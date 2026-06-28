import { createContext, useContext, useEffect, useState } from 'react'
import { fetchSettings } from '../lib/api'

/**
 * SettingsContext — loads dashboard-managed site settings (hero text, stats,
 * WhatsApp number, social links, bio) so the public site renders dynamically.
 * Ships with sensible defaults so the site looks complete before the API
 * responds or if it's offline.
 */
const DEFAULTS = {
  whatsapp_number: '212600000000',
  whatsapp_message: 'Hi Mehdi, I saw your portfolio…',
  hero_title: 'I build refined, high-end web experiences.',
  hero_subtitle:
    'I craft fast, accessible and beautifully animated apps with React, Tailwind, Laravel & MySQL — turning ideas into polished products.',
  hero_roles: ['Full Stack Developer', 'React Developer', 'Laravel Developer'],
  bio: "I'm a full-stack developer who loves the sweet spot between engineering and design.",
  // Profile photo URL (set from the dashboard); empty → local placeholder.
  profile_photo: '',
  available: true,
  stats: [
    { label: 'Years experience', value: 4, suffix: '+' },
    { label: 'Projects shipped', value: 50, suffix: '+' },
    { label: 'Happy clients', value: 30, suffix: '+' },
    { label: 'Cups of coffee', value: 12, suffix: 'k' },
  ],
  socials: {
    linkedin: 'https://linkedin.com/',
    github: 'https://github.com/',
    email: 'lyrvmind@gmail.com',
  },
}

const SettingsContext = createContext({ settings: DEFAULTS, loading: true })

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    fetchSettings()
      .then((data) => {
        if (!alive || !data) return
        // Merge so any missing keys fall back to defaults.
        setSettings({ ...DEFAULTS, ...data })
      })
      .catch(() => {}) // keep defaults on failure
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
