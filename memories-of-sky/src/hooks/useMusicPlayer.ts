import { useEffect, useRef, useState, useCallback } from 'react';
import APlayer from 'aplayer';
import 'aplayer/dist/APlayer.min.css';
import { musicConfig } from '@/config/music';

interface MusicState {
  playing: boolean;
  muted: boolean;
  volume: number;
  currentTitle: string;
  currentArtist: string;
}

// Use Netlify redirect proxy to reach SCF API (avoids browser CORS/network issues)
const NCM_BASE = '/api/ncm';

export function useMusicPlayer() {
  const apRef = useRef<APlayer | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cleanupInteractionRef = useRef<(() => void) | null>(null);
  const [state, setState] = useState<MusicState>({
    playing: false,
    muted: false,
    volume: musicConfig.volume,
    currentTitle: '',
    currentArtist: '',
  });

  useEffect(() => {
    if (!musicConfig.enable) return;

    const container = document.createElement('div');
    container.style.display = 'none';
    document.body.appendChild(container);
    containerRef.current = container;

    async function loadMusic() {
      try {
        // 1. Fetch playlist
        const playlistRes = await fetch(`${NCM_BASE}/playlist/detail?id=${musicConfig.id}`);
        const playlistData = await playlistRes.json();
        const tracks: any[] = playlistData.playlist?.tracks ?? [];
        if (!tracks.length) return;

        const ids = tracks.map((t: any) => t.id);

        // 2. Fetch song URLs one by one (SCF rate-limits batch requests from proxy)
        const urlMap = new Map<number, string>();
        for (const tid of ids) {
          try {
            const r = await fetch(`${NCM_BASE}/song/url?id=${tid}&br=128000`);
            const d = await r.json();
            if (d.data?.[0]?.url) {
              let url: string = d.data[0].url;
              if (url.startsWith('http://')) url = 'https://' + url.slice(7);
              urlMap.set(tid, url);
            }
          } catch { /* skip */ }
        }

        // 3. Fetch lyrics in parallel (lightweight, less likely to be blocked)
        const lyricsArr = await Promise.all(
          ids.map((tid: number) =>
            fetch(`${NCM_BASE}/lyric?id=${tid}`)
              .then((r) => r.json())
              .then((d: any) => d.lrc?.lyric ?? '')
              .catch(() => '')
          )
        );

        // 4. Build audio list
        const audioList = tracks.map((track: any, i: number) => {
          let cover = track.al?.picUrl ? track.al.picUrl + '?param=300y300' : '';
          if (cover.startsWith('http://')) cover = 'https://' + cover.slice(7);
          return {
            name: track.name || 'Unknown',
            artist: (track.ar || []).map((a: any) => a.name).join(' / '),
            url: urlMap.get(track.id) || '',
            cover,
            lrc: lyricsArr[i] || '',
          };
        });

        if (!audioList.length) return;

        const ap = new APlayer({
          container,
          audio: audioList,
          mutex: true,
          volume: musicConfig.volume,
          lrcType: 0,
        });

        apRef.current = ap;

        const current = ap.list.audios[ap.list.index];
        if (current) {
          setState((s) => ({ ...s, currentTitle: current.name, currentArtist: current.artist }));
        }

        ap.on('play', () => setState((s) => ({ ...s, playing: true })));
        ap.on('pause', () => setState((s) => ({ ...s, playing: false })));
        ap.on('listswitch', (info: { index: number }) => {
          const cur = ap.list.audios[info.index];
          if (cur) {
            setState((s) => ({ ...s, currentTitle: cur.name, currentArtist: cur.artist }));
          }
        });
        ap.on('ended', () => {
          if (ap.list.index >= ap.list.audios.length - 1) {
            ap.list.switch(0);
            ap.play();
          }
        });

        if (musicConfig.autoplay) {
          const tryPlay = () => {
            if (apRef.current && !apRef.current.audio.paused) return;
            apRef.current?.play();
          };
          tryPlay();
          setTimeout(() => {
            if (apRef.current && apRef.current.audio.paused) {
              const onInteraction = () => {
                tryPlay();
                cleanupInteractionRef.current?.();
                cleanupInteractionRef.current = null;
              };
              document.addEventListener('click', onInteraction, { once: true });
              document.addEventListener('keydown', onInteraction, { once: true });
              document.addEventListener('touchstart', onInteraction, { once: true });
              cleanupInteractionRef.current = () => {
                document.removeEventListener('click', onInteraction);
                document.removeEventListener('keydown', onInteraction);
                document.removeEventListener('touchstart', onInteraction);
              };
            }
          }, 500);
        }
      } catch (err) {
        console.error('Music load error:', err);
      }
    }

    loadMusic();

    return () => {
      cleanupInteractionRef.current?.();
      cleanupInteractionRef.current = null;
      apRef.current?.destroy();
      container.remove();
    };
  }, []);

  const toggle = useCallback(() => { apRef.current?.toggle(); }, []);
  const next = useCallback(() => { apRef.current?.skipForward(); apRef.current?.play(); }, []);
  const prev = useCallback(() => { apRef.current?.skipBack(); apRef.current?.play(); }, []);
  const setVolume = useCallback((v: number) => { apRef.current?.volume(v, true); setState((s) => ({ ...s, volume: v })); }, []);
  const toggleMute = useCallback(() => {
    if (!apRef.current) return;
    apRef.current.audio.muted = !apRef.current.audio.muted;
    setState((s) => ({ ...s, muted: !s.muted }));
  }, []);

  return { ...state, toggle, next, prev, setVolume, toggleMute, enabled: musicConfig.enable };
}
