import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';

const btnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  border: 'none',
  background: 'transparent',
  color: 'rgba(255,255,255,0.6)',
  cursor: 'pointer',
  transition: 'color 0.2s, background 0.2s',
  padding: 0,
};

export default function MusicPlayer() {
  const { playing, muted, volume, currentTitle, currentArtist, toggle, next, prev, toggleMute, enabled } =
    useMusicPlayer();

  if (!enabled) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Prev / Play / Next */}
      <button
        style={btnStyle}
        onClick={prev}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'transparent'; }}
        aria-label="Previous track"
      >
        <SkipBack size={14} />
      </button>

      <button
        style={{ ...btnStyle, width: 32, height: 32, border: '1px solid rgba(255,255,255,0.25)' }}
        onClick={toggle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.background = 'transparent'; }}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: 2 }} />}
      </button>

      <button
        style={btnStyle}
        onClick={next}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'transparent'; }}
        aria-label="Next track"
      >
        <SkipForward size={14} />
      </button>

      {/* Mute */}
      <button
        style={{ ...btnStyle, width: 24, height: 24 }}
        onClick={toggleMute}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
      </button>

      {/* Track info */}
      {currentTitle && (
        <span
          className="hidden lg:block font-mono text-[10px] tracking-wider max-w-[120px] truncate"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          title={`${currentTitle} - ${currentArtist}`}
        >
          {currentTitle}
        </span>
      )}
    </div>
  );
}
