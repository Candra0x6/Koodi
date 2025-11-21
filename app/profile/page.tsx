import { auth } from "@/auth";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function ProfilePage() {
  const session = await auth();
  console.log("Session:", session);
  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      stats: true,
      achievements: {
        include: {
          achievement: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* User Info Card */}
        <Card className="w-full md:w-1/3">
          <CardHeader className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar || ""} alt={user.firstName || "User"} />
              <AvatarFallback className="text-2xl">
                {user.firstName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <CardTitle className="text-2xl">{user.firstName} {user.lastName}</CardTitle>
              <p className="text-muted-foreground">@{user.username || "user"}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Level {user.stats?.level || 1}</Badge>
              <Badge variant="outline">Joined {user.createdAt.toLocaleDateString()}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Bio</h3>
              <p className="text-sm text-muted-foreground">
                {user.profile?.bio || "No bio yet."}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Location</h3>
              <p className="text-sm text-muted-foreground">
                {user.profile?.location || "Unknown"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Achievements */}
        <div className="flex-1 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total XP</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.stats?.xp || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">🔥 {user.stats?.streak || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Hearts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">❤️ {user.stats?.hearts || 5}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Rank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#{user.stats?.weeklyRank || "-"}</div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Section */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              {user.achievements.length === 0 ? (
                <p className="text-muted-foreground text-sm">No achievements unlocked yet. Keep learning!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.achievements.map((ua) => (
                    <div key={ua.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="text-2xl">{ua.achievement.icon || "🏆"}</div>
                      <div>
                        <p className="font-medium">{ua.achievement.name}</p>
                        <p className="text-xs text-muted-foreground">{ua.achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
