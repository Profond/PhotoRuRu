export interface StoredPhoto {
  id: string;
  blob: Blob;
  name: string;
  addedAt: number;
}

const DB_NAME = 'memories-of-sky';
const STORE_NAME = 'uploaded-photos';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function compressImage(file: File | Blob, maxDim = 1920, quality = 0.8): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  if (width <= maxDim && height <= maxDim && file.type === 'image/jpeg') {
    bitmap.close();
    return file;
  }

  const scale = Math.min(maxDim / width, maxDim / height, 1);
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', quality);
  });
}

export async function savePhoto(file: File, name: string): Promise<string> {
  const db = await openDB();
  const blob = await compressImage(file);
  const id = crypto.randomUUID();
  const record: StoredPhoto = { id, blob, name, addedAt: Date.now() };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).add(record);
    tx.oncomplete = () => { db.close(); resolve(id); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function getAllPhotos(): Promise<StoredPhoto[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => {
      db.close();
      const results = request.result as StoredPhoto[];
      results.sort((a, b) => a.addedAt - b.addedAt);
      resolve(results);
    };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

export async function deletePhoto(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}
