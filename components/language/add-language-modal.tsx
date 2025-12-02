'use client'

import React, { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RadioGroup } from '@/components/duolingo-ui'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface Language {
  id: string
  name: string
  slug: string
}

interface AddLanguageModalProps {
  isOpen: boolean
  onClose: () => void
  availableLanguages: Language[]
  onAddLanguage: (languageId: string, skillLevel: string) => Promise<void>
}

const languageIcons: Record<string, string> = {
  python: '/python.png',
  javascript: '/javascript.png',
  java: '/java.png',
  typescript: '/typescript.png',
}

const skillLevels = [
  { label: 'Beginner', value: 'BEGINNER' },
  { label: 'Intermediate', value: 'INTERMEDIATE' },
  { label: 'Advanced', value: 'ADVANCED' },
]

export const AddLanguageModal = ({
  isOpen,
  onClose,
  availableLanguages,
  onAddLanguage,
}: AddLanguageModalProps) => {
  const [step, setStep] = useState<'select' | 'skill'>('select')
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [selectedSkill, setSelectedSkill] = useState('BEGINNER')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSelectLanguage = (language: Language) => {
    setSelectedLanguage(language)
    setStep('skill')
  }

  const handleAddLanguage = async () => {
    if (!selectedLanguage) return

    setIsLoading(true)
    try {
      await onAddLanguage(selectedLanguage.id, selectedSkill)
      toast.success(`Started learning ${selectedLanguage.name}!`)
      handleClose()
    } catch (error) {
      toast.error('Failed to add language')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep('select')
    setSelectedLanguage(null)
    setSelectedSkill('BEGINNER')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-gray-200 bg-blue-50">
          <h2 className="text-xl font-bold text-gray-700">
            {step === 'select' ? 'Choose a Language' : 'Select Your Level'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-blue-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 min-h-96">
          {step === 'select' ? (
            // Step 1: Language Selection
            <div className="space-y-3">
              <p className="text-sm text-gray-600 font-medium mb-4">
                Pick a language to get started
              </p>
              {availableLanguages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => handleSelectLanguage(lang)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all"
                >
                  <Image
                    src={languageIcons[lang.slug] || '/python.png'}
                    alt={lang.name}
                    width={40}
                    height={40}
                  />
                  <span className="font-bold text-gray-700">{lang.name}</span>
                </button>
              ))}
            </div>
          ) : (
            // Step 2: Skill Level Selection
            <div className="space-y-4">
              <p className="text-sm text-gray-600 font-medium">
                What's your {selectedLanguage?.name} experience?
              </p>
              <RadioGroup
                options={skillLevels}
                value={selectedSkill}
                onChange={setSelectedSkill}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-gray-200 bg-gray-50 flex justify-between gap-3">
          {step === 'skill' && (
            <Button
              variant="outline"
              onClick={() => {
                setStep('select')
                setSelectedLanguage(null)
              }}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            variant="primary"
            onClick={
              step === 'select'
                ? () =>
                    handleSelectLanguage(availableLanguages[0])
                : handleAddLanguage
            }
            disabled={isLoading}
            className={step === 'skill' ? 'flex-1' : 'w-full'}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : step === 'select' ? (
              'Choose'
            ) : (
              'Start Learning'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
