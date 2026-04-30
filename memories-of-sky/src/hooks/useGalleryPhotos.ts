import { useState, useEffect, useCallback } from 'react';
import { uploadPhoto, listPhotos, deletePhoto, type UploadedPhoto } from '@/lib/galleryStorage';
import { generateLayout, type PhotoLayout } from '@/lib/autoLayout';
import { asset } from '@/lib/utils';

export interface GalleryPhoto {
  id: string;
  src: string;
  name: string;
  isUploaded: boolean;
  layout: PhotoLayout;
}

const BUILTIN_PHOTOS = [
  { id: 'spring', image: asset('/images/spring-sakura.jpg'), name: 'spring' },
  { id: 'summer', image: asset('/images/summer-clouds.jpg'), name: 'summer' },
  { id: 'autumn', image: asset('/images/autumn-railway.jpg'), name: 'autumn' },
  { id: 'winter', image: asset('/images/winter-snow.jpg'), name: 'winter' },
];

function buildPhotos(uploadedList: UploadedPhoto[]): GalleryPhoto[] {
  const layouts = generateLayout(BUILTIN_PHOTOS.length + uploadedList.length);

  const builtin: GalleryPhoto[] = BUILTIN_PHOTOS.map((p, i) => ({
    id: p.id,
    src: p.image,
    name: p.name,
    isUploaded: false,
    layout: layouts[i],
  }));

  const uploaded: GalleryPhoto[] = uploadedList.map((p, i) => ({
    id: p.url,
    src: p.url,
    name: p.filename,
    isUploaded: true,
    layout: layouts[BUILTIN_PHOTOS.length + i],
  }));

  return [...builtin, ...uploaded];
}

export function useGalleryPhotos() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    let cancelled = false;
    listPhotos().then((stored) => {
      if (!cancelled) setPhotos(buildPhotos(stored));
    });
    return () => { cancelled = true; };
  }, []);

  const addPhotos = useCallback(async (files: FileList) => {
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      await uploadPhoto(file);
    }
    const all = await listPhotos();
    setPhotos(buildPhotos(all));
  }, []);

  const removePhoto = useCallback(async (id: string) => {
    await deletePhoto(id);
    const all = await listPhotos();
    setPhotos(buildPhotos(all));
  }, []);

  return { photos, addPhotos, removePhoto };
}
