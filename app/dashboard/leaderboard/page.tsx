"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/duolingo-ui"
import { Trophy, Flame, Loader2, Shield } from "lucide-react"
import { motion } from "framer-motion"

interface LeaderboardUser {
  rank: number
  id: string
  username: string
  avatarId: string | null
  xp: number
  streak: number
}

export default function LeaderboardPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leaderboard?limit=50`)
        if (!response.ok) throw new Error("Failed to fetch leaderboard")
        const data = (await response.json()) as { leaderboard: LeaderboardUser[] }
        setUsers(data.leaderboard)
      } catch (err) {
        setError(String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-500"
    if (rank === 2) return "text-gray-400"
    if (rank === 3) return "text-orange-500"
    return "text-green-500"
  }

  const getRankStyles = (rank: number) => {
    if (rank === 1) return "border-yellow-200 bg-yellow-50"
    if (rank === 2) return "border-gray-200 bg-gray-50"
    if (rank === 3) return "border-orange-200 bg-orange-50"
    return "border-gray-200 bg-white"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-red-500">Failed to load leaderboard</h2>
        <p className="text-gray-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="w-full pb-20 space-y-6">
       <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
          <Shield className="w-8 h-8 text-yellow-900 fill-current" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-700">Leaderboard</h1>
          <p className="text-gray-500 font-medium">Compete with others and climb the ranks!</p>
        </div>
      </div>

      <div className="space-y-3">
        {users.map((user, index) => {
          const isCurrentUser = currentUser?.id === user.id
          
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`p-4 flex items-center gap-4 transition-all hover:scale-[1.02] ${
                  isCurrentUser ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200 ring-offset-2" : getRankStyles(user.rank)
                }`}
              >
                <div className={`font-bold text-xl w-8 text-center ${getRankColor(user.rank)}`}>
                  {user.rank}
                </div>

                <Avatar
                  fallback={user.username.charAt(0).toUpperCase()}
                  className={`w-12 h-12 border-2 ${
                    isCurrentUser ? "border-blue-300" : "border-gray-200"
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold truncate ${isCurrentUser ? "text-blue-700" : "text-gray-700"}`}>
                      {user.username}
                    </h3>
                    {isCurrentUser && (
                      <span className="text-xs font-bold bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400 font-medium">
                    <Flame className="w-3 h-3 text-orange-500 fill-current" />
                    {user.streak} day streak
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-gray-700">{user.xp} XP</div>
                  <div className="text-xs text-gray-400 font-bold uppercase">Total</div>
                </div>
              </Card>
            </motion.div>
          )
        })}

        {users.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No users found yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
