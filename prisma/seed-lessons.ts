import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.fvwsoryptbhufzdlgmya:KOSnianoisano218@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres',
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
  
  // --- EXTRA QUESTIONS TO EXPAND THE BANK ---
  // DEBUG_HUNT (3)
  {
    id: 'q13',
    type: 'DEBUG_HUNT',
    instruction: 'Spot the typo',
    description: 'Fix the property name to access array length.',
    codeSegments: [
      { id: 'q13_1', code: 'const nums = [1,2,3];', isBug: false, correction: null, index: 0 },
      { id: 'q13_2', code: ' if (nums.', isBug: false, correction: null, index: 1 },
      { id: 'q13_3', code: 'lenght', isBug: true, correction: 'length', index: 2 },
      { id: 'q13_4', code: ' > 0) {', isBug: false, correction: null, index: 3 },
      { id: 'q13_5', code: ' console.log(nums[0]);', isBug: false, correction: null, index: 4 },
      { id: 'q13_6', code: ' }', isBug: false, correction: null, index: 5 },
    ],
    explanation: 'The correct property is length, not lenght.',
    difficulty: 1,
  },

  // MULTIPLE_CHOICE (2)
  {
    id: 'q14',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Choose the correct method',
    description: 'Remove the first element of the array.',
    codeBlock: 'const q = ["a", "b", "c"];\nq.________();',
    options: [
      { id: 'q14o1', text: 'pop', isCorrect: false, index: 1 },
      { id: 'q14o2', text: 'shift', isCorrect: true, index: 2 },
      { id: 'q14o3', text: 'unshift', isCorrect: false, index: 3 },
    ],
    explanation: 'shift() removes the first element from an array.',
    difficulty: 1,
  },

  // REORDER (4)
  {
    id: 'q15',
    type: 'REORDER',
    instruction: 'Make a sum function',
    description: 'Order the lines to sum numbers from 1 to n.',
    items: [
      { id: 'q15_i1', text: 'function sumTo(n) {', index: 1 },
      { id: 'q15_i2', text: '  let s = 0;', index: 2 },
      { id: 'q15_i3', text: '  for (let i = 1; i <= n; i++) s += i;', index: 3 },
      { id: 'q15_i4', text: '  return s; }', index: 4 },
    ],
    correctOrder: [1, 2, 3, 4],
    explanation: 'Initialize accumulator, loop from 1..n, and return.',
    difficulty: 2,
  },

  // FILL_BLANK (3)
  {
    id: 'q16',
    type: 'FILL_BLANK',
    instruction: 'Use strict equality',
    description: 'Fill the operator to strictly compare a with 5.',
    codeBefore: 'const a = 5; if (a ',
    codeAfter: ' 5) { console.log("five"); }',
    options: [
      { id: 'q16o1', text: '===', isCorrect: true, index: 1 },
      { id: 'q16o2', text: '==', isCorrect: false, index: 2 },
      { id: 'q16o3', text: '<=', isCorrect: false, index: 3 },
    ],
    explanation: '=== performs strict equality without type coercion.',
    difficulty: 1,
  },

  // PREDICT_OUTPUT (2)
  {
    id: 'q17',
    type: 'PREDICT_OUTPUT',
    instruction: 'Know your types',
    description: 'What is the output of typeof null?',
    codeBlock: 'console.log(typeof null);',
    options: [
      { id: 'q17o1', text: '"null"', isCorrect: false, index: 1 },
      { id: 'q17o2', text: '"object"', isCorrect: true, index: 2 },
      { id: 'q17o3', text: '"undefined"', isCorrect: false, index: 3 },
    ],
    explanation: 'In JS, typeof null is a historical quirk: "object".',
    difficulty: 2,
  },

  // LOGIC_PUZZLE (2)
  {
    id: 'q18',
    type: 'LOGIC_PUZZLE',
    instruction: 'Pass the exam',
    description: 'Choose values that satisfy the condition.',
    logicCondition: 'score > 50 && passed === true',
    options: [
      { id: 'q18o1', text: 'score = 40, passed = true', isCorrect: false, index: 1 },
      { id: 'q18o2', text: 'score = 60, passed = true', isCorrect: true, index: 2 },
      { id: 'q18o3', text: 'score = 60, passed = false', isCorrect: false, index: 3 },
    ],
    explanation: 'Both conditions must be true: score > 50 and passed.',
    difficulty: 2,
  },

  // --- ADDITIONAL QUESTIONS to reach ~50 total ---
  // DEBUG_HUNT (4)
  {
    id: 'q19',
    type: 'DEBUG_HUNT',
    instruction: 'Fix the loop boundary',
    description: 'Off-by-one error prevents last element from printing.',
    codeSegments: [
      { id: 'q19_1', code: 'const arr = [1,2,3,4];', isBug: false, correction: null, index: 0 },
      { id: 'q19_2', code: ' for (let i = 0; i ', isBug: false, correction: null, index: 1 },
      { id: 'q19_3', code: '< ', isBug: true, correction: '<= ', index: 2 },
      { id: 'q19_4', code: 'arr.length - 1; i++) {', isBug: false, correction: null, index: 3 },
      { id: 'q19_5', code: ' console.log(arr[i]);', isBug: false, correction: null, index: 4 },
      { id: 'q19_6', code: ' }', isBug: false, correction: null, index: 5 },
    ],
    explanation: 'Use <= arr.length - 1 or i < arr.length.',
    difficulty: 1,
  },

  // MULTIPLE_CHOICE (3)
  {
    id: 'q20',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Pick the correct method',
    description: 'Find if an array contains a value.',
    codeBlock: 'const langs = ["js", "py", "rb"];\n// Check for "py"',
    options: [
      { id: 'q20o1', text: 'langs.has("py")', isCorrect: false, index: 1 },
      { id: 'q20o2', text: 'langs.includes("py")', isCorrect: true, index: 2 },
      { id: 'q20o3', text: 'langs.contains("py")', isCorrect: false, index: 3 },
    ],
    explanation: 'Use Array.prototype.includes to check membership.',
    difficulty: 1,
  },

  // REORDER (5)
  {
    id: 'q21',
    type: 'REORDER',
    instruction: 'Construct a try/catch',
    description: 'Arrange to handle a potential error.',
    items: [
      { id: 'q21_i1', text: 'try {', index: 1 },
      { id: 'q21_i2', text: '  JSON.parse("{")', index: 2 },
      { id: 'q21_i3', text: '} catch (e) {', index: 3 },
      { id: 'q21_i4', text: '  console.error(e.message)', index: 4 },
      { id: 'q21_i5', text: '}', index: 5 },
    ],
    correctOrder: [1, 2, 3, 4, 5],
    explanation: 'try block first, then catch to handle errors.',
    difficulty: 2,
  },

  // FILL_BLANK (4)
  {
    id: 'q22',
    type: 'FILL_BLANK',
    instruction: 'Complete the template string',
    description: 'Use backticks and interpolation.',
    codeBefore: 'const name = "Ada"; const msg = ',
    codeAfter: ';',
    options: [
      { id: 'q22o1', text: '`Hello, ${name}!`', isCorrect: true, index: 1 },
      { id: 'q22o2', text: '"Hello, ${name}!"', isCorrect: false, index: 2 },
      { id: 'q22o3', text: "'Hello, ' + {name}", isCorrect: false, index: 3 },
    ],
    explanation: 'Template literals require backticks and ${}.',
    difficulty: 1,
  },

  // LOGIC_PUZZLE (3)
  {
    id: 'q23',
    type: 'LOGIC_PUZZLE',
    instruction: 'Gate access rule',
    description: 'Choose values to satisfy the condition.',
    logicCondition: 'isAdmin || (loggedIn && hasTicket)',
    options: [
      { id: 'q23o1', text: 'isAdmin=false, loggedIn=true, hasTicket=false', isCorrect: false, index: 1 },
      { id: 'q23o2', text: 'isAdmin=true, loggedIn=false, hasTicket=false', isCorrect: true, index: 2 },
      { id: 'q23o3', text: 'isAdmin=false, loggedIn=true, hasTicket=true', isCorrect: true, index: 3 },
    ],
    explanation: 'Either admin or both logged in and has a ticket.',
    difficulty: 2,
  },

  // MATCH_MADNESS (3)
  {
    id: 'q24',
    type: 'MATCH_MADNESS',
    instruction: 'Match expressions to results',
    description: 'Tap matching pairs.',
    pairs: [
      { text: 'Array.isArray([])', matchId: 'true', index: 1 },
      { text: 'Boolean(0)', matchId: 'false', index: 2 },
      { text: 'Math.max(1, 3)', matchId: '3', index: 3 },
      { text: 'parseInt("10")', matchId: '10', index: 4 },
      { text: 'true', matchId: 'Array.isArray([])', index: 5 },
      { text: 'false', matchId: 'Boolean(0)', index: 6 },
      { text: '3', matchId: 'Math.max(1, 3)', index: 7 },
      { text: '10', matchId: 'parseInt("10")', index: 8 },
    ],
    explanation: 'Recognize standard JS results.',
    difficulty: 2,
  },

  // REORDER (6)
  {
    id: 'q25',
    type: 'REORDER',
    instruction: 'Compose a fetch sequence',
    description: 'Properly handle a promise chain.',
    items: [
      { id: 'q25_i1', text: 'fetch("/api")', index: 1 },
      { id: 'q25_i2', text: '  .then(r => r.json())', index: 2 },
      { id: 'q25_i3', text: '  .then(data => console.log(data))', index: 3 },
      { id: 'q25_i4', text: '  .catch(err => console.error(err))', index: 4 },
    ],
    correctOrder: [1, 2, 3, 4],
    explanation: 'Parse JSON before using data; catch at the end.',
    difficulty: 2,
  },

  // FILL_BLANK (5)
  {
    id: 'q26',
    type: 'FILL_BLANK',
    instruction: 'Select proper default value',
    description: 'Use nullish coalescing to default.',
    codeBefore: 'const input = null; const value = input ',
    codeAfter: ' "N/A";',
    options: [
      { id: 'q26o1', text: '??', isCorrect: true, index: 1 },
      { id: 'q26o2', text: '||', isCorrect: false, index: 2 },
      { id: 'q26o3', text: '?:', isCorrect: false, index: 3 },
    ],
    explanation: 'Use ?? to fallback only on null/undefined.',
    difficulty: 1,
  },

  // DEBUG_HUNT (5)
  {
    id: 'q27',
    type: 'DEBUG_HUNT',
    instruction: 'Fix strict mode error',
    description: 'Undeclared variable assignment should be declared.',
    codeSegments: [
      { id: 'q27_1', code: '"use strict";', isBug: false, correction: null, index: 0 },
      { id: 'q27_2', code: ' x ', isBug: true, correction: ' let x ', index: 1 },
      { id: 'q27_3', code: '= 10;', isBug: false, correction: null, index: 2 },
    ],
    explanation: 'Declare variables with let/const in strict mode.',
    difficulty: 2,
  },

  // MULTIPLE_CHOICE (4)
  {
    id: 'q28',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Immutable string operation',
    description: 'Which creates a new string with uppercase?',
    codeBlock: 'const s = "hello";',
    options: [
      { id: 'q28o1', text: 's[0] = "H"', isCorrect: false, index: 1 },
      { id: 'q28o2', text: 's.toUpperCase()', isCorrect: true, index: 2 },
      { id: 'q28o3', text: 's.capitalize()', isCorrect: false, index: 3 },
    ],
    explanation: 'Strings are immutable; methods return new strings.',
    difficulty: 1,
  },

  // REORDER (7)
  {
    id: 'q29',
    type: 'REORDER',
    instruction: 'Build a filter pipeline',
    description: 'Filter evens and map doubled.',
    items: [
      { id: 'q29_i1', text: 'const xs = [1,2,3,4];', index: 1 },
      { id: 'q29_i2', text: 'const ys = xs', index: 2 },
      { id: 'q29_i3', text: '  .filter(x => x % 2 === 0)', index: 3 },
      { id: 'q29_i4', text: '  .map(x => x * 2);', index: 4 },
    ],
    correctOrder: [1, 2, 3, 4],
    explanation: 'Filter before map for desired result.',
    difficulty: 2,
  },

  // FILL_BLANK (6)
  {
    id: 'q30',
    type: 'FILL_BLANK',
    instruction: 'Choose the correct keyword',
    description: 'Prevent reassignment of a binding.',
    codeBefore: '_____ pi = 3.14159;',
    codeAfter: '',
    options: [
      { id: 'q30o1', text: 'const', isCorrect: true, index: 1 },
      { id: 'q30o2', text: 'let', isCorrect: false, index: 2 },
      { id: 'q30o3', text: 'var', isCorrect: false, index: 3 },
    ],
    explanation: 'Use const for constants.',
    difficulty: 1,
  },

  // DEBUG_HUNT (6)
  {
    id: 'q31',
    type: 'DEBUG_HUNT',
    instruction: 'Correct equality usage',
    description: 'Fix loose equality in condition.',
    codeSegments: [
      { id: 'q31_1', code: 'const n = "5";', isBug: false, correction: null, index: 0 },
      { id: 'q31_2', code: ' if (n ', isBug: false, correction: null, index: 1 },
      { id: 'q31_3', code: '==', isBug: true, correction: '===', index: 2 },
      { id: 'q31_4', code: ' 5) { console.log("five") }', isBug: false, correction: null, index: 3 },
    ],
    explanation: 'Prefer strict equality (===).',
    difficulty: 1,
  },

  // MULTIPLE_CHOICE (5)
  {
    id: 'q32',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Pick correct spread usage',
    description: 'Clone an array shallowly.',
    codeBlock: 'const a = [1,2,3];',
    options: [
      { id: 'q32o1', text: 'const b = a;', isCorrect: false, index: 1 },
      { id: 'q32o2', text: 'const b = [...a];', isCorrect: true, index: 2 },
      { id: 'q32o3', text: 'const b = clone(a);', isCorrect: false, index: 3 },
    ],
    explanation: 'Spread operator creates a shallow copy.',
    difficulty: 1,
  },

  // REORDER (8)
  {
    id: 'q33',
    type: 'REORDER',
    instruction: 'Create an arrow function',
    description: 'Return square of a number.',
    items: [
      { id: 'q33_i1', text: 'const sq = ', index: 1 },
      { id: 'q33_i2', text: '(n) => ', index: 2 },
      { id: 'q33_i3', text: 'n * n;', index: 3 },
    ],
    correctOrder: [1, 2, 3],
    explanation: 'Arrow function syntax: params => expression.',
    difficulty: 1,
  },

  // LOGIC_PUZZLE (4)
  {
    id: 'q34',
    type: 'LOGIC_PUZZLE',
    instruction: 'Shipping eligibility',
    description: 'Choose cart values that qualify for free shipping.',
    logicCondition: 'total >= 50 && country !== "Remote"',
    options: [
      { id: 'q34o1', text: 'total = 40, country="US"', isCorrect: false, index: 1 },
      { id: 'q34o2', text: 'total = 50, country="US"', isCorrect: true, index: 2 },
      { id: 'q34o3', text: 'total = 70, country="Remote"', isCorrect: false, index: 3 },
    ],
    explanation: 'Threshold must be met and country not Remote.',
    difficulty: 2,
  },

  // DEBUG_HUNT (7)
  {
    id: 'q35',
    type: 'DEBUG_HUNT',
    instruction: 'Fix property access',
    description: 'Correctly access nested property.',
    codeSegments: [
      { id: 'q35_1', code: 'const user = { profile: { name: "Lin" } };', isBug: false, correction: null, index: 0 },
      { id: 'q35_2', code: ' console.log(user.profile.', isBug: false, correction: null, index: 1 },
      { id: 'q35_3', code: 'nam', isBug: true, correction: 'name', index: 2 },
      { id: 'q35_4', code: ');', isBug: false, correction: null, index: 3 },
    ],
    explanation: 'Typo in property name.',
    difficulty: 1,
  },

  // MULTIPLE_CHOICE (6)
  {
    id: 'q36',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Pick correct Map usage',
    description: 'Set and get values from a Map.',
    codeBlock: 'const m = new Map();',
    options: [
      { id: 'q36o1', text: 'm["a"] = 1; m.get("a")', isCorrect: false, index: 1 },
      { id: 'q36o2', text: 'm.set("a", 1); m.get("a")', isCorrect: true, index: 2 },
      { id: 'q36o3', text: 'm.add("a", 1); m.fetch("a")', isCorrect: false, index: 3 },
    ],
    explanation: 'Use set/get with Map.',
    difficulty: 2,
  },

  // PREDICT_OUTPUT (3)
  {
    id: 'q37',
    type: 'PREDICT_OUTPUT',
    instruction: 'Understand hoisting',
    description: 'What is printed?',
    codeBlock: 'console.log(a);\nvar a = 2;',
    options: [
      { id: 'q37o1', text: '2', isCorrect: false, index: 1 },
      { id: 'q37o2', text: 'undefined', isCorrect: true, index: 2 },
      { id: 'q37o3', text: 'ReferenceError', isCorrect: false, index: 3 },
    ],
    explanation: 'var declarations are hoisted with undefined.',
    difficulty: 2,
  },

  // FILL_BLANK (7)
  {
    id: 'q38',
    type: 'FILL_BLANK',
    instruction: 'Choose correct destructuring',
    description: 'Extract second item from array by index.',
    codeBefore: 'const arr = ["x","y","z"]; const ',
    codeAfter: ' = arr[1];',
    options: [
      { id: 'q38o1', text: 'second', isCorrect: true, index: 1 },
      { id: 'q38o2', text: '{ second }', isCorrect: false, index: 2 },
      { id: 'q38o3', text: 'arr[1]', isCorrect: false, index: 3 },
    ],
    explanation: 'Index access returns the second element.',
    difficulty: 1,
  },

  // DEBUG_HUNT (8)
  {
    id: 'q39',
    type: 'DEBUG_HUNT',
    instruction: 'Fix missing return',
    description: 'Function should return value.',
    codeSegments: [
      { id: 'q39_1', code: 'function id(x) {', isBug: false, correction: null, index: 0 },
      { id: 'q39_2', code: ' x', isBug: true, correction: ' return x', index: 1 },
      { id: 'q39_3', code: ' }', isBug: false, correction: null, index: 2 },
    ],
    explanation: 'Return the parameter x.',
    difficulty: 1,
  },

  // MULTIPLE_CHOICE (7)
  {
    id: 'q40',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Correct Set usage',
    description: 'Add unique elements to a Set.',
    codeBlock: 'const s = new Set([1,2]);',
    options: [
      { id: 'q40o1', text: 's.push(2)', isCorrect: false, index: 1 },
      { id: 'q40o2', text: 's.add(2)', isCorrect: true, index: 2 },
      { id: 'q40o3', text: 's.insert(3)', isCorrect: false, index: 3 },
    ],
    explanation: 'Use add() with Set.',
    difficulty: 1,
  },

  // PREDICT_OUTPUT (4)
  {
    id: 'q41',
    type: 'PREDICT_OUTPUT',
    instruction: 'Know NaN comparisons',
    description: 'What is the result?',
    codeBlock: 'console.log(NaN === NaN);',
    options: [
      { id: 'q41o1', text: 'true', isCorrect: false, index: 1 },
      { id: 'q41o2', text: 'false', isCorrect: true, index: 2 },
      { id: 'q41o3', text: 'TypeError', isCorrect: false, index: 3 },
    ],
    explanation: 'NaN is not equal to itself.',
    difficulty: 2,
  },

  // FILL_BLANK (8)
  {
    id: 'q42',
    type: 'FILL_BLANK',
    instruction: 'Complete object destructuring',
    description: 'Extract name property.',
    codeBefore: 'const user = { name: "Mia", age: 20 }; const { ',
    codeAfter: ' } = user;',
    options: [
      { id: 'q42o1', text: 'username', isCorrect: false, index: 1 },
      { id: 'q42o2', text: 'name', isCorrect: true, index: 2 },
      { id: 'q42o3', text: 'user.name', isCorrect: false, index: 3 },
    ],
    explanation: 'Destructure by property name.',
    difficulty: 1,
  },

  // DEBUG_HUNT (9)
  {
    id: 'q43',
    type: 'DEBUG_HUNT',
    instruction: 'Fix JSON string',
    description: 'JSON requires double quotes for keys and strings.',
    codeSegments: [
      { id: 'q43_1', code: "const s = '{'name': 'Ada'}';", isBug: true, correction: 'const s = "{\"name\": \"Ada\"}";', index: 0 },
    ],
    explanation: 'Use double quotes in JSON or escape properly.',
    difficulty: 3,
  },

  // MULTIPLE_CHOICE (8)
  {
    id: 'q44',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Choose correct Promise creation',
    description: 'Create a resolved Promise with value 42.',
    codeBlock: '',
    options: [
      { id: 'q44o1', text: 'new Promise(42)', isCorrect: false, index: 1 },
      { id: 'q44o2', text: 'Promise.resolve(42)', isCorrect: true, index: 2 },
      { id: 'q44o3', text: 'Promise.new(42)', isCorrect: false, index: 3 },
    ],
    explanation: 'Use Promise.resolve to wrap a value.',
    difficulty: 1,
  },

  // PREDICT_OUTPUT (5)
  {
    id: 'q45',
    type: 'PREDICT_OUTPUT',
    instruction: 'Arrow function this',
    description: 'What is printed?',
    codeBlock: 'const obj = {\n  val: 1,\n  inc: () => { this.val++; console.log(this.val); }\n};\nobj.inc();',
    options: [
      { id: 'q45o1', text: '2', isCorrect: false, index: 1 },
      { id: 'q45o2', text: 'undefined or error', isCorrect: true, index: 2 },
      { id: 'q45o3', text: 'NaN', isCorrect: false, index: 3 },
    ],
    explanation: 'Arrow functions do not bind their own this.',
    difficulty: 3,
  },

  // FILL_BLANK (9)
  {
    id: 'q46',
    type: 'FILL_BLANK',
    instruction: 'Pick correct optional chaining',
    description: 'Safely access nested property.',
    codeBefore: 'const city = user.address',
    codeAfter: ';',
    options: [
      { id: 'q46o1', text: '?.city', isCorrect: true, index: 1 },
      { id: 'q46o2', text: '.?city;', isCorrect: false, index: 2 },
      { id: 'q46o3', text: '??.city', isCorrect: false, index: 3 },
    ],
    explanation: 'Use ?. for optional chaining.',
    difficulty: 2,
  },

  // DEBUG_HUNT (10)
  {
    id: 'q47',
    type: 'DEBUG_HUNT',
    instruction: 'Fix async/await',
    description: 'Await the asynchronous call before using result.',
    codeSegments: [
      { id: 'q47_1', code: 'async function run() {', isBug: false, correction: null, index: 0 },
      { id: 'q47_2', code: ' const data = fetch("/api");', isBug: true, correction: ' const data = await fetch("/api");', index: 1 },
      { id: 'q47_3', code: ' console.log(data.ok);', isBug: false, correction: null, index: 2 },
      { id: 'q47_4', code: '}', isBug: false, correction: null, index: 3 },
    ],
    explanation: 'Use await to resolve the Promise.',
    difficulty: 2,
  },

  // MULTIPLE_CHOICE (9)
  {
    id: 'q48',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Select correct String/Number conversion',
    description: 'Turn "42" into 42.',
    codeBlock: '',
    options: [
      { id: 'q48o1', text: 'Number("42")', isCorrect: true, index: 1 },
      { id: 'q48o2', text: 'parseFloat(42)', isCorrect: false, index: 2 },
      { id: 'q48o3', text: 'toNumber("42")', isCorrect: false, index: 3 },
    ],
    explanation: 'Number(…) converts strings to numbers.',
    difficulty: 1,
  },

  // PREDICT_OUTPUT (6)
  {
    id: 'q49',
    type: 'PREDICT_OUTPUT',
    instruction: 'Array reference behavior',
    description: 'What gets printed?',
    codeBlock: 'const a = [1];\nconst b = a;\nb.push(2);\nconsole.log(a.length);',
    options: [
      { id: 'q49o1', text: '1', isCorrect: false, index: 1 },
      { id: 'q49o2', text: '2', isCorrect: true, index: 2 },
      { id: 'q49o3', text: 'Error', isCorrect: false, index: 3 },
    ],
    explanation: 'Arrays are reference types; b references a.',
    difficulty: 1,
  },

  // FILL_BLANK (10)
  {
    id: 'q50',
    type: 'FILL_BLANK',
    instruction: 'Choose correct export',
    description: 'Export a default function.',
    codeBefore: 'export default ',
    codeAfter: ' main() { return 1 }',
    options: [
      { id: 'q50o1', text: 'export default', isCorrect: false, index: 1 },
      { id: 'q50o2', text: 'function', isCorrect: true, index: 2 },
      { id: 'q50o3', text: 'module.exports =', isCorrect: false, index: 3 },
    ],
    explanation: 'Default export is declared at file end in this snippet.',
    difficulty: 2,
  },

  // ===== CHAPTER 1 SPECIFIC QUESTIONS (Variables, Data Types, Operations) =====
  // q51-q75: Variables & Data Types
  {
    id: 'q51',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Choose the correct variable declaration',
    description: 'Which statement correctly declares a variable?',
    codeBlock: 'Select the valid JavaScript variable declaration:',
    options: [
      { id: 'q51o1', text: 'var x = 5;', isCorrect: true, index: 1 },
      { id: 'q51o2', text: '5 = x;', isCorrect: false, index: 2 },
      { id: 'q51o3', text: 'variable x;', isCorrect: false, index: 3 },
    ],
    explanation: 'var, let, or const are used to declare variables in JavaScript.',
    difficulty: 1,
  },

  {
    id: 'q52',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Identify the data type',
    description: 'What is the data type of the value 42?',
    codeBlock: 'const value = 42;',
    options: [
      { id: 'q52o1', text: 'string', isCorrect: false, index: 1 },
      { id: 'q52o2', text: 'number', isCorrect: true, index: 2 },
      { id: 'q52o3', text: 'boolean', isCorrect: false, index: 3 },
    ],
    explanation: '42 is a numeric value, so its type is "number".',
    difficulty: 1,
  },

  {
    id: 'q53',
    type: 'PREDICT_OUTPUT',
    instruction: 'What will this print?',
    description: 'Analyze the code and predict the output.',
    codeBlock: 'console.log(typeof "hello");',
    options: [
      { id: 'q53o1', text: '"hello"', isCorrect: false, index: 1 },
      { id: 'q53o2', text: '"string"', isCorrect: true, index: 2 },
      { id: 'q53o3', text: 'string', isCorrect: false, index: 3 },
    ],
    explanation: 'The typeof operator returns "string" for string values.',
    difficulty: 1,
  },

  {
    id: 'q54',
    type: 'DEBUG_HUNT',
    instruction: 'Fix the variable error',
    description: 'Find the bug in this variable declaration.',
    codeSegments: [
      { id: 'q54_1', code: 'let ', isBug: false, correction: null, index: 0 },
      { id: 'q54_2', code: '123name', isBug: true, correction: 'name123', index: 1 },
      { id: 'q54_3', code: ' = "Alice";', isBug: false, correction: null, index: 2 },
    ],
    explanation: 'Variable names cannot start with a number.',
    difficulty: 1,
  },

  {
    id: 'q55',
    type: 'FILL_BLANK',
    instruction: 'Complete the statement',
    description: 'Fill in the correct data type keyword.',
    codeBefore: 'The value "true" is of type ',
    codeAfter: '',
    options: [
      { id: 'q55o1', text: 'boolean', isCorrect: true, index: 1 },
      { id: 'q55o2', text: 'string', isCorrect: false, index: 2 },
      { id: 'q55o3', text: 'object', isCorrect: false, index: 3 },
    ],
    explanation: 'true and false are boolean values in JavaScript.',
    difficulty: 1,
  },

  {
    id: 'q56',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Select the correct reassignment',
    description: 'How do you change a variable\'s value?',
    codeBlock: 'let x = 5;\n________',
    options: [
      { id: 'q56o1', text: 'x == 10;', isCorrect: false, index: 1 },
      { id: 'q56o2', text: 'x = 10;', isCorrect: true, index: 2 },
      { id: 'q56o3', text: 'let x = 10;', isCorrect: false, index: 3 },
    ],
    explanation: 'Use = (assignment) to change a variable value, not == (comparison).',
    difficulty: 1,
  },

  {
    id: 'q57',
    type: 'PREDICT_OUTPUT',
    instruction: 'What is the output?',
    description: 'Predict the console output.',
    codeBlock: 'let a = "5";\nlet b = 5;\nconsole.log(a + b);',
    options: [
      { id: 'q57o1', text: '10', isCorrect: false, index: 1 },
      { id: 'q57o2', text: '"55"', isCorrect: true, index: 2 },
      { id: 'q57o3', text: '"10"', isCorrect: false, index: 3 },
    ],
    explanation: 'Adding a string to a number concatenates them as a string.',
    difficulty: 1,
  },

  {
    id: 'q58',
    type: 'REORDER',
    instruction: 'Order the statements',
    description: 'Arrange to declare, initialize, and use a variable.',
    items: [
      { id: 'var-1', text: 'const message = "Hello";', index: 1 },
      { id: 'var-2', text: 'console.log(message);', index: 2 },
    ],
    correctOrder: [1, 2],
    explanation: 'You must declare and initialize before using a variable.',
    difficulty: 1,
  },

  {
    id: 'q59',
    type: 'LOGIC_PUZZLE',
    instruction: 'Find the correct value',
    description: 'Which value is a valid number?',
    logicCondition: 'typeof x === "number"',
    options: [
      { id: 'q59o1', text: '"42"', isCorrect: false, index: 1 },
      { id: 'q59o2', text: '42', isCorrect: true, index: 2 },
      { id: 'q59o3', text: 'null', isCorrect: false, index: 3 },
    ],
    explanation: '42 without quotes is a number; "42" with quotes is a string.',
    difficulty: 1,
  },

  {
    id: 'q60',
    type: 'MATCH_MADNESS',
    instruction: 'Match values to their types',
    description: 'Match each value with its correct data type.',
    pairs: [
      { text: '42', matchId: 'number', index: 1 },
      { text: '"hello"', matchId: 'string', index: 2 },
      { text: 'true', matchId: 'boolean', index: 3 },
      { text: 'number', matchId: '42', index: 4 },
      { text: 'string', matchId: '"hello"', index: 5 },
      { text: 'boolean', matchId: 'true', index: 6 },
    ],
    explanation: 'Match each value to its corresponding data type.',
    difficulty: 1,
  },

  // ===== CHAPTER 2 SPECIFIC QUESTIONS (Control Flow, Loops, Logic) =====
  // q61-q85: If/Else, Loops, Boolean Logic
  {
    id: 'q61',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Complete the if statement',
    description: 'Which condition checks if a number is greater than 10?',
    codeBlock: 'if (________) {',
    options: [
      { id: 'q61o1', text: 'num > 10', isCorrect: true, index: 1 },
      { id: 'q61o2', text: 'num < 10', isCorrect: false, index: 2 },
      { id: 'q61o3', text: 'num = 10', isCorrect: false, index: 3 },
    ],
    explanation: 'Use > for "greater than" comparisons.',
    difficulty: 1,
  },

  {
    id: 'q62',
    type: 'PREDICT_OUTPUT',
    instruction: 'What does this output?',
    description: 'Predict the console output.',
    codeBlock: 'let x = 15;\nif (x > 10) {\n  console.log("big");\n} else {\n  console.log("small");\n}',
    options: [
      { id: 'q62o1', text: '"small"', isCorrect: false, index: 1 },
      { id: 'q62o2', text: '"big"', isCorrect: true, index: 2 },
      { id: 'q62o3', text: 'Error', isCorrect: false, index: 3 },
    ],
    explanation: '15 > 10 is true, so "big" is printed.',
    difficulty: 1,
  },

  {
    id: 'q63',
    type: 'DEBUG_HUNT',
    instruction: 'Fix the logic error',
    description: 'This condition has the wrong operator.',
    codeSegments: [
      { id: 'q63_1', code: 'if (age ', isBug: false, correction: null, index: 0 },
      { id: 'q63_2', code: '> ', isBug: true, correction: '>=', index: 1 },
      { id: 'q63_3', code: '18)', isBug: false, correction: null, index: 2 },
    ],
    explanation: 'Use >= to include 18; > excludes it.',
    difficulty: 1,
  },

  {
    id: 'q64',
    type: 'FILL_BLANK',
    instruction: 'Complete the else if',
    description: 'Fill in the keyword for additional conditions.',
    codeBefore: 'if (x > 10) {\n  console.log("high");\n} ',
    codeAfter: ' (x < 5) {\n  console.log("low");\n}',
    options: [
      { id: 'q64o1', text: 'else if', isCorrect: true, index: 1 },
      { id: 'q64o2', text: 'if', isCorrect: false, index: 2 },
      { id: 'q64o3', text: 'else', isCorrect: false, index: 3 },
    ],
    explanation: 'Use else if for additional conditions after the first if.',
    difficulty: 1,
  },

  {
    id: 'q65',
    type: 'REORDER',
    instruction: 'Order the loop correctly',
    description: 'Arrange the for loop components in order.',
    items: [
      { id: 'loop-a', text: 'for (let i = 0; i < 3; i++) {', index: 1 },
      { id: 'loop-b', text: '  console.log(i);', index: 2 },
      { id: 'loop-c', text: '}', index: 3 },
    ],
    correctOrder: [1, 2, 3],
    explanation: 'The for loop structure: declaration, condition, increment, body.',
    difficulty: 1,
  },

  {
    id: 'q66',
    type: 'LOGIC_PUZZLE',
    instruction: 'How many times will this loop run?',
    description: 'Count the iterations.',
    logicCondition: 'for (let i = 0; i < 5; i++)',
    options: [
      { id: 'q66o1', text: '4 times', isCorrect: false, index: 1 },
      { id: 'q66o2', text: '5 times', isCorrect: true, index: 2 },
      { id: 'q66o3', text: '6 times', isCorrect: false, index: 3 },
    ],
    explanation: 'i goes from 0 to 4 (5 values), so the loop runs 5 times.',
    difficulty: 1,
  },

  {
    id: 'q67',
    type: 'PREDICT_OUTPUT',
    instruction: 'What is the output?',
    description: 'Predict what this code prints.',
    codeBlock: 'for (let i = 1; i <= 3; i++) {\n  console.log(i);\n}',
    options: [
      { id: 'q67o1', text: '0, 1, 2', isCorrect: false, index: 1 },
      { id: 'q67o2', text: '1, 2, 3', isCorrect: true, index: 2 },
      { id: 'q67o3', text: '1, 2, 3, 4', isCorrect: false, index: 3 },
    ],
    explanation: 'i starts at 1, goes up to and includes 3.',
    difficulty: 1,
  },

  {
    id: 'q68',
    type: 'MULTIPLE_CHOICE',
    instruction: 'What does && mean?',
    description: 'Which statement describes the && operator?',
    codeBlock: 'Select the meaning of &&',
    options: [
      { id: 'q68o1', text: 'OR - either condition is true', isCorrect: false, index: 1 },
      { id: 'q68o2', text: 'AND - both conditions must be true', isCorrect: true, index: 2 },
      { id: 'q68o3', text: 'NOT - negates a condition', isCorrect: false, index: 3 },
    ],
    explanation: '&& is the AND operator; both conditions must be true.',
    difficulty: 1,
  },

  {
    id: 'q69',
    type: 'PREDICT_OUTPUT',
    instruction: 'Evaluate the boolean expression',
    description: 'What is the result?',
    codeBlock: 'console.log(true && false);',
    options: [
      { id: 'q69o1', text: 'true', isCorrect: false, index: 1 },
      { id: 'q69o2', text: 'false', isCorrect: true, index: 2 },
      { id: 'q69o3', text: 'undefined', isCorrect: false, index: 3 },
    ],
    explanation: 'true && false = false (both must be true for AND).',
    difficulty: 1,
  },

  {
    id: 'q70',
    type: 'MATCH_MADNESS',
    instruction: 'Match operators to their meanings',
    description: 'Match each operator to what it does.',
    pairs: [
      { text: '&&', matchId: 'AND - both true', index: 1 },
      { text: '||', matchId: 'OR - either true', index: 2 },
      { text: '!', matchId: 'NOT - negates', index: 3 },
      { text: 'AND - both true', matchId: '&&', index: 4 },
      { text: 'OR - either true', matchId: '||', index: 5 },
      { text: 'NOT - negates', matchId: '!', index: 6 },
    ],
    explanation: 'These are the three main logical operators.',
    difficulty: 1,
  },

  // ===== CHAPTER 3 SPECIFIC QUESTIONS (Functions, Parameters, Returns) =====
  // q71-q95: Functions, Scope, Recursion
  {
    id: 'q71',
    type: 'MULTIPLE_CHOICE',
    instruction: 'How do you declare a function?',
    description: 'Which is the correct function declaration syntax?',
    codeBlock: 'Select the correct function declaration:',
    options: [
      { id: 'q71o1', text: 'function myFunc() { }', isCorrect: true, index: 1 },
      { id: 'q71o2', text: 'func myFunc() { }', isCorrect: false, index: 2 },
      { id: 'q71o3', text: 'define myFunc() { }', isCorrect: false, index: 3 },
    ],
    explanation: 'Use the "function" keyword to declare a function.',
    difficulty: 1,
  },

  {
    id: 'q72',
    type: 'MULTIPLE_CHOICE',
    instruction: 'What does return do?',
    description: 'What is the purpose of the return statement?',
    codeBlock: 'function getValue() { return 42; }',
    options: [
      { id: 'q72o1', text: 'Stops the program', isCorrect: false, index: 1 },
      { id: 'q72o2', text: 'Sends a value back from the function', isCorrect: true, index: 2 },
      { id: 'q72o3', text: 'Prints to console', isCorrect: false, index: 3 },
    ],
    explanation: 'return sends the result back to where the function was called.',
    difficulty: 1,
  },

  {
    id: 'q73',
    type: 'PREDICT_OUTPUT',
    instruction: 'What will be logged?',
    description: 'Predict the output.',
    codeBlock: 'function add(a, b) { return a + b; }\nconsole.log(add(3, 5));',
    options: [
      { id: 'q73o1', text: '"3, 5"', isCorrect: false, index: 1 },
      { id: 'q73o2', text: '8', isCorrect: true, index: 2 },
      { id: 'q73o3', text: 'undefined', isCorrect: false, index: 3 },
    ],
    explanation: 'add(3, 5) returns 3 + 5 = 8.',
    difficulty: 1,
  },

  {
    id: 'q74',
    type: 'DEBUG_HUNT',
    instruction: 'Fix the function',
    description: 'This function is missing something.',
    codeSegments: [
      { id: 'q74_1', code: 'function greet(name) {', isBug: false, correction: null, index: 0 },
      { id: 'q74_2', code: '  console.log("Hi " + name);', isBug: false, correction: null, index: 1 },
      { id: 'q74_3', code: '}', isBug: true, correction: '// Missing return', index: 2 },
    ],
    explanation: 'The function works but doesn\'t return a value.',
    difficulty: 1,
  },

  {
    id: 'q75',
    type: 'FILL_BLANK',
    instruction: 'Complete the function call',
    description: 'Fill in the missing parameter.',
    codeBefore: 'function square(x) { return x * x; }\nlet result = square(',
    codeAfter: ');',
    options: [
      { id: 'q75o1', text: '5', isCorrect: true, index: 1 },
      { id: 'q75o2', text: 'return', isCorrect: false, index: 2 },
      { id: 'q75o3', text: 'x', isCorrect: false, index: 3 },
    ],
    explanation: 'Pass the argument 5 to the square function.',
    difficulty: 1,
  },

  {
    id: 'q76',
    type: 'REORDER',
    instruction: 'Order the function correctly',
    description: 'Arrange to create a complete function.',
    items: [
      { id: 'func-1', text: 'function multiply(a, b) {', index: 1 },
      { id: 'func-2', text: '  return a * b;', index: 2 },
      { id: 'func-3', text: '}', index: 3 },
    ],
    correctOrder: [1, 2, 3],
    explanation: 'Function structure: keyword, name/params, body, closing brace.',
    difficulty: 1,
  },

  {
    id: 'q77',
    type: 'LOGIC_PUZZLE',
    instruction: 'What will this function return?',
    description: 'Trace the execution.',
    logicCondition: 'function getValue() { return 10 * 2; } getValue();',
    options: [
      { id: 'q77o1', text: '10', isCorrect: false, index: 1 },
      { id: 'q77o2', text: '20', isCorrect: true, index: 2 },
      { id: 'q77o3', text: '100', isCorrect: false, index: 3 },
    ],
    explanation: '10 * 2 = 20.',
    difficulty: 1,
  },

  {
    id: 'q78',
    type: 'MULTIPLE_CHOICE',
    instruction: 'What is a parameter?',
    description: 'Which statement correctly describes parameters?',
    codeBlock: 'function greet(name) { ... }',
    options: [
      { id: 'q78o1', text: 'The value passed when calling the function', isCorrect: false, index: 1 },
      { id: 'q78o2', text: 'The variable in the function definition', isCorrect: true, index: 2 },
      { id: 'q78o3', text: 'The return value', isCorrect: false, index: 3 },
    ],
    explanation: 'Parameters are variables in the function definition; arguments are values passed.',
    difficulty: 1,
  },

  {
    id: 'q79',
    type: 'PREDICT_OUTPUT',
    instruction: 'What is the scope issue?',
    description: 'Where can the variable be accessed?',
    codeBlock: 'function myFunc() { let x = 5; } console.log(x);',
    options: [
      { id: 'q79o1', text: '5', isCorrect: false, index: 1 },
      { id: 'q79o2', text: 'Error - x is not defined', isCorrect: true, index: 2 },
      { id: 'q79o3', text: 'undefined', isCorrect: false, index: 3 },
    ],
    explanation: 'let x is local to the function; it\'s not accessible outside.',
    difficulty: 2,
  },

  {
    id: 'q80',
    type: 'MATCH_MADNESS',
    instruction: 'Match function concepts',
    description: 'Match terms with definitions.',
    pairs: [
      { text: 'Parameter', matchId: 'Variable in function definition', index: 1 },
      { text: 'Argument', matchId: 'Value passed to function', index: 2 },
      { text: 'Return', matchId: 'Send value back', index: 3 },
      { text: 'Variable in function definition', matchId: 'Parameter', index: 4 },
      { text: 'Value passed to function', matchId: 'Argument', index: 5 },
      { text: 'Send value back', matchId: 'Return', index: 6 },
    ],
    explanation: 'These are key function terminology.',
    difficulty: 1,
  },

  // ===== PYTHON CHAPTER 1: Variables, Data Types, Operations (q81-q90) =====
  {
    id: 'q81',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Python variable declaration',
    description: 'How do you declare a variable in Python?',
    codeBlock: '',
    options: [
      { id: 'q81o1', text: 'var age = 25;', isCorrect: false, index: 1 },
      { id: 'q81o2', text: 'age = 25', isCorrect: true, index: 2 },
      { id: 'q81o3', text: 'int age = 25;', isCorrect: false, index: 3 },
    ],
    explanation: 'Python variables are declared by assignment without type keyword.',
    difficulty: 1,
  },

  {
    id: 'q82',
    type: 'PREDICT_OUTPUT',
    instruction: 'Python string concatenation',
    description: 'What does this print?',
    codeBlock: 'name = "Alice"\nage = 25\nprint(name + str(age))',
    options: [
      { id: 'q82o1', text: 'Alice25', isCorrect: true, index: 1 },
      { id: 'q82o2', text: 'Alice 25', isCorrect: false, index: 2 },
      { id: 'q82o3', text: 'Error', isCorrect: false, index: 3 },
    ],
    explanation: 'str() converts integer to string for concatenation.',
    difficulty: 1,
  },

  {
    id: 'q83',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Python data type check',
    description: 'What type is the value 3.14?',
    codeBlock: '',
    options: [
      { id: 'q83o1', text: 'int', isCorrect: false, index: 1 },
      { id: 'q83o2', text: 'float', isCorrect: true, index: 2 },
      { id: 'q83o3', text: 'decimal', isCorrect: false, index: 3 },
    ],
    explanation: 'Numbers with decimal points are float type in Python.',
    difficulty: 1,
  },

  {
    id: 'q84',
    type: 'FILL_BLANK',
    instruction: 'Python type conversion',
    description: 'Convert string to integer.',
    codeBefore: 'num = ',
    codeAfter: '("42")',
    options: [
      { id: 'q84o1', text: 'int', isCorrect: true, index: 1 },
      { id: 'q84o2', text: 'float', isCorrect: false, index: 2 },
      { id: 'q84o3', text: 'str', isCorrect: false, index: 3 },
    ],
    explanation: 'int() converts strings to integers.',
    difficulty: 1,
  },

  {
    id: 'q85',
    type: 'PREDICT_OUTPUT',
    instruction: 'Python arithmetic',
    description: 'What is the result?',
    codeBlock: 'print(10 // 3)\nprint(10 % 3)',
    options: [
      { id: 'q85o1', text: '3\n1', isCorrect: true, index: 1 },
      { id: 'q85o2', text: '3.33\n1', isCorrect: false, index: 2 },
      { id: 'q85o3', text: '3\n0.33', isCorrect: false, index: 3 },
    ],
    explanation: '// is floor division, % is modulo (remainder).',
    difficulty: 2,
  },

  {
    id: 'q86',
    type: 'DEBUG_HUNT',
    instruction: 'Fix the Python variable error',
    description: 'Find the bug in this code.',
    codeSegments: [
      { id: 'cs86_1', code: 'x = 5', isBug: false, correction: null, index: 0 },
      { id: 'cs86_2', code: '\ny = "10"', isBug: false, correction: null, index: 1 },
      { id: 'cs86_3', code: '\nprint(x + y)', isBug: true, correction: 'print(x + int(y))', index: 2 },
    ],
    explanation: 'Cannot add int and string directly. Need to convert string to int.',
    difficulty: 1,
  },

  {
    id: 'q87',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Python boolean values',
    description: 'Which is correct boolean in Python?',
    codeBlock: '',
    options: [
      { id: 'q87o1', text: 'true', isCorrect: false, index: 1 },
      { id: 'q87o2', text: 'True', isCorrect: true, index: 2 },
      { id: 'q87o3', text: 'TRUE', isCorrect: false, index: 3 },
    ],
    explanation: 'Python uses True and False (capitalized).',
    difficulty: 1,
  },

  {
    id: 'q88',
    type: 'FILL_BLANK',
    instruction: 'Python f-string formatting',
    description: 'Format a variable into a string.',
    codeBefore: 'name = "Bob"\nprint(',
    codeAfter: '"Hello {name}")',
    options: [
      { id: 'q88o1', text: 'f', isCorrect: true, index: 1 },
      { id: 'q88o2', text: 'r', isCorrect: false, index: 2 },
      { id: 'q88o3', text: 's', isCorrect: false, index: 3 },
    ],
    explanation: 'f-strings use f prefix for variable interpolation.',
    difficulty: 1,
  },

  {
    id: 'q89',
    type: 'REORDER',
    instruction: 'Order Python statements',
    description: 'Arrange to get correct output.',
    items: [
      { id: 'py89_1', text: 'x = 10', index: 1 },
      { id: 'py89_2', text: 'y = 20', index: 2 },
      { id: 'py89_3', text: 'print(x + y)', index: 3 },
    ],
    correctOrder: [1, 2, 3],
    explanation: 'Variables must be declared before use.',
    difficulty: 1,
  },

  {
    id: 'q90',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Python variable naming',
    description: 'Which is a valid variable name?',
    codeBlock: '',
    options: [
      { id: 'q90o1', text: '2name', isCorrect: false, index: 1 },
      { id: 'q90o2', text: 'my_name', isCorrect: true, index: 2 },
      { id: 'q90o3', text: 'my-name', isCorrect: false, index: 3 },
    ],
    explanation: 'Variables must start with letter or underscore, not number.',
    difficulty: 1,
  },

  // ===== PYTHON CHAPTER 2: Control Flow & Logic (q91-q100) =====
  {
    id: 'q91',
    type: 'PREDICT_OUTPUT',
    instruction: 'Python if statement',
    description: 'What is printed?',
    codeBlock: 'x = 15\nif x > 10:\n    print("Greater")\nelse:\n    print("Less")',
    options: [
      { id: 'q91o1', text: 'Greater', isCorrect: true, index: 1 },
      { id: 'q91o2', text: 'Less', isCorrect: false, index: 2 },
      { id: 'q91o3', text: 'Error', isCorrect: false, index: 3 },
    ],
    explanation: '15 is greater than 10, so "Greater" is printed.',
    difficulty: 1,
  },

  {
    id: 'q92',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Python elif usage',
    description: 'What does elif mean?',
    codeBlock: '',
    options: [
      { id: 'q92o1', text: 'else if', isCorrect: true, index: 1 },
      { id: 'q92o2', text: 'else loop', isCorrect: false, index: 2 },
      { id: 'q92o3', text: 'else for', isCorrect: false, index: 3 },
    ],
    explanation: 'elif is short for "else if" in Python.',
    difficulty: 1,
  },

  {
    id: 'q93',
    type: 'PREDICT_OUTPUT',
    instruction: 'Python for loop',
    description: 'What does this print?',
    codeBlock: 'for i in range(3):\n    print(i)',
    options: [
      { id: 'q93o1', text: '0\n1\n2', isCorrect: true, index: 1 },
      { id: 'q93o2', text: '1\n2\n3', isCorrect: false, index: 2 },
      { id: 'q93o3', text: '0\n1\n2\n3', isCorrect: false, index: 3 },
    ],
    explanation: 'range(3) produces 0, 1, 2 (not including 3).',
    difficulty: 1,
  },

  {
    id: 'q94',
    type: 'FILL_BLANK',
    instruction: 'Python while loop',
    description: 'Complete the loop.',
    codeBefore: 'x = 0\nwhile x < 5:',
    codeAfter: '\n    x += 1',
    options: [
      { id: 'q94o1', text: 'pass', isCorrect: false, index: 1 },
      { id: 'q94o2', text: 'print(x)', isCorrect: true, index: 2 },
      { id: 'q94o3', text: 'break', isCorrect: false, index: 3 },
    ],
    explanation: 'The body should print x in a while loop.',
    difficulty: 1,
  },

  {
    id: 'q95',
    type: 'PREDICT_OUTPUT',
    instruction: 'Python break statement',
    description: 'What is printed?',
    codeBlock: 'for i in range(5):\n    if i == 3:\n        break\n    print(i)',
    options: [
      { id: 'q95o1', text: '0\n1\n2', isCorrect: true, index: 1 },
      { id: 'q95o2', text: '0\n1\n2\n3', isCorrect: false, index: 2 },
      { id: 'q95o3', text: '3\n4', isCorrect: false, index: 3 },
    ],
    explanation: 'break exits the loop when i == 3.',
    difficulty: 1,
  },

  {
    id: 'q96',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Python comparison operator',
    description: 'What does != mean?',
    codeBlock: '',
    options: [
      { id: 'q96o1', text: 'greater than', isCorrect: false, index: 1 },
      { id: 'q96o2', text: 'not equal', isCorrect: true, index: 2 },
      { id: 'q96o3', text: 'not greater', isCorrect: false, index: 3 },
    ],
    explanation: '!= is the "not equal to" comparison operator.',
    difficulty: 1,
  },

  {
    id: 'q97',
    type: 'DEBUG_HUNT',
    instruction: 'Fix indentation error',
    description: 'Find the Python indentation bug.',
    codeSegments: [
      { id: 'cs97_1', code: 'if x > 5:', isBug: false, correction: null, index: 0 },
      { id: 'cs97_2', code: '\nprint("Yes")', isBug: true, correction: '    print("Yes")', index: 1 },
    ],
    explanation: 'Python requires indentation for code blocks.',
    difficulty: 1,
  },

  {
    id: 'q98',
    type: 'PREDICT_OUTPUT',
    instruction: 'Python logical operators',
    description: 'What is printed?',
    codeBlock: 'x = 5\ny = 10\nif x < 10 and y > 5:\n    print("Both true")',
    options: [
      { id: 'q98o1', text: 'Both true', isCorrect: true, index: 1 },
      { id: 'q98o2', text: 'Nothing', isCorrect: false, index: 2 },
      { id: 'q98o3', text: 'Error', isCorrect: false, index: 3 },
    ],
    explanation: 'Both conditions are true, so "Both true" prints.',
    difficulty: 1,
  },

  {
    id: 'q99',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Python logical NOT',
    description: 'What does "not True" return?',
    codeBlock: '',
    options: [
      { id: 'q99o1', text: 'True', isCorrect: false, index: 1 },
      { id: 'q99o2', text: 'False', isCorrect: true, index: 2 },
      { id: 'q99o3', text: 'None', isCorrect: false, index: 3 },
    ],
    explanation: '"not True" inverts the boolean to False.',
    difficulty: 1,
  },

  {
    id: 'q100',
    type: 'REORDER',
    instruction: 'Order if-elif-else',
    description: 'Arrange in correct order.',
    items: [
      { id: 'py100_1', text: 'if x < 0:', index: 1 },
      { id: 'py100_2', text: '    print("Negative")', index: 2 },
      { id: 'py100_3', text: 'elif x == 0:', index: 3 },
      { id: 'py100_4', text: '    print("Zero")', index: 4 },
      { id: 'py100_5', text: 'else:', index: 5 },
      { id: 'py100_6', text: '    print("Positive")', index: 6 },
    ],
    correctOrder: [1, 2, 3, 4, 5, 6],
    explanation: 'if-elif-else structure checks conditions in order.',
    difficulty: 1,
  },

  // ===== PYTHON CHAPTER 3: Functions & Parameters (q101-q110) =====
  {
    id: 'q101',
    type: 'PREDICT_OUTPUT',
    instruction: 'Python function definition',
    description: 'What is printed?',
    codeBlock: 'def greet(name):\n    return "Hello " + name\nprint(greet("Alice"))',
    options: [
      { id: 'q101o1', text: 'Hello Alice', isCorrect: true, index: 1 },
      { id: 'q101o2', text: 'Hello', isCorrect: false, index: 2 },
      { id: 'q101o3', text: 'Error', isCorrect: false, index: 3 },
    ],
    explanation: 'The function returns and prints the greeting string.',
    difficulty: 1,
  },

  {
    id: 'q102',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Python function parameters',
    description: 'What is a parameter?',
    codeBlock: '',
    options: [
      { id: 'q102o1', text: 'Value passed to function', isCorrect: false, index: 1 },
      { id: 'q102o2', text: 'Variable in function definition', isCorrect: true, index: 2 },
      { id: 'q102o3', text: 'Function name', isCorrect: false, index: 3 },
    ],
    explanation: 'Parameters are variables defined in the function definition.',
    difficulty: 1,
  },

  {
    id: 'q103',
    type: 'PREDICT_OUTPUT',
    instruction: 'Python function with multiple parameters',
    description: 'What is printed?',
    codeBlock: 'def add(a, b):\n    return a + b\nprint(add(3, 5))',
    options: [
      { id: 'q103o1', text: '8', isCorrect: true, index: 1 },
      { id: 'q103o2', text: '35', isCorrect: false, index: 2 },
      { id: 'q103o3', text: 'Error', isCorrect: false, index: 3 },
    ],
    explanation: 'add(3, 5) returns 3 + 5 = 8.',
    difficulty: 1,
  },

  {
    id: 'q104',
    type: 'FILL_BLANK',
    instruction: 'Python default parameters',
    description: 'Add a default value.',
    codeBefore: 'def greet(name',
    codeAfter: '):\n    return "Hello " + name',
    options: [
      { id: 'q104o1', text: '="World"', isCorrect: true, index: 1 },
      { id: 'q104o2', text: ':="World"', isCorrect: false, index: 2 },
      { id: 'q104o3', text: '= "World', isCorrect: false, index: 3 },
    ],
    explanation: 'Default parameters use = syntax.',
    difficulty: 1,
  },

  {
    id: 'q105',
    type: 'PREDICT_OUTPUT',
    instruction: 'Python return value',
    description: 'What does this return?',
    codeBlock: 'def square(x):\n    return x * x\nresult = square(4)\nprint(result)',
    options: [
      { id: 'q105o1', text: '16', isCorrect: true, index: 1 },
      { id: 'q105o2', text: '8', isCorrect: false, index: 2 },
      { id: 'q105o3', text: 'None', isCorrect: false, index: 3 },
    ],
    explanation: 'square(4) returns 16, stored in result.',
    difficulty: 1,
  },

  {
    id: 'q106',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Python void function',
    description: 'What does a function return if no return statement?',
    codeBlock: '',
    options: [
      { id: 'q106o1', text: 'Error', isCorrect: false, index: 1 },
      { id: 'q106o2', text: 'None', isCorrect: true, index: 2 },
      { id: 'q106o3', text: 'null', isCorrect: false, index: 3 },
    ],
    explanation: 'Python functions without return statement return None.',
    difficulty: 1,
  },

  {
    id: 'q107',
    type: 'DEBUG_HUNT',
    instruction: 'Fix function error',
    description: 'Find the bug in this function.',
    codeSegments: [
      { id: 'cs107_1', code: 'def multiply(a, b)', isBug: true, correction: 'def multiply(a, b):', index: 0 },
      { id: 'cs107_2', code: '\n    return a * b', isBug: false, correction: null, index: 1 },
    ],
    explanation: 'Function definition needs a colon (:) at the end.',
    difficulty: 1,
  },

  {
    id: 'q108',
    type: 'PREDICT_OUTPUT',
    instruction: 'Python function scope',
    description: 'What is printed?',
    codeBlock: 'def test():\n    x = 10\n    return x\nprint(test())',
    options: [
      { id: 'q108o1', text: '10', isCorrect: true, index: 1 },
      { id: 'q108o2', text: 'None', isCorrect: false, index: 2 },
      { id: 'q108o3', text: 'Error', isCorrect: false, index: 3 },
    ],
    explanation: 'The function returns 10.',
    difficulty: 1,
  },

  {
    id: 'q109',
    type: 'MULTIPLE_CHOICE',
    instruction: 'Python *args usage',
    description: 'What does *args allow?',
    codeBlock: '',
    options: [
      { id: 'q109o1', text: 'Unlimited keyword arguments', isCorrect: false, index: 1 },
      { id: 'q109o2', text: 'Unlimited positional arguments', isCorrect: true, index: 2 },
      { id: 'q109o3', text: 'Pointer arguments', isCorrect: false, index: 3 },
    ],
    explanation: '*args allows functions to accept any number of positional arguments.',
    difficulty: 2,
  },

  {
    id: 'q110',
    type: 'REORDER',
    instruction: 'Order function code',
    description: 'Arrange to create a working function.',
    items: [
      { id: 'py110_1', text: 'def power(base, exp):', index: 1 },
      { id: 'py110_2', text: '    result = base ** exp', index: 2 },
      { id: 'py110_3', text: '    return result', index: 3 },
      { id: 'py110_4', text: 'print(power(2, 3))', index: 4 },
    ],
    correctOrder: [1, 2, 3, 4],
    explanation: 'Function definition comes before function call.',
    difficulty: 1,
  },
];

