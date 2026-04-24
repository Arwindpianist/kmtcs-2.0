'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { logger } from '@/app/lib/logger';
import { AdminTablePageSkeleton } from '@/app/components/skeletons/PageSkeletons';

type TrainingTable = 'technical_trainings' | 'non_technical_trainings';

interface TrainingRow {
  id: string;
  title: string;
  table_name: TrainingTable;
}

interface BlobRow {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
  etag: string;
}

interface DuplicateGroup {
  etag: string;
  blobs: BlobRow[];
}

function confirmWithToast(message: string) {
  return new Promise<boolean>((resolve) => {
    let settled = false;
    toast(message, {
      duration: 12000,
      action: {
        label: 'Confirm',
        onClick: () => {
          settled = true;
          resolve(true);
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
          settled = true;
          resolve(false);
        },
      },
      onAutoClose: () => {
        if (!settled) resolve(false);
      },
      onDismiss: () => {
        if (!settled) resolve(false);
      },
    });
  });
}

export default function BrochureReconciliationPage() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [missingTrainings, setMissingTrainings] = useState<TrainingRow[]>([]);
  const [unlinkedBlobs, setUnlinkedBlobs] = useState<BlobRow[]>([]);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [selectedBlobByTraining, setSelectedBlobByTraining] = useState<Record<string, string>>({});

  const loadState = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/brochure-reconciliation');
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Failed to load reconciliation data');

      setMissingTrainings(payload.data?.missingTrainings || []);
      setUnlinkedBlobs(payload.data?.unlinkedBlobs || []);
      setDuplicateGroups(payload.data?.duplicateGroups || []);
    } catch (error) {
      logger.error('Load brochure reconciliation error:', error);
      toast.error('Unable to load brochure reconciliation data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const duplicateDeletionCandidates = useMemo(() => {
    let count = 0;
    for (const group of duplicateGroups) {
      if (group.blobs.length > 1) count += group.blobs.length - 1;
    }
    return count;
  }, [duplicateGroups]);

  const linkBrochure = async (training: TrainingRow) => {
    const blobUrl = selectedBlobByTraining[training.id];
    if (!blobUrl) {
      toast.error('Please select a brochure blob first.');
      return;
    }

    setBusy(true);
    try {
      const response = await fetch('/api/admin/brochure-reconciliation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'linkBrochure',
          training_table: training.table_name,
          training_id: training.id,
          blob_url: blobUrl,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Failed to link brochure');
      toast.success('Brochure linked to training.');
      await loadState();
    } catch (error) {
      logger.error('Link brochure error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to link brochure');
    } finally {
      setBusy(false);
    }
  };

  const cleanupDuplicates = async () => {
    setBusy(true);
    try {
      const response = await fetch('/api/admin/brochure-reconciliation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cleanupDuplicateBlobs' }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Failed duplicate cleanup');
      toast.success(`Deleted ${payload.deleted || 0} duplicate unlinked blob files.`);
      await loadState();
    } catch (error) {
      logger.error('Cleanup duplicates error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed duplicate cleanup');
    } finally {
      setBusy(false);
    }
  };

  const deleteUnlinkedBlob = async (blobUrl: string) => {
    setBusy(true);
    try {
      const response = await fetch('/api/admin/brochure-reconciliation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteUnlinkedBlob', blob_url: blobUrl }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Failed to delete blob');
      toast.success('Unlinked blob deleted.');
      await loadState();
    } catch (error) {
      logger.error('Delete unlinked blob error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete blob');
    } finally {
      setBusy(false);
    }
  };

  const purgeAllBrochures = async () => {
    const confirmed = await confirmWithToast(
      'Delete ALL brochure files and clear all training/event brochure links? This cannot be undone.'
    );
    if (!confirmed) {
      return;
    }

    setBusy(true);
    try {
      const response = await fetch('/api/admin/brochure-reconciliation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'purgeAllBrochures' }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Failed to purge brochures');
      toast.success(`Purged all brochures. Deleted ${payload.deleted_blobs || 0} blob file(s).`);
      await loadState();
    } catch (error) {
      logger.error('Purge all brochures error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to purge brochures');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <AdminTablePageSkeleton />;

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      <div className="mb-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Brochure Reconciliation</h1>
          <p className="text-sm text-gray-600 mt-2">
            Link existing Blob brochures to older trainings and safely remove duplicate unlinked files.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section className="rounded-xl border border-gray-200 bg-white p-4 lg:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Global Purge</h2>
            <button
              type="button"
              onClick={purgeAllBrochures}
              disabled={busy}
              className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              Purge All Brochures (Supabase Links + Blob Files)
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Use this once to fully reset brochure data: remove all linked brochure metadata from trainings/events and
            delete all brochure blobs.
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 lg:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Duplicate Blob Cleanup</h2>
            <button
              type="button"
              onClick={cleanupDuplicates}
              disabled={busy}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              Remove Duplicate Unlinked Blobs
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Duplicate groups: <span className="font-medium">{duplicateGroups.length}</span> | Estimated deletion candidates:{' '}
            <span className="font-medium">{duplicateDeletionCandidates}</span>
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Trainings Missing Brochure Links ({missingTrainings.length})
          </h2>
          {missingTrainings.length === 0 ? (
            <p className="text-sm text-gray-500">All trainings already have linked brochures.</p>
          ) : (
            <div className="space-y-3">
              {missingTrainings.map((training) => (
                <div key={training.id} className="rounded-lg border border-gray-200 p-3">
                  <p className="font-medium text-gray-900 text-sm">{training.title}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    {training.table_name === 'technical_trainings' ? 'Technical Training' : 'Non-Technical Training'}
                  </p>
                  <div className="flex flex-col gap-2 md:flex-row">
                    <select
                      value={selectedBlobByTraining[training.id] || ''}
                      onChange={(event) =>
                        setSelectedBlobByTraining((prev) => ({ ...prev, [training.id]: event.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option value="">Select unlinked brochure blob...</option>
                      {unlinkedBlobs.map((blob) => (
                        <option key={blob.url} value={blob.url}>
                          {blob.pathname}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => linkBrochure(training)}
                      disabled={busy}
                      className="rounded-lg border border-indigo-600 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-60"
                    >
                      Link Brochure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Unlinked Brochure Blobs ({unlinkedBlobs.length})
          </h2>
          {unlinkedBlobs.length === 0 ? (
            <p className="text-sm text-gray-500">No unlinked brochure blobs found.</p>
          ) : (
            <div className="space-y-2">
              {unlinkedBlobs.map((blob) => (
                <div key={blob.url} className="flex flex-col gap-2 rounded-lg border border-gray-200 p-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{blob.pathname}</p>
                    <p className="text-xs text-gray-500">
                      {(blob.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteUnlinkedBlob(blob.url)}
                    disabled={busy}
                    className="rounded-lg border border-red-500 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    Delete Unlinked Blob
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
