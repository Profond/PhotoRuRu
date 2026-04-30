import { useApp } from '@/context/AppContext';
import { SEASONS, LANG_LABELS } from '@/types';
import type { Season, Lang } from '@/types';
import MusicPlayer from './MusicPlayer';

export default function Navbar() {
  const { currentSeason, setSeason, timeString, lang, setLang, t } = useApp();

  const seasonNames: Record<string, string> = {
    spring: t.springName,
    summer: t.summerName,
    autumn: t.autumnName,
    winter: t.winterName,
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-[5vw] h-20"
      style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="font-display text-white"
          style={{
            fontSize: '1.1rem',
            fontWeight: 300,
            letterSpacing: '0.2em',
            writingMode: lang === 'ja' ? 'vertical-rl' : 'horizontal-tb',
            height: lang === 'ja' ? '48px' : 'auto',
          }}
        >
          {lang === 'zh' ? '天空记忆' : lang === 'ja' ? '空の記憶' : 'Memories'}
        </div>
        <span
          className="hidden sm:block font-display-en text-white/60"
          style={{ fontSize: '0.7rem', fontWeight: 200 }}
        >
          {t.logoSub}
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Music player */}
        <MusicPlayer />

        {/* Time display */}
        <span
          className="hidden md:block font-mono text-xs tracking-wider"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          {timeString}
        </span>

        {/* Language switcher */}
        <div className="flex items-center gap-1">
          {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className="relative w-8 h-8 rounded-full flex items-center justify-center font-mono text-[11px] tracking-wider cursor-pointer transition-all duration-300"
              style={{
                background: lang === l ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: lang === l ? '#ffffff' : 'rgba(255,255,255,0.4)',
                border: lang === l ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (lang !== l) {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                }
              }}
              onMouseLeave={(e) => {
                if (lang !== l) {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>

        {/* Season buttons */}
        <div className="flex items-center gap-2">
          {SEASONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSeason(s.id as Season)}
              className="group relative w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300"
              aria-pressed={currentSeason.id === s.id}
              style={{
                border: `1.5px solid ${currentSeason.id === s.id ? s.color : 'rgba(255,255,255,0.25)'}`,
                background: currentSeason.id === s.id
                  ? `radial-gradient(circle, ${s.color}40 0%, transparent 70%)`
                  : 'transparent',
                color: currentSeason.id === s.id ? '#ffffff' : 'rgba(255,255,255,0.6)',
                boxShadow: currentSeason.id === s.id ? `0 0 12px ${s.color}66, 0 0 24px ${s.color}33` : 'none',
              }}
              onMouseEnter={(e) => {
                if (currentSeason.id !== s.id) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentSeason.id !== s.id) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span className="font-display text-base relative z-10">{s.kanji}</span>

              {/* Tooltip - localized season name */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-wider text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                {seasonNames[s.id]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
