import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { auth } from '@/auth';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

/**
 * GET /api/questions/[questionId]
 * 
 * Fetch a single question by ID with all nested relations
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params;

    if (!questionId) {
      return NextResponse.json(
        { message: 'questionId is required' },
        { status: 400 }
      );
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        codeSegments: { orderBy: { index: 'asc' } },
        options: { orderBy: { index: 'asc' } },
        items: { orderBy: { index: 'asc' } },
        pairs: { orderBy: { index: 'asc' } },
        chapter: {
          select: { id: true, title: true },
        },
        language: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        { message: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { message: 'Failed to fetch question', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PATCH /api/questions/[questionId]
 * 
 * Update an existing question
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { questionId } = await params;

    if (!questionId) {
      return NextResponse.json(
        { message: 'questionId is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      type,
      instruction,
      description,
      codeBlock,
      correctOrder,
      codeBefore,
      codeAfter,
      logicCondition,
      explanation,
      difficulty,
      languageId,
      chapterId,
    } = body;

    // Check if question exists
    const existingQuestion = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { message: 'Question not found' },
        { status: 404 }
      );
    }

    // Update question
    const question = await prisma.question.update({
      where: { id: questionId },
      data: {
        ...(type && { type }),
        ...(instruction && { instruction }),
        ...(description !== undefined && { description }),
        ...(codeBlock !== undefined && { codeBlock }),
        ...(correctOrder && { correctOrder }),
        ...(codeBefore !== undefined && { codeBefore }),
        ...(codeAfter !== undefined && { codeAfter }),
        ...(logicCondition !== undefined && { logicCondition }),
        ...(explanation !== undefined && { explanation }),
        ...(difficulty && { difficulty }),
        ...(languageId && { languageId }),
        ...(chapterId && { chapterId }),
      },
      include: {
        codeSegments: { orderBy: { index: 'asc' } },
        options: { orderBy: { index: 'asc' } },
        items: { orderBy: { index: 'asc' } },
        pairs: { orderBy: { index: 'asc' } },
      },
    });

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { message: 'Failed to update question', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * DELETE /api/questions/[questionId]
 * 
 * Delete a question and all its nested relations
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { questionId } = await params;

    if (!questionId) {
      return NextResponse.json(
        { message: 'questionId is required' },
        { status: 400 }
      );
    }

    // Check if question exists
    const existingQuestion = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { message: 'Question not found' },
        { status: 404 }
      );
    }

    // Delete question (cascade will delete nested relations)
    await prisma.question.delete({
      where: { id: questionId },
    });

    return NextResponse.json({ success: true, message: 'Question deleted' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { message: 'Failed to delete question', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
