"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { Card } from "@/components/ui/card"
import { User, Calendar, Zap, Gem, Heart, Trophy, Clock, Loader2, Edit2 } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { format } from "date-fns"
import { ProfileEditForm } from "@/components/profile/profile-edit-form"
import { User as PrismaUser } from "@/lib/generated/prisma/client"
import { Button } from "@/components/ui/button"

interface RewardHistoryItem {
  id: string
  goal: string
  category: string
  claimedAt: string
  reward: {
    xp: number
    gems: number
    hearts: number
  } | null
}

interface RewardsData {
  history: RewardHistoryItem[]
  totals: {
    xp: number
    gems: number
    hearts: number
  }
}

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const [rewardsData, setRewardsData] = useState<RewardsData | null>(null)
  const [loadingRewards, setLoadingRewards] = useState(true)
  const [showEditForm, setShowEditForm] = useState(false)
  const [displayUser, setDisplayUser] = useState<PrismaUser | null>(null)

  useEffect(() => {
    if (user) {
      setDisplayUser(user)
    }
  }, [user])

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/rewards`)
        if (res.ok) {
          const data = await res.json()
          setRewardsData(data)
        }
      } catch (error) {
        console.error("Failed to fetch rewards:", error)
      } finally {
        setLoadingRewards(false)
      }
    }

    if (user) {
      fetchRewards()
    } else if (!authLoading) {
      setLoadingRewards(false)
    }
  }, [user, authLoading])

  const handleEditSuccess = (updatedUser: PrismaUser) => {
    setDisplayUser(updatedUser)
  }

  if (authLoading || loadingRewards) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!user || !displayUser) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">Please sign in to view your profile</h2>
      </div>
    )
  }

  const joinDate = new Date(displayUser.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="w-full pb-20 space-y-8">
      {/* Edit Form Modal */}
      {showEditForm && displayUser && (
        <ProfileEditForm 
          user={displayUser}
          onClose={() => setShowEditForm(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Profile Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-200 pb-8">
        <div className="space-y-1 flex-1">
          <h1 className="text-3xl font-extrabold text-gray-700">{displayUser.username}</h1>
          <p className="text-gray-500 font-medium">
            {displayUser.email || <span className="text-orange-500">(No email set)</span>}
          </p>
          {displayUser.isGuest && (
            <p className="text-orange-500 font-bold text-sm">👤 Guest Account</p>
          )}
          <div className="text-gray-400 font-medium text-sm pt-1">
            Joined {joinDate}
          </div>
        </div>
        <div className="flex flex-col gap-3 items-end">
          <Button
            onClick={() => setShowEditForm(true)}
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            {displayUser.isGuest ? 'Complete Account' : 'Edit Profile'}
          </Button>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-2 shadow-sm">
            <Image 
              src="/diverse-flags.png" 
              alt="Language" 
              width={32} 
              height={32} 
              className="rounded-sm"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-700">Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Streak */}
          <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-4">
             <div className="text-orange-500"><Zap className="w-6 h-6 fill-current" /></div>
             <div>
                <div className="text-xl font-bold text-gray-700">{displayUser.streak}</div>
                <div className="text-gray-400 text-sm font-bold uppercase">Day Streak</div>
             </div>
          </div>
          
          {/* Total XP */}
          <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-4">
             <div className="text-yellow-500"><Zap className="w-6 h-6 fill-current" /></div>
             <div>
                <div className="text-xl font-bold text-gray-700">{displayUser.xp}</div>
                <div className="text-gray-400 text-sm font-bold uppercase">Total XP</div>
             </div>
          </div>

          {/* League */}
          <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-4">
             <div className="text-yellow-600"><Trophy className="w-6 h-6 fill-current" /></div>
             <div>
                <div className="text-xl font-bold text-gray-700">Bronze</div>
                <div className="text-gray-400 text-sm font-bold uppercase">Current League</div>
             </div>
          </div>

          {/* Hearts */}
          <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-4">
             <div className="text-red-500"><Heart className="w-6 h-6 fill-current" /></div>
             <div>
                <div className="text-xl font-bold text-gray-700">{displayUser.hearts}</div>
                <div className="text-gray-400 text-sm font-bold uppercase">Hearts</div>
             </div>
          </div>
        </div>
      </div>

      {/* Achievements / Rewards List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-700">Achievements</h2>
            <Button variant="ghost" className="text-blue-400 uppercase font-bold hover:bg-blue-50">View All</Button>
        </div>
        
        <div className="border-2 border-gray-200 rounded-2xl overflow-hidden">
            {rewardsData?.history && rewardsData.history.length > 0 ? (
                rewardsData.history.map((item, index) => (
                    <div key={item.id} className={`p-4 flex items-center gap-4 bg-white ${index !== 0 ? 'border-t-2 border-gray-200' : ''}`}>
                        {/* Icon Box */}
                        <div className={`w-20 h-20 shrink-0 rounded-xl flex items-center justify-center ${
                            index % 3 === 0 ? 'bg-red-500' : index % 3 === 1 ? 'bg-green-500' : 'bg-purple-500'
                        }`}>
                            <Trophy className="w-10 h-10 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex justify-between mb-2">
                                <h3 className="font-bold text-gray-800 text-lg">{item.goal}</h3>
                            </div>
                            
                            {/* Progress Bar Visual - Full since completed */}
                            <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-yellow-400 w-full" />
                            </div>
                            
                            <div className="text-gray-400 font-medium text-sm">
                                {format(new Date(item.claimedAt), "MMM d, yyyy")}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                 <div className="p-8 text-center text-gray-400">No achievements yet</div>
            )}
        </div>
      </div>
    </div>
  )
}
