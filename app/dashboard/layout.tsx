"use client"
import React from 'react'

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ProgressBar } from "@/components/duolingo-ui"
import {
  MissionList,
  RewardPopup,
} from "@/components/duolingo-ui"
import { LanguageSelector } from "@/components/language/language-selector"
import { AddLanguageModal } from "@/components/language/add-language-modal"
import { Confetti, type ConfettiRef } from "@/components/confetti"
import { Home, Zap, Shield, User, Settings, Bell, Star, Flame, Gem, MoreHorizontal, X, Archive, Loader2 } from "lucide-react"
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth, LANGUAGE_CHANGED_EVENT } from "@/lib/hooks/use-auth"
import { useMissions } from "@/lib/hooks/use-missions"
import { useUserLanguages } from "@/lib/hooks/use-user-languages"
import { Toaster } from "react-hot-toast"
import { LISTNAVITEMS } from '@/lib/constant/nav-items'
import BottomNavigation from '@/components/navigation/bottom-navigation-mobile'
import { Button } from '@/components/ui/button'


function layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isSamePath = (path: string) => pathname === path
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  // Language management
  const {
    languages,
    activeLanguage,
    isLoading: languagesLoading,
    addLanguage,
    switchLanguage,
  } = useUserLanguages()
  const [showAddLanguage, setShowAddLanguage] = useState(false)

  // Handle language switch with page refresh
  const handleLanguageSwitch = async (languageId: string) => {
    await switchLanguage(languageId)
    // Dispatch custom event to notify all components about language change
    window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGED_EVENT))
  }

  // Mission system integration
  const { dailyMissions, isLoading: missionsLoading, claimReward, refetch } = useMissions()
  const [claimedReward, setClaimedReward] = useState<{
    xp?: number
    gems?: number
    hearts?: number
  } | null>(null)

  // Handle mission claim
  const handleClaimMission = async (missionId: string) => {
    const result = await claimReward(missionId)
    if (result) {
      setClaimedReward(result)
      // Refetch missions after claiming
      refetch()
    }
  }

  // Daily XP goal - get from user data
  const dailyXp = user?.dailyXp ?? 0
  const [dailyGoal, setDailyGoal] = useState(50)
  const [showEditGoal, setShowEditGoal] = useState(false)
  const [editGoalValue, setEditGoalValue] = useState(50)
  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false)

  // Update dailyGoal when user data loads
  useEffect(() => {
    if (user?.dailyXpGoal) {
      setDailyGoal(user.dailyXpGoal)
      setEditGoalValue(user.dailyXpGoal)
    }
  }, [user?.dailyXpGoal])

  // Handle updating daily goal
  const handleUpdateGoal = async () => {
    if (editGoalValue < 10 || editGoalValue > 500) return

    setIsUpdatingGoal(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/daily-goal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dailyXpGoal: editGoalValue }),
      })

      if (res.ok) {
        setDailyGoal(editGoalValue)
        setShowEditGoal(false)
      }
    } catch (error) {
      console.error('Failed to update goal:', error)
    } finally {
      setIsUpdatingGoal(false)
    }
  }

  // Goal options
  const goalOptions = [
    { value: 10, label: 'Casual', description: '10 XP per day' },
    { value: 20, label: 'Regular', description: '20 XP per day' },
    { value: 50, label: 'Serious', description: '50 XP per day' },
    { value: 100, label: 'Intense', description: '100 XP per day' },
  ]

  // Language icon mapping
  const languageIcons: Record<string, string> = {
    python: "/python.png",
    javascript: "/javascript.png",
    java: "/java.png",
    typescript: "/typescript.png",
  }

  // Get all available languages (for add language modal)
  const [allLanguages, setAllLanguages] = useState<any[]>([])

  useEffect(() => {
    const fetchAllLanguages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/languages`)
        if (res.ok) {
          const data = await res.json()
          // Filter out already selected languages
          const selectedLangIds = new Set(languages.map(l => l.languageId))
          setAllLanguages(data.filter((lang: any) => !selectedLangIds.has(lang.id)))
        }
      } catch (error) {
        console.error('Failed to fetch languages:', error)
      }
    }

    fetchAllLanguages()
  }, [languages])
  return (
    <div className="w-full mx-auto">
      <Toaster position="top-center" />    
      <div className="mx-auto w-full items-start pt-10 justify-center flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation (Desktop) */}
        <aside className="hidden lg:flex flex-col gap-2  ">
          {LISTNAVITEMS.map((item, i) => (
            <div
              onClick={() => { router.push(item.href) }}
              className={`w-full text-left flex justify-start gap-3 p-5  border-2 ${isSamePath(item.href) ? "bg-secondary/20 border-secondary" : "border-transparent"} rounded-xl  `}
            >
              <item.icon className={`w-5 h-5 ${isSamePath(item.href) ? "text-secondary" : "text-muted-foreground"}`} /> <span className={`font-bold ${isSamePath(item.href) ? "text-secondary" : "text-muted-foreground"}`}>{item.name}</span>
            </div>
          ))
          }
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-12 max-w-2xl">

          {children}
        </main>
        {/* Right Sidebar (Desktop) */}
        <div className="hidden lg:flex flex-col gap-6 w-80 shrink-0">
          {/* Language Selector */}
          {!languagesLoading && (
            <LanguageSelector
              activeLanguage={activeLanguage}
              allLanguages={languages}
              onLanguageSwitch={handleLanguageSwitch}
              onAddLanguage={() => setShowAddLanguage(true)}
            />
          )}

          {/* Stats Row */}
          <div className="flex justify-between items-center">
            {/* Streak */}
            <div className="flex items-center justify-center gap-1">
              <span className='text-2xl'>🔥</span>
              <p className="font-bold text-gray-700 text-lg">{user?.streak ?? 0}</p>
            </div>
            {/* Gems/XP */}
            <div className="flex items-center justify-center gap-1">
              <span className='text-2xl'>👾</span>
              <p className="font-bold text-gray-700 text-lg">{user?.xp ?? 0}</p>
            </div>
            {/* Hearts */}
            <div className="flex items-center justify-end gap-1">
              <span className='text-2xl'>💎</span>
              <p className="font-bold text-gray-700 text-lg">{user?.gems ?? 0}</p>
            </div>

          </div>

          {/* Dynamic Mission List */}
          <MissionList
            missions={dailyMissions}
            title="Daily Quests"
            onClaim={handleClaimMission}
            isLoading={missionsLoading}
            emptyMessage="Complete lessons to unlock quests!"
          />

          {/* Reward Popup */}
          <RewardPopup
            isOpen={!!claimedReward}
            reward={claimedReward ? {
              id: "claimed",
              xp: claimedReward.xp ?? 0,
              gems: claimedReward.gems ?? 0,
              hearts: claimedReward.hearts ?? 0,
              streakFreeze: 0,
              xpBooster: 0,
              items: [],
            } : null}
            onClose={() => setClaimedReward(null)}
          />

          {/* XP Progress */}
          <Card className="p-4 space-y-4 border-2 border-gray-200 shadow-none">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-700">XP Progress</h3>
              <button
                onClick={() => setShowEditGoal(true)}
                className="text-blue-400 font-bold text-xs uppercase hover:text-blue-500 transition-colors"
              >
                Edit Goal
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center border-2 border-orange-200">
                <Gem className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-sm font-bold text-gray-700">Daily goal</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <ProgressBar value={dailyXp} max={dailyGoal} color="bg-orange-400" className="h-3" />
                  </div>
                  <span className="text-xs font-bold text-gray-400">{dailyXp}/{dailyGoal} XP</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Edit Goal Modal */}
          {showEditGoal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xl text-gray-800">Daily Goal</h3>
                    <button
                      onClick={() => setShowEditGoal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Choose your daily XP target</p>
                </div>

                <div className="p-4 space-y-2">
                  {goalOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setEditGoalValue(option.value)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${editGoalValue === option.value
                          ? 'bg-blue-50 border-blue-400'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="text-left">
                        <p className={`font-bold ${editGoalValue === option.value ? 'text-blue-600' : 'text-gray-700'}`}>
                          {option.label}
                        </p>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </div>
                      {editGoalValue === option.value && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-100">
                  <Button
                    variant="primary"
                    onClick={handleUpdateGoal}
                    disabled={isUpdatingGoal}
                    className="w-full bg-blue-500 border-blue-600 hover:bg-blue-400"
                  >
                    {isUpdatingGoal ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Save Goal'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Create Profile - Show only for guests or unauthenticated */}
          {(!isAuthenticated || user?.isGuest) && (
            <Card className="p-6 space-y-4 border-2 border-gray-200 shadow-none">
              <h3 className="font-bold text-lg text-gray-700">Create a profile to save your progress!</h3>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  onClick={() => router.push('/dashboard/profile')}
                  className="w-full text-white"
                >
                  Create a profile
                </Button>
                <Button
                  variant="primary"
                  onClick={() => router.push('/login')}
                  className="w-full bg-blue-400 border-blue-500 hover:bg-blue-300 text-white uppercase tracking-widest"
                >
                  Sign in
                </Button>
              </div>
            </Card>
          )}

          {/* User Profile Card - Show for authenticated users */}
          {isAuthenticated && !user?.isGuest && user && (
            <Card
              className="p-4 space-y-3 border-2 border-gray-200 shadow-none cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => router.push('/dashboard/profile')}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-200">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-700">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.email || 'No email'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                <div className="text-center">
                  <p className="font-bold text-lg text-gray-700">{user.xp}</p>
                  <p className="text-xs text-gray-500">Total XP</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-gray-700">{user.streak}</p>
                  <p className="text-xs text-gray-500">Day Streak</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-gray-700">{user.hearts}</p>
                  <p className="text-xs text-gray-500">Hearts</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNavigation />

        {/* Add Language Modal */}
        <AddLanguageModal
          isOpen={showAddLanguage}
          onClose={() => setShowAddLanguage(false)}
          availableLanguages={allLanguages}
          onAddLanguage={addLanguage}
        />
      </div>
    </div>
  )
}

export default layout
