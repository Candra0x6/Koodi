import { PrismaClient } from '../lib/generated/prisma/client';

/**
 * Create chapter structure (5 chapters, 25 units, ~150+ lessons with questions)
 * Called after user completes onboarding
 */
export async function createChapterStructure(
  prisma: PrismaClient,
  languageId: string,
  languageName: string
) {
  console.log(`📚 Creating chapter structure for ${languageName}...`);

  const LESSON_QUESTIONS = [
    // MULTIPLE_CHOICE (5 questions)
    {
      type: 'MULTIPLE_CHOICE',
      content: 'What is the output of this code?\nprint(type(5))',
      explanation: 'The type() function returns the data type. 5 is an integer, so it returns <class "int">.',
      choices: JSON.stringify([
        '<class "int">',
        '<class "float">',
        '<class "str">',
        '<class "number">'
      ]),
      answer: '<class "int">',
      difficulty: 1,
    },
    {
      type: 'MULTIPLE_CHOICE',
      content: 'Which of these is a valid variable name in Python?',
      explanation: 'Variable names must start with a letter or underscore, not a number. _count is valid.',
      choices: JSON.stringify([
        '2count',
        'count-value',
        '_count',
        'count value'
      ]),
      answer: '_count',
      difficulty: 1,
    },
    {
      type: 'MULTIPLE_CHOICE',
      content: 'What will be printed?\nli = [1, 2, 3, 4, 5]\nprint(li[2])',
      explanation: 'Lists are 0-indexed. Index 2 refers to the third element, which is 3.',
      choices: JSON.stringify(['2', '3', '4', '5']),
      answer: '3',
      difficulty: 1,
    },
    {
      type: 'MULTIPLE_CHOICE',
      content: 'What does the len() function return for the string "hello"?',
      explanation: 'The len() function counts characters. "hello" has 5 characters.',
      choices: JSON.stringify(['4', '5', '6', 'Error']),
      answer: '5',
      difficulty: 1,
    },
    {
      type: 'MULTIPLE_CHOICE',
      content: 'What is the result of 10 // 3 in Python?',
      explanation: 'The // operator performs integer division. 10 divided by 3 equals 3 (remainder ignored).',
      choices: JSON.stringify(['3.33', '3', '4', '10']),
      answer: '3',
      difficulty: 2,
    },

    // FILL_BLANK (5 questions)
    {
      type: 'FILL_BLANK',
      content: 'To create an empty list, use ____',
      explanation: 'An empty list is created with square brackets [] or list().',
      choices: JSON.stringify(['[]', 'list()', '{}', 'array()']),
      answer: '[]',
      difficulty: 1,
    },
    {
      type: 'FILL_BLANK',
      content: 'The method to add an item to a list is ____.append(item)',
      explanation: 'The append() method adds an item to the end of a list.',
      choices: JSON.stringify(['list', 'my_list', 'items', 'arr']),
      answer: 'my_list',
      difficulty: 1,
    },
    {
      type: 'FILL_BLANK',
      content: 'To convert a string to uppercase, use ____.upper()',
      explanation: 'The upper() method converts all characters to uppercase.',
      choices: JSON.stringify(['text', 'str', 'string', 'message']),
      answer: 'text',
      difficulty: 1,
    },
    {
      type: 'FILL_BLANK',
      content: 'To get the last element of a list, use list[____]',
      explanation: 'In Python, -1 refers to the last element of a list.',
      choices: JSON.stringify(['-1', 'last', 'length-1', 'end']),
      answer: '-1',
      difficulty: 2,
    },
    {
      type: 'FILL_BLANK',
      content: 'The keyword ____ is used to exit a loop prematurely',
      explanation: 'The break keyword exits a loop immediately.',
      choices: JSON.stringify(['exit', 'break', 'stop', 'return']),
      answer: 'break',
      difficulty: 2,
    },

    // CODE_OUTPUT (5 questions)
    {
      type: 'CODE_OUTPUT',
      content: 'What will this print?\nx = "Python"\nfor char in x:\n    print(char)',
      explanation: 'The loop iterates through each character in the string and prints each one on a new line.',
      choices: JSON.stringify(['Python', 'P\ny\nt\nh\no\nn', 'P y t h o n', 'Error']),
      answer: 'P\ny\nt\nh\no\nn',
      difficulty: 1,
    },
    {
      type: 'CODE_OUTPUT',
      content: 'What will be printed?\nresult = 5 * 2 + 3\nprint(result)',
      explanation: 'Following order of operations: 5 * 2 = 10, then 10 + 3 = 13.',
      choices: JSON.stringify(['25', '13', '11', '10']),
      answer: '13',
      difficulty: 1,
    },
    {
      type: 'CODE_OUTPUT',
      content: 'What is the output?\ndata = {"name": "Alice", "age": 25}\nprint(data["name"])',
      explanation: 'Dictionary access with key "name" returns the value "Alice".',
      choices: JSON.stringify(['name', 'Alice', '25', 'Error']),
      answer: 'Alice',
      difficulty: 1,
    },
    {
      type: 'CODE_OUTPUT',
      content: 'What will print?\nnums = [1, 2, 3]\nnums.extend([4, 5])\nprint(nums)',
      explanation: 'The extend() method adds all items from the second list to the first list.',
      choices: JSON.stringify(['[1, 2, 3, 4, 5]', '[1, 2, 3]', '[[1, 2, 3], [4, 5]]', 'Error']),
      answer: '[1, 2, 3, 4, 5]',
      difficulty: 2,
    },
    {
      type: 'CODE_OUTPUT',
      content: 'What is the output?\nprint("Hello " * 2)',
      explanation: 'Multiplying a string by a number repeats it. "Hello " * 2 = "Hello Hello ".',
      choices: JSON.stringify(['Hello Hello', 'Hello Hello ', '2', 'Error']),
      answer: 'Hello Hello ',
      difficulty: 2,
    },

    // DEBUG_CODE (5 questions)
    {
      type: 'DEBUG_CODE',
      content: 'What is the error in this code?\nif x > 5\n    print("x is greater than 5")',
      explanation: 'Python requires a colon (:) after the if condition.',
      choices: JSON.stringify([
        'Missing colon after condition',
        'Missing parentheses',
        'Wrong variable name',
        'Invalid indentation'
      ]),
      answer: 'Missing colon after condition',
      difficulty: 1,
    },
    {
      type: 'DEBUG_CODE',
      content: 'What is wrong?\nmy_list = [1, 2, 3]\nmy_list.append([4, 5])\nprint(my_list[3][0])',
      explanation: 'my_list[3] is [4, 5], and [4, 5][0] is 4. This code should work and print 4. If an error occurs, check if index is out of range.',
      choices: JSON.stringify([
        'Index out of range',
        'Cannot append a list to a list',
        'No error - prints 4',
        'Syntax error'
      ]),
      answer: 'No error - prints 4',
      difficulty: 2,
    },
    {
      type: 'DEBUG_CODE',
      content: 'What is the bug?\ndef calculate(a, b):\n    return a + b\nprint(calculate(5))',
      explanation: 'The function requires 2 arguments but only 1 is provided. This causes a TypeError.',
      choices: JSON.stringify([
        'Missing function argument',
        'Return statement is wrong',
        'Variable name is incorrect',
        'No error'
      ]),
      answer: 'Missing function argument',
      difficulty: 2,
    },
    {
      type: 'DEBUG_CODE',
      content: 'What is the issue?\nfor i in range(5)\n    print(i)',
      explanation: 'Missing colon (:) after the for statement. Python requires a colon before the loop body.',
      choices: JSON.stringify([
        'Missing colon after for loop',
        'Invalid range()',
        'print() is deprecated',
        'Indentation error'
      ]),
      answer: 'Missing colon after for loop',
      difficulty: 1,
    },
  ];

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

  const chapters = [];

  for (let chapterIdx = 1; chapterIdx <= 5; chapterIdx++) {
    const chapter = await prisma.chapter.create({
      data: {
        title: `Chapter ${chapterIdx}: ${getChapterTitle(chapterIdx)}`,
        levelIndex: chapterIdx,
        languageId,
        units: {
          create: Array.from({ length: 5 }, (_, unitIdx) => {
            const unitIndex = unitIdx + 1;
            return {
              title: `Unit ${unitIndex}: ${getUnitTitle(chapterIdx, unitIndex)}`,
              unitIndex,
              lessons: {
                create: Array.from({ length: 5 + Math.floor(Math.random() * 6) }, (_, lessonIdx) => {
                  const lessonIndex = lessonIdx + 1;
                  // Assign questions from LESSON_QUESTIONS in round-robin fashion
                  const questionIndices = [];
                  for (let q = 0; q < 3; q++) {
                    const qIdx = ((chapterIdx - 1) * 4 + (unitIndex - 1)) % 20;
                    questionIndices.push((qIdx + q) % 20);
                  }

                  return {
                    title: `Lesson ${lessonIndex}`,
                    lessonIndex,
                    questions: {
                      create: questionIndices.map((qIdx) => {
                        const q = LESSON_QUESTIONS[qIdx];
                        return {
                          type: q.type as any,
                          content: q.content,
                          explanation: q.explanation,
                          choices: typeof q.choices === 'string' 
                            ? JSON.parse(q.choices) 
                            : q.choices,
                          answer: q.answer,
                          difficulty: q.difficulty,
                        };
                      }),
                    },
                  };
                }),
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
  }

  // Initialize UserUnitProgress for all units as unlocked for first chapter, locked for others
  for (let chIdx = 0; chIdx < chapters.length; chIdx++) {
    const chapter = chapters[chIdx];
    for (let uIdx = 0; uIdx < chapter.units.length; uIdx++) {
      const unit = chapter.units[uIdx];
      // First unit of first chapter is unlocked, rest are locked
      // Will be managed by frontend logic based on completion
      // For now, we create the progress record
    }
  }

  return chapters;
}
