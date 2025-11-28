import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import puppeteer from 'puppeteer';
import dbConnect from '@/lib/mongodb';
import Resume from '@/models/Resume';



function generateResumeHTML(data, title) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          background: white;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .name {
          font-size: 32px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .contact {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 10px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #2563eb;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        .experience-item, .education-item, .certification-item {
          margin-bottom: 20px;
          padding-left: 20px;
          border-left: 4px solid #2563eb;
        }
        .job-title {
          font-weight: bold;
          font-size: 16px;
          color: #1f2937;
        }
        .company {
          color: #2563eb;
          font-weight: 600;
        }
        .date {
          color: #6b7280;
          font-size: 14px;
        }
        .description {
          margin-top: 8px;
          white-space: pre-line;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
        }
        .skill-item {
          background: #f3f4f6;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          border-left: 3px solid #10b981;
        }
        .skill-name {
          font-weight: 600;
        }
        .skill-level {
          color: #6b7280;
          font-size: 12px;
          text-transform: capitalize;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="name">${data.personalInfo.firstName || 'First Name'} ${data.personalInfo.lastName || 'Last Name'}</div>
        <div class="contact">
          ${data.personalInfo.email ? data.personalInfo.email : ''}
          ${data.personalInfo.phone ? ' | ' + data.personalInfo.phone : ''}
          ${data.personalInfo.location ? ' | ' + data.personalInfo.location : ''}
        </div>
      </div>

      ${data.summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <p>${data.summary}</p>
        </div>
      ` : ''}

      ${data.experience.length > 0 ? `
        <div class="section">
          <div class="section-title">Work Experience</div>
          ${data.experience.map(exp => `
            <div class="experience-item">
              <div class="job-title">${exp.position || 'Job Title'}</div>
              <div class="company">${exp.company || 'Company Name'}</div>
              <div class="date">${exp.startDate || 'Start Date'} - ${exp.current ? 'Present' : (exp.endDate || 'End Date')}</div>
              <div class="description">${exp.description || 'Job description...'}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.skills.length > 0 ? `
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills-grid">
            ${data.skills.map(skill => `
              <div class="skill-item">
                <div class="skill-name">${skill.name || 'Skill Name'}</div>
                <div class="skill-level">${skill.level || 'Level'}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${data.certifications && data.certifications.length > 0 ? `
        <div class="section">
          <div class="section-title">Certifications</div>
          ${data.certifications.map(cert => `
            <div class="certification-item">
              <div class="job-title">${cert.name || 'Certification Name'}</div>
              <div class="company">${cert.issuer || 'Issuing Organization'}</div>
              <div class="date">Issued: ${cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'Issue Date'}</div>
              ${cert.expiryDate ? `<div class="date">Expires: ${new Date(cert.expiryDate).toLocaleDateString()}</div>` : ''}
              ${cert.credentialId ? `<div class="date">Credential ID: ${cert.credentialId}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${data.education.map(edu => `
            <div class="education-item">
              <div class="job-title">${edu.degree || 'Degree'} in ${edu.field || 'Field of Study'}</div>
              <div class="company">${edu.institution || 'Institution Name'}</div>
              <div class="date">${edu.startDate || 'Start Date'} - ${edu.current ? 'Present' : (edu.endDate || 'End Date')}</div>
              ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </body>
    </html>
  `;
}

export async function GET(
  request,
  { params }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const resume = await Resume.findOne({ _id: (await params).id, userId });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Launch Puppeteer browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Generate HTML content
    const htmlContent = generateResumeHTML(resume.data, resume.title);

    // Set content and generate PDF
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    // Return PDF as response
    const response = new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resume.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`
      }
    });

    return response;

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
