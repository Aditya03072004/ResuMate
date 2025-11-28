import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Resume from '@/models/Resume';
import User from '@/models/User';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });

    return NextResponse.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, template, data } = body;

    await dbConnect();

    // Check user plan and resume count
    const user = await User.findOne({ clerkId: userId });
    if (user && user.plan === 'free' && user.resumesCount >= 3) {
      return NextResponse.json({ error: 'Free plan limit reached' }, { status: 403 });
    }

    const resume = new Resume({
      userId,
      title: title || 'Untitled Resume',
      template: template || 'modern',
      data: data || {
        personalInfo: {},
        summary: '',
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        projects: [],
      },
    });

    await resume.save();

    // Update user resume count
    if (user) {
      user.resumesCount += 1;
      await user.save();
    }

    return NextResponse.json(resume, { status: 201 });
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
