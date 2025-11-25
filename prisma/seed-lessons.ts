import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.ckngpdwuhbjbbentrrza:KoodieEinSIjaknslasdjb10129@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres',
});

const prisma = new PrismaClient({ adapter });

// Question definitions matching the schema structure
const LESSON_QUESTIONS = [
  // DEBUG_HUNT (1)
  {
    id: 'q1',
    type: 'DEBUG_HUNT',
    instruction: 'Fix the bug!',
    description: 'This function should add two numbers, but it\'s subtracting them.',
    codeSegments: [
      { id: 'cs1', code: 'function ', isBug: false, correction: null, index: 0 },
      { id: 'cs2', code: 'add', isBug: false, correction: null, index: 1 },
      { id: 'cs3', code: '(a, b) {', isBug: false, correction: null, index: 2 },
      { id: 'cs4', code: '  return ', isBug: false, correction: null, index: 3 },
      { id: 'cs5', code: 'a - b', isBug: true, correction: 'a + b', index: 4 },
      { id: 'cs6', code: ';', isBug: false, correction: null, index: 5 },
      { id: 'cs7', code: '}', isBug: false, correction: null, index: 6 },
    ],
    explanation: 'The bug is on line 5: it should be "a + b" instead of "a - b".',
    difficulty: 1,
  },

  // MULTIPLE_CHOICE (1)
  {
    id: 'q2',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Complete the code',
    description: 'Select the correct line to print the message to the console.',
    codeBlock: 'function greet(name) {\n  __________\n}',
    options: [
      { id: 'q2o1', text: 'print("Hello " + name);', isCorrect: false, index: 1 },
      { id: 'q2o2', text: 'console.log("Hello " + name);', isCorrect: true, index: 2 },
      { id: 'q2o3', text: 'System.out.println(name);', isCorrect: false, index: 3 },
    ],
    explanation: 'In JavaScript, use console.log() to print to the console.',
    difficulty: 1,
  },

  // DEBUG_HUNT (2)
  {
    id: 'q3',
    type: 'DEBUG_HUNT',
    instruction: 'Find the syntax error',
    description: 'Variables must be declared correctly.',
    codeSegments: [
      { id: 'cs3_1', code: 'const ', isBug: false, correction: null, index: 0 },
      { id: 'cs3_2', code: 'user ', isBug: false, correction: null, index: 1 },
      { id: 'cs3_3', code: '= ', isBug: false, correction: null, index: 2 },
      { id: 'cs3_4', code: '\'Alice\'', isBug: false, correction: null, index: 3 },
      { id: 'cs3_5', code: 'let ', isBug: false, correction: null, index: 4 },
      { id: 'cs3_6', code: 'age ', isBug: false, correction: null, index: 5 },
      { id: 'cs3_7', code: '== ', isBug: true, correction: '= ', index: 6 },
      { id: 'cs3_8', code: '25;', isBug: false, correction: null, index: 7 },
    ],
    explanation: 'Line 7: use "=" for assignment, not "==" which is for comparison.',
    difficulty: 1,
  },

  // REORDER (1)
  {
    id: 'q4',
    type: 'REORDER',
    instruction: 'Arrange the code',
    description: 'Drag the blocks to create a valid if/else statement.',
    items: [
      { id: 'item-1', text: 'if (age >= 18) {', index: 1 },
      { id: 'item-2', text: '  console.log(\'Adult\');', index: 2 },
      { id: 'item-3', text: '} else {', index: 3 },
      { id: 'item-5', text: '  console.log(\'Minor\');', index: 5 },
      { id: 'item-4', text: '}', index: 4 },
    ],
    correctOrder: [1, 2, 3, 5, 4],
    explanation: 'The if statement must have the condition first, then the code block.',
    difficulty: 1,
  },

  // REORDER (2)
  {
    id: 'q5',
    type: 'REORDER',
    instruction: 'Build the loop',
    description: 'Put the loop parts in the correct order to count to 5.',
    items: [
      { id: 'loop-1', text: 'for (let i = 0; i < 5; i++) {', index: 1 },
      { id: 'loop-2', text: '  // Print number', index: 2 },
      { id: 'loop-3', text: '  console.log(i);', index: 3 },
      { id: 'loop-4', text: '}', index: 4 },
    ],
    correctOrder: [1, 2, 3, 4],
    explanation: 'The for loop syntax: declaration, condition, increment, then body.',
    difficulty: 1,
  },

  // REORDER (3)
  {
    id: 'q6',
    type: 'REORDER',
    instruction: 'Build the function',
    description: 'Assemble the function pieces correctly.',
    items: [
      { id: 'fn-1', text: 'function multiply(a, b) {', index: 1 },
      { id: 'fn-2', text: '  // Calculate product', index: 2 },
      { id: 'fn-3', text: '  return a * b;', index: 3 },
      { id: 'fn-4', text: '}', index: 4 },
    ],
    correctOrder: [1, 2, 3, 4],
    explanation: 'Function structure: declaration, body, return statement, closing brace.',
    difficulty: 1,
  },

  // FILL_BLANK (1)
  {
    id: 'q7',
    type: 'FILL_BLANK',
    instruction: 'Fill The Missing Line',
    description: 'Complete the loop condition to run 5 times.',
    codeBefore: 'for (let i = 0; i < 5; ',
    codeAfter: ') {\n  console.log(i);\n}',
    options: [
      { id: 'opt-1', text: 'i++', isCorrect: true, index: 1 },
      { id: 'opt-2', text: 'i--', isCorrect: false, index: 2 },
      { id: 'opt-3', text: 'i = i + 5', isCorrect: false, index: 3 },
    ],
    explanation: 'The i++ increment operator increments i by 1 each iteration.',
    difficulty: 1,
  },

  // FILL_BLANK (2)
  {
    id: 'q8',
    type: 'FILL_BLANK',
    instruction: 'Autocomplete Challenge',
    description: 'Select the correct array method to add an item to the end.',
    codeBefore: 'const fruits = [\'apple\', \'banana\'];\nfruits.',
    codeAfter: '(\'orange\');',
    options: [
      { id: 'opt2-1', text: 'pop', isCorrect: false, index: 1 },
      { id: 'opt2-2', text: 'push', isCorrect: true, index: 2 },
      { id: 'opt2-3', text: 'shift', isCorrect: false, index: 3 },
    ],
    explanation: 'The push() method adds elements to the end of an array.',
    difficulty: 1,
  },

  // PREDICT_OUTPUT (1)
  {
    id: 'q9',
    type: 'PREDICT_OUTPUT',
    instruction: 'What will this print?',
    description: 'Analyze the code and predict the console output.',
    codeBlock: 'let x = "2" + 2;\nconsole.log(x);',
    options: [
      { id: 'out-1', text: '4', isCorrect: false, index: 1 },
      { id: 'out-2', text: '"22"', isCorrect: true, index: 2 },
      { id: 'out-3', text: 'Error', isCorrect: false, index: 3 },
    ],
    explanation: 'When adding a string and number, JavaScript concatenates them as a string.',
    difficulty: 1,
  },

  // LOGIC_PUZZLE (1)
  {
    id: 'q10',
    type: 'LOGIC_PUZZLE',
    instruction: 'Unlock the Chest',
    description: 'Choose the value that satisfies the condition to open the chest.',
    logicCondition: 'chest.open = (age >= 18)',
    options: [
      { id: 'log-1', text: 'age = 12', isCorrect: false, index: 1 },
      { id: 'log-2', text: 'age = 20', isCorrect: true, index: 2 },
      { id: 'log-3', text: 'age = 17', isCorrect: false, index: 3 },
    ],
    explanation: 'Choose the value that satisfies the condition age >= 18 to open the chest.',
    difficulty: 1,
  },

  // MATCH_MADNESS (1)
  {
    id: 'q11',
    type: 'MATCH_MADNESS',
    instruction: 'Match Code to Output',
    description: 'Tap the matching pairs to clear the board!',
    pairs: [
      {
        text: '[1, 2, 3].length',
        matchId: '3',
        index: 1,
      },
      {
        text: '"A".toLowerCase()',
        matchId: '"a"',
        index: 2,
      },
      {
        text: 'typeof 42',
        matchId: '"number"',
        index: 3,
      },
      {
        text: '2 + 2',
        matchId: '4',
        index: 4,
      },
      {
        text: '3',
        matchId: '[1, 2, 3].length',
        index: 5,
      },
      {
        text: '"a"',
        matchId: '"A".toLowerCase()',
        index: 6,
      },
      {
        text: '"number"',
        matchId: 'typeof 42',
        index: 7,
      },
      {
        text: '4',
        matchId: '2 + 2',
        index: 8,
      },
    ],
    explanation: 'Match each code snippet with its correct output.',
    difficulty: 1,
  },

  // MATCH_MADNESS (2) - OOP Concepts
  {
    id: 'q12',
    type: 'MATCH_MADNESS',
    instruction: 'Match Programming Concepts',
    description: 'Match each term with the correct explanation.',
    pairs: [
      {
        text: 'Polymorphism',
        matchId: 'Ability of a function to take many forms',
        index: 1,
      },
      {
        text: 'Encapsulation',
        matchId: 'Wrapping data and functions into a single unit',
        index: 2,
      },
      {
        text: 'Recursion',
        matchId: 'Function calling itself repeatedly',
        index: 3,
      },
      {
        text: 'Abstraction',
        matchId: 'Hiding complex implementation details',
        index: 4,
      },
      {
        text: 'Ability of a function to take many forms',
        matchId: 'Polymorphism',
        index: 5,
      },
      {
        text: 'Wrapping data and functions into a single unit',
        matchId: 'Encapsulation',
        index: 6,
      },
      {
        text: 'Function calling itself repeatedly',
        matchId: 'Recursion',
        index: 7,
      },
      {
        text: 'Hiding complex implementation details',
        matchId: 'Abstraction',
        index: 8,
      },
    ],
    explanation: 'OOP principles are fundamental to object-oriented programming.',
    difficulty: 2,
  },
];

