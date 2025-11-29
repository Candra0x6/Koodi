'use client'

import { useCallback, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface Language {
  id: string
  name: string
  slug: string
}

interface UserLanguageProgress {
  id: string
  userId: string
  languageId: string
  language: Language
  skillLevel: string
  isActive: boolean
  currentChapterId?: string | null
}

interface UseUserLanguagesReturn {
  languages: UserLanguageProgress[]
  activeLanguage: UserLanguageProgress | null
  isLoading: boolean
  error: string | null
  addLanguage: (languageId: string, skillLevel: string) => Promise<void>
  switchLanguage: (languageId: string) => Promise<void>
  refetch: () => Promise<void>
}

export function useUserLanguages(): UseUserLanguagesReturn {
  const [languages, setLanguages] = useState<UserLanguageProgress[]>([])
  const [activeLanguage, setActiveLanguage] = useState<UserLanguageProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLanguages = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const res = await fetch('/api/user/languages')
      if (!res.ok) {
        throw new Error('Failed to fetch languages')
      }

      const data = await res.json()
      setLanguages(data.languages || [])
      setActiveLanguage(data.activeLanguage || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load languages')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addLanguage = useCallback(
    async (languageId: string, skillLevel: string) => {
      try {
        const res = await fetch('/api/user/languages/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ languageId, skillLevel }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to add language')
        }

        await fetchLanguages()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add language'
        toast.error(message)
        throw err
      }
    },
    [fetchLanguages]
  )

  const switchLanguage = useCallback(
    async (languageId: string) => {
      try {
        const res = await fetch('/api/user/languages/switch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ languageId }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to switch language')
        }

        await fetchLanguages()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to switch language'
        toast.error(message)
        throw err
      }
    },
    [fetchLanguages]
  )

  useEffect(() => {
    fetchLanguages()
  }, [fetchLanguages])

  return {
    languages,
    activeLanguage,
    isLoading,
    error,
    addLanguage,
    switchLanguage,
    refetch: fetchLanguages,
  }
}
