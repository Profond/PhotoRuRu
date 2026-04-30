import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Season, SeasonConfig, Lang } from '@/types';
import { SEASONS, TRANSLATIONS } from '@/types';

interface AppState {
  currentSeason: SeasonConfig;
  sliderValue: number;
  timeString: string;
  lang: Lang;
  setSeason: (season: Season) => void;
  setSliderValue: (value: number) => void;
  setLang: (lang: Lang) => void;
  t: typeof TRANSLATIONS['zh'];
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentSeason, setCurrentSeason] = useState<SeasonConfig>(SEASONS[0]);
  const [sliderValue, setSliderValueState] = useState(0.15);
  const [timeString, setTimeString] = useState('07:00');
  const [lang, setLangState] = useState<Lang>('zh');

  const t = TRANSLATIONS[lang];

  const setSeason = useCallback((season: Season) => {
    const config = SEASONS.find(s => s.id === season);
    if (config) {
      setCurrentSeason(config);
    }
  }, []);

  const setSliderValue = useCallback((value: number) => {
    const clamped = Math.max(0, Math.min(1, value));
    setSliderValueState(clamped);
    const hours = Math.floor(4 + clamped * 20);
    const minutes = Math.round(((4 + clamped * 20) % 1) * 60);
    setTimeString(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentSeason,
        sliderValue,
        timeString,
        lang,
        setSeason,
        setSliderValue,
        setLang,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