// Helper function to create chapter structure for a language
async function createChapterStructure(languageId: string, languageName: string) {
  console.log(`\n📚 Creating chapter structure for ${languageName}...`);

  const chapters = [];
  
  for (let chapterIdx = 1; chapterIdx <= 3; chapterIdx++) {
    const chapter = await prisma.chapter.create({
      data: {
        title: `Chapter ${chapterIdx}: ${getChapterTitle(chapterIdx)}`,
        levelIndex: chapterIdx,
        languageId,
        units: {
          create: Array.from({ length: 3 }, (_, unitIdx) => {
            const unitIndex = unitIdx + 1;
            return {
              title: `Unit ${unitIndex}: ${getUnitTitle(chapterIdx, unitIndex)}`,
              unitIndex,
              lessons: {
                create: [
                  {
                    title: 'Lesson 1: Basics',
                    lessonIndex: 1,
                    questions: {
                      create: LESSON_QUESTIONS.slice(0, 6).map((q) => createQuestionData(q)),
                    },
                  },
                  {
                    title: 'Lesson 2: Advanced',
                    lessonIndex: 2,
                    questions: {
                      create: LESSON_QUESTIONS.slice(6, 12).map((q) => createQuestionData(q)),
                    },
                  },
                ],
              },
            };
          }),
        },
      },
      include: {
        units: {
          include: {
            lessons: {
              include: { questions: true },
            },
          },
        },
      },
    });

    chapters.push(chapter);
    console.log(`  ✓ Chapter ${chapterIdx}: ${chapter.title} (${chapter.units.length} units)`);
  }

  // Count total questions created
  const totalQuestions = chapters.reduce((sum, ch) => {
    return sum + ch.units.reduce((uSum, u) => {
      return uSum + u.lessons.reduce((lSum, l) => lSum + l.questions.length, 0);
    }, 0);
  }, 0);

  console.log(`\n✅ Created structure: 3 chapters, 9 units, 18 lessons, ${totalQuestions} questions`);
  return chapters;
}

