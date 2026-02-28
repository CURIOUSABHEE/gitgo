import mongoose, { Schema, Document, Model } from "mongoose"

export interface IResumeSkillGroup {
  category: string
  skills: string[]
}

export interface IResumeExperience {
  title: string
  company: string
  duration: string
  description: string
}

export interface IResumeEducation {
  degree: string
  institution: string
  year: string
  details?: string
}

export interface IResumeProject {
  name: string
  description: string
  technologies: string[]
  githubUrl?: string
  duration?: string
}

export interface ILinkedInProfile {
  url: string
  headline?: string
  summary?: string
  skills?: string[]
  experience?: {
    title: string
    company: string
    duration: string
  }[]
  fetchedAt?: Date
}

export interface IUser extends Document {
  githubId: string
  login: string
  name: string
  email: string
  avatar_url: string
  bio: string
  location: string
  blog: string
  company: string
  twitter_username: string
  hireable: boolean
  public_repos: number
  followers: number
  following: number
  created_at: Date
  updated_at: Date
  lastSynced: Date
  // Skills and languages
  languages: string[]
  skills: string[]
  techStack: string[]
  // Technology map
  technologyMap: {
    technology: string
    projects: Array<{
      repoName: string
      repoId: number
      isPrimary: boolean
      lastUsed: Date
    }>
    totalProjects: number
    firstUsed: Date
    lastUsed: Date
  }[]
  // Resume data
  resumeFileName?: string
  resumeUploadedAt?: Date
  resumeCareerObjective?: string
  resumeSkillGroups?: IResumeSkillGroup[]
  resumeExperience?: IResumeExperience[]
  resumeEducation?: IResumeEducation[]
  resumeProjects?: IResumeProject[]
  resumeRawText?: string
  // LinkedIn data
  linkedin?: ILinkedInProfile
}

const UserSchema = new Schema<IUser>(
  {
    githubId: { type: String, required: true, unique: true, index: true },
    login: { type: String, required: true, unique: true },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    avatar_url: { type: String, default: "" },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    blog: { type: String, default: "" },
    company: { type: String, default: "" },
    twitter_username: { type: String, default: "" },
    hireable: { type: Boolean, default: false },
    public_repos: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    created_at: { type: Date },
    lastSynced: { type: Date, default: Date.now },
    // Skills & languages
    languages: [{ type: String }],
    skills: [{ type: String }],
    techStack: [{ type: String }],
    // Technology map
    technologyMap: [
      {
        technology: { type: String, required: true },
        projects: [
          {
            repoName: { type: String, required: true },
            repoId: { type: Number, required: true },
            isPrimary: { type: Boolean, default: false },
            lastUsed: { type: Date, default: Date.now },
          },
        ],
        totalProjects: { type: Number, default: 0 },
        firstUsed: { type: Date, default: Date.now },
        lastUsed: { type: Date, default: Date.now },
      },
    ],
    // Resume data
    resumeFileName: { type: String },
    resumeUploadedAt: { type: Date },
    resumeCareerObjective: { type: String },
    resumeSkillGroups: [
      {
        category: { type: String, default: "" },
        skills: [{ type: String }],
      },
    ],
    resumeExperience: [
      {
        title: { type: String, default: "" },
        company: { type: String, default: "" },
        duration: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    resumeEducation: [
      {
        degree: { type: String, default: "" },
        institution: { type: String, default: "" },
        year: { type: String, default: "" },
        details: { type: String },
      },
    ],
    resumeProjects: [
      {
        name: { type: String, default: "" },
        description: { type: String, default: "" },
        technologies: [{ type: String }],
        githubUrl: { type: String },
        duration: { type: String },
      },
    ],
    resumeRawText: { type: String },
    // LinkedIn data
    linkedin: {
      url: { type: String },
      headline: { type: String },
      summary: { type: String },
      skills: [{ type: String }],
      experience: [
        {
          title: { type: String },
          company: { type: String },
          duration: { type: String },
        },
      ],
      fetchedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
)

// Prevent model recompilation in development
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
