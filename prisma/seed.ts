import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: "postgresql://postgres.ckngpdwuhbjbbentrrza:KoodieEinSIjaknslasdjb10129@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres",
});

const prisma = new PrismaClient({ adapter });
console.log("DATABASE_URL =", process.env.DATABASE_URL);

async function main() {
  console.log('Starting database seed...');

  // Create GameTypes
  const gameTypes = await prisma.gameType.createMany({
    data: [
      {
        name: 'fix_the_bug',
        description: 'Find and fix the bug in the code',
        configSchema: { language: 'python', codeBlocks: true },
      },
      {
        name: 'code_reorder',
        description: 'Arrange code lines in the correct order',
        configSchema: { language: 'python', shuffled: true },
      },
      {
        name: 'fill_in_blank',
        description: 'Fill in the missing code',
        configSchema: { language: 'python', blanks: true },
      },
      {
        name: 'predict_output',
        description: 'Predict what the code will output',
        configSchema: { language: 'python', multiple_choice: true },
      },
      {
        name: 'timed_coding',
        description: 'Complete the coding challenge within time limit',
        configSchema: { language: 'python', time_limit: 300 },
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✓ Created ${gameTypes.count} GameTypes`);

  // Fetch GameTypes to get IDs
  const fixTheBug = await prisma.gameType.findUnique({
    where: { name: 'fix_the_bug' },
  });
  const codeReorder = await prisma.gameType.findUnique({
    where: { name: 'code_reorder' },
  });
  const fillInBlank = await prisma.gameType.findUnique({
    where: { name: 'fill_in_blank' },
  });
  const predictOutput = await prisma.gameType.findUnique({
    where: { name: 'predict_output' },
  });
  const timedCoding = await prisma.gameType.findUnique({
    where: { name: 'timed_coding' },
  });

  // Create 20 Python questions
  const questions = [
    // Fix The Bug (4 questions)
    {
      gameTypeId: fixTheBug!.id,
      prompt: 'Fix the bug in this function that calculates the sum of a list.',
      codeSnippet: `def sum_list(numbers):
    total = 0
    for num in numbers
        total = total + num
    return total`,
      correctAnswer: { fix: 'Line 3: Missing colon after for loop declaration' },
      explanation:
        'Python requires a colon (:) after for loop declarations. The correct line should be: for num in numbers:',
      difficulty: 1,
      tags: ['loops', 'syntax', 'beginner'],
      questionType: 'fix_the_bug',
      metadata: {
        language: 'python',
        topic: 'syntax',
        skillLevel: 'beginner',
        category: 'loops',
      },
    },
    {
      gameTypeId: fixTheBug!.id,
      prompt: 'Identify the bug in this function that checks if a number is prime.',
      codeSnippet: `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i = 0:
            return False
    return True`,
      correctAnswer: {
        fix: 'Line 5: Use == for comparison, not = for assignment',
      },
      explanation:
        'The condition should use == (comparison operator) instead of = (assignment operator). Correct: if n % i == 0:',
      difficulty: 1,
      tags: ['conditionals', 'operators', 'logic'],
      questionType: 'fix_the_bug',
      metadata: {
        language: 'python',
        topic: 'operators',
        skillLevel: 'beginner',
        category: 'conditionals',
      },
    },
    {
      gameTypeId: fixTheBug!.id,
      prompt: 'Fix the error in this dictionary access function.',
      codeSnippet: `def get_value(dict, key):
    if key in dict:
        return dict[key]
    else
        return None`,
      correctAnswer: { fix: 'Line 4: Missing colon after else statement' },
      explanation:
        'Python requires a colon (:) after else. The correct line should be: else:',
      difficulty: 1,
      tags: ['dictionaries', 'syntax', 'conditionals'],
      questionType: 'fix_the_bug',
      metadata: {
        language: 'python',
        topic: 'syntax',
        skillLevel: 'beginner',
        category: 'dictionaries',
      },
    },
    {
      gameTypeId: fixTheBug!.id,
      prompt: 'Fix the string indexing error.',
      codeSnippet: `def get_first_char(text):
    return text[1]`,
      correctAnswer: { fix: 'Line 2: Python uses 0-based indexing, should be text[0]' },
      explanation:
        'In Python, indexing starts at 0, not 1. The first character is at index 0. Should be: return text[0]',
      difficulty: 2,
      tags: ['strings', 'indexing', 'logic'],
      questionType: 'fix_the_bug',
      metadata: {
        language: 'python',
        topic: 'strings',
        skillLevel: 'intermediate',
        category: 'indexing',
      },
    },

    // Code Reorder (4 questions)
    {
      gameTypeId: codeReorder!.id,
      prompt: 'Arrange these lines to create a function that reverses a string.',
      codeSnippet: `return reversed_str
reversed_str = ""
def reverse_string(s):
for char in s:
    reversed_str += char`,
      correctAnswer: {
        order: [2, 1, 3, 4, 5],
      },
      explanation:
        'The correct order is: function definition, variable initialization, loop start, and then the loop body. This builds the reversed string character by character.',
      difficulty: 2,
      tags: ['strings', 'loops', 'functions'],
      questionType: 'code_reorder',
      metadata: {
        language: 'python',
        topic: 'strings',
        skillLevel: 'intermediate',
        category: 'functions',
      },
    },
    {
      gameTypeId: codeReorder!.id,
      prompt: 'Arrange the lines to create a factorial function.',
      codeSnippet: `result *= n
n -= 1
def factorial(n):
result = 1
while n > 1:
return result`,
      correctAnswer: {
        order: [3, 4, 5, 1, 2, 6],
      },
      explanation:
        'Function definition first, then initialize result, start the while loop, multiply and decrement inside the loop, then return.',
      difficulty: 2,
      tags: ['loops', 'functions', 'math'],
      questionType: 'code_reorder',
      metadata: {
        language: 'python',
        topic: 'loops',
        skillLevel: 'intermediate',
        category: 'functions',
      },
    },
    {
      gameTypeId: codeReorder!.id,
      prompt: 'Order these lines to filter even numbers from a list.',
      codeSnippet: `return even_numbers
even_numbers = []
def filter_evens(numbers):
if num % 2 == 0:
for num in numbers:
    even_numbers.append(num)`,
      correctAnswer: {
        order: [3, 2, 5, 4, 6, 1],
      },
      explanation:
        'Define function, initialize list, loop through numbers, check if even, append to list, return result.',
      difficulty: 2,
      tags: ['lists', 'loops', 'conditionals'],
      questionType: 'code_reorder',
      metadata: {
        language: 'python',
        topic: 'lists',
        skillLevel: 'intermediate',
        category: 'filtering',
      },
    },
    {
      gameTypeId: codeReorder!.id,
      prompt: 'Arrange the lines to merge two sorted lists.',
      codeSnippet: `return merged
merged = []
def merge_sorted(list1, list2):
merged.extend(list2)
merged.extend(list1)`,
      correctAnswer: {
        order: [3, 2, 5, 4, 1],
      },
      explanation:
        'Define function, initialize merged list, extend with first list, extend with second list, then return the result.',
      difficulty: 2,
      tags: ['lists', 'functions', 'algorithms'],
      questionType: 'code_reorder',
      metadata: {
        language: 'python',
        topic: 'lists',
        skillLevel: 'intermediate',
        category: 'merging',
      },
    },

    // Fill in Blank (4 questions)
    {
      gameTypeId: fillInBlank!.id,
      prompt: 'Complete this function to count occurrences of a character in a string.',
      codeSnippet: `def count_char(s, char):
    count = 0
    for c in s:
        if c ____ char:
            count += 1
    return count`,
      correctAnswer: { blank: '==' },
      explanation:
        'Use the equality operator == to compare if the character c matches the target char.',
      difficulty: 1,
      tags: ['strings', 'conditionals', 'operators'],
      questionType: 'fill_in_blank',
      metadata: {
        language: 'python',
        topic: 'operators',
        skillLevel: 'beginner',
        category: 'comparison',
      },
    },
    {
      gameTypeId: fillInBlank!.id,
      prompt: 'Fill in the blank to create a function that checks if a list is empty.',
      codeSnippet: `def is_empty(lst):
    return ____ == 0`,
      correctAnswer: { blank: 'len(lst)' },
      explanation:
        'Use len() to get the length of the list. If the length is 0, the list is empty.',
      difficulty: 1,
      tags: ['lists', 'functions', 'operators'],
      questionType: 'fill_in_blank',
      metadata: {
        language: 'python',
        topic: 'lists',
        skillLevel: 'beginner',
        category: 'utilities',
      },
    },
    {
      gameTypeId: fillInBlank!.id,
      prompt: 'Complete the list comprehension to square all numbers.',
      codeSnippet: `numbers = [1, 2, 3, 4, 5]
squared = [____ for num in numbers]`,
      correctAnswer: { blank: 'num ** 2' },
      explanation:
        'Use ** (exponentiation operator) to square each number. num ** 2 raises num to the power of 2.',
      difficulty: 2,
      tags: ['lists', 'comprehensions', 'operators'],
      questionType: 'fill_in_blank',
      metadata: {
        language: 'python',
        topic: 'list-comprehensions',
        skillLevel: 'intermediate',
        category: 'transformations',
      },
    },
    {
      gameTypeId: fillInBlank!.id,
      prompt: 'Fill in the blank in this function to find the maximum of two numbers.',
      codeSnippet: `def max_of_two(a, b):
    if a > b:
        return a
    else:
        return ____`,
      correctAnswer: { blank: 'b' },
      explanation: 'If a is not greater than b, then b must be the maximum (or equal).',
      difficulty: 1,
      tags: ['conditionals', 'logic', 'functions'],
      questionType: 'fill_in_blank',
      metadata: {
        language: 'python',
        topic: 'conditionals',
        skillLevel: 'beginner',
        category: 'comparison',
      },
    },

    // Predict Output (4 questions)
    {
      gameTypeId: predictOutput!.id,
      prompt: 'What will be the output of this code?',
      codeSnippet: `x = 5
y = 3
print(x + y * 2)`,
      correctAnswer: { output: '11' },
      explanation:
        'Following order of operations: 3 * 2 = 6, then 5 + 6 = 11. Multiplication happens before addition.',
      difficulty: 1,
      tags: ['operators', 'arithmetic', 'order-of-operations'],
      questionType: 'predict_output',
      metadata: {
        language: 'python',
        topic: 'operators',
        skillLevel: 'beginner',
        category: 'arithmetic',
      },
    },
    {
      gameTypeId: predictOutput!.id,
      prompt: 'What is the output of this code?',
      codeSnippet: `words = ["hello", "world"]
for word in words:
    print(word.upper())`,
      correctAnswer: { output: 'HELLO\nWORLD' },
      explanation:
        '.upper() converts strings to uppercase. The loop prints each word in uppercase on separate lines.',
      difficulty: 1,
      tags: ['strings', 'loops', 'methods'],
      questionType: 'predict_output',
      metadata: {
        language: 'python',
        topic: 'strings',
        skillLevel: 'beginner',
        category: 'string-methods',
      },
    },
    {
      gameTypeId: predictOutput!.id,
      prompt: 'What will this code output?',
      codeSnippet: `nums = [1, 2, 3, 4, 5]
result = [x * 2 for x in nums if x > 2]
print(result)`,
      correctAnswer: { output: '[6, 8, 10]' },
      explanation:
        'List comprehension filters numbers > 2 (which are 3, 4, 5) and doubles them: [6, 8, 10].',
      difficulty: 2,
      tags: ['lists', 'comprehensions', 'conditionals'],
      questionType: 'predict_output',
      metadata: {
        language: 'python',
        topic: 'list-comprehensions',
        skillLevel: 'intermediate',
        category: 'filtering',
      },
    },
    {
      gameTypeId: predictOutput!.id,
      prompt: 'What is the output?',
      codeSnippet: `def add(a, b=10):
    return a + b

print(add(5))
print(add(5, 3))`,
      correctAnswer: { output: '15\n8' },
      explanation:
        'First call uses default b=10, so 5+10=15. Second call overrides b=3, so 5+3=8.',
      difficulty: 2,
      tags: ['functions', 'parameters', 'defaults'],
      questionType: 'predict_output',
      metadata: {
        language: 'python',
        topic: 'functions',
        skillLevel: 'intermediate',
        category: 'default-parameters',
      },
    },

    // Timed Coding (4 questions)
    {
      gameTypeId: timedCoding!.id,
      prompt:
        'Write a function that returns the sum of all even numbers in a list. Time limit: 5 minutes.',
      codeSnippet: 'def sum_evens(numbers):\n    # Your code here\n    pass',
      correctAnswer: {
        solution: `def sum_evens(numbers):
    total = 0
    for num in numbers:
        if num % 2 == 0:
            total += num
    return total`,
      },
      explanation:
        'Iterate through the list, check if each number is even (divisible by 2), and add it to the total.',
      difficulty: 2,
      tags: ['loops', 'conditionals', 'functions', 'math'],
      questionType: 'timed_coding',
      metadata: {
        language: 'python',
        topic: 'loops',
        skillLevel: 'intermediate',
        category: 'summing',
        timeLimit: 300,
      },
    },
    {
      gameTypeId: timedCoding!.id,
      prompt: 'Write a function that reverses a string. Time limit: 3 minutes.',
      codeSnippet: 'def reverse_string(s):\n    # Your code here\n    pass',
      correctAnswer: {
        solution: `def reverse_string(s):
    return s[::-1]`,
      },
      explanation:
        'Use Python slice notation [::-1] to reverse the string. Start from end, go to beginning, step by -1.',
      difficulty: 1,
      tags: ['strings', 'slicing', 'functions'],
      questionType: 'timed_coding',
      metadata: {
        language: 'python',
        topic: 'strings',
        skillLevel: 'beginner',
        category: 'string-manipulation',
        timeLimit: 180,
      },
    },
    {
      gameTypeId: timedCoding!.id,
      prompt: 'Write a function to find the second largest number in a list. Time limit: 5 minutes.',
      codeSnippet:
        'def second_largest(numbers):\n    # Your code here\n    pass',
      correctAnswer: {
        solution: `def second_largest(numbers):
    unique_nums = list(set(numbers))
    unique_nums.sort(reverse=True)
    return unique_nums[1]`,
      },
      explanation:
        'Remove duplicates by converting to set, sort in descending order, and return the element at index 1.',
      difficulty: 3,
      tags: ['lists', 'sorting', 'functions', 'sets'],
      questionType: 'timed_coding',
      metadata: {
        language: 'python',
        topic: 'lists',
        skillLevel: 'advanced',
        category: 'sorting',
        timeLimit: 300,
      },
    },
    {
      gameTypeId: timedCoding!.id,
      prompt:
        'Write a function that checks if a word is a palindrome. Time limit: 4 minutes.',
      codeSnippet: 'def is_palindrome(word):\n    # Your code here\n    pass',
      correctAnswer: {
        solution: `def is_palindrome(word):
    cleaned = word.lower().replace(" ", "")
    return cleaned == cleaned[::-1]`,
      },
      explanation:
        'Remove spaces and convert to lowercase, then compare the string with its reverse.',
      difficulty: 2,
      tags: ['strings', 'conditionals', 'functions'],
      questionType: 'timed_coding',
      metadata: {
        language: 'python',
        topic: 'strings',
        skillLevel: 'intermediate',
        category: 'pattern-matching',
        timeLimit: 240,
      },
    },
  ];

  const createdQuestions = await prisma.question.createMany({
    data: questions,
  });

  console.log(`✓ Created ${createdQuestions.count} questions`);
  console.log('\n📊 Question Summary:');
  console.log(`  • Total Questions: 20`);
  console.log(`  • Language: Python`);
  console.log(`  • Types: fix_the_bug(4), code_reorder(4), fill_in_blank(4), predict_output(4), timed_coding(4)`);
  console.log(`  • Difficulties: 1 (Beginner), 2 (Intermediate), 3 (Advanced)`);
  console.log(`  • Categories: loops, syntax, operators, strings, lists, functions, conditionals`);

  console.log('\n✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
