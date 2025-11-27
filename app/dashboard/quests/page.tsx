"use client"

import React, { useState } from "react"
import { useMissions } from "@/lib/hooks/use-missions"
import { MissionList, RewardPopup, Button } from "@/components/duolingo-ui"
import { Star, Calendar, Zap, Trophy } from "lucide-react"
import { motion } from "framer-motion"

export default function QuestsPage() {
  const { 
    dailyMissions, 
    weeklyMissions, 
    eventMissions, 
    isLoading, 
    claimReward,
    refetch 
  } = useMissions()

  const [claimedReward, setClaimedReward] = useState<{
    xp?: number
    gems?: number
    hearts?: number
  } | null>(null)

  const handleClaimMission = async (missionId: string) => {
    const result = await claimReward(missionId)
    if (result) {
      setClaimedReward(result)
      refetch()
    }
  }

  // Calculate progress
  const completedDaily = dailyMissions.filter(m => m.status === 'COMPLETED' || m.status === 'CLAIMED').length
  const totalDaily = dailyMissions.length
  const dailyProgress = totalDaily > 0 ? (completedDaily / totalDaily) * 100 : 0

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
          <Star className="w-8 h-8 text-yellow-900 fill-current" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-700">Quests</h1>
          <p className="text-gray-500 font-medium">Complete quests to earn rewards!</p>
        </div>
      </div>

      {/* Daily Quests */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500 fill-current" />
            <h2 className="text-xl font-bold text-gray-700">Daily Quests</h2>
          </div>
          {totalDaily > 0 && (
            <div className="text-sm font-bold text-gray-500">
              {completedDaily} / {totalDaily} Completed
            </div>
          )}
        </div>
        
        {/* Daily Progress Bar */}
        {totalDaily > 0 && (
          <div className="mb-4 h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-yellow-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${dailyProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        )}

        <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 shadow-sm">
          <MissionList 
            missions={dailyMissions} 
            title="" 
            onClaim={handleClaimMission}
            isLoading={isLoading}
            emptyMessage="No daily quests available right now. Check back tomorrow!"
          />
        </div>
      </div>

      {/* Weekly Quests */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-6 h-6 text-green-500 fill-current" />
          <h2 className="text-xl font-bold text-gray-700">Weekly Quests</h2>
        </div>
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 shadow-sm">
          <MissionList 
            missions={weeklyMissions} 
            title="" 
            onClaim={handleClaimMission}
            isLoading={isLoading}
            emptyMessage="No weekly quests available. Keep learning to unlock more!"
          />
        </div>
      </div>

      {/* Event Quests (only show if there are any) */}
      {eventMissions.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-purple-500 fill-current" />
            <h2 className="text-xl font-bold text-gray-700">Special Events</h2>
          </div>
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 shadow-sm">
            <MissionList 
              missions={eventMissions} 
              title="" 
              onClaim={handleClaimMission}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

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
    </div>
  )
}
