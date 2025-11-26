"use client"
import React from 'react'

import { useState, useRef } from "react"
import {
  Button,
  Card,
  ProgressBar,
} from "@/components/duolingo-ui"
import { Confetti, type ConfettiRef } from "@/components/confetti"
import { Home, Zap, Shield, User, Settings, Bell, Star, Flame, Gem, MoreHorizontal, X, Archive } from "lucide-react"
import { usePathname, useRouter } from 'next/navigation'

const listNavItems = [
  { name: "LEARN", icon: Home, href: "/dashboard" },
  { name: "PRACTICE", icon: Zap, href: "/dashboard/practice" },
    { name: "LEADERBOARD", icon: Shield, href: "/dashboard/leaderboard" },
    { name: "QUESTS", icon: Star, href: "/dashboard/quests" },
    { name: "SHOP", icon: Gem, href: "/dashboard/shop" },
]
function layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isSamePath = (path: string) => pathname === path
    const router = useRouter()
  return (
    <div className="">
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
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
        <main className="flex-1 space-y-12 max-w-5xl">
         
        {children}
        </main>
      </div>
    </div>
  )
}

export default layout
        // <div className="hidden lg:flex flex-col gap-6 w-80 shrink-0">

          
        //   {/* Daily Quests */}
        //   <Card className="p-4 space-y-4 border-2 border-gray-200 shadow-none">
        //     <div className="flex items-center justify-between">
        //       <h3 className="font-bold text-lg text-gray-700">Daily Quests</h3>
        //     </div>
        //     <div className="flex items-center gap-3">
        //       <Zap className="w-10 h-10 text-yellow-400 fill-current" />
        //       <div className="flex-1 space-y-2">
        //         <div className="text-sm font-bold text-gray-700">Earn 10 XP</div>
        //         <div className="flex items-center gap-2">
        //           <div className="relative flex-1 h-5 bg-gray-200 rounded-full overflow-hidden">
        //             <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-500 z-10">
        //               0 / 10
        //             </div>
        //             <div className="h-full bg-yellow-400 w-0" />
        //           </div>
        //           <Archive className="w-6 h-6 text-yellow-600" />
        //         </div>
        //       </div>
        //     </div>
        //   </Card>

        //   {/* XP Progress */}
        //   <Card className="p-4 space-y-4 border-2 border-gray-200 shadow-none">
        //     <div className="flex items-center justify-between">
        //       <h3 className="font-bold text-lg text-gray-700">XP Progress</h3>
        //       <button className="text-blue-400 font-bold text-xs uppercase hover:text-blue-500 transition-colors">
        //         Edit Goal
        //       </button>
        //     </div>
        //     <div className="flex items-center gap-4">
        //       <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center border-2 border-orange-200">
        //         <Gem className="w-6 h-6 text-orange-500" />
        //       </div>
        //       <div className="flex-1 space-y-1">
        //         <div className="text-sm font-bold text-gray-700">Daily goal</div>
        //         <div className="flex items-center gap-2">
        //           <div className="flex-1">
        //             <ProgressBar value={0} max={10} color="bg-orange-400" className="h-3" />
        //           </div>
        //           <span className="text-xs font-bold text-gray-400">0/10 XP</span>
        //         </div>
        //       </div>
        //     </div>
        //   </Card>

        //   {/* Create Profile */}
        //   <Card className="p-6 space-y-4 border-2 border-gray-200 shadow-none">
        //     <h3 className="font-bold text-lg text-gray-700">Create a profile to save your progress!</h3>
        //     <div className="space-y-3">
        //       <Button
        //         variant="primary"
        //         className="w-full bg-green-500 border-green-600 hover:bg-green-400 text-white uppercase tracking-widest"
        //       >
        //         Create a profile
        //       </Button>
        //       <Button
        //         variant="primary"
        //         className="w-full bg-blue-400 border-blue-500 hover:bg-blue-300 text-white uppercase tracking-widest"
        //       >
        //         Sign in
        //       </Button>
        //     </div>
        //   </Card>
        // </div>