

Below is a **clean, professional PRD (Project Requirements Document)** for your **Duolingo-style Coding Learning App** — using **Next.js + TypeScript + Supabase + Prisma ORM**.  
This is structured exactly like a real software PRD used by product managers.

---

# 📘 **PRD — Duolingo-Style Coding Learning App**
**Tech Stack: Next.js (App Router), TypeScript, Supabase Auth + DB, Prisma ORM**  
**Platform: Web-first, later Mobile (React Native optional)**  
**Version:** MVP v1.0

---

# 1. 🎯 **App Overview**
A gamified web app that teaches coding from beginner → advanced using mini-games inspired by Duolingo.  
Instead of text-heavy lessons, users learn through:

- Fix-the-bug games  
- Code reorder puzzles  
- Predict-the-output quizzes  
- Timed challenges  
- Mini project builder  
- Streak-based difficulty

The product is built to be:

- **Extremely addictive** (Duolingo-style progression)  
- **Beginner-friendly** (no typing at first, only tap/drag)  
- **Modular** (game levels stored in Supabase, rendered dynamically)

---

# 2. 👤 **Target Users**
### Primary:
- Students (13–25) learning coding for the first time  
- Absolute beginners who get overwhelmed by text-heavy tutorials  
- People who prefer mobile-style learning (Duolingo UX)

### Secondary:
- Bootcamp learners  
- Hobbyists  
- Coding influencers teaching via custom paths

---

# 3. 🎮 **Core Game Lesson Types (Mandatory)**

### 1. **Fix-The-Bug Games**
- Debug Hunt (tap wrong syntax)
- Line Repair
- 3 Bugs Challenge (timed)

### 2. **Code Reorder Games**
- Drag blocks to form correct code
- Build the Function (assemble components)

### 3. **Fill-in-the-Blank**
- Missing line in loop
- Autocomplete challenge (array, string methods)

### 4. **Predict the Output**
- “What will this print?”
- Step-tracing visualizer

### 5. **Timed Coding Challenges (Fast Mode)**
- Match code → output
- Rapid Debug Mode (fix 5 bugs under 30 seconds)

### 6. **Logic Puzzle Games**
- Boolean unlock
- Flowchart decisions

### 7. **Mini-Project Builder**
- Progressive: add variables → add functions → loops → arrays

### 8. **Streak-Based Difficulty Unlocking**
- Lessons adapt based on streak  
- Unlock boss challenges every 7 days  

---

# 4. 🛣️ **User Flows (Critical)**

## **4.1 Onboarding**
1. User creates account via **Supabase Auth** (email, Google, or anonymous mode).  
2. Choose coding path:  
   - JavaScript (MVP)  
3. Mini onboarding test → places user at Level 1–3.  
4. Opens first unit.

---

## **4.2 Lesson Flow (Duolingo Path Style)**
1. User taps a level  
2. Backend returns:
   - game type  
   - question data  
   - correct answers  
   - UI config  
3. User completes 1–4 mini-games per lesson  
4. Award XP, streak, hearts  
5. Progress to next lesson  

---

## **4.3 Streak & XP**
- Streak increased daily  
- XP gained from lessons & challenges  
- Higher streak → unlock harder problems  
- Losing all hearts → retry tomorrow  

---

## **4.4 Program Builder Unlock Flow**
1. After completing Level 5, user unlocks "Mini Program"  
2. Each lesson adds a new feature:  
   - print text  
   - add variable  
   - add function  
   - loop  
3. At the end → user gets certificate-like animation  

---

# 5. 🧩 **Core Features (MVP)**

### ✔️ Gamified Learning Path
- Chapters → Units → Lessons → Mini-games  
- Locked lessons until prerequisites are completed

### ✔️ All Game Lesson Types
- 8 game modes listed above  
- Configurable via Supabase JSON schema

### ✔️ XP, Streak, Leaderboards
- Track user performance  
- Weekly global leaderboard  
- Streak freeze (premium later)

### ✔️ Daily Challenges
- Random mix of mini-games  
- Timed challenge  
- Rewards: bonus XP or profile badges  

### ✔️ User Profile & Stats
- XP count  
- Lesson completion history  
- Achievements  
- Streak history graph  

### ✔️ Basic Admin Panel
- Upload new questions  
- Create levels  
- Configure game modes  
- JSON editor for question structure  

---

# 6. ⚙️ **Tech Stack & Architecture**

### **Frontend — Next.js + TypeScript**
- App Router  
- Server Actions for DB mutations  
- React for game rendering  
- Zustand for global state (XP, hearts, streak UI)

### **Backend — Supabase**
- Supabase Auth: email, Google, anonymous  
- Supabase DB (Postgres)  
- Supabase RLS for security  

### **ORM — Prisma**
- Models for:  
  - User  
  - Lesson  
  - GameType  
  - Question  
  - UserProgress  
  - UserStats  
  - StreakLog  

### **Storage**
- Supabase Storage for:  
  - Images  
  - Minified game configs  

### **API Routes**
- `/api/lesson/get`  
- `/api/lesson/complete`  
- `/api/streak/update`  
- `/api/progress/save`  
- `/api/admin/*`  

---

# 7. 🗂️ **Database Schema (Simplified)**

### `User`
- id  
- email  
- created_at  

### `UserStats`
- user_id  
- xp  
- streak  
- hearts  
- last_active_date  

### `Lesson`
- id  
- unit_id  
- order  
- game_type (FK)  
- difficulty  
- question_ids (array)  

### `Question`
- id  
- game_type  
- prompt  
- code_snippet  
- choices (json)  
- answer (json)  
- metadata (json)

### `GameType`
- id  
- name  
- config_schema (json)  

### `UserProgress`
- user_id  
- lesson_id  
- completed  
- score  

---

# 8. ✨ **In-Scope (MVP)**

### ✔️ Must Have
- Authentication  
- Gamified learning path  
- 8 game mini-types  
- Streak + XP  
- Daily challenge  
- Basic admin panel  
- Responsive web design  

---

# 9. 🚫 **Out-of-Scope (Future Versions)**

### Not for MVP:
- Full social features (friends, following)  
- Code editor with typing  
- Community-created lessons  
- Multi-language support (Python, Java)  
- Premium subscription  
- Long-form projects  
- AI tutor (later addition)

---

# 10. 📆 **Timeline (Realistic)**
**8–12 weeks MVP**

| Week | Deliverable |
|------|-------------|
| 1–2 | UI/UX wireframes, DB schema, lesson structure |
| 3–4 | Auth + user stats + lesson map |
| 5–6 | Mini-game engines (first 5 types) |
| 7 | All 8 game types integrated |
| 8 | Streak & XP system + UI |
| 9 | Admin panel |
| 10 | QA, polish animations, deploy |
| 11–12 | Beta test + adjustments |

---

# 11. 🧭 **Vision (Long-Term)**
"Become the Duolingo for learning to code — simple, addictive, and fun, with playful characters and gamified curriculum."
