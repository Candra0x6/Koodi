"use client"
import React from 'react'

import { useState, useRef, useEffect } from "react"
import {
  Button,
  Card,
  ProgressBar,
  MissionList,
  RewardPopup,
} from "@/components/duolingo-ui"
import { Confetti, type ConfettiRef } from "@/components/confetti"
import { Home, Zap, Shield, User, Settings, Bell, Star, Flame, Gem, MoreHorizontal, X, Archive, Loader2 } from "lucide-react"
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from "@/lib/hooks/use-auth"
import { useMissions } from "@/lib/hooks/use-missions"
import { Toaster } from "react-hot-toast"

const listNavItems = [
  { name: "LEARN", icon: Home, href: "/dashboard" },
  { name: "PRACTICE", icon: Zap, href: "/dashboard/practice" },
    { name: "LEADERBOARD", icon: Shield, href: "/dashboard/leaderboard" },
    { name: "QUESTS", icon: Star, href: "/dashboard/quests" },
    { name: "SHOP", icon: Gem, href: "/dashboard/shop" },
    { name: "PROFILE", icon: User, href: "/dashboard/profile" },
]
function layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isSamePath = (path: string) => pathname === path
    const router = useRouter()
    const { user, isAuthenticated, isLoading } = useAuth()
    
    // Mission system integration
    const { missions, isLoading: missionsLoading, claimReward, refetch } = useMissions()
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
    
    // Calculate daily XP progress (XP earned today)
    const [dailyXp, setDailyXp] = useState(0)
    const dailyGoal = 10 // Default daily goal
    
    // Language icon mapping
    const languageIcons: Record<string, string> = {
      python: "/python.png",
      javascript: "/javascript.png",
      java: "/java.png",
      typescript: "/typescript.png",
    }
    
    const selectedLanguageSlug = user?.selectedLanguage?.slug || "python"
    const languageIcon = languageIcons[selectedLanguageSlug] || "/python.png"
    const languageName = user?.selectedLanguage?.name || "Python"
  return (
    <div className="">
    <Toaster position="top-center" />    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation (Desktop) */}
        <aside className="hidden lg:flex flex-col gap-2 w-64 shrink-0 sticky top-24 h-[calc(100vh-8rem)]">
         {listNavItems.map((item, i) => (
           <div
           onClick={() => {router.push(item.href)}}
           className={`w-full text-left flex justify-start gap-3 p-5  border-2 ${ isSamePath(item.href) ? "bg-[#DDF4FF] border-[#84D8FF]" : "border-transparent"} rounded-xl  `}
         >
           <item.icon className={`w-5 h-5 ${ isSamePath(item.href) ? "text-[#49bff6]" : "text-gray-400"}`} /> <span className={`font-bold ${ isSamePath(item.href) ? "text-[#49bff6]" : "text-gray-400"}`}>{item.name}</span>
         </div>  
        )) 
         }
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-12 max-w-3xl">
         
        {children}
        </main>
        {/* Right Sidebar (Desktop) */}
          <div className="hidden lg:flex flex-col gap-6 w-80 shrink-0">
         <div className="flex justify-between items-center mb-2">

          {/* Language */}
          <div className='flex items-center gap-x-2'>
            <Image src={languageIcon} alt={languageName} width={30} height={30} />
          </div>
          {/* Streak */}
          <div className="flex items-center justify-end gap-1">
            <span className='text-2xl'>🔥</span>
            <p className="font-bold text-gray-700 text-lg">{user?.streak ?? 0}</p>
          </div>
          {/* Gems/XP */}
          <div className="flex items-center justify-end gap-1">
            <span className='text-2xl'>💎</span>
            <p className="font-bold text-gray-700 text-lg">{user?.xp ?? 0}</p>
          </div>
          {/* Hearts */}
          <div className="flex items-center justify-end gap-1">
            <span className='text-2xl'>❤️</span>
            <p className="font-bold text-gray-700 text-lg">{user?.hearts ?? 5}</p>
          </div>

         </div>
          
          {/* Dynamic Mission List */}
          <MissionList 
            missions={missions}
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
              <button className="text-blue-400 font-bold text-xs uppercase hover:text-blue-500 transition-colors">
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

          {/* Create Profile - Show only for guests or unauthenticated */}
          {(!isAuthenticated || user?.isGuest) && (
            <Card className="p-6 space-y-4 border-2 border-gray-200 shadow-none">
              <h3 className="font-bold text-lg text-gray-700">Create a profile to save your progress!</h3>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  onClick={() => router.push('/register')}
                  className="w-full bg-green-500 border-green-600 hover:bg-green-400 text-white uppercase tracking-widest"
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
      </div>
    </div>
  )
}

export default layout
      