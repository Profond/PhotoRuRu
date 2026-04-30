import { asset } from '@/lib/utils';

export interface UploadedPhoto {
  filename: string;
  src: string;
}

export async function uploadPhoto(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/upload-photo', { method: 'POST', body: form });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.filename as string;
}

export async function listPhotos(): Promise<UploadedPhoto[]> {
  try {
    const res = await fetch(asset('/images/uploaded/_manifest.json'));
    if (!res.ok) return [];
    const filenames: string[] = await res.json();
    return filenames.map(f => ({ filename: f, src: asset('/images/uploaded/' + f) }));
  } catch {
    return [];
  }
}

export async function deletePhoto(filename: string): Promise<void> {
  await fetch('/api/photos', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename }),
  });
}
