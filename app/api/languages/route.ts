import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const languages = await prisma.language.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return NextResponse.json(languages);
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      { message: 'Failed to fetch languages' },
      { status: 500 }
    );
  }
}
