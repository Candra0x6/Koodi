import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import questionsData from '../lib/constant/questions.json';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.fvwsoryptbhufzdlgmya:KOSnianoisano218@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres',
});

const prisma = new PrismaClient({ adapter });

// Question definitions imported from JSON
const LESSON_QUESTIONS = questionsData as any[];
// For second language, use first half of questions (they'll be shared/reused)
const JS_LESSON_QUESTIONS = LESSON_QUESTIONS;

// Calculate difficulty for a lesson (average of its 10 questions)
function getLessonDifficulty(questions: any[]): 'EASY' | 'MEDIUM' | 'HARD' {
  if (questions.length === 0) return 'EASY';
  const avgDifficulty = questions.reduce((sum, q) => sum + (q.difficulty || 1), 0) / questions.length;
  if (avgDifficulty < 1.5) return 'EASY';
  if (avgDifficulty < 2.5) return 'MEDIUM';
  return 'HARD';
}

// Extract topic name from question ID (e.g., "py_print_q1" → "print")
function getTopicFromId(questionId: string): string {
  const parts = questionId.split('_');
  return parts.length > 1 ? parts[1] : 'unknown';
}

// Helper function to create dynamic chapter structure
async function createChapterStructure(languageId: string, languageName: string, questionArray: any[] = LESSON_QUESTIONS) {
  console.log(`\n📚 Creating chapter structure for ${languageName}...`);

  const CHAPTERS_PER_LANGUAGE = 3;
  const UNITS_PER_CHAPTER = 5;
  const LESSONS_PER_UNIT = 5;
  const QUESTIONS_PER_LESSON_MIN = 7;
  const QUESTIONS_PER_LESSON_MAX = 9;

  let totalQuestionsCreated = 0;
  let questionIdx = 0;
  const totalQuestions = questionArray.length;

  // Create 3 chapters per language
  for (let chapterIdx = 0; chapterIdx < CHAPTERS_PER_LANGUAGE; chapterIdx++) {
    const chapter = await prisma.chapter.create({
      data: {
        title: `Chapter ${chapterIdx + 1}: ${getChapterTopicName(chapterIdx)}`,
        levelIndex: chapterIdx + 1,
        languageId,
      },
    });

    // Create 5 units per chapter
    for (let unitIdx = 0; unitIdx < UNITS_PER_CHAPTER; unitIdx++) {
      const unit = await prisma.unit.create({
        data: {
          title: `Unit ${unitIdx + 1}: ${getUnitTopicName(chapterIdx, unitIdx)}`,
          unitIndex: unitIdx + 1,
          chapterId: chapter.id,
        },
      });

      // Create 5 lessons per unit
      for (let lessonIdx = 0; lessonIdx < LESSONS_PER_UNIT; lessonIdx++) {
        // Randomly assign 7-9 questions per lesson
        const questionsInLesson = Math.floor(Math.random() * (QUESTIONS_PER_LESSON_MAX - QUESTIONS_PER_LESSON_MIN + 1)) + QUESTIONS_PER_LESSON_MIN;
        const lessonQuestionsArray: any[] = [];

        // Get next available questions
        for (let i = 0; i < questionsInLesson && questionIdx < totalQuestions; i++) {
          lessonQuestionsArray.push(questionArray[questionIdx]);
          questionIdx++;
        }

        if (lessonQuestionsArray.length === 0) continue; // Skip if no questions available

        const difficulty = getLessonDifficulty(lessonQuestionsArray);
        const topicName = getTopicFromId(lessonQuestionsArray[0].id);

        const lesson = await prisma.lesson.create({
          data: {
            title: `Lesson ${lessonIdx + 1}: ${capitalizeWords(topicName)}`,
            lessonIndex: lessonIdx + 1,
            unitId: unit.id,
            hearts: 3,
            questionCount: lessonQuestionsArray.length,
            targetDifficulty: difficulty,
          },
        });

        // Add 7-9 questions to this lesson
        for (const question of lessonQuestionsArray) {
          await prisma.question.create({
            data: {
              ...createQuestionData(question),
              languageId,
              chapterId: chapter.id,
            },
          });
          totalQuestionsCreated++;
        }

        console.log(`  ✓ Chapter ${chapterIdx + 1}, Unit ${unitIdx + 1}, Lesson ${lessonIdx + 1}: ${lesson.title} (${lessonQuestionsArray.length} questions, ${difficulty})`);
      }
    }
  }

  console.log(`\n✅ Created structure: ${CHAPTERS_PER_LANGUAGE} chapters, ${CHAPTERS_PER_LANGUAGE * UNITS_PER_CHAPTER} units, ${CHAPTERS_PER_LANGUAGE * UNITS_PER_CHAPTER * LESSONS_PER_UNIT} lessons, ${totalQuestionsCreated} questions for ${languageName}\n`);
}



