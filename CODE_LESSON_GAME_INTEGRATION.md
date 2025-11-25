# Code Lesson Game - Integration Guide

## Overview
The `CodeLessonGame` component has been updated to fetch questions dynamically from the database using Prisma schema types. It no longer uses mock data.

## Key Changes

### 1. **Component Now Requires `lessonId` Prop**
The component now takes a `lessonId` parameter to fetch questions from the database.

```tsx
// Before
<CodeLessonGame onClose={() => setIsGameOpen(false)} />

// After
<CodeLessonGame lessonId="lesson-id-from-db" onClose={() => setIsGameOpen(false)} />
```

### 2. **Uses Prisma Question Schema Types**
The component now uses types from the Prisma schema directly:

```typescript
type QuestionType = 'DEBUG_HUNT' | 'LINE_REPAIR' | 'MULTIPLE_CHOICE' | 'REORDER' | 'FILL_BLANK' | 'PREDICT_OUTPUT' | 'LOGIC_PUZZLE' | 'MATCH_MADNESS'

type PrismaQuestion = {
  id: string
  type: QuestionType
  instruction: string
  description: string | null
  codeBlock: string | null
  codeBefore: string | null
  codeAfter: string | null
  logicCondition: string | null
  correctOrder: string | null
  explanation: string | null
  difficulty: number
  codeSegments: CodeSegmentData[]
  options: QuestionOptionData[]
  items: ReorderItemData[]
  pairs: MatchPairData[]
}
```

### 3. **API Route Returns Full Question Structure**
The API endpoint `/api/lessons/[lessonId]/questions` now returns all question relations:

```json
{
  "lesson": {
    "id": "lesson-id",
    "title": "Lesson Title",
    "hearts": 3,
    "questions": [
      {
        "id": "question-id",
        "type": "DEBUG_HUNT",
        "instruction": "Fix the bug!",
        "description": "...",
        "codeSegments": [
          { "id": "...", "code": "...", "isCorrect": true, "index": 0 }
        ],
        "options": [],
        "items": [],
        "pairs": []
      }
    ]
  }
}
```

## Question Type Field Names

The component maps Prisma question fields correctly for all question types:

### DEBUG_HUNT
- Uses `codeSegments` array
- Each segment has `code`, `isCorrect` (boolean), and `index`

### MULTIPLE_CHOICE, FILL_BLANK, PREDICT_OUTPUT, LOGIC_PUZZLE, LINE_REPAIR
- Uses `options` array
- Each option has `text`, `isCorrect` (boolean), and `index`
- Also supports `codeBlock` for rendering code context

### REORDER
- Uses `items` array
- Each item has `text` and `index`
- Stores correct order in `correctOrder` field (pipe-separated IDs)

### MATCH_MADNESS
- Uses `pairs` array
- Each pair has `left`, `right`, and `index` fields
- Matching is done by comparing left/right values

## Game State Management

The component handles the following game states:
- `loading` - Fetching questions from database
- `playing` - User answering questions
- `feedback` - Showing correct/incorrect feedback
- `completed` - All questions answered correctly
- `failed` - User ran out of hearts
- `error` - Failed to load lesson

## Usage Example

```tsx
'use client'

import { useState } from 'react'
import { CodeLessonGame } from '@/components/code-lesson-game'

export default function LessonPage({ params }: { params: { lessonId: string } }) {
  const [gameOpen, setGameOpen] = useState(true)

  return (
    <div>
      {gameOpen && (
        <CodeLessonGame
          lessonId={params.lessonId}
          onClose={() => setGameOpen(false)}
        />
      )}
    </div>
  )
}
```

## Data Format from Database

When creating/seeding lessons, ensure questions follow this structure:

```typescript
const question = {
  type: 'DEBUG_HUNT' as const,
  instruction: 'Fix the bug!',
  description: 'This function should add two numbers...',
  difficulty: 1,
  codeSegments: [
    { code: 'function ', isCorrect: true, index: 0 },
    { code: 'add', isCorrect: true, index: 1 },
    { code: '(a, b) {', isCorrect: true, index: 2 },
    { code: 'a - b', isCorrect: false, index: 3 }, // The bug!
  ],
  options: [],
  items: [],
  pairs: [],
  correctOrder: null,
  explanation: 'The bug is on line 3: it should be "a + b" instead of "a - b".',
}
```

## Error Handling

The component now includes:
- Loading state with spinner while fetching
- Error state if API call fails
- Fallback error messages
- Null checks for optional fields

## Notes

- All question type constants changed from kebab-case to UPPER_SNAKE_CASE
- The component now expects exact question data from Prisma
- Match Madness pairs display the `left` value (not a generic `text` field)
- REORDER correctOrder is stored as pipe-separated string: `"item-1|item-2|item-3"`

