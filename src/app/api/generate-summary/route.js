import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const summaryTemplates = [
  "Dynamic and results-oriented professional with expertise in {keywords}. Proven track record of delivering innovative solutions and driving team success. Committed to continuous learning and professional growth in a fast-paced environment.",
  "Experienced specialist skilled in {keywords}, bringing {years} years of hands-on experience to complex challenges. Adept at collaborating with cross-functional teams to achieve organizational objectives. Passionate about leveraging technology to create meaningful impact.",
  "Accomplished professional with strong background in {keywords}. Demonstrated ability to lead projects from conception to successful completion. Focused on building scalable solutions and fostering positive work environments.",
  "Innovative thinker and problem-solver with proficiency in {keywords}. Excel at analyzing complex problems and implementing effective strategies. Dedicated to staying current with industry trends and best practices.",
  "Results-driven professional with comprehensive experience in {keywords}. Skilled at managing multiple priorities while maintaining high standards of quality. Committed to contributing to organizational success through strategic thinking and collaborative efforts."
];

function generateSummaryFromKeywords(keywords) {
  // Split keywords and clean them
  const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);

  // Select a random template
  const template = summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)];

  // Replace placeholders
  let summary = template.replace('{keywords}', keywordList.join(', '));

  // Add some variety by randomly including experience years
  if (Math.random() > 0.5) {
    const years = Math.floor(Math.random() * 10) + 3; // 3-12 years
    summary = summary.replace('{years}', years.toString());
  } else {
    summary = summary.replace('{years} years of', 'extensive');
  }

  return summary;
}

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { keywords } = await request.json();

    if (!keywords || !keywords.trim()) {
      return NextResponse.json({ error: 'Keywords are required' }, { status: 400 });
    }

    const summary = generateSummaryFromKeywords(keywords);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
