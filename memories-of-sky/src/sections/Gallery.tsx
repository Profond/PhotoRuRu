import { useRef, useEffect, useCallback, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useGalleryPhotos } from '@/hooks/useGalleryPhotos';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
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

const PER_PAGE = 6;

export default function Gallery() {
  const { t } = useApp();
  const { photos, addPhotos, removePhoto } = useGalleryPhotos();
  const sectionRef = useRef<HTMLElement>(null);
  const polaroidsRef = useRef<(HTMLDivElement | null)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);

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

  const totalPages = Math.max(1, Math.ceil((photos.length + 1) / PER_PAGE));

  const getPages = () => {
    const pages: { photos: typeof photos; addOnThisPage: boolean }[] = [];
    for (let p = 0; p < totalPages; p++) {
      const start = p * PER_PAGE;
      const end = Math.min(start + PER_PAGE, photos.length);
      const pagePhotos = photos.slice(start, end);
      const isLastPage = p === totalPages - 1;
      const addOnThisPage = isLastPage;
      pages.push({ photos: pagePhotos, addOnThisPage });
    }
    return pages;
  };

  const pages = getPages();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, globalIndex: number) => {
      const el = polaroidsRef.current[globalIndex];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = -y * 16;
      const rotateY = x * 16;
      const rotate = photos[globalIndex]?.layout.rotate ?? 0;
      el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(${rotate}deg)`;
    },
    [photos],
  );

  const handleMouseLeave = useCallback(
    (globalIndex: number) => {
      const el = polaroidsRef.current[globalIndex];
      if (!el) return;
      const rotate = photos[globalIndex]?.layout.rotate ?? 0;
      el.style.transform = `perspective(600px) rotateX(0deg) rotateY(0deg) rotate(${rotate}deg)`;
    },
    [photos],
  );

  useEffect(() => {
    const totalItems = photos.length + 1; // +1 for add card
    polaroidsRef.current = polaroidsRef.current.slice(0, totalItems);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        polaroidsRef.current.filter(Boolean),
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [photos.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const pageWidth = el.clientWidth;
      const idx = Math.round(el.scrollLeft / pageWidth);
      setCurrentPage(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToPage = (page: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: page * el.clientWidth, behavior: 'smooth' });
  };

  const handlePrev = () => scrollToPage(Math.max(0, currentPage - 1));
  const handleNext = () => scrollToPage(Math.min(totalPages - 1, currentPage + 1));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await addPhotos(e.target.files);
      e.target.value = '';
    }
  };

  const addCardLayout = { size: 240, rotate: 2 };

  return (
    <section ref={sectionRef} className="relative z-10 py-24 lg:py-32">
      <div className="text-center mb-16">
        <h2
          className="font-display text-white"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300, letterSpacing: '0.1em' }}
        >
          {t.galleryTitle}
        </h2>
      </div>

      {/* Navigation arrows */}
      <div className="relative max-w-6xl mx-auto px-[5vw]">
        {totalPages > 1 && (
          <>
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-default"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-default"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          className="overflow-x-auto flex snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {pages.map((page, pageIdx) => (
            <div
              key={pageIdx}
              className="snap-center shrink-0 w-full py-4 px-4"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridAutoRows: 'min-content',
                justifyItems: 'center',
                alignContent: 'start',
                gap: '24px 16px',
              }}
            >
              {page.photos.map((photo) => {
                const globalIdx = pageIdx * PER_PAGE + page.photos.indexOf(photo);
                return (
                  <div
                    key={photo.id}
                    ref={(el) => { polaroidsRef.current[globalIdx] = el; }}
                    className="polaroid relative opacity-0"
                    style={{
                      width: '100%',
                      maxWidth: '320px',
                      transform: `rotate(${photo.layout.rotate}deg)`,
                      transition: 'transform 0.15s ease-out',
                    }}
                    onMouseMove={(e) => handleMouseMove(e, globalIdx)}
                    onMouseLeave={() => handleMouseLeave(globalIdx)}
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
                    <div className="overflow-hidden" style={{ aspectRatio: '1 / 1.15', width: '100%', maxWidth: '300px' }}>
                      <img src={photo.src} alt={getLabel(photo.name, photo.isUploaded)} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <p className="text-center mt-3" style={{ fontSize: '0.85rem', color: '#333' }}>
                      {getLabel(photo.name, photo.isUploaded)}
                    </p>
                  </div>
                );
              })}

              {/* Add Photo Card — only on last page */}
              {page.addOnThisPage && (
                <div
                  className="polaroid cursor-pointer group opacity-0"
                  ref={(el) => { polaroidsRef.current[photos.length] = el; }}
                  style={{
                    width: '100%',
                    maxWidth: '320px',
                    transform: `rotate(${addCardLayout.rotate}deg)`,
                    transition: 'transform 0.15s ease-out',
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onMouseMove={(e) => {
                    const el = polaroidsRef.current[photos.length];
                    if (!el) return;
                    const rect = el.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    el.style.transform = `perspective(600px) rotateX(${-y * 16}deg) rotateY(${x * 16}deg) rotate(${addCardLayout.rotate}deg)`;
                  }}
                  onMouseLeave={() => {
                    const el = polaroidsRef.current[photos.length];
                    if (!el) return;
                    el.style.transform = `perspective(600px) rotateX(0deg) rotateY(0deg) rotate(${addCardLayout.rotate}deg)`;
                  }}
                >
                  <div
                    className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded group-hover:border-gray-400 transition-colors"
                    style={{ aspectRatio: '1 / 1.15', width: '100%', maxWidth: '300px' }}
                  >
                    <Plus className="w-10 h-10 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <p className="text-center mt-3" style={{ fontSize: '0.85rem', color: '#999' }}>
                    {t.addPhoto}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Page indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => scrollToPage(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentPage ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
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
