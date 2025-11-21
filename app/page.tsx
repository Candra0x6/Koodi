"use client"

import { useState, useRef } from "react"
import {
  Button,
  Card,
  LessonCard,
  Input,
  ProgressBar,
  Badge,
  Alert,
  Switch,
  Checkbox,
  RadioGroup,
  Avatar,
  Tooltip,
  Modal,
  Tabs,
  Stepper,
  FeedbackSheet,
} from "@/components/duolingo-ui"
import { Confetti, type ConfettiRef } from "@/components/confetti"
import { Home, Zap, Shield, User, Settings, Bell, Star, Flame, Gem, MoreHorizontal, X } from "lucide-react"

export default function DuolingoStyleGuide() {
  const confettiRef = useRef<ConfettiRef>(null)
  const [activeTab, setActiveTab] = useState("learn")
  const [toggleState, setToggleState] = useState(false)
  const [checkboxState, setCheckboxState] = useState(true)
  const [radioValue, setRadioValue] = useState("option1")
  const [modalOpen, setModalOpen] = useState(false)
  const [progress, setProgress] = useState(60)

  // Feedback Simulation State
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "correct" | "incorrect">("idle")

  const handleCelebrate = () => {
    confettiRef.current?.fire()
  }

  const handleSimulateCorrect = () => {
    setFeedbackStatus("correct")
    confettiRef.current?.fire()
  }

  const handleSimulateIncorrect = () => {
    setFeedbackStatus("incorrect")
  }

  const handleDismissFeedback = () => {
    setFeedbackStatus("idle")
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground pb-40">
      <Confetti ref={confettiRef} />

      <FeedbackSheet
        isOpen={feedbackStatus !== "idle"}
        status={feedbackStatus === "idle" ? "correct" : feedbackStatus}
        correctAnswer="The apple"
        onNext={handleDismissFeedback}
      />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-extrabold text-primary tracking-tighter">duolingo-ui</h1>
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#"
                className="text-sm font-bold text-muted-foreground hover:text-primary uppercase tracking-wide"
              >
                Learn
              </a>
              <a
                href="#"
                className="text-sm font-bold text-muted-foreground hover:text-primary uppercase tracking-wide"
              >
                Letters
              </a>
              <a
                href="#"
                className="text-sm font-bold text-muted-foreground hover:text-primary uppercase tracking-wide"
              >
                Schools
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-2 rounded-xl hover:bg-muted cursor-pointer">
                <img src="/diverse-flags.png" className="w-7 h-5 rounded-md object-cover" alt="Flag" />
                <span className="text-sm font-bold text-muted-foreground uppercase">EN</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-2 rounded-xl hover:bg-muted cursor-pointer">
                <Flame className="w-5 h-5 text-orange-500 fill-current" />
                <span className="text-sm font-bold text-orange-500">2</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-2 rounded-xl hover:bg-muted cursor-pointer">
                <Gem className="w-5 h-5 text-blue-400 fill-current" />
                <span className="text-sm font-bold text-blue-400">450</span>
              </div>
            </div>
            <Avatar fallback="JD" className="bg-green-600 text-white border-green-700" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation (Desktop) */}
        <aside className="hidden lg:flex flex-col gap-2 w-64 shrink-0 sticky top-24 h-[calc(100vh-8rem)]">
          <Button
            variant={activeTab === "learn" ? "sidebarActive" : "sidebar"}
            onClick={() => setActiveTab("learn")}
            className="w-full"
          >
            <Home className="w-5 h-5" /> <span>Learn</span>
          </Button>
          <Button
            variant={activeTab === "practice" ? "sidebarActive" : "sidebar"}
            onClick={() => setActiveTab("practice")}
            className="w-full"
          >
            <Zap className="w-5 h-5" /> <span>Practice</span>
          </Button>
          <Button
            variant={activeTab === "leaderboard" ? "sidebarActive" : "sidebar"}
            onClick={() => setActiveTab("leaderboard")}
            className="w-full"
          >
            <Shield className="w-5 h-5" /> <span>Leaderboard</span>
          </Button>
          <Button
            variant={activeTab === "quests" ? "sidebarActive" : "sidebar"}
            onClick={() => setActiveTab("quests")}
            className="w-full"
          >
            <Star className="w-5 h-5" /> <span>Quests</span>
          </Button>
          <Button
            variant={activeTab === "shop" ? "sidebarActive" : "sidebar"}
            onClick={() => setActiveTab("shop")}
            className="w-full"
          >
            <Gem className="w-5 h-5" /> <span>Shop</span>
          </Button>
          <Button
            variant={activeTab === "profile" ? "sidebarActive" : "sidebar"}
            onClick={() => setActiveTab("profile")}
            className="w-full"
          >
            <User className="w-5 h-5" /> <span>Profile</span>
          </Button>
          <Button
            variant={activeTab === "more" ? "sidebarActive" : "sidebar"}
            onClick={() => setActiveTab("more")}
            className="w-full"
          >
            <MoreHorizontal className="w-5 h-5" /> <span>More</span>
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-12">
          {/* Section: Buttons */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-extrabold text-foreground">Buttons</h2>
              <div className="h-1 flex-1 bg-border rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-4 p-6 border-2 border-border rounded-3xl">
                <h3 className="font-bold text-muted-foreground uppercase text-sm">Primary</h3>
                <Button className="w-full" onClick={handleCelebrate}>
                  Celebrate!
                </Button>
                <Button className="w-full" disabled>
                  Disabled
                </Button>
              </div>

              <div className="space-y-4 p-6 border-2 border-border rounded-3xl">
                <h3 className="font-bold text-muted-foreground uppercase text-sm">Secondary</h3>
                <Button variant="secondary" className="w-full">
                  Skip
                </Button>
                <Button variant="secondary" className="w-full" disabled>
                  Disabled
                </Button>
              </div>

              <div className="space-y-4 p-6 border-2 border-border rounded-3xl">
                <h3 className="font-bold text-muted-foreground uppercase text-sm">Destructive</h3>
                <Button variant="destructive" className="w-full">
                  Quit
                </Button>
                <Button variant="destructive" className="w-full" disabled>
                  Disabled
                </Button>
              </div>

              <div className="space-y-4 p-6 border-2 border-border rounded-3xl">
                <h3 className="font-bold text-muted-foreground uppercase text-sm">Outline & Ghost</h3>
                <Button variant="outline" className="w-full bg-transparent">
                  No Thanks
                </Button>
                <Button variant="ghost" className="w-full">
                  I ALREADY HAVE AN ACCOUNT
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 p-6 border-2 border-border rounded-3xl items-end">
              <div className="space-y-2">
                <h3 className="font-bold text-muted-foreground uppercase text-sm">Sizes</h3>
                <div className="flex items-end gap-4">
                  <Button size="sm">Small</Button>
                  <Button>Default</Button>
                  <Button size="lg">Large Button</Button>
                </div>
              </div>
              <div className="space-y-2 ml-auto">
                <h3 className="font-bold text-muted-foreground uppercase text-sm">Icon Buttons</h3>
                <div className="flex gap-4">
                  <Button size="icon" variant="secondary">
                    <Bell className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Settings className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="destructive">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Inputs & Forms */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-extrabold text-foreground">Form Elements</h2>
              <div className="h-1 flex-1 bg-border rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6 space-y-6">
                <h3 className="text-xl font-bold">Login</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase">Username</label>
                    <Input placeholder="Email or username" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase">Password</label>
                    <Input type="password" placeholder="Password" />
                  </div>
                  <Button className="w-full" size="lg">
                    LOG IN
                  </Button>
                </div>
              </Card>

              <Card className="p-6 space-y-6">
                <h3 className="text-xl font-bold">Controls</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Sound Effects</span>
                    <Switch checked={toggleState} onCheckedChange={setToggleState} />
                  </div>

                  <div className="space-y-3">
                    <span className="font-bold text-foreground block">Daily Goal</span>
                    <RadioGroup
                      value={radioValue}
                      onChange={setRadioValue}
                      options={[
                        { label: "Casual (5 mins/day)", value: "option1" },
                        { label: "Regular (10 mins/day)", value: "option2" },
                        { label: "Serious (15 mins/day)", value: "option3" },
                      ]}
                    />
                  </div>

                  <div className="pt-4 border-t-2 border-border">
                    <Checkbox
                      checked={checkboxState}
                      onCheckedChange={setCheckboxState}
                      label="I agree to the terms and conditions"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Section: Progress & Badges */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-extrabold text-foreground">Feedback & Status</h2>
              <div className="h-1 flex-1 bg-border rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card className="p-6 space-y-6">
                  <h3 className="font-bold text-muted-foreground uppercase text-sm mb-4">Progress Bars</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-primary">Lesson Progress</span>
                      <span className="text-primary">60%</span>
                    </div>
                    <ProgressBar value={progress} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-orange-500">Daily Goal</span>
                      <span className="text-orange-500">3/5</span>
                    </div>
                    <ProgressBar value={60} color="bg-orange-500" />
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold text-muted-foreground uppercase text-sm mb-4">Badges</h3>
                  <div className="flex flex-wrap gap-3">
                    <Badge>New</Badge>
                    <Badge variant="secondary">Beta</Badge>
                    <Badge variant="accent">Super</Badge>
                    <Badge variant="destructive">Error</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <Alert variant="success" title="Good job!">
                  You completed the lesson with 95% accuracy.
                </Alert>
                <Alert variant="error" title="Incorrect">
                  The correct answer is "La manzana".
                </Alert>
                <Alert variant="warning" title="Streak at risk">
                  Practice today to keep your 50-day streak!
                </Alert>
                <Alert variant="info" title="Did you know?">
                  You can practice speaking in the settings menu.
                </Alert>
              </div>
            </div>
          </section>

          {/* Section: Cards & Layouts */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-extrabold text-foreground">Cards & Content</h2>
              <div className="h-1 flex-1 bg-border rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <LessonCard title="Basics 1" description="Start here" icon={Star} color="bg-yellow-400" active />
              <LessonCard title="Greetings" description="Say hello" icon={User} color="bg-blue-400" />
              <LessonCard title="Food" description="Order a meal" icon={Gem} color="bg-green-500" />
            </div>

            <div className="mt-8 p-8 border-2 border-border rounded-3xl bg-muted/30 flex flex-col items-center text-center space-y-6">
              <img src="/majestic-owl.png" className="w-32 h-32 object-contain" alt="Mascot" />
              <div className="space-y-2 max-w-md">
                <h3 className="text-2xl font-extrabold">Unlock Leaderboards!</h3>
                <p className="text-muted-foreground font-medium">
                  Complete 10 more lessons to start competing with others.
                </p>
              </div>
              <Button size="lg" variant="super" className="w-full max-w-xs">
                START LESSON
              </Button>
            </div>
          </section>

          {/* Section: Interactive Elements */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-extrabold text-foreground">Interactive</h2>
              <div className="h-1 flex-1 bg-border rounded-full"></div>
            </div>

            <div className="flex flex-wrap gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-muted-foreground uppercase text-sm">Tooltips</h3>
                <div className="flex gap-4">
                  <Tooltip content="Start Lesson">
                    <Button size="icon">
                      <Zap className="w-5 h-5" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="View Profile">
                    <Avatar fallback="ME" />
                  </Tooltip>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-muted-foreground uppercase text-sm">Modals</h3>
                <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
                <Modal
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  title="Quit Lesson?"
                  footer={
                    <>
                      <Button variant="ghost" onClick={() => setModalOpen(false)}>
                        CANCEL
                      </Button>
                      <Button variant="destructive" onClick={() => setModalOpen(false)}>
                        QUIT
                      </Button>
                    </>
                  }
                >
                  <div className="text-center space-y-4 py-4">
                    <img src="/sad-owl.jpg" className="w-24 h-24 mx-auto" alt="Sad Owl" />
                    <p className="text-lg font-medium text-muted-foreground">
                      You'll lose your progress if you quit now!
                    </p>
                  </div>
                </Modal>
              </div>

              <div className="space-y-4 w-full max-w-md">
                <h3 className="font-bold text-muted-foreground uppercase text-sm">Tabs</h3>
                <Tabs tabs={["Daily", "Weekly", "All Time"]} activeTab={activeTab} onChange={setActiveTab} />
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-muted-foreground uppercase text-sm">Confetti</h3>
                <Button variant="super" className="w-full" onClick={handleCelebrate}>
                  Trigger Confetti
                </Button>
              </div>
            </div>

            <div className="mt-8 p-6 border-2 border-border rounded-3xl bg-card">
              <h3 className="font-bold text-muted-foreground uppercase text-sm mb-4">Lesson Feedback Simulation</h3>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="space-y-2">
                  <p className="font-bold text-lg">Translate this sentence</p>
                  <div className="flex items-center gap-2">
                    <img src="/majestic-owl.png" className="w-16 h-16 object-contain" alt="Owl" />
                    <div className="bg-white border-2 border-border p-3 rounded-2xl rounded-tl-none relative">
                      <p className="font-medium">La manzana</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    className="bg-[#58cc02] border-[#46a302] hover:bg-[#46a302] text-white w-40"
                    onClick={handleSimulateCorrect}
                  >
                    Simulate Correct
                  </Button>
                  <Button
                    className="bg-[#ff4b4b] border-[#ea2b2b] hover:bg-[#ea2b2b] text-white w-40"
                    onClick={handleSimulateIncorrect}
                  >
                    Simulate Incorrect
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-muted-foreground uppercase text-sm mb-4">Lesson Header (Stepper)</h3>
              <Stepper steps={10} currentStep={6} />
            </div>
          </section>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t-2 border-border h-20 px-4 flex items-center justify-around z-50 pb-2">
        <button className="flex flex-col items-center gap-1 p-2 text-primary">
          <Home className="w-6 h-6 fill-current" />
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary">
          <Zap className="w-6 h-6" />
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary">
          <Shield className="w-6 h-6" />
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary">
          <User className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
