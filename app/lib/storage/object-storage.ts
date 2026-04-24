import { put } from '@vercel/blob';

export async function uploadPublicFile(file: File, keyPrefix: string) {
  const extension = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
  const safeExtension = extension?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'bin';
  const key = `${keyPrefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExtension}`;

  const blob = await put(key, file, {
    access: 'public',
    addRandomSuffix: false,
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
  };
}
