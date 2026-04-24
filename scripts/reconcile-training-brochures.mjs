import { list, del } from '@vercel/blob';
import { Pool } from '@neondatabase/serverless';
import { readFileSync } from 'node:fs';

function loadDotEnvLocal() {
  try {
    const envRaw = readFileSync('.env.local', 'utf8');
    for (const line of envRaw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const separator = trimmed.indexOf('=');
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator).trim();
      let value = trimmed.slice(separator + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // ignore
  }
}

function normalizeText(value) {
  return (value || '')
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value) {
  return normalizeText(value)
    .split(' ')
    .filter((token) => token.length >= 3);
}

function pathToFileName(pathname) {
  const parts = pathname.split('/');
  return parts[parts.length - 1] || pathname;
}

function scoreBlobMatch(trainingTitle, blobPathname) {
  const titleTokens = tokenize(trainingTitle);
  if (titleTokens.length === 0) return 0;
  const blobName = normalizeText(pathToFileName(blobPathname));

  let score = 0;
  for (const token of titleTokens) {
    if (blobName.includes(token)) score += 1;
  }
  return score;
}

async function listAllBlobsForPrefix(prefix) {
  const blobs = [];
  let cursor = undefined;

  while (true) {
    const result = await list({ prefix, cursor, limit: 1000 });
    blobs.push(...result.blobs);
    if (!result.hasMore) break;
    cursor = result.cursor;
  }

  return blobs;
}

async function run() {
  loadDotEnvLocal();

  const apply = process.argv.includes('--apply');
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('Missing DATABASE_URL');
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Missing BLOB_READ_WRITE_TOKEN');
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    const [technicalRows, nonTechnicalRows] = await Promise.all([
      client.query(`
        SELECT id, title, brochure_url, brochure_path, brochure_file_name, brochure_file_size, brochure_mime_type
        FROM technical_trainings
      `),
      client.query(`
        SELECT id, title, brochure_url, brochure_path, brochure_file_name, brochure_file_size, brochure_mime_type
        FROM non_technical_trainings
      `),
    ]);

    const allTrainings = [
      ...technicalRows.rows.map((row) => ({ ...row, table: 'technical_trainings' })),
      ...nonTechnicalRows.rows.map((row) => ({ ...row, table: 'non_technical_trainings' })),
    ];

    const missingBrochure = allTrainings.filter((row) => !row.brochure_url);

    const [blobBrochures, blobDocuments] = await Promise.all([
      listAllBlobsForPrefix('training-brochures/'),
      listAllBlobsForPrefix('training-documents/'),
    ]);

    const allPdfBlobs = [...blobBrochures, ...blobDocuments].filter((blob) =>
      blob.pathname.toLowerCase().endsWith('.pdf')
    );

    const proposedLinks = [];
    for (const training of missingBrochure) {
      let bestBlob = null;
      let bestScore = 0;

      for (const blob of allPdfBlobs) {
        const score = scoreBlobMatch(training.title || '', blob.pathname);
        if (score > bestScore) {
          bestScore = score;
          bestBlob = blob;
        } else if (score === bestScore && bestBlob && new Date(blob.uploadedAt) > new Date(bestBlob.uploadedAt)) {
          bestBlob = blob;
        }
      }

      if (bestBlob && bestScore >= 2) {
        proposedLinks.push({
          training,
          blob: bestBlob,
          score: bestScore,
        });
      }
    }

    let linkedCount = 0;
    if (apply) {
      for (const proposal of proposedLinks) {
        const fileName = (proposal.training.title || 'Training Brochure').trim() + '.pdf';
        await client.query(
          `
          UPDATE ${proposal.training.table}
          SET brochure_url = $1,
              brochure_path = $2,
              brochure_file_name = $3,
              brochure_file_size = $4,
              brochure_mime_type = 'application/pdf',
              brochure_updated_at = NOW(),
              updated_at = NOW()
          WHERE id = $5
          `,
          [proposal.blob.url, proposal.blob.pathname, fileName, proposal.blob.size, proposal.training.id]
        );
        linkedCount += 1;
      }
    }

    const referencedRows = await client.query(`
      SELECT brochure_url, brochure_path FROM technical_trainings WHERE brochure_url IS NOT NULL
      UNION ALL
      SELECT brochure_url, brochure_path FROM non_technical_trainings WHERE brochure_url IS NOT NULL
    `);

    const referenced = new Set();
    for (const row of referencedRows.rows) {
      if (row.brochure_url) referenced.add(row.brochure_url);
      if (row.brochure_path) referenced.add(row.brochure_path);
    }

    const blobsByEtag = new Map();
    for (const blob of [...blobBrochures, ...blobDocuments]) {
      if (!blobsByEtag.has(blob.etag)) {
        blobsByEtag.set(blob.etag, []);
      }
      blobsByEtag.get(blob.etag).push(blob);
    }

    const duplicateGroups = [...blobsByEtag.values()].filter((group) => group.length > 1);
    const duplicateDeletionCandidates = [];

    for (const group of duplicateGroups) {
      const referencedGroup = group.filter(
        (blob) => referenced.has(blob.url) || referenced.has(blob.pathname)
      );
      const unreferencedGroup = group.filter(
        (blob) => !referenced.has(blob.url) && !referenced.has(blob.pathname)
      );

      if (referencedGroup.length > 0) {
        duplicateDeletionCandidates.push(...unreferencedGroup);
      } else if (unreferencedGroup.length > 1) {
        const sorted = [...unreferencedGroup].sort(
          (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
        duplicateDeletionCandidates.push(...sorted.slice(1));
      }
    }

    let deletedDuplicates = 0;
    if (apply && duplicateDeletionCandidates.length > 0) {
      const batch = duplicateDeletionCandidates.map((blob) => blob.url);
      await del(batch);
      deletedDuplicates = batch.length;
    }

    const summary = {
      mode: apply ? 'apply' : 'dry-run',
      trainingsTotal: allTrainings.length,
      trainingsMissingBrochure: missingBrochure.length,
      proposedLinks: proposedLinks.length,
      linkedCount,
      blobTotals: {
        trainingBrochures: blobBrochures.length,
        trainingDocuments: blobDocuments.length,
      },
      duplicateGroups: duplicateGroups.length,
      duplicateDeletionCandidates: duplicateDeletionCandidates.length,
      deletedDuplicates,
    };

    console.log(JSON.stringify(summary, null, 2));

    if (!apply && proposedLinks.length > 0) {
      console.log('\nTop proposed links (preview):');
      for (const item of proposedLinks.slice(0, 20)) {
        console.log(
          `- [${item.training.table}] ${item.training.title} -> ${item.blob.pathname} (score=${item.score})`
        );
      }
      if (proposedLinks.length > 20) {
        console.log(`... and ${proposedLinks.length - 20} more`);
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error('Reconcile training brochures failed:', error);
  process.exit(1);
});
