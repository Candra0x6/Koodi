# Duolingo-Style Coding Learning App - Implementation Tasks

This task list tracks the progress of the Duolingo-style coding learning app implementation based on the [PRD](app/docs/prd.md).

## Completed Tasks

- [x] **Project Initialization**
    - [x] Set up Next.js App Router with TypeScript
    - [x] Configure Tailwind CSS and Shadcn UI
    - [x] Set up ESLint and Prettier
- [x] **Database & ORM Setup**
    - [x] Initialize Prisma with PostgreSQL
    - [x] Define `User` and `UserStats` models
    - [x] Define `Lesson`, `Unit`, `Chapter` models
    - [x] Define `Question`, `GameType`, `UserProgress` models
    - [x] Define `Streak`, `XPLog`, `Leaderboard` models
    - [x] Generate Prisma Client
- [x] **Authentication & Backend Integration**
    - [x] Set up Supabase project
    - [x] Configure Supabase Auth (Email, Google, Anonymous)
    - [x] Create Supabase client utilities (`lib/supabase`)
    - [x] Create Prisma client singleton (`lib/prisma`)

## In Progress Tasks

- [x] Auth with Email & Password with Next Auth
- [x] Profile setup 




- [ ] **Core Game Engine**
    - [ ] Create generic Game Container component
    - [ ] Implement "Fix-The-Bug" game logic
    - [ ] Implement "Code Reorder" game logic
    - [ ] Implement "Fill-in-the-Blank" game logic
    - [ ] Implement "Predict the Output" game logic
    - [ ] Implement "Timed Coding Challenges" logic
- [ ] **Lesson Flow & Progression**
    - [ ] Implement Lesson Map UI (Chapters/Units/Lessons)
    - [ ] Create API for fetching lesson data (`/api/lesson/get`)
    - [ ] Create API for submitting lesson results (`/api/lesson/complete`)
    - [ ] Implement XP and Streak updates on completion
    - [ ] Implement "Heart" system (lose heart on wrong answer)

## Future Tasks

- [ ] **User Dashboard & Profile**
    - [ ] Create User Profile page (Stats, Badges)
    - [ ] Implement Leaderboard UI (Weekly rankings)
    - [ ] Implement Streak History graph
- [ ] **Onboarding Flow**
    - [ ] Create Onboarding Wizard (Goal selection, Experience level)
    - [ ] Implement Initial Assessment (Placement test)
- [ ] **Admin Panel**
    - [ ] Create Admin Dashboard layout
    - [ ] Implement Question Editor (JSON schema builder)
    - [ ] Implement Lesson/Unit management
- [ ] **Polish & Gamification**
    - [ ] Add sound effects (Success, Fail, Level Up)
    - [ ] Add animations (Confetti, Progress bars, Character reactions)
    - [ ] Implement Daily Challenges

## Implementation Plan

### Phase 1: Core Game Loop (Current Focus)
Focus on getting the lesson player working with at least one game type.
1.  **Lesson Player Page**: Create `app/lesson/[lessonId]/page.tsx`.
2.  **Game Components**: Build reusable components for code blocks, drag-and-drop areas, and multiple-choice inputs.
3.  **State Management**: Use Zustand to manage the current lesson state (current question, hearts, progress).

### Phase 2: Progression System
Connect the game loop to the user's progress.
1.  **Map Interface**: Build the main dashboard where users select lessons.
2.  **Unlock Logic**: Ensure users can only play unlocked lessons.
3.  **XP & Streaks**: Hook up the backend to track daily activity.

### Relevant Files

- `prisma/schema.prisma` - Database schema definitions ✅
- `lib/prisma.ts` - Prisma client instance ✅
- `lib/supabase/client.ts` - Supabase client configuration ✅
- `app/page.tsx` - Landing page / Dashboard
- `components/ui/*` - Reusable UI components ✅
