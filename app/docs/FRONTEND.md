⭐ **FRONTEND INTEGRATION BLUEPRINT

(Mission System → Coding Duolingo App)**

Product Manager Version — Clear, High-Level, Non-code Flow
1️⃣ Where Missions Live in the App UI
Missions connect to four existing areas:
Area	Why missions connect	UX behavior
Home Screen	Shows daily/weekly tasks	User sees progress at a glance
Lesson Path	Completing lessons triggers mission progress	e.g., “Complete 1 Lesson”
XP Progress Bar	Missions award XP & gems	XP animation updates
Profile Screen	Displays completed missions & badges	Motivates streak retention
2️⃣ How Missions Connect to Existing Features
⭐ A. Lessons (the most important integration)

When user completes a lesson:

XP is granted → reward-engine.grantXP()

XPLog is created → front-end listens to XP change

MissionEngine updates mission progress via:
POST /api/missions/progress

Example triggered missions:

Complete 1 lesson

Earn 20 XP

Fix 5 bugs

Practice Debug mode

➡️ Frontend must fire /missions/progress after lesson completion.

⭐ B. Dynamic Question System

Your system picks questions dynamically based on:

chapter

difficulty

past mistakes

Mission integration:

“Fix 3 bugs today”

“Answer 5 questions correctly”

“Complete Debug Mini-game”

➡️ After every question answered, frontend fires:
POST /missions/progress { event: "QUESTION_ANSWERED", correct: true }

⭐ C. Streak System

When streak updates:

Frontend triggers:
POST /missions/progress { event: "STREAK_UPDATED" }

Example missions connected:

Maintain streak today

Reach 5-day streak

Reach 10-day streak

⭐ D. XP / Leveling

XPLogs power XP-based missions:

Earn 10 XP

Earn 50 XP in one day

Frontend uses:
reward-engine.grantXP()

UI updates XP bar in real time.

⭐ E. Gems / Store

Missions granting gems:

“Claim reward → gems increment”

Frontend updates:

Gem counter in top navigation

Unlock screen animations

⭐ F. Achievements & Badges

Weekly missions may grant badges like:

“Bug Slayer” (fix 20 bugs)

“Algorithm Apprentice”

Displayed in profile page.

3️⃣ Frontend Components Needed (UI System for PM)

These components integrate missions everywhere:

⭐ A. MissionCard

Used in home screen, profile screen.

Contains:

mission type icon

title, description

progress bar

reward preview

claim button (if completed)

⭐ B. MissionList

Contains:

Daily missions (3)

Weekly missions (3–5)

Connected to endpoint:
GET /api/missions

⭐ C. MissionProgressBar

Small compact bar showing:
progress / goal

Used inside:

MissionCard

Home screen

Modal popups

⭐ D. RewardPopup

Shows when user claims reward:

XP pop animation

Gem sparkle effect

Badge earned animation

Triggered by:
POST /missions/claim

⭐ E. Inline Mission Toast

After lesson:
“🔥 +1 Mission Progress: Fix 5 Bugs”

Appears bottom of screen.

4️⃣ Frontend Sequence Flows (Critical for Alignment)
🔥 Flow 1: User Completes a Lesson
1. User completes lesson

Frontend already:

awards XP

shows results

2. Frontend triggers mission progress update:
POST /api/missions/progress
{
  event: "LESSON_COMPLETED",
  xpGained: 10,
  languageId: "python"
}

3. Mission engine returns updated missions

Frontend updates:

mission cards

mission badge in home page

4. If mission reaches goal:

Show Mission Complete Popup.

🔥 Flow 2: User Claims Reward
1. User taps “Claim Reward”

Frontend calls:
POST /api/missions/claim { missionId }

2. RewardEngine returns:

xp granted

gems granted

item / badge

3. Frontend plays:

gem animation

XP bar increase

badge popup

🔥 Flow 3: Question Answered

If mission is question-based:

Frontend calls:

POST /api/missions/progress
{
  event: "QUESTION_ANSWERED",
  correct: true,
  type: "bugFix"
}


Mission progress updates live.

🔥 Flow 4: Daily Reset

Not frontend-triggered.
But frontend must handle UI transition at 00:00:

Frontend logic:

After midnight → refresh missions

Show “New Missions Ready!” modal

Reset progress bars

5️⃣ How Missions Fit Into Existing Screens (PM Overview)
🔹 Home Screen (main impact)

New section added:

“🎯 Your Missions”

daily missions

weekly missions

progress bars

claim buttons

🔹 Learning Path Screen

After completing a lesson:

toast with mission progress

XP animation flowing upward

mission badge pulse

🔹 Lesson Screen

Top bar shows:

XP

Gems

Streak

Mission indicator (small dot when progress increases)

🔹 Profile Screen

Section:

“🏆 Mission History”

completed missions

badges

🔹 Store Screen

Uses gems earned from missions.

6️⃣ Product Manager Summary Sheet

To present to your team:

MISSION SYSTEM — FRONTEND INTEGRATION SUMMARY
Screen	New Elements	Backend Integration
Home	mission list, claim button	GET /missions
Lesson Result	mission toast, XP updates	POST /missions/progress
Lesson Flow	question-based mission triggers	POST /missions/progress
Profile	mission history, badges	GET /missions
Navigation Bar	XP, gems updates	reward-engine
Store	uses gems from missions	none required
7️⃣ What Developers Need Next

If you want, I can generate:

🔧 Frontend integration code

API client

hooks: useMissions(), useMissionProgress()

MissionCard component (Next.js + Tailwind)

MissionClaimModal UI

Mission tracking during lessons

🎨 UI designs (PM-ready)

home screen missions section

mission claim popup

badges

mission animations

🧪 QA checklist

mission completion accuracy

edge cases

daily reset behavio