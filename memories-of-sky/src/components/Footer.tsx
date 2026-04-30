import { ExternalLink } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export default function Footer() {
  const { lang, t } = useApp()
  const title = lang === 'zh' ? '天空记忆' : lang === 'ja' ? '空の記憶' : 'Memories of Sky'

  return (
    <footer
      className="relative z-10 py-16 px-[5vw]"
      style={{
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-2xl md:text-3xl mb-2">{title}</h2>
        <p className="font-display-en text-base text-white/50 mb-6">
          Memories of Sky
        </p>

        <p className="font-body text-sm text-white/40 mb-2">
          {t.footerTagline}
        </p>
        {t.footerTaglineEn && (
          <p className="font-display-en italic text-xs text-white/30 mb-8">
            {t.footerTaglineEn}
          </p>
        )}

        <div className="flex items-center justify-center gap-6 mb-8">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors"
          >
            <InstagramIcon />
            <span className="font-mono-label text-xs">Instagram</span>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors"
          >
            <TwitterIcon />
            <span className="font-mono-label text-xs">Twitter</span>
          </a>
          <a
            href="https://behance.net"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors"
          >
            <ExternalLink size={18} />
            <span className="font-mono-label text-xs">Behance</span>
          </a>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="font-mono-label text-[11px] text-white/20">
            &copy; 2024 {title}. {t.footerCopyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
