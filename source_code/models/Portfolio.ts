import mongoose, { Schema, Document, Model } from "mongoose"

export interface IPortfolio extends Document {
  userId: string // githubId
  templateId: string
  theme: string
  sections: Array<{
    id: string
    type: string
    order: number
    visible: boolean
    data: Record<string, any>
  }>
  metadata: {
    title: string
    description: string
    favicon?: string
    ogImage?: string
  }
  isPublished: boolean
  slug: string
  createdAt: Date
  updatedAt: Date
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    userId: { type: String, required: true, index: true },
    templateId: { type: String, required: true, default: "modern" },
    theme: { type: String, required: true, default: "midnight" },
    sections: [
      {
        id: { type: String, required: true },
        type: { type: String, required: true },
        order: { type: Number, required: true },
        visible: { type: Boolean, default: true },
        data: { type: Schema.Types.Mixed, default: {} },
      },
    ],
    metadata: {
      title: { type: String, default: "My Portfolio" },
      description: { type: String, default: "Developer Portfolio" },
      favicon: { type: String, default: "" },
      ogImage: { type: String, default: "" },
    },
    isPublished: { type: Boolean, default: false },
    slug: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: true,
  }
)

const Portfolio: Model<IPortfolio> =
  mongoose.models.Portfolio || mongoose.model<IPortfolio>("Portfolio", PortfolioSchema)

export default Portfolio