// JavaScript-specific questions - for now use the same questions but can be extended
const JS_LESSON_QUESTIONS = LESSON_QUESTIONS;

// Helper function to create chapter structure for a language (no loops, unique content)
async function createChapterStructure(languageId: string, languageName: string, questionArray: any[] = LESSON_QUESTIONS) {
  console.log(`\n📚 Creating chapter structure for ${languageName} (no loops, unique lessons/questions)...`);

  let totalQuestionsCreated = 0;

  // -------------------- Chapter 1 --------------------
  const chapter1 = await prisma.chapter.create({
    data: {
      title: `Chapter 1: ${getChapterTitle(1)}`,
      levelIndex: 1,
      languageId,
    },
  });

  // Units for Chapter 1
  const ch1_unit1 = await prisma.unit.create({
    data: { title: 'Unit 1: Intro to Variables', unitIndex: 1, chapterId: chapter1.id },
  });
  const ch1_unit2 = await prisma.unit.create({
    data: { title: 'Unit 2: Data Types & Strings', unitIndex: 2, chapterId: chapter1.id },
  });
  const ch1_unit3 = await prisma.unit.create({
    data: { title: 'Unit 3: Basic Operations', unitIndex: 3, chapterId: chapter1.id },
  });

  // Lessons for Chapter 1 (unique titles) - 5-6 per unit
  await prisma.lesson.create({
    data: {
      title: 'Variables Basics',
      lessonIndex: 1,
      unitId: ch1_unit1.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'EASY',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Variable Scope',
      lessonIndex: 2,
      unitId: ch1_unit1.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'EASY',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Naming Conventions',
      lessonIndex: 3,
      unitId: ch1_unit1.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'EASY',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Constants & Mutability',
      lessonIndex: 4,
      unitId: ch1_unit1.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'EASY',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Assignment Patterns',
      lessonIndex: 5,
      unitId: ch1_unit1.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'EASY',
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Type Conversion',
      lessonIndex: 1,
      unitId: ch1_unit2.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'EASY',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'String Methods',
      lessonIndex: 2,
      unitId: ch1_unit2.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'EASY',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Numbers & Math',
      lessonIndex: 3,
      unitId: ch1_unit2.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'EASY',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Boolean Values',
      lessonIndex: 4,
      unitId: ch1_unit2.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'EASY',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Template Strings',
      lessonIndex: 5,
      unitId: ch1_unit2.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'EASY',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Type Checking',
      lessonIndex: 6,
      unitId: ch1_unit2.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'EASY',
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Operators 101',
      lessonIndex: 1,
      unitId: ch1_unit3.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'EASY',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Arithmetic Operations',
      lessonIndex: 2,
      unitId: ch1_unit3.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'EASY',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Comparison Operators',
      lessonIndex: 3,
      unitId: ch1_unit3.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'EASY',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Logical Operations',
      lessonIndex: 4,
      unitId: ch1_unit3.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'EASY',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Expressions Practice',
      lessonIndex: 5,
      unitId: ch1_unit3.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'EASY',
    },
  });

  // Questions for Chapter 1 (Variables, Data Types, Operations)
  await prisma.question.create({ data: { ...createQuestionData(questionArray[50]), languageId, chapterId: chapter1.id } }); // q51
  await prisma.question.create({ data: { ...createQuestionData(questionArray[51]), languageId, chapterId: chapter1.id } }); // q52
  await prisma.question.create({ data: { ...createQuestionData(questionArray[52]), languageId, chapterId: chapter1.id } }); // q53
  await prisma.question.create({ data: { ...createQuestionData(questionArray[53]), languageId, chapterId: chapter1.id } }); // q54
  await prisma.question.create({ data: { ...createQuestionData(questionArray[54]), languageId, chapterId: chapter1.id } }); // q55
  await prisma.question.create({ data: { ...createQuestionData(questionArray[55]), languageId, chapterId: chapter1.id } }); // q56
  await prisma.question.create({ data: { ...createQuestionData(questionArray[56]), languageId, chapterId: chapter1.id } }); // q57
  await prisma.question.create({ data: { ...createQuestionData(questionArray[57]), languageId, chapterId: chapter1.id } }); // q58
  await prisma.question.create({ data: { ...createQuestionData(questionArray[58]), languageId, chapterId: chapter1.id } }); // q59
  await prisma.question.create({ data: { ...createQuestionData(questionArray[59]), languageId, chapterId: chapter1.id } }); // q60
  // Language specific Chapter 1 questions (q81-q90)
  await prisma.question.create({ data: { ...createQuestionData(questionArray[80]), languageId, chapterId: chapter1.id } }); // q81
  await prisma.question.create({ data: { ...createQuestionData(questionArray[81]), languageId, chapterId: chapter1.id } }); // q82
  await prisma.question.create({ data: { ...createQuestionData(questionArray[82]), languageId, chapterId: chapter1.id } }); // q83
  await prisma.question.create({ data: { ...createQuestionData(questionArray[83]), languageId, chapterId: chapter1.id } }); // q84
  await prisma.question.create({ data: { ...createQuestionData(questionArray[84]), languageId, chapterId: chapter1.id } }); // q85
  await prisma.question.create({ data: { ...createQuestionData(questionArray[85]), languageId, chapterId: chapter1.id } }); // q86
  await prisma.question.create({ data: { ...createQuestionData(questionArray[86]), languageId, chapterId: chapter1.id } }); // q87
  await prisma.question.create({ data: { ...createQuestionData(questionArray[87]), languageId, chapterId: chapter1.id } }); // q88
  await prisma.question.create({ data: { ...createQuestionData(questionArray[88]), languageId, chapterId: chapter1.id } }); // q89
  await prisma.question.create({ data: { ...createQuestionData(questionArray[89]), languageId, chapterId: chapter1.id } }); // q90
  totalQuestionsCreated += 30;
  console.log(`  ✓ Chapter 1: ${chapter1.title} (3 units, 16 lessons, 30 questions on Variables & Data Types)`);

  // -------------------- Chapter 2 --------------------
  const chapter2 = await prisma.chapter.create({
    data: {
      title: `Chapter 2: ${getChapterTitle(2)}`,
      levelIndex: 2,
      languageId,
    },
  });

  const ch2_unit1 = await prisma.unit.create({
    data: { title: 'Unit 1: If/Else Foundations', unitIndex: 1, chapterId: chapter2.id },
  });
  const ch2_unit2 = await prisma.unit.create({
    data: { title: 'Unit 2: Looping Patterns', unitIndex: 2, chapterId: chapter2.id },
  });
  const ch2_unit3 = await prisma.unit.create({
    data: { title: 'Unit 3: Boolean Logic', unitIndex: 3, chapterId: chapter2.id },
  });

  await prisma.lesson.create({
    data: {
      title: 'Branching Basics',
      lessonIndex: 1,
      unitId: ch2_unit1.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'MEDIUM',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'If/Else Chains',
      lessonIndex: 2,
      unitId: ch2_unit1.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'MEDIUM',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Nested Conditions',
      lessonIndex: 3,
      unitId: ch2_unit1.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'MEDIUM',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Ternary Operator',
      lessonIndex: 4,
      unitId: ch2_unit1.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'MEDIUM',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Switch Statements',
      lessonIndex: 5,
      unitId: ch2_unit1.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'MEDIUM',
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'For Loops',
      lessonIndex: 1,
      unitId: ch2_unit2.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'MEDIUM',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'While Loops',
      lessonIndex: 2,
      unitId: ch2_unit2.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'MEDIUM',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Do-While Loops',
      lessonIndex: 3,
      unitId: ch2_unit2.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'MEDIUM',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Break & Continue',
      lessonIndex: 4,
      unitId: ch2_unit2.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'MEDIUM',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Nested Loops',
      lessonIndex: 5,
      unitId: ch2_unit2.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'MEDIUM',
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Truth Tables',
      lessonIndex: 1,
      unitId: ch2_unit3.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'MEDIUM',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'AND/OR/NOT',
      lessonIndex: 2,
      unitId: ch2_unit3.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'MEDIUM',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'De Morgan Logic',
      lessonIndex: 3,
      unitId: ch2_unit3.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'MEDIUM',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Logic Puzzles',
      lessonIndex: 4,
      unitId: ch2_unit3.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'MEDIUM',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Operator Precedence',
      lessonIndex: 5,
      unitId: ch2_unit3.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'MEDIUM',
    },
  });

  // Questions for Chapter 2 (Control Flow, Loops, Boolean Logic)
  await prisma.question.create({ data: { ...createQuestionData(questionArray[60]), languageId, chapterId: chapter2.id } }); // q61
  await prisma.question.create({ data: { ...createQuestionData(questionArray[61]), languageId, chapterId: chapter2.id } }); // q62
  await prisma.question.create({ data: { ...createQuestionData(questionArray[62]), languageId, chapterId: chapter2.id } }); // q63
  await prisma.question.create({ data: { ...createQuestionData(questionArray[63]), languageId, chapterId: chapter2.id } }); // q64
  await prisma.question.create({ data: { ...createQuestionData(questionArray[64]), languageId, chapterId: chapter2.id } }); // q65
  await prisma.question.create({ data: { ...createQuestionData(questionArray[65]), languageId, chapterId: chapter2.id } }); // q66
  await prisma.question.create({ data: { ...createQuestionData(questionArray[66]), languageId, chapterId: chapter2.id } }); // q67
  await prisma.question.create({ data: { ...createQuestionData(questionArray[67]), languageId, chapterId: chapter2.id } }); // q68
  await prisma.question.create({ data: { ...createQuestionData(questionArray[68]), languageId, chapterId: chapter2.id } }); // q69
  await prisma.question.create({ data: { ...createQuestionData(questionArray[69]), languageId, chapterId: chapter2.id } }); // q70
  // Language specific Chapter 2 questions (q91-q100)
  await prisma.question.create({ data: { ...createQuestionData(questionArray[90]), languageId, chapterId: chapter2.id } }); // q91
  await prisma.question.create({ data: { ...createQuestionData(questionArray[91]), languageId, chapterId: chapter2.id } }); // q92
  await prisma.question.create({ data: { ...createQuestionData(questionArray[92]), languageId, chapterId: chapter2.id } }); // q93
  await prisma.question.create({ data: { ...createQuestionData(questionArray[93]), languageId, chapterId: chapter2.id } }); // q94
  await prisma.question.create({ data: { ...createQuestionData(questionArray[94]), languageId, chapterId: chapter2.id } }); // q95
  await prisma.question.create({ data: { ...createQuestionData(questionArray[95]), languageId, chapterId: chapter2.id } }); // q96
  await prisma.question.create({ data: { ...createQuestionData(questionArray[96]), languageId, chapterId: chapter2.id } }); // q97
  await prisma.question.create({ data: { ...createQuestionData(questionArray[97]), languageId, chapterId: chapter2.id } }); // q98
  await prisma.question.create({ data: { ...createQuestionData(questionArray[98]), languageId, chapterId: chapter2.id } }); // q99
  await prisma.question.create({ data: { ...createQuestionData(questionArray[99]), languageId, chapterId: chapter2.id } }); // q100
  totalQuestionsCreated += 30;
  console.log(`  ✓ Chapter 2: ${chapter2.title} (3 units, 15 lessons, 30 questions on Control Flow & Logic)`);

  // -------------------- Chapter 3 --------------------
  const chapter3 = await prisma.chapter.create({
    data: {
      title: `Chapter 3: ${getChapterTitle(3)}`,
      levelIndex: 3,
      languageId,
    },
  });

  const ch3_unit1 = await prisma.unit.create({
    data: { title: 'Unit 1: Function Basics', unitIndex: 1, chapterId: chapter3.id },
  });
  const ch3_unit2 = await prisma.unit.create({
    data: { title: 'Unit 2: Parameters & Returns', unitIndex: 2, chapterId: chapter3.id },
  });
  const ch3_unit3 = await prisma.unit.create({
    data: { title: 'Unit 3: Recursion & Patterns', unitIndex: 3, chapterId: chapter3.id },
  });

  await prisma.lesson.create({
    data: {
      title: 'Writing Functions',
      lessonIndex: 1,
      unitId: ch3_unit1.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'HARD',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Function Scope',
      lessonIndex: 2,
      unitId: ch3_unit1.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'HARD',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Global vs Local',
      lessonIndex: 3,
      unitId: ch3_unit1.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'HARD',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Hoisting Behavior',
      lessonIndex: 4,
      unitId: ch3_unit1.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'HARD',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Closure Concepts',
      lessonIndex: 5,
      unitId: ch3_unit1.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'HARD',
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Arguments & Defaults',
      lessonIndex: 1,
      unitId: ch3_unit2.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'HARD',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Return Values',
      lessonIndex: 2,
      unitId: ch3_unit2.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'HARD',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Arrow Functions',
      lessonIndex: 3,
      unitId: ch3_unit2.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'HARD',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Higher Order Functions',
      lessonIndex: 4,
      unitId: ch3_unit2.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'HARD',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Callback Functions',
      lessonIndex: 5,
      unitId: ch3_unit2.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'HARD',
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Recursion Intro',
      lessonIndex: 1,
      unitId: ch3_unit3.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'HARD',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Base Cases',
      lessonIndex: 2,
      unitId: ch3_unit3.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'HARD',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Recursive Patterns',
      lessonIndex: 3,
      unitId: ch3_unit3.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'HARD',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Stack & Call Stack',
      lessonIndex: 4,
      unitId: ch3_unit3.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'HARD',
    },
  });
  await prisma.lesson.create({
    data: {
      title: 'Tail Recursion',
      lessonIndex: 5,
      unitId: ch3_unit3.id,
      hearts: 3,
      questionCount: 4,
      targetDifficulty: 'HARD',
    },
  });

  // Questions for Chapter 3 (Functions, Parameters, Returns, Scope)
  await prisma.question.create({ data: { ...createQuestionData(questionArray[70]), languageId, chapterId: chapter3.id } }); // q71
  await prisma.question.create({ data: { ...createQuestionData(questionArray[71]), languageId, chapterId: chapter3.id } }); // q72
  await prisma.question.create({ data: { ...createQuestionData(questionArray[72]), languageId, chapterId: chapter3.id } }); // q73
  await prisma.question.create({ data: { ...createQuestionData(questionArray[73]), languageId, chapterId: chapter3.id } }); // q74
  await prisma.question.create({ data: { ...createQuestionData(questionArray[74]), languageId, chapterId: chapter3.id } }); // q75
  await prisma.question.create({ data: { ...createQuestionData(questionArray[75]), languageId, chapterId: chapter3.id } }); // q76
  await prisma.question.create({ data: { ...createQuestionData(questionArray[76]), languageId, chapterId: chapter3.id } }); // q77
  await prisma.question.create({ data: { ...createQuestionData(questionArray[77]), languageId, chapterId: chapter3.id } }); // q78
  await prisma.question.create({ data: { ...createQuestionData(questionArray[78]), languageId, chapterId: chapter3.id } }); // q79
  await prisma.question.create({ data: { ...createQuestionData(questionArray[79]), languageId, chapterId: chapter3.id } }); // q80
  // Language specific Chapter 3 questions (q101-q110)
  await prisma.question.create({ data: { ...createQuestionData(questionArray[100]), languageId, chapterId: chapter3.id } }); // q101
  await prisma.question.create({ data: { ...createQuestionData(questionArray[101]), languageId, chapterId: chapter3.id } }); // q102
  await prisma.question.create({ data: { ...createQuestionData(questionArray[102]), languageId, chapterId: chapter3.id } }); // q103
  await prisma.question.create({ data: { ...createQuestionData(questionArray[103]), languageId, chapterId: chapter3.id } }); // q104
  await prisma.question.create({ data: { ...createQuestionData(questionArray[104]), languageId, chapterId: chapter3.id } }); // q105
  await prisma.question.create({ data: { ...createQuestionData(questionArray[105]), languageId, chapterId: chapter3.id } }); // q106
  await prisma.question.create({ data: { ...createQuestionData(questionArray[106]), languageId, chapterId: chapter3.id } }); // q107
  await prisma.question.create({ data: { ...createQuestionData(questionArray[107]), languageId, chapterId: chapter3.id } }); // q108
  await prisma.question.create({ data: { ...createQuestionData(questionArray[108]), languageId, chapterId: chapter3.id } }); // q109
  await prisma.question.create({ data: { ...createQuestionData(questionArray[109]), languageId, chapterId: chapter3.id } }); // q110
  totalQuestionsCreated += 30;
  console.log(`  ✓ Chapter 3: ${chapter3.title} (3 units, 15 lessons, 30 questions on Functions & Scope)`);

  console.log(`\n✅ Created structure: 3 chapters, 9 units, 46 lessons, ${totalQuestionsCreated} questions (90 Python-specific questions: 30 per chapter - Variables/Data Types, Control Flow/Logic, Functions/Scope)\n`);
  return [chapter1, chapter2, chapter3];
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

  const baseData = {
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
    console.log('   - Python: 3 chapters with 9 units and 46 lessons');
    console.log('   - JavaScript: 3 chapters with 9 units and 46 lessons');
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
