'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, Flame } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  id: string;
  username: string;
  avatarId: string | null;
  xp: number;
  streak: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leaderboard?limit=100`);
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        const data = (await response.json()) as { leaderboard: LeaderboardUser[] };
        setUsers(data.leaderboard);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankColor = (rank: number): string => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-200';
    if (rank === 2) return 'bg-gray-50 border-gray-200';
    if (rank === 3) return 'bg-orange-50 border-orange-200';
    return 'bg-white border-gray-200';
  };

  const getRankIcon = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => (window.location.href = '/chapters')}
            className="mb-4 text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Chapters
          </Button>
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
          </div>
          <p className="text-gray-600">Top learners by experience points</p>
        </div>

        {loading && (
          <Card className="p-8 text-center">
            <p className="text-gray-600">Loading leaderboard...</p>
          </Card>
        )}

        {error && (
          <Card className="p-8 text-center border-red-200 bg-red-50">
            <p className="text-red-600">{error}</p>
          </Card>
        )}

        {!loading && !error && users.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No users yet</p>
          </Card>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="space-y-3">
            {users.map((user) => (
              <Card
                key={user.id}
                className={`p-4 border transition-all hover:shadow-md ${getRankColor(
                  user.rank
                )}`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-700">
                      {getRankIcon(user.rank)}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {user.username}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">
                        {user.streak} day streak
                      </span>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold text-indigo-600">
                      {user.xp.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">XP</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
