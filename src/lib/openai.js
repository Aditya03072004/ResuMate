import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;

export async function generateResumeContent(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer. Generate professional, ATS-friendly resume content.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate resume content');
  }
}

export async function rewriteBulletPoints(bulletPoints) {
  try {
    const prompt = `Rewrite the following bullet points to be more impactful and ATS-friendly:\n\n${bulletPoints.join('\n')}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer. Rewrite bullet points to be more impactful, quantifiable, and ATS-friendly.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 800,
      temperature: 0.6,
    });

    const rewritten = completion.choices[0]?.message?.content || '';
    return rewritten.split('\n').filter(line => line.trim().length > 0);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to rewrite bullet points');
  }
}

export async function extractResumeData(text) {
  try {
    const prompt = `Extract structured resume data from the following text. Return JSON format with fields: personalInfo, summary, experience, education, skills, projects.\n\nText: ${text}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at parsing resume text. Extract and structure resume information into clean JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const extracted = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(extracted);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to extract resume data');
  }
}

export async function tailorResumeForJob(resumeData, jobDescription) {
  try {
    const prompt = `Tailor this resume for the following job description. Focus on matching keywords and highlighting relevant experience:\n\nJob Description: ${jobDescription}\n\nResume Data: ${JSON.stringify(resumeData)}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career counselor. Tailor resume content to match job requirements while maintaining authenticity.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1500,
      temperature: 0.5,
    });

    const tailored = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(tailored);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to tailor resume for job');
  }
}