// Helper to create question data based on type
function createQuestionData(q: any) {
  // Ensure correctOrder is always an array
  const correctOrderValue = Array.isArray(q.correctOrder) ? q.correctOrder : [];
  
  const baseData = {
    type: q.type as any,
    instruction: q.instruction,
    description: q.description || null,
    explanation: q.explanation || null,
    difficulty: q.difficulty,
    codeBlock: q.codeBlock || null,
    codeBefore: q.codeBefore || null,
    codeAfter: q.codeAfter || null,
    logicCondition: q.logicCondition || null,
    correctOrder: correctOrderValue,
  };

  const createData: any = { ...baseData };

  // Add nested relations based on question type
  if (q.options && q.options.length > 0) {
    createData.options = {
      create: q.options.map((opt: any) => ({
        text: opt.text,
        isCorrect: opt.isCorrect,
        index: opt.index,
      })),
    };
  }

  if (q.codeSegments && q.codeSegments.length > 0) {
    createData.codeSegments = {
      create: q.codeSegments.map((seg: any) => ({
        code: seg.code,
        isBug: seg.isBug,
        correction: seg.correction || null,
        index: seg.index,
      })),
    };
  }

  if (q.items && q.items.length > 0) {
    createData.items = {
      create: q.items.map((item: any) => ({
        text: item.text,
        index: item.index,
      })),
    };
  }

  if (q.pairs && q.pairs.length > 0) {
    createData.pairs = {
      create: q.pairs.map((pair: any) => ({
        text: pair.text,
        matchId: pair.matchId,
        index: pair.index,
      })),
    };
  }

  return createData;
}

function getChapterTitle(chapterNum: number): string {
  const titles = [
    'Fundamentals & Variables',
    'Control Flow & Logic',
    'Functions & Scope',
    'Data Structures & Collections',
    'Advanced Concepts & Projects',
  ];
  return titles[chapterNum - 1] || 'Advanced';
}

function getUnitTitle(chapterNum: number, unitNum: number): string {
  const titles: Record<number, string[]> = {
    1: ['Variables', 'Data Types', 'Operations', 'Strings', 'Input/Output'],
    2: ['If/Else', 'Loops', 'Break/Continue', 'Boolean Logic', 'Nested Control'],
    3: ['Function Basics', 'Parameters', 'Return Values', 'Scope', 'Recursion'],
    4: ['Lists', 'Dictionaries', 'Tuples', 'Sets', 'List Comprehensions'],
    5: ['Error Handling', 'Modules', 'File I/O', 'OOP Basics', 'Capstone Project'],
  };
  return titles[chapterNum]?.[unitNum - 1] || 'Topic';
}

async function main() {
  console.log('🌱 Seeding lesson data...');

  try {
    // Ensure Python language exists
    const pythonLang = await prisma.language.upsert({
      where: { slug: 'python' },
      update: {},
      create: {
        name: 'Python',
        slug: 'python',
      },
    });

    console.log(`✓ Language: ${pythonLang.name}`);

    // Create chapter structure
    await createChapterStructure(pythonLang.id, pythonLang.name);

    console.log('\n✅ Lesson data seeding completed successfully!');
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
