⭐ Mission System — Full Feature Integration Overview (PM Version)
How Missions Connect With Lessons, XP, Streak, Dynamic Questions & User Progress
1️⃣ What Missions Do in the Product

Missions guide learners toward consistent study habits and reinforce learning goals using clear, trackable tasks.

They sit at the center of the engagement loop:

Learn → Earn XP → Complete Missions → Collect Rewards → Unlock Content → Continue Learning

2️⃣ Mission Types & When They Trigger
Mission Type	Example	Trigger Source
Daily Missions	Complete 1 Lesson	App session start (daily)
Weekly Missions	Earn 150 XP	Weekly cycle refresh
Skill Practice	Fix 3 past mistakes	User history (dynamic questions)
Streak Missions	Study 3 days in a row	Streak system
Language-Specific Missions	Learn 10 Python keywords	Chapter / question metadata
Special Missions	Beat a boss challenge	Seasonal events
3️⃣ How Missions Connect With Other Features

Below is the PM-level integration diagram:

[Lessons] ──> [XP System] ──> [Mission Progress] ──> [Rewards] ──> [Profile Growth]

[Dynamic Questions] ───────┘
[Streak System] ───────────┘
[User Mistake Data] ───────┘
[Daily App Open] ──────────┘


Everything feeds progress into missions.

4️⃣ Mission Integration With Each Core Feature
A. Lessons → Mission Progress

Every time a user finishes a lesson:

XP is awarded.

Lesson completed count increments.

Mission engine checks:

Is there a mission requiring:
✓ lessons completed?
✓ chapter progress?
✓ unit progress?
✓ completing specific lesson types?


Example
Mission: Complete 3 Python Lessons
→ Each lesson completion updates Mission.progress += 1

Lessons become the core trigger for 70% of mission types.

B. XP System → Mission Progress

Some missions use XP itself as the goal.

Example:
Mission: Earn 40 XP Today
→ Every XP grant triggers a mission check:

Mission.progress += xpEarned
If progress >= goal → COMPLETE


This drives retention because XP is earned everywhere
→ lessons, practice, streak repairs, challenges.

C. Dynamic Question System → Mission Progress

Dynamic questions use:

user mistakes

difficulty ramping

chapter structure

Missions connected to this:

Mission	Trigger
Fix 5 past mistakes	answered question from UserQuestionHistory marked previously wrong
Complete 3 Medium questions	difficulty filter
Master this chapter	mix of easy/medium from current chapters

Every question answered runs:

Check if this question matches mission.rules
If yes → progress++


Makes missions meaningful for learning quality, not just quantity.

D. Streak System → Mission Integration

Streaks are a mission category of their own.

Examples:

Complete a lesson 3 days in a row

Get a 7-day streak

Maintain streak without losing hearts

Flow:

Day completed → streak++ → mission.progress++
If streak meets goal → mission COMPLETE


This integrates the habit loop strongly.

E. User Mistake Tracking (UserQuestionHistory) → Missions

Mission examples tied to mistakes:

Fix 3 mistakes from yesterday

Review 10 old problems

Master your weak topics

Triggered when:

User answers a question
History entry updated
If correction made → mission.progress++


This reinforces spaced repetition & mastery goals.

F. Rewards → XP, Gems, Items, Badges

When a mission is completed:

User taps “Claim”

Reward model gives:

XP (level up fast)

Gems (store unlockables)

Items (streak freeze, extra hearts, etc)

Badges (long-term motivation)

Missions often unlock new content

Example:
Mission: Finish 5 lessons this week
Reward: Streak Freeze

5️⃣ Mission System Lifecycle (PM Flow)
1. Mission Generation

Daily missions created at midnight

Weekly missions created on Monday

Skill practice missions generated based on weak topics

Special missions created by admin or season events

2. Mission Tracking

Triggered during:

lesson completion

question answered

XP earned

streak updated

item used

3. Mission Completion

When progress >= goal, status → COMPLETED

4. Claiming Reward

User taps “Claim”:

reward given

item added

gems added

XP boosted

claimedAt saved

5. Expiration

Missions with expiresAt become EXPIRED automatically by cron.

6️⃣ End-to-End Example Scenario
Day 1

User opens app → receives:

Daily: Complete 1 Lesson

Skill: Fix 2 mistakes

XP: Earn 20 XP today

During learning:

User completes lesson →
✓ 20 XP gained
✓ 1 lesson completed
✓ fixed 1 mistake

Mission checks:

Daily: progress = 1/1 → COMPLETE

XP: progress = 20/20 → COMPLETE

Skill: progress = 1/2 → IN_PROGRESS

After claiming rewards:

User earns gems + XP + badges
→ Encouraged to continue learning
→ App retains user longer

7️⃣ Why PMs Use Missions (Business Value)
Goal	How Missions Help
Boost retention (Day 1, Day 7, Day 30)	Daily missions create habit loops
Improve learning effectiveness	Skill/Mistake missions enforce mastery
Increase session length	Missions create “just one more task” effect
Monetization	Gems from missions increase store interaction
Personalization	Missions adapt based on user performance
8️⃣ How Missions Integrate with Backend

Key enabling components:

Storage:

Mission

MissionReward

UserQuestionHistory

XPLogs

Streak

Core Services:

MissionEngine

RewardEngine

LessonCompletionHandler

StreakService

DynamicQuestionSelector

API Endpoints:

GET /missions

POST /missions/claim

POST /missions/progress (called internally)

cron: /missions/resetDaily

cron: /missions/resetWeekly