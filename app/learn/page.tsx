"use client"

import { cn } from "@/lib/utils"
import { Home, Zap, Target, Shield, User, Bell, Lock } from "lucide-react"
import { UnitHeader, LearningPath, type UnitData } from "@/components/learning-path"
import Image from "next/image"

// --- Mock Data ---

const unit1: UnitData = {
  id: "u1",
  title: "Unit 1",
  description: "Form basic sentences, greet people",
  color: "#58cc02",
  levels: [
    { id: "l1", status: "active", type: "lesson" },
    { id: "l2", status: "locked", type: "book" },
    { id: "l3", status: "locked", type: "lesson" },
    { id: "l4", status: "locked", type: "chest" },
    { id: "l5", status: "locked", type: "book" },
    { id: "l6", status: "locked", type: "lesson" },
    { id: "l7", status: "locked", type: "lesson" },
    { id: "l8", status: "locked", type: "chest" },
  ],
}

// --- Components ---

const TopBar = () => (
  <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b-2 border-border h-16">
    <div className="container max-w-md mx-auto h-full flex items-center justify-between px-4">
      {/* Language Flag */}
      <div className="cursor-pointer hover:bg-muted p-2 rounded-xl transition-colors">
        <div className="relative w-8 h-6 overflow-hidden rounded-md ring-2 ring-border">
          <Image
            src="/diverse-flags.png"
            alt="Language"
            width={32}
            height={24}
            className="object-cover"
            style={{ objectPosition: "0 0" }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-orange-500 font-bold px-2 py-1 hover:bg-muted rounded-xl cursor-pointer">
          <Zap className="w-5 h-5 fill-current" />
          <span>1</span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-400 font-bold px-2 py-1 hover:bg-muted rounded-xl cursor-pointer">
          <div className="w-5 h-5 rounded-md border-2 border-blue-400 bg-blue-400/20" /> {/* Gem shape approx */}
          <span>505</span>
        </div>
        <div className="flex items-center gap-1.5 text-red-500 font-bold px-2 py-1 hover:bg-muted rounded-xl cursor-pointer">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>5</span>
        </div>
      </div>
    </div>
  </header>
)

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t-2 border-border h-20 pb-4">
    <div className="container max-w-md mx-auto h-full flex items-center justify-between px-2">
      <NavItem icon={Home} active />
      <NavItem icon={Target} /> {/* Letters/Dumbbell approx */}
      <NavItem icon={Shield} /> {/* Leaderboard */}
      <NavItem icon={User} /> {/* Profile */}
      <NavItem icon={Bell} />
    </div>
  </nav>
)

const NavItem = ({ icon: Icon, active }: { icon: any; active?: boolean }) => (
  <button className="flex-1 h-full flex items-center justify-center p-2 relative group">
    {active && (
      <div className="absolute top-2 bottom-2 left-2 right-2 bg-blue-50/50 rounded-xl border-2 border-blue-200 pointer-events-none" />
    )}
    <Icon
      className={cn(
        "w-7 h-7 transition-colors",
        active ? "text-blue-500 fill-blue-500" : "text-muted-foreground group-hover:text-blue-400",
      )}
      strokeWidth={2.5}
    />
  </button>
)

// --- Page ---

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <TopBar />

      <div className="max-w-full mx-auto bg-background min-h-screen border-x-2 border-border/50 shadow-sm relative">
        <div className="sticky top-16 z-40 bg-[#58cc02] pb-4">
          <div className="text-center text-white/90 font-bold uppercase text-sm tracking-widest pt-2">
            Intro to Spanish
          </div>
          <UnitHeader unit={unit1} />
        </div>

        <div className="py-8 relative z-0">
          <LearningPath unit={unit1} />

          {/* Start of next unit for visual continuity */}
          <div className="mt-12 border-t-2 border-border pt-8 px-4 opacity-50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-muted-foreground">Unit 2</h3>
              <div className="text-muted-foreground">Guidebook</div>
            </div>
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-[#e5e5e5] bg-[#e5e5e5] flex items-center justify-center">
                <Lock className="text-[#afafaf]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
