import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Season } from '@/lib/utils'
import { translations, type Lang, type Translations } from '@/lib/translations'

interface AppContextValue {
  season: Season
  setSeason: (s: Season) => void
  timeFraction: number
  setTimeFraction: (t: number) => void
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [season, setSeason] = useState<Season>('spring')
  const [timeFraction, setTimeFraction] = useState(0.15)
  const [lang, setLang] = useState<Lang>('ja')
  const t = translations[lang]

  return (
    <AppContext.Provider
      value={{ season, setSeason, timeFraction, setTimeFraction, lang, setLang, t }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
