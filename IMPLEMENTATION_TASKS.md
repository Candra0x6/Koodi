
# ✅ Developer To-Do List (Full Roadmap)

## 🟡 PHASE 1 — Onboarding & Personalization

### 4. Onboarding flow UI/UX
PROGRESS STEPPER
* [ ] Welcome screen
* [ ] Select sign-up method
* [ ] Choose programming language
* [ ] Choose learning goal
* [ ] Optional placement test (5 questions)
* [ ] Avatar selection
* [ ] Tutorial on XP, Hearts, Streak

### 5. API / Logic

* [ ] Save onboarding choices to DB
* [ ] Placement test scoring
* [ ] Determine starting chapter/unit from score

---

## 🔵 PHASE 2 — Learning Path & Lesson Engine

### 6. Learning Path Screen

* [ ] Display chapters → expandable units → lessons
* [ ] Locked state until previous unit completed
* [ ] UI with progress tracking indicators
* [ ] Resume button (continue where user left)

### 7. Lesson System

* [ ] Fetch lesson questions based on language → chapter → unit
* [ ] Question renderer components:

  * [ ] Multiple Choice
  * [ ] Fill In The Blank
  * [ ] Predict Output
  * [ ] Debug Code (Fix the bug)
  * [ ] Drag Reorder Code (if not in v1, keep optional)
* [ ] Show answer feedback (correct / incorrect + explanation)
* [ ] Lesson Summary screen

### 8. Gamification Logic

* [*] Hearts (lose life on wrong answer)
* [ ] Saving current success task
* [ ] XP reward on lesson completion
* [ ] Level-up animation
* [ ] Streak tracking
* [ ] Badges for milestones
* [ ] Daily reward popup

---

## 🔴 PHASE 3 — User Dashboard & Retention Systems

### 9. Dashboard (Home Screen)

* [ ] Current XP & Level
* [ ] Streak days
* [ ] Next lesson button
* [ ] Weekly goals progress bar

### 10. Profile & Stats Page

* [ ] XP history (weekly/monthly)
* [ ] Completed units / chapters
* [ ] Badge collection
* [ ] Avatar customization

### 11. Streak & Motivation

* [ ] Streak freeze item (if user missed 1 day)
* [ ] Daily XP goal notification
* [ ] Push notifications (later for mobile)

---

## 🟣 PHASE 4 — Monetization (Optional for MVP)

### 12. Subscription System

* [ ] Stripe integration
* [ ] Premium flags in DB
* [ ] Paywall when:

  * Hearts empty
  * Want to unlock next chapter early
  * Want explanations / hints

### 13. Premium Features Page

* [ ] + Unlimited hearts
* [ ] + Access next chapters early
* [ ] + Interview course (future)
* [ ] + AI code feedback (future)

---

## ⚫ PHASE 5 — Polishing, QA, and Beta Launch

### 14. Performance & Edge Cases

* [ ] No-network mode handling
* [ ] Rate limit API calls
* [ ] Optimize images and animations
* [ ] Disable skip in locked lessons

### 15. Analytics

* [ ] Track:

  * Daily Active Users
  * Lesson completion rate
  * Retention and streak failure
  * Search reasons for user drop-off

### 16. Bug Fix & UX Pass

* [ ] Accessibility (keyboard + WCAG)
* [ ] Skeleton shimmer loading
* [ ] Mobile responsive

### 17. Beta Launch

* [ ] Invite first 50–100 users
* [ ] Collect feedback inside app
* [ ] Priority fix list for v1.1

---

# 📌 Optional Expansions After MVP

| Feature                     | Complexity   |
| --------------------------- | ------------ |
| Real code editor playground | 🔥 Hard      |
| AI-powered feedback on code | 🔥 Hard      |
| Leaderboards                | 🟠 Medium    |
| Player vs Player Code Duel  | 🔥 Hard      |
| Community-generated lessons | 🔥 Very Hard |

---

## ❤️ PRO TIP FOR EXECUTION ORDER

If you’re building alone or with small team, recommended order:

```
Auth → DB → Onboarding → Learning Path → Lesson System → XP/Streak → Dashboard → Polish → Beta
```

---

If you want, I can also provide next steps like:
✔ Jira task breakdown by developer role
✔ Architecture diagrams
✔ UI wireframes for all screens
✔ Prisma seed file generator for Python lessons

Just ask: **“Next: seed file”** or **“Next: wireframes”** or **“Next: Jira tasks”** 💪
