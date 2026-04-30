import { useState, useEffect, useRef, useCallback } from 'react';
import { savePhoto, getAllPhotos, deletePhoto, type StoredPhoto } from '@/lib/galleryStorage';
import { generateLayout, type PhotoLayout } from '@/lib/autoLayout';

export interface GalleryPhoto {
  id: string;
  src: string;
  name: string;
  isUploaded: boolean;
  layout: PhotoLayout;
}

const BUILTIN_PHOTOS = [
  { id: 'spring', image: '/images/spring-sakura.jpg' },
  { id: 'summer', image: '/images/summer-clouds.jpg' },
  { id: 'autumn', image: '/images/autumn-railway.jpg' },
  { id: 'winter', image: '/images/winter-snow.jpg' },
];

export function useGalleryPhotos() {
  const [uploaded, setUploaded] = useState<StoredPhoto[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const urlMapRef = useRef<Map<string, string>>(new Map());

  const revokeAllUrls = useCallback(() => {
    urlMapRef.current.forEach((url) => URL.revokeObjectURL(url));
    urlMapRef.current.clear();
  }, []);

  const buildPhotos = useCallback((uploadedList: StoredPhoto[]) => {
    revokeAllUrls();

    const layouts = generateLayout(BUILTIN_PHOTOS.length + uploadedList.length);

    const builtin: GalleryPhoto[] = BUILTIN_PHOTOS.map((p, i) => ({
      id: p.id,
      src: p.image,
      name: p.id,
      isUploaded: false,
      layout: layouts[i],
    }));

    const uploadedPhotos: GalleryPhoto[] = uploadedList.map((p, i) => {
      const url = URL.createObjectURL(p.blob);
      urlMapRef.current.set(p.id, url);
      return {
        id: p.id,
        src: url,
        name: p.name,
        isUploaded: true,
        layout: layouts[BUILTIN_PHOTOS.length + i],
      };
    });

    setPhotos([...builtin, ...uploadedPhotos]);
  }, [revokeAllUrls]);

  useEffect(() => {
    let cancelled = false;
    getAllPhotos().then((stored) => {
      if (!cancelled) {
        setUploaded(stored);
        buildPhotos(stored);
      }
    });
    return () => {
      cancelled = true;
      revokeAllUrls();
    };
  }, [buildPhotos, revokeAllUrls]);

  const addPhotos = useCallback(async (files: FileList) => {
    const newStored: StoredPhoto[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      const id = await savePhoto(file, file.name);
      newStored.push({ id, blob: file, name: file.name, addedAt: Date.now() });
    }
    if (newStored.length === 0) return;

    const all = await getAllPhotos();
    setUploaded(all);
    buildPhotos(all);
  }, [buildPhotos]);

  const removePhoto = useCallback(async (id: string) => {
    const url = urlMapRef.current.get(id);
    if (url) {
      URL.revokeObjectURL(url);
      urlMapRef.current.delete(id);
    }
    await deletePhoto(id);
    const all = await getAllPhotos();
    setUploaded(all);
    buildPhotos(all);
  }, [buildPhotos]);

  return { photos, addPhotos, removePhoto };
}
