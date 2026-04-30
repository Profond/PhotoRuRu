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

export function useMusicPlayer() {
  const apRef = useRef<APlayer | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<MusicState>({
    playing: false,
    muted: false,
    volume: musicConfig.volume,
    currentTitle: '',
    currentArtist: '',
  });

  useEffect(() => {
    if (!musicConfig.enable) return;

    // Create hidden container for APlayer
    const container = document.createElement('div');
    container.style.display = 'none';
    document.body.appendChild(container);
    containerRef.current = container;

    const apiUrl = musicConfig.metingApi
      + '?server=' + musicConfig.server
      + '&type=' + musicConfig.type
      + '&id=' + musicConfig.id
      + '&r=' + Math.random();

    fetch(apiUrl)
      .then((res) => res.json())
      .then((audioList: Array<{ name: string; artist: string; url: string; cover: string; lrc: string }>) => {
        if (!audioList || !audioList.length) return;

        const ap = new APlayer({
          container,
          audio: audioList,
          mutex: true,
          volume: musicConfig.volume,
          lrcType: 0,
        });

        apRef.current = ap;

        // Sync initial track info
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
          // Loop: go back to first track when playlist ends
          if (ap.list.index >= ap.list.audios.length - 1) {
            ap.list.switch(0);
            ap.play();
          }
        });
      })
      .catch(() => { /* silently fail if API unreachable */ });

    return () => {
      apRef.current?.destroy();
      container.remove();
    };
  }, []);

  const toggle = useCallback(() => {
    apRef.current?.toggle();
  }, []);

  const next = useCallback(() => {
    apRef.current?.skipForward();
    apRef.current?.play();
  }, []);

  const prev = useCallback(() => {
    apRef.current?.skipBack();
    apRef.current?.play();
  }, []);

  const setVolume = useCallback((v: number) => {
    apRef.current?.volume(v, true);
    setState((s) => ({ ...s, volume: v }));
  }, []);

  const toggleMute = useCallback(() => {
    if (!apRef.current) return;
    const muted = apRef.current.audio.muted;
    apRef.current.audio.muted = !muted;
    setState((s) => ({ ...s, muted: !muted }));
  }, []);

  return { ...state, toggle, next, prev, setVolume, toggleMute, enabled: musicConfig.enable };
}
