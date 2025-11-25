Sure — here is a **complete PRD (Product Requirements Document)** for your coding-learning app (Duolingo-style for programming).

---

# 📌 PRD — Coding Learning App (Gamified like Duolingo)

## 1. Overview

The app teaches users to code using short gamified lessons with XP, streaks, hearts, and progressive difficulty.
Users choose a programming language (e.g., Python) during onboarding and follow a personalized learning path.

---

## 2. Goals

| Type      | Goal                                                            |
| --------- | --------------------------------------------------------------- |
| Primary   | Help beginners learn coding in an engaging, game-based way      |
| Secondary | Help intermediate users improve skills & prepare for interviews |
| Business  | Convert users from free → premium subscription                  |

---

## 3. Target Users

| Segment             | Description                                 |
| ------------------- | ------------------------------------------- |
| Beginner learners   | Never coded before, want guided progression |
| Intermediate coders | Already coding, want structured improvement |
| Job seekers         | Preparing for coding interview challenges   |

---

## 4. Core Experience / User Flow

Open App
  ↓
Welcome Screen
  → CTA: "Start Learning"
  ↓
Sign Up / Login
  • Google
  • Email & Password
  • Continue Without Account (Guest)
  ↓
Choose Language (Phase 1: Python; Phase 2: JS, Java, C++)
  ↓
Choose Goal
  • Learn coding from zero
  • Improve coding skills
  • Prepare for interviews
  ↓
Skill Placement Test (Optional - 5 questions)
  → Determines starting level & unlocks matching lessons
  ↓
Avatar Setup (Quick)
  → Choose character, username auto-suggested
  ↓
Intro to XP, Hearts, Streak, Coins
  ↓
Start First Lesson
  → Learning Path with Chapters → Units → Lessons
      (Each chapter harder than previous; first chapter unlocked only)



## After First Lesson -> New User Retention Loop
Lesson Complete
  ↓
Reward Popup
  • XP gained
  • Coins earned
  • Streak
  ↓
Daily Goal
  • Soft prompt: "You’re close to your daily goal, continue?"
  ↓
Home Dashboard
  • Continue Lesson
  • Practice
  • Play Minigame
  • Leaderboard


---

## 5. Features

### 5.1 Learning Content Hierarchy

| Level    | Meaning                                          |
| -------- | ------------------------------------------------ |
| Language | Python                          |
| Chapter  | High-level topic (Basics, OOP, Data Structures…) |
| Unit     | Subtopic (Variables, Loops, Lists…)              |
| Lesson   | Daily lesson group                               |
| Question | MCQ, fill blank, debug code, code output         |

### 5.2 Lesson Question Types

| Type              | Example                 |
| ----------------- | ----------------------- |
| Multiple Choice   | Choose correct syntax   |
| Fill in the Blank | `print(____)`           |
| Code Output       | Predict output of code  |
| Debug Code        | Fix broken code snippet |

Each question has:

* Content
* Multiple choices (for MCQ)
* Correct answer
* Explanation after answering

### 5.3 Gamification

| System | Rules                                           |
| ------ | ----------------------------------------------- |
| Hearts | Lose heart when wrong → lesson ends if 0        |
| XP     | Earn XP for correct answers & lesson completion |
| Streak | Increase daily learning streak                  |
| Unlock | Units are locked until previous completed       |

### 5.4 User Progress

The app tracks:

* Completed lessons
* Progress per unit & chapter
* Answers (correct/incorrect)
* Starting level (if placement test used)

## 7. Success Metrics (KPIs)

| Category   | Metric                                           |
| ---------- | ------------------------------------------------ |
| Engagement | Daily Active Users (DAU), Average Lesson Time    |
| Learning   | Lessons completed per week, improvement accuracy |
| Retention  | Day-3 retention, streak length                   |
| Business   | Conversion to Premium                            |

---

## 8. Technical Architecture

### 8.1 Frontend

| Section  | Stack                |
| -------- | -------------------- |
| Client   | Next.js (App Router) |
| Language | TypeScript           |
| State    | Zustand / Redux      |
| UI       | Tailwind / Shadcn    |

### 8.2 Backend

| Component                       | Technology                        |
| ------------------------------- | --------------------------------- |
| API                             | Next.js Route Handlers            |
| Auth                            | NextAuth (Google + Email + Guest) |
| DB                              | PostgreSQL                        |
| ORM                             | Prisma                            |

### 8.3 Database (Prisma)

Matches previous schema:

* Users, Languages, Chapters, Units, Lessons, Questions
* Progress tables (UserUnitProgress, UserLessonCompletion, UserAnswer)

---

## 9. Content Roadmap (Python Phase-1)

| Chapter         | Units | Lessons | Questions |
| --------------- | ----- | ------- | --------- |
| Basics          | 5     | 25      | 150       |
| Control Flow    | 5     | 25      | 150       |
| Functions       | 4     | 20      | 120       |
| Data Structures | 4     | 20      | 120       |

Total launch content ≈ **540 questions**

---

## 10. Milestones / Timeline

| Week   | Deliverable                                 |
| ------ | ------------------------------------------- |
| Week 1 | UI Wireframes + DB completed + Auth working |
| Week 2 | Onboarding flow + Language → Learning Path  |
| Week 3 | Lesson system + Questions + XP + Hearts     |
| Week 4 | Progress tracking + Streak + Dashboard      |
| Week 5 | Avatar + Animations + Transitions           |
| Week 6 | Polish + QA + Beta launch                   |

---

## 11. Risks & Mitigation

| Risk                              | Mitigation                              |
| --------------------------------- | --------------------------------------- |
| Users quit after early difficulty | Adaptive difficulty + hints             |
| Not enough content                | Modular content import tool for authors |
| Bugs in code questions            | Preview + testcase validation           |

---

## 12. Future Enhancements (Phase 3+)

* Leaderboards
* AI feedback on code
* Community challenge battles
* Learning pathways (Web Dev / Data Science)
* Mobile app (React Native)

---

### ✔ This PRD is suitable for:

* Founder vision alignment
* Investor deck
* Roadmap planning
* Team development sync

---

If you want next I can create:
🚀 **Wireframes (UI/UX Screen flow)
🔥 Jira Sprint Task Breakdown
🗂️ Notion Documentation Structure
📦 Full seed file with Python lessons**

Just tell me what you want next.
