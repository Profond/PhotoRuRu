export interface UploadedPhoto {
  filename: string;
  src: string;
}

const BASE = '/images/uploaded/';

export async function uploadPhoto(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/upload-photo', { method: 'POST', body: form });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.filename as string;
}

export async function listPhotos(): Promise<UploadedPhoto[]> {
  const res = await fetch('/api/photos');
  if (!res.ok) return [];
  const filenames: string[] = await res.json();
  return filenames.map(f => ({ filename: f, src: BASE + f }));
}

export async function deletePhoto(filename: string): Promise<void> {
  await fetch('/api/photos', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename }),
  });
}