// Helper to create question data based on type
function createQuestionData(q: any) {
  // Ensure correctOrder is always an array
  const correctOrderValue = Array.isArray(q.correctOrder) ? q.correctOrder : [];
  
  // Map numeric difficulty to DifficultyLevel enum
  const difficultyMap: Record<number, 'EASY' | 'MEDIUM' | 'HARD'> = {
    1: 'EASY',
    2: 'MEDIUM',
    3: 'HARD',
  };

  const createData: any = {
    type: q.type as any,
    instruction: q.instruction,
    description: q.description || null,
    explanation: q.explanation || null,
    difficulty: difficultyMap[q.difficulty] || 'EASY',
    codeBlock: q.codeBlock || null,
    codeBefore: q.codeBefore || null,
    codeAfter: q.codeAfter || null,
    logicCondition: q.logicCondition || null,
    correctOrder: correctOrderValue,
  };

  // Add nested relations based on question type
  if (q.options && q.options.length > 0) {
    createData.options = {
      create: q.options.map((opt: any, idx: number) => ({
        text: opt.text,
        isCorrect: opt.isCorrect,
        index: opt.index ?? idx,
      })),
    };
  }

  if (q.codeSegments && q.codeSegments.length > 0) {
    createData.codeSegments = {
      create: q.codeSegments.map((seg: any, idx: number) => ({
        code: seg.code,
        isBug: seg.isBug,
        correction: seg.correction || null,
        index: seg.index ?? idx,
      })),
    };
  }

  if (q.items && q.items.length > 0) {
    createData.items = {
      create: q.items.map((item: any, idx: number) => ({
        text: item.text,
        index: item.index ?? idx,
      })),
    };
  }

  if (q.pairs && q.pairs.length > 0) {
    createData.pairs = {
      create: q.pairs.map((pair: any, idx: number) => ({
        text: pair.text,
        matchId: pair.matchId,
        index: pair.index ?? idx,
      })),
    };
  }

  return createData;
}

function capitalizeWords(str: string): string {
  return str
    .split(/[-_]/g)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function getChapterTopicName(chapterIdx: number): string {
  const topics = [
    'Fundamentals & Output',
    'Variables & Types',
    'Input & Operations',
    'Advanced Topics',
    'Capstone Projects',
  ];
  return topics[chapterIdx] || 'Advanced';
}

function getUnitTopicName(chapterIdx: number, unitIdx: number): string {
  const unitTopics: Record<number, string[]> = {
    0: ['Print & Output', 'Variables', 'Input Basics'],
    1: ['Types & Casting', 'Operators', 'Logic Basics'],
    2: ['Functions Intro', 'Scope & Closure', 'Advanced Functions'],
    3: ['Collections', 'Iteration', 'Data Structures'],
    4: ['Projects', 'Review', 'Challenges'],
  };
  const chapterTopics = unitTopics[chapterIdx] || ['Topic 1', 'Topic 2', 'Topic 3'];
  return chapterTopics[unitIdx] || 'Topic';
}

async function main() {
  console.log('🌱 Seeding lesson data for Python and JavaScript...\n');

  try {
    // Seed Python
    const pythonLang = await prisma.language.upsert({
      where: { slug: 'python' },
      update: {},
      create: {
        name: 'Python',
        slug: 'python',
      },
    });

    console.log(`📚 Language: ${pythonLang.name}`);
    await createChapterStructure(pythonLang.id, pythonLang.name);
    console.log(`✓ ${pythonLang.name} structure created\n`);

    // Seed JavaScript
    const jsLang = await prisma.language.upsert({
      where: { slug: 'javascript' },
      update: {},
      create: {
        name: 'JavaScript',
        slug: 'javascript',
      },
    });

    console.log(`📚 Language: ${jsLang.name}`);
    await createChapterStructure(jsLang.id, jsLang.name, JS_LESSON_QUESTIONS);
    console.log(`✓ ${jsLang.name} structure created\n`);

    console.log('✅ Lesson data seeding completed successfully!');
    console.log('   - Python: 3 chapters with 15 units and 15 lessons (~8 questions per lesson = ~120 questions)');
    console.log('   - JavaScript: 3 chapters with 15 units and 15 lessons (~8 questions per lesson = ~120 questions)');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
