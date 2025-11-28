import { auth } from '@/auth';
import { prisma } from '@/lib/prisma/client';
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        selectedLanguage: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
        message : 'User profile fetched successfully',
        result : user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username, email, password } = body;

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};

    // Update username if provided and different
    if (username && username.trim()) {
      if (username.length < 3 || username.length > 30) {
        return NextResponse.json(
          { error: 'Username must be between 3 and 30 characters' },
          { status: 400 }
        );
      }

      // Check if username is already taken by another user
      const existingUsername = await prisma.user.findUnique({
        where: { username: username.trim() },
      });

      if (existingUsername && existingUsername.id !== currentUser.id) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        );
      }

      updateData.username = username.trim();
    }

    // Update email if provided (for non-guest or guest converting to full)
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }

      // Check if email is already taken
      const existingEmail = await prisma.user.findUnique({
        where: { email: email.trim() },
      });

      if (existingEmail && existingEmail.id !== currentUser.id) {
        return NextResponse.json(
          { error: 'Email is already in use' },
          { status: 400 }
        );
      }

      updateData.email = email.trim();
    }

    // Update password if provided (for guest converting or regular user)
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;

      // If guest user is adding password, mark them as converted
      if (currentUser.isGuest) {
        updateData.isGuest = false;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      include: {
        selectedLanguage: true,
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      result: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
