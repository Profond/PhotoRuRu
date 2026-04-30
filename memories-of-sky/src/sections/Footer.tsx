import { Instagram, Twitter } from 'lucide-react';
import { useApp } from '@/context/AppContext';

function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h6a4 4 0 0 1 4 4 4 4 0 0 1-4 4H3V3z" />
      <path d="M3 11h7a4 4 0 0 1 4 4 4 4 0 0 1-4 4H3v-8z" />
      <path d="M15 4h6" />
      <path d="M15 20a4 4 0 1 1 6-3.47" />
    </svg>
  );
}

export default function Footer() {
  const { t, lang } = useApp();

  const siteName = lang === 'zh' ? '天空记忆' : lang === 'ja' ? '空の記憶' : 'Memories of Sky';

  return (
    <footer
      className="relative z-10 py-16 px-[5vw]"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="font-display text-white mb-4"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 300, letterSpacing: '0.1em' }}
        >
          {siteName}
        </h2>

        <p
          className="font-display text-white/60 mb-10"
          style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)', fontWeight: 300, lineHeight: 1.8, letterSpacing: '0.05em' }}
        >
          {t.footerQuote}
        </p>

        <div className="flex items-center justify-center gap-6 mb-10">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors duration-300" aria-label="Instagram">
            <Instagram size={22} strokeWidth={1.5} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors duration-300" aria-label="Twitter">
            <Twitter size={22} strokeWidth={1.5} />
          </a>
          <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors duration-300" aria-label="Behance">
            <BehanceIcon className="w-[22px] h-[22px]" />
          </a>
        </div>

        <div className="w-16 h-[1px] bg-white/20 mx-auto mb-6" />

        <p className="font-mono text-white/30" style={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}>
          {t.copyright}
        </p>
      </div>
    </footer>
  );
}
