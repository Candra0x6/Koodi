"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Zap, Brain, Code, Terminal, Map as MapIcon, Trophy, Gift, Laptop, Target, Check, GripVertical, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { LearningPath, type UnitData } from "@/components/learning-path"
import { Tiles } from "@/components/ui/tiles"
import Image from "next/image"

export default function LandingPage() {
  const [demoStep, setDemoStep] = useState(0)
  const [rewardStep, setRewardStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 6)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setRewardStep((prev) => (prev + 1) % 2)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background items-center">
      {/* Header */}
      <header className="w-full border-b-2 border-border px-6 py-4 flex items-center justify-between fixed top-5 bg-background/95 backdrop-blur-sm z-50 max-w-6xl mx-auto rounded-full">
        <div className="flex items-center gap-2">
          <Image alt="Koodi Logo" src="/logo.svg" width={120} height={120} />
        </div>
        <div className="flex gap-4">
           <Link href="/onboarding">
            <Button variant="ghost" className="font-bold text-muted-foreground hover:text-primary uppercase tracking-widest">
              I have an account
            </Button>
           </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-screen max-w-6xl mx-auto w-full py-10">
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center gap-12 px-6 h-full lg:py-20 max-w-7xl mx-auto w-full min-h-screen relative  rounded-2xl my-2">
          
          {/* Text Content */}
          <div className="relative w-full  bg-gray-100 h-[80vh] rounded-2xl mx-auto text-center flex flex-col items-center justify-center gap-6 z-10">
            <div className=" flex flex-col justify-center items-center gap-8 px-4 lg:px-0 max-w-4xl relative">

            {/* Floating Avatars (Decorative) */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="hidden lg:flex absolute -top-10 left-10 p-2 pr-4 rounded-full items-center gap-3 "
            >
              <Image alt="avatar" src="/1.png" width={130} height={130} />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="hidden lg:flex absolute bottom-0 -right-12 p-2 pr-4 rounded-full items-center gap-3 "
            >
              <Image alt="horse" src="/18.png" width={180} height={180} />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]"
            >
              Fun The Best <br/>
              <span className="text-primary">Coding Platform</span> For You
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground font-medium max-w-2xl"
            >
              Start your coding journey inspired. Look, we made it easy. Smart lessons give you a blueprint for mastering code.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/onboarding">
                <Button size="lg" className="h-14 px-8 rounded-full text-lg font-bold ">
                  Get Started
                </Button>
              </Link>
            </motion.div>
            </div>
          </div>

       
        </section>

        {/* Features Section (5-Grid) */}
        <section className=" py-20 ">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 flex items-center w-fit mx-auto">
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">Make It Fun. </h2>
              <Image alt="decorative" src="/11.png" width={70} height={70} className="mx-auto mb-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[minmax(300px,auto)]">
              
              {/* 1. Adaptive Learning Path */}
              <Card className="md:col-span-2 border-b-4 border-border overflow-hidden relative group ">
                <CardHeader className="relative z-10 p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                    <MapIcon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">Adaptive Learning Path</CardTitle>
                  <p className="text-muted-foreground mt-2">
                    A dynamic path that adjusts based on your progress and skill level.
                  </p>
                </CardHeader>
                <div className="absolute inset-0 top-32 flex items-center mt-10 justify-center opacity-20 group-hover:opacity-30 transition-opacity">
                   <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
                     <motion.path
                       d="M 0 50 Q 50 10 100 50 T 200 50"
                       fill="none"
                       stroke="currentColor"
                       strokeWidth="4"
                       className="text-primary/80"
                       initial={{ pathLength: 0 }}
                       animate={{ pathLength: 1 }}
                       transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                     />
                     <motion.circle cx="50" cy="30" r="7" className="text-primary " fill="currentColor" animate={{ y: [0, -1, 0] }} transition={{ duration: 1, repeat: Infinity }} />
                     <motion.circle cx="100" cy="50" r="7" className="text-primary" fill="currentColor" animate={{ y: [0, -1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }} />
                     <motion.circle cx="150" cy="70" r="7" className="text-primary" fill="currentColor" animate={{ y: [0, -1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.6 }} />
                   </svg>
                </div>
              </Card>

              {/* 2. Leaderboard & Competition */}
              <Card className="md:col-span-2 border-b-4 border-border overflow-hidden relative">
                <CardHeader className="relative z-10 p-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 text-yellow-600">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">Leaderboard & Competition</CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Compete with other learners in your chosen programming language.
                  </p>
                </CardHeader>
                <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-4 pb-4 px-4">
                  {[2, 1, 3].map((rank, i) => (
                    <motion.div
                      key={rank}
                      className={cn(
                        "w-16 rounded-t-lg flex flex-col items-center justify-end pb-2 shadow-sm border-x-2 border-t-2 border-black/5",
                        rank === 1 ? "h-24 bg-yellow-400 z-10" : rank === 2 ? "h-16 bg-gray-300" : "h-12 bg-orange-300"
                      )}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                    >
                      <div className="w-8 h-8 rounded-full bg-white/50 mb-2" />
                      <span className="text-xs font-bold text-white">#{rank}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* 3. Rewards & Motivation */}
              <Card className="md:col-span-2 border-b-4 border-border overflow-hidden relative h-80">
                <AnimatePresence mode="wait">
                  {rewardStep === 0 ? (
                    <motion.div
                      key="default"
                      className="absolute inset-0 flex flex-col"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardHeader className="relative z-10 p-6">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 text-red-600">
                          <Gift className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-xl">Rewards & Motivation</CardTitle>
                        <p className="text-muted-foreground mt-2">
                          Unlock chests, earn badges, and build streaks to stay motivated.
                        </p>
                      </CardHeader>
                      <div className="absolute bottom-4 right-4">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Gift className="w-24 h-24 text-red-500" />
                          <motion.div 
                            className="absolute -top-4 left-1/2 -translate-x-1/2"
                            animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-sm border border-yellow-600" />
                          </motion.div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="popup"
                      className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div 
                        className="w-full bg-background rounded-2xl shadow-2xl overflow-hidden border-2 border-border"
                        initial={{ scale: 0.8, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                      >
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 text-center relative overflow-hidden">
                          <motion.div
                            initial={{ rotate: -10, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                          >
                            <Trophy className="w-12 h-12 text-white mx-auto mb-1 relative z-10" />
                          </motion.div>
                          <h2 className="text-lg font-extrabold text-white relative z-10">Reward Claimed!</h2>
                          
                          {/* Shine effect */}
                          <motion.div 
                            className="absolute inset-0 bg-white/20"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                            style={{ skewX: -20 }}
                          />
                        </div>
                        
                        <div className="p-4 space-y-4">
                          <div className="flex justify-center gap-4">
                            <motion.div 
                              className="text-center"
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-1 mx-auto border-2 border-yellow-200">
                                <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                              </div>
                              <p className="font-bold text-sm text-foreground">+50 XP</p>
                            </motion.div>
                            
                            <motion.div 
                              className="text-center"
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-1 mx-auto border-2 border-blue-200">
                                <span className="text-xl">💎</span>
                              </div>
                              <p className="font-bold text-sm text-foreground">+20</p>
                            </motion.div>
                          </div>
                          
                          <Button size="sm" className="w-full bg-green-500 hover:bg-green-600 text-white border-b-4 border-green-700 active:border-b-0 active:translate-y-1 uppercase font-bold tracking-widest">
                            Continue
                          </Button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              {/* 4. Interactive Code Lesson Demo */}
              <Card className="md:col-span-4 md:row-span-1 border-b-4 border-border overflow-hidden relative bg-card">
                <div className="absolute inset-0 p-8 flex flex-col">
                  <div className="flex items-center gap-2 mb-4 text-muted-foreground ">
                    <Laptop className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-widest">Interactive Demo</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 w-full relative min-h-[260px]">
                      <AnimatePresence mode="wait">
                        {demoStep === 0 && (
                          <motion.div 
                            key="step0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 absolute inset-0"
                          >
                            {/* Multiple Choice */}
                            <div className="bg-code-editor-bg p-6 rounded-2xl font-mono text-base md:text-lg text-white shadow-inner border-2 border-code-editor-border leading-relaxed">
                              <span className="text-purple-400">let</span> x = <span className="text-orange-400">5</span>;<br/>
                              <span className="text-blue-400">console</span>.<span className="text-yellow-400">log</span>(x + <span className="text-orange-400">3</span>);
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <motion.div 
                                className="h-16 rounded-xl border-2 border-b-4 font-mono text-lg font-bold flex items-center justify-center cursor-pointer"
                                animate={{ 
                                  borderColor: ["#e5e5e5", "#22c55e", "#e5e5e5"],
                                  backgroundColor: ["#ffffff", "#dcfce7", "#ffffff"],
                                  color: ["#3c3c3c", "#16a34a", "#3c3c3c"],
                                  y: [0, 4, 0],
                                  borderBottomWidth: ["4px", "0px", "4px"]
                                }}
                                transition={{ duration: 2, repeat: Infinity, times: [0, 0.5, 1], delay: 0.5 }}
                              >
                                8
                              </motion.div>
                              <div className="h-16 rounded-xl border-2 border-b-4 border-border bg-background text-muted-foreground font-mono text-lg font-bold flex items-center justify-center opacity-50">
                                53
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {demoStep === 1 && (
                          <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 absolute inset-0"
                          >
                            {/* Debug Hunt */}
                            <div className="bg-code-editor-bg p-6 rounded-2xl font-mono text-base md:text-lg text-white shadow-inner border-2 border-code-editor-border leading-relaxed">
                              <span className="text-purple-400">function</span> <span className="text-blue-400">isEven</span>(n) {"{"}<br/>
                              &nbsp;&nbsp;<motion.span 
                                  className="inline-block px-1 rounded cursor-pointer border-2 border-transparent"
                                  animate={{ 
                                    backgroundColor: ["rgba(239,68,68,0)", "rgba(239,68,68,0.2)", "rgba(34,197,94,0.2)", "rgba(34,197,94,0.2)"],
                                    borderColor: ["transparent", "#ef4444", "#22c55e", "#22c55e"]
                                  }}
                                  transition={{ duration: 2, times: [0, 0.2, 0.8, 1], delay: 0.5 }}
                              >
                                <span className="text-purple-400">return</span> n % <span className="text-orange-400">2</span> = <span className="text-orange-400">1</span>;
                              </motion.span><br/>
                              {"}"}
                            </div>
                            <div className="h-16 flex items-center justify-center">
                               <p className="text-muted-foreground font-bold animate-pulse">Tap the bug to fix it!</p>
                            </div>
                          </motion.div>
                        )}

                        {demoStep === 2 && (
                          <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-3 absolute inset-0"
                          >
                            {/* Reorder */}
                            {[
                              { text: "let x = 10;", color: "text-blue-400", id: 1 },
                              { text: "x = x * 2;", color: "text-yellow-400", id: 2 },
                              { text: "print(x);", color: "text-purple-400", id: 3 }
                            ].map((line, i) => (
                              <motion.div
                                key={line.id}
                                layout
                                initial={{ y: i === 0 ? 60 : i === 1 ? -60 : 0 }} 
                                animate={{ y: 0 }}
                                transition={{ duration: 1.5, ease: "backOut", delay: 0.5 }}
                                className="bg-card border-2 border-b-4 border-border p-3 rounded-xl font-mono font-bold flex items-center gap-3 h-14"
                              >
                                <GripVertical className="w-4 h-4 text-muted-foreground" />
                                <span className={line.color}>{line.text}</span>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}

                        {demoStep === 3 && (
                          <motion.div 
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 absolute inset-0"
                          >
                            {/* Fill in the Blank */}
                            <div className="bg-code-editor-bg p-6 rounded-2xl font-mono text-base md:text-lg text-white shadow-inner border-2 border-code-editor-border leading-relaxed">
                              <span className="text-purple-400">if</span> (score &gt; <span className="text-orange-400">10</span>) {"{"}<br/>
                              &nbsp;&nbsp;<span className="inline-block min-w-[60px] border-b-2 border-white/20 text-center">
                                <motion.span
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 1, duration: 0.5 }}
                                  className="text-green-400 font-bold"
                                >
                                  return
                                </motion.span>
                              </span> <span className="text-blue-400">true</span>;<br/>
                              {"}"}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <motion.div 
                                className="h-16 rounded-xl border-2 border-b-4 font-mono text-lg font-bold flex items-center justify-center cursor-pointer bg-card border-border"
                                animate={{ 
                                  scale: [1, 0.95, 1],
                                  opacity: [1, 0, 0]
                                }}
                                transition={{ duration: 2, times: [0.5, 0.6, 1], delay: 0.5 }}
                              >
                                return
                              </motion.div>
                              <div className="h-16 rounded-xl border-2 border-b-4 border-border bg-background text-muted-foreground font-mono text-lg font-bold flex items-center justify-center opacity-50">
                                break
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {demoStep === 4 && (
                          <motion.div 
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 absolute inset-0"
                          >
                            {/* Predict Output */}
                            <div className="bg-code-editor-bg p-6 rounded-2xl font-mono text-base md:text-lg text-white shadow-inner border-2 border-code-editor-border leading-relaxed relative overflow-hidden">
                              <div className="absolute top-2 right-2 opacity-20"><Terminal className="w-6 h-6" /></div>
                              <span className="text-blue-400">print</span>(<span className="text-green-400">"Hi "</span> + <span className="text-green-400">"Dev"</span>);
                              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-green-400">
                                <span>➜</span>
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 1.5 }}
                                  className="font-bold"
                                >
                                  Hi Dev
                                </motion.span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <motion.div 
                                className="h-16 rounded-xl border-2 border-b-4 font-mono text-lg font-bold flex items-center justify-center cursor-pointer"
                                animate={{ 
                                  borderColor: ["#e5e5e5", "#22c55e", "#e5e5e5"],
                                  backgroundColor: ["#ffffff", "#dcfce7", "#ffffff"],
                                  color: ["#3c3c3c", "#16a34a", "#3c3c3c"],
                                  y: [0, 4, 0],
                                  borderBottomWidth: ["4px", "0px", "4px"]
                                }}
                                transition={{ duration: 2, repeat: Infinity, times: [0, 0.5, 1], delay: 0.5 }}
                              >
                                "Hi Dev"
                              </motion.div>
                              <div className="h-16 rounded-xl border-2 border-b-4 border-border bg-background text-muted-foreground font-mono text-lg font-bold flex items-center justify-center opacity-50">
                                "HiDev"
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {demoStep === 5 && (
                          <motion.div 
                            key="step5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 absolute inset-0 flex flex-col items-center justify-center"
                          >
                            {/* Logic Puzzle */}
                            <div className="relative w-32 h-32 flex items-center justify-center">
                              <motion.div
                                className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl"
                                animate={{ backgroundColor: ["#ef4444", "#ef4444", "#eab308", "#22c55e"] }}
                                transition={{ duration: 2, times: [0, 0.5, 0.8, 1] }}
                              >
                                <Brain className="w-12 h-12 text-white" />
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: -40 }}
                                transition={{ delay: 1.5 }}
                                className="absolute top-0 text-green-500 font-bold text-xl"
                              >
                                UNLOCKED!
                              </motion.div>
                            </div>
                            <div className="w-full bg-slate-100 p-3 rounded-xl border-2 border-slate-200 text-center font-mono text-slate-600 font-bold">
                              IF (A && B) THEN OPEN
                            </div>
                            <div className="flex gap-2 w-full">
                               <div className="flex-1 h-12 bg-green-100 border-2 border-green-500 rounded-lg flex items-center justify-center font-bold text-green-700">A = 1</div>
                               <div className="flex-1 h-12 bg-green-100 border-2 border-green-500 rounded-lg flex items-center justify-center font-bold text-green-700">B = 1</div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left z-10 bg-card/80 backdrop-blur-sm p-4 rounded-xl">
                      <h3 className="text-2xl font-bold mb-2 text-foreground">
                        {demoStep === 0 ? "Multiple Choice" : 
                         demoStep === 1 ? "Find the Bug" : 
                         demoStep === 2 ? "Reorder Code" :
                         demoStep === 3 ? "Fill in the Blank" :
                         demoStep === 4 ? "Predict Output" : "Logic Puzzle"}
                      </h3>
                      <p className="text-muted-foreground mb-4 text-lg min-h-14">
                        {demoStep === 0 ? "Select the correct output for the code snippet." : 
                         demoStep === 1 ? "Spot the syntax error and tap to fix it instantly." : 
                         demoStep === 2 ? "Drag and drop lines to make the code work correctly." :
                         demoStep === 3 ? "Complete the code by selecting the missing piece." :
                         demoStep === 4 ? "Run the code mentally and predict the console output." :
                         "Solve logic gates and boolean puzzles to unlock the next level."}
                      </p>
                      
                      {/* XP Badge */}
                      <motion.div 
                        key={demoStep}
                        className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-2xl font-bold border-b-4 border-accent-depth"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        <Zap className="w-4 h-4 fill-current" />
                        +10 XP
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 5. Daily Missions */}
              <Card className="md:col-span-2 border-b-4 border-border overflow-hidden relative flex flex-col">
                <CardHeader className="relative z-10 p-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 text-orange-600">
                    <Target className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">Daily Missions</CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Complete daily coding missions to earn XP, gems, and streak boosts.
                  </p>
                </CardHeader>
                <div className="flex-1 px-6 pb-6 flex items-center justify-center bg-muted/20">
                  <div className="w-full max-w-60 space-y-3 relative">
                    {/* Mission List Animation */}
                    <motion.div 
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: [50, 0, 0, 50], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.9, 1] }}
                      className="space-y-2"
                    >
                      {[
                        { 
                          title: "Solve 3 coding questions", 
                          progress: 3, 
                          total: 3, 
                          icon: Target, 
                          color: "bg-orange-500", 
                          status: "CLAIMED",
                          reward: { xp: 20, gems: 5 },
                        },
                        { 
                          title: "Practice functions", 
                          progress: 1, 
                          total: 5, 
                          icon: Code, 
                          color: "bg-blue-500", 
                          status: "PENDING",
                          reward: { xp: 15, gems: 2 },
                          
                        },
                       
                      ].map((mission, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-2xl border-2 transition-all",
                            mission.status === "CLAIMED" 
                              ? "bg-green-50 border-green-200 opacity-90" 
                              : "bg-card border-border"
                          )}
                        >
                          {/* Icon */}
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0", mission.color)}>
                            <mission.icon className="w-5 h-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 space-y-2">
                            <p className="text-sm font-bold text-foreground truncate">{mission.title}</p>
                            <div className="w-full">
                              <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-muted-foreground z-10">
                                  {mission.progress} / {mission.total}
                                </div>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(mission.progress / mission.total) * 100}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className={cn(
                                    "h-full transition-all rounded-full",
                                    mission.progress >= mission.total ? "bg-green-500" : "bg-yellow-400"
                                  )}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Reward / Status */}
                          <div className="shrink-0">
                            {mission.status === "CLAIMED" ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1, 1, 0] }}
                                transition={{ duration: 4, times: [0.2, 0.3, 0.8, 0.9, 1], repeat: Infinity }}
                                className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
                              >
                                <Check className="w-4 h-4 text-white" strokeWidth={3} />
                              </motion.div>
                            ) : (
                              <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                                {mission.reward.xp && (
                                  <span className="flex items-center gap-0.5">
                                    <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    {mission.reward.xp}
                                  </span>
                                )}
                                {mission.reward.gems && (
                                  <span className="flex items-center gap-0.5">
                                    💎 {mission.reward.gems}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </motion.div>

                    {/* XP Pop-up */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-full shadow-lg border-2 border-yellow-600 z-10 whitespace-nowrap"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.2, 1, 0], opacity: [0, 1, 1, 0], y: [0, -20, -20, 0] }}
                      transition={{ duration: 4, times: [0.3, 0.4, 0.7, 0.8], repeat: Infinity }}
                    >
                      +20 XP
                    </motion.div>
                  </div>
                </div>
              </Card>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-primary rounded-3xl p-12 md:p-20 text-center relative overflow-hidden group">
             

              {/* Floating Icons */}
              {[
                { Icon: "🌟", left: "10%", top: "20%", delay: 0 },
                { Icon: "⚡", left: "80%", top: "15%", delay: 0.5 },
                { Icon: "🏆", left: "20%", top: "70%", delay: 1 },
                { Icon: "⭐", left: "75%", top: "60%", delay: 1.5 },
                { Icon: "🎯", left: "50%", top: "80%", delay: 2 },
              ].map(({ Icon, left, top, delay }, i) => (
                <motion.div
                  key={i}
                  className="absolute "
                  initial={{ scale: 1, rotate: 0 }}
                  animate={{ 
                    y: [0, -2, 0],
                    rotate: [0, 10, -10, 0],
                    scale: 1
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    delay: delay
                  }}
                  style={{ left, top }}
                >
                  <span className="text-6xl opacity-50">{Icon}</span>
                </motion.div>
              ))}

              <div className="relative z-10 space-y-8 overflow-hidden">
                  <div className="w-full h-[500px] absolute top-20 -z-10 opacity-20 pointer-events-none">
      <Tiles 
        rows={50} 
        cols={8}
        tileSize="md"
        
      />
    </div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-6xl font-extrabold text-white tracking-tight"
                >
                  Ready to start your <br/>
                  <span className="text-yellow-300">coding streak?</span>
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-xl text-white/90 max-w-2xl mx-auto font-medium"
                >
                  Join thousands of developers learning to code the fun way. 
                  Free forever, no credit card required.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Link href="/onboarding" className="">
                    <Button 
                      size="lg" 
                      className="h-16 px-10 rounded-2xl text-xl font-bold bg-white text-primary hover:bg-gray-100 border-b-8 border-gray-200 active:border-b-0 active:translate-y-2 transition-all"
                    >
                      Get Started For Free
                    </Button>
                  </Link>
                </motion.div>
                
             
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background w-full max-w-6xl">
    
        <div className="max-w-7xl mx-auto text-left p-6 mt-12 pt-8 border-t-2 border-border text-muted-foreground font-medium">
          © 2025 Koodi. All rights reserved. 🏇
        </div>
      </footer>
    </div>
  )
}
