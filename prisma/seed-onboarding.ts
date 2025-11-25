import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.ckngpdwuhbjbbentrrza:KoodieEinSIjaknslasdjb10129@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding onboarding data...');

  // Create Python Language
  const pythonLang = await prisma.language.upsert({
    where: { slug: 'python' },
    update: {},
    create: {
      name: 'Python',
      slug: 'python',
    },
  });

  console.log(`✓ Created Language: ${pythonLang.name}`);

  // Create 5 Placement Test Questions for Python
  const placementTests = [
    {
      languageId: pythonLang.id,
      type: 'MULTIPLE_CHOICE' as const,
      content: 'What is the correct way to create a variable in Python?',
      explanation: 'In Python, variables are created by assignment. The variable name goes on the left of the equals sign.',
      choices: [
        'name = "John"',
        'set name = "John"',
        'name: String = "John"',
        'declare name = "John"'
      ],
      answer: 'name = "John"',
      difficulty: 1,
    },
    {
      languageId: pythonLang.id,
      type: 'MULTIPLE_CHOICE' as const,
      content: 'What will this code output?\nx = 5\ny = 3\nprint(x + y)',
      explanation: 'The code adds two numbers: 5 + 3 = 8.',
      choices: ['8', '53', '2', 'Error'],
      answer: '8',
      difficulty: 1,
    },
    {
      languageId: pythonLang.id,
      type: 'FILL_BLANK' as const,
      content: 'Complete this code:\nfor i in ____:\n    print(i)',
      explanation: 'A loop needs a sequence to iterate over. range(5) creates numbers 0-4.',
      choices: ['range(5)', 'list', 'array', 'numbers'],
      answer: 'range(5)',
      difficulty: 2,
    },
    {
      languageId: pythonLang.id,
      type: 'CODE_OUTPUT' as const,
      content: 'What will be printed?\nword = "Python"\nprint(word[0])',
      explanation: 'Python uses 0-based indexing. word[0] is the first character "P".',
      choices: ['P', 'Python', '0', 'Pyt'],
      answer: 'P',
      difficulty: 1,
    },
    {
      languageId: pythonLang.id,
      type: 'DEBUG_CODE' as const,
      content: 'What is wrong with this code?\ndef greet(name)\n    print("Hello " + name)',
      explanation: 'Python requires a colon (:) after function definitions. It should be "def greet(name):"',
      choices: [
        'Missing colon after function name',
        'Missing parentheses',
        'print statement is wrong',
        'String concatenation is wrong'
      ],
      answer: 'Missing colon after function name',
      difficulty: 1,
    },
  ];

  const createdTests = await prisma.placementTest.createMany({
    data: placementTests,
    skipDuplicates: true,
  });

  console.log(`✓ Created ${createdTests.count} Placement Test Questions`);
  console.log('\n✅ Onboarding data seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
