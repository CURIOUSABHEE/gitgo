import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import Portfolio from "@/models/Portfolio"

// GET user's portfolio
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.githubId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const portfolio = await Portfolio.findOne({ 
      userId: session.user.githubId 
    }).lean()

    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    )
  }
}

// POST create or update portfolio
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.githubId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { templateId, theme, sections, metadata } = body

    await connectDB()

    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: session.user.githubId },
      {
        $set: {
          templateId,
          theme,
          sections,
          metadata,
        },
      },
      { new: true, upsert: true, runValidators: true }
    ).lean()

    return NextResponse.json({ 
      success: true, 
      portfolio,
      message: "Portfolio saved successfully" 
    })
  } catch (error) {
    console.error("Error saving portfolio:", error)
    return NextResponse.json(
      { error: "Failed to save portfolio" },
      { status: 500 }
    )
  }
}
