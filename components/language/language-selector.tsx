'use client'

import React, { useState } from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import { Button } from '@/components/duolingo-ui'
import Image from 'next/image'
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
}

interface LanguageSelectorProps {
  activeLanguage: UserLanguageProgress | null
  allLanguages: UserLanguageProgress[]
  onLanguageSwitch: (languageId: string) => Promise<void>
  onAddLanguage: () => void
}

const languageIcons: Record<string, string> = {
  python: '/python.png',
  javascript: '/javascript.png',
  java: '/java.png',
  typescript: '/typescript.png',
}

export const LanguageSelector = ({
  activeLanguage,
  allLanguages,
  onLanguageSwitch,
  onAddLanguage,
}: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)

  const handleLanguageSwitch = async (languageId: string) => {
    setIsSwitching(true)
    try {
      await onLanguageSwitch(languageId)
      setIsOpen(false)
      toast.success('Language switched!')
    } catch (error) {
      toast.error('Failed to switch language')
    } finally {
      setIsSwitching(false)
    }
  }

  if (!activeLanguage) {
    return null
  }

  const activeIcon = languageIcons[activeLanguage.language.slug] || '/python.png'

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-3 rounded-2xl border-2 border-gray-200 bg-white hover:bg-gray-50 transition-colors w-full"
      >
        <Image
          src={activeIcon}
          alt={activeLanguage.language.name}
          width={24}
          height={24}
        />
        <span className="font-bold text-sm text-gray-700 flex-1">
          {activeLanguage.language.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border-2 border-gray-200 rounded-2xl shadow-lg z-50">
          {/* Current Languages */}
          <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
            {allLanguages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => handleLanguageSwitch(lang.languageId)}
                disabled={isSwitching}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  lang.isActive
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'border-2 border-transparent hover:bg-gray-50'
                }`}
              >
                <Image
                  src={languageIcons[lang.language.slug] || '/python.png'}
                  alt={lang.language.name}
                  width={20}
                  height={20}
                />
                <div className="flex-1 text-left">
                  <p className="font-bold text-sm text-gray-700">
                    {lang.language.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {lang.skillLevel.toLowerCase()}
                  </p>
                </div>
                {lang.isActive && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
              </button>
            ))}
          </div>

          {/* Divider */}
          {allLanguages.length > 0 && (
            <div className="border-t border-gray-200" />
          )}

          {/* Add New Language Button */}
          <button
            onClick={() => {
              setIsOpen(false)
              onAddLanguage()
            }}
            className="w-full flex items-center justify-center gap-2 p-3 text-blue-500 hover:bg-blue-50 transition-colors font-bold text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Language
          </button>
        </div>
      )}
    </div>
  )
}
