import mongoose, { Schema, Document, Model } from "mongoose"

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
  // New fields for skills and languages
  languages: string[]
  skills: string[]
  techStack: string[]
  // Technology map: tracks which technologies were used in which projects
  technologyMap: {
    technology: string
    projects: Array<{
      repoName: string
      repoId: number
      isPrimary: boolean // true if it's the main language of the repo
      lastUsed: Date
    }>
    totalProjects: number
    firstUsed: Date
    lastUsed: Date
  }[]
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
    // New fields
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
  },
  {
    timestamps: true,
  }
)

// Prevent model recompilation in development
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
