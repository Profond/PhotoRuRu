import { upload } from '@vercel/blob/client';

export interface UploadedPhoto {
  url: string;
  filename: string;
}

export async function uploadPhoto(file: File): Promise<string> {
  const blob = await upload(file.name, file, {
    access: 'public',
    handleUploadUrl: '/api/upload',
  });
  return blob.url;
}

export async function listPhotos(): Promise<UploadedPhoto[]> {
  try {
    const res = await fetch('/api/list');
    if (!res.ok) return [];
    const urls: string[] = await res.json();
    return urls.map(url => ({
      url,
      filename: url.split('/').pop() || 'photo',
    }));
  } catch {
    return [];
  }
}

export async function deletePhoto(url: string): Promise<void> {
  await fetch('/api/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
}
