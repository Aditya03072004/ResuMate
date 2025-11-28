import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'Untitled Resume',
    },
    template: {
      type: String,
      enum: ['minimal', 'modern', 'professional', 'creative'],
      default: 'modern',
    },
    data: {
      personalInfo: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        location: String,
        linkedin: String,
        website: String,
        twitter: String,
        github: String,
        portfolio: String,
      },
      summary: String,
      experience: [{
        id: String,
        company: String,
        position: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String,
      }],
      education: [{
        id: String,
        institution: String,
        degree: String,
        field: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        gpa: String,
      }],
      skills: [{
        id: String,
        name: String,
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        },
      }],
      certifications: [{
        id: String,
        name: String,
        issuer: String,
        issueDate: String,
        expiryDate: String,
        credentialId: String,
        url: String,
      }],
      projects: [{
        id: String,
        name: String,
        description: String,
        technologies: [String],
        url: String,
        github: String,
        startDate: String,
        endDate: String,
      }],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
