import { useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { useGalleryPhotos } from '@/hooks/useGalleryPhotos';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

gsap.registerPlugin(ScrollTrigger);

export default function Gallery() {
  const { t } = useApp();
  const { photos, addPhotos, removePhoto } = useGalleryPhotos();
  const sectionRef = useRef<HTMLElement>(null);
  const polaroidsRef = useRef<(HTMLDivElement | null)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photoLabels: Record<string, string> = {
    spring: t.springPhoto,
    summer: t.summerPhoto,
    autumn: t.autumnPhoto,
    winter: t.winterPhoto,
  };

  const getLabel = (name: string, isUploaded: boolean) => {
    if (isUploaded) return name.replace(/\.[^.]+$/, '');
    return photoLabels[name] ?? name;
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, index: number) => {
      const el = polaroidsRef.current[index];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = -y * 16;
      const rotateY = x * 16;
      el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(${photos[index].layout.rotate}deg)`;
    },
    [photos],
  );

  const handleMouseLeave = useCallback(
    (index: number) => {
      const el = polaroidsRef.current[index];
      if (!el) return;
      el.style.transform = `perspective(600px) rotateX(0deg) rotateY(0deg) rotate(${photos[index].layout.rotate}deg)`;
    },
    [photos],
  );

  useEffect(() => {
    polaroidsRef.current = polaroidsRef.current.slice(0, photos.length);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        polaroidsRef.current.filter(Boolean),
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.15, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' },
        },
      );
      polaroidsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: -(20 + i * 10), ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: photos[i].layout.scrub },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [photos.length]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await addPhotos(e.target.files);
      e.target.value = '';
    }
  };

  const addPhotoLayout = photos.length >= 4
    ? { size: 260, rotate: 2, mt: 32, ml: 12 }
    : { size: 260, rotate: 2, mt: 0, ml: 0 };

  return (
    <section ref={sectionRef} className="relative z-10 px-[5vw] py-24 lg:py-32">
      <div className="text-center mb-16">
        <h2
          className="font-display text-white"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300, letterSpacing: '0.1em' }}
        >
          {t.galleryTitle}
        </h2>
      </div>

      <div className="flex flex-wrap justify-center items-start gap-8 max-w-6xl mx-auto">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            ref={(el) => { polaroidsRef.current[i] = el; }}
            className="polaroid relative opacity-0"
            style={{
              marginTop: `${photo.layout.mt}px`,
              marginLeft: `${photo.layout.ml}px`,
              transform: `rotate(${photo.layout.rotate}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={() => handleMouseLeave(i)}
          >
            {photo.isUploaded && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <X size={12} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t.delete}</AlertDialogTitle>
                    <AlertDialogDescription>{t.deletePhotoConfirm}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => removePhoto(photo.id)}
                    >
                      {t.delete}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <div className="overflow-hidden" style={{ width: `${photo.layout.size}px`, height: `${photo.layout.size * 1.15}px` }}>
              <img src={photo.src} alt={getLabel(photo.name, photo.isUploaded)} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <p className="text-center mt-3" style={{ fontSize: '0.85rem', color: '#333' }}>
              {getLabel(photo.name, photo.isUploaded)}
            </p>
          </div>
        ))}

        {/* Add Photo Card */}
        <div
          className="polaroid cursor-pointer group opacity-0"
          ref={(el) => { polaroidsRef.current[photos.length] = el; }}
          style={{
            marginTop: `${addPhotoLayout.mt}px`,
            marginLeft: `${addPhotoLayout.ml}px`,
            transform: `rotate(${addPhotoLayout.rotate}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
          onClick={() => fileInputRef.current?.click()}
          onMouseMove={(e) => {
            const el = polaroidsRef.current[photos.length];
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            el.style.transform = `perspective(600px) rotateX(${-y * 16}deg) rotateY(${x * 16}deg) rotate(${addPhotoLayout.rotate}deg)`;
          }}
          onMouseLeave={() => {
            const el = polaroidsRef.current[photos.length];
            if (!el) return;
            el.style.transform = `perspective(600px) rotateX(0deg) rotateY(0deg) rotate(${addPhotoLayout.rotate}deg)`;
          }}
        >
          <div
            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded group-hover:border-gray-400 transition-colors"
            style={{ width: `${addPhotoLayout.size}px`, height: `${addPhotoLayout.size * 1.15}px` }}
          >
            <Plus className="w-10 h-10 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
          <p className="text-center mt-3" style={{ fontSize: '0.85rem', color: '#999' }}>
            {t.addPhoto}
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </section>
  );
}
