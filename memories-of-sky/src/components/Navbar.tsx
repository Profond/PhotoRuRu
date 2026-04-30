import { useApp } from '@/contexts/AppContext'
import { SEASON_COLORS, SEASON_LABELS, getTimeLabel, type Season } from '@/lib/utils'
import { LANG_LABELS, type Lang } from '@/lib/translations'

const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter']
const langs: Lang[] = ['zh', 'ja', 'en']

export default function Navbar() {
  const { season, setSeason, timeFraction, lang, setLang, t } = useApp()

  const navItems = [
    { label: t.navAbout, href: '#about' },
    { label: t.navWorks, href: '#gallery' },
    { label: t.navSeasons, href: '#seasons' },
    { label: t.navExhibition, href: '#exhibition' },
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-[5vw]"
      style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1), transparent)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <a href="#" className="writing-vertical font-display text-[1.1rem] tracking-[0.2em] h-12 flex items-center text-white/90 hover:text-white transition-colors">
          {lang === 'zh' ? '天空记忆' : '空の記憶'}
        </a>
        <span className="hidden sm:block font-display-en text-[0.7rem] text-white/60 mt-1">
          Memories of Sky
        </span>
      </div>

      {/* Center nav links */}
      <div className="hidden lg:flex items-center gap-8">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="font-body text-[13px] text-white/50 hover:text-white/90 tracking-wider transition-colors"
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Time display */}
        <span className="hidden md:block font-mono-label text-[0.75rem] text-white/50">
          {getTimeLabel(timeFraction)}
        </span>

        {/* Language switcher — same circle style as season buttons */}
        <div className="flex items-center gap-1.5">
          {langs.map((l) => {
            const isActive = lang === l
            return (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="h-8 rounded-full flex items-center justify-center font-mono-label text-[11px] px-2.5 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_12px_rgba(255,255,255,0.1)] hover:text-white/80"
                style={{
                  background: isActive
                    ? 'radial-gradient(circle, rgba(255,255,255,0.2), rgba(255,255,255,0.05))'
                    : 'transparent',
                  border: isActive
                    ? '1.5px solid rgba(255,255,255,0.4)'
                    : '1.5px solid transparent',
                  boxShadow: isActive
                    ? '0 0 12px rgba(255,255,255,0.15), 0 0 24px rgba(255,255,255,0.08)'
                    : 'none',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                }}
              >
                {LANG_LABELS[l]}
              </button>
            )
          })}
        </div>

        {/* Season buttons */}
        <div className="flex items-center gap-2">
          {seasons.map((s) => {
            const isActive = season === s
            const color = SEASON_COLORS[s]
            return (
              <div key={s} className="relative group">
                <button
                  onClick={() => setSeason(s)}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-display text-sm transition-all duration-300"
                  style={{
                    background: isActive
                      ? `radial-gradient(circle, ${color}40, ${color}10)`
                      : 'transparent',
                    border: isActive ? `1.5px solid ${color}` : '1.5px solid transparent',
                    boxShadow: isActive
                      ? `0 0 12px ${color}40, 0 0 24px ${color}20`
                      : 'none',
                    color: isActive ? color : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {SEASON_LABELS[s].jp}
                </button>
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-black/80 text-white/80 text-xs font-mono-label whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {lang === 'zh' ? SEASON_LABELS[s].zh : lang === 'en' ? SEASON_LABELS[s].en : SEASON_LABELS[s].jp}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
