import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { parseGitHubUrl } from "@/lib/utils"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const repoUrl = searchParams.get("repoUrl")
    const type = searchParams.get("type") || "issue"
    const sort = searchParams.get("sort") || "created-desc"
    const labels = searchParams.get("labels")

    if (!repoUrl) {
      return NextResponse.json({ error: "repoUrl is required" }, { status: 400 })
    }

    const parsed = parseGitHubUrl(repoUrl)
    if (!parsed) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 })
    }

    const { owner, repo } = parsed
    const token = (session as any).accessToken || process.env.GITHUB_TOKEN

    if (!token) {
      return NextResponse.json(
        { error: "GitHub token not found" },
        { status: 401 }
      )
    }

    // Build GitHub API URL
    let apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=30`

    // Add labels filter if provided
    if (labels) {
      apiUrl += `&labels=${encodeURIComponent(labels)}`
    }

    // Add sort parameter
    if (sort === "created-desc") {
      apiUrl += "&sort=created&direction=desc"
    } else if (sort === "created-asc") {
      apiUrl += "&sort=created&direction=asc"
    } else if (sort === "comments-desc") {
      apiUrl += "&sort=comments&direction=desc"
    }

    // Fetch issues from GitHub
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`GitHub API error (${response.status}):`, errorData)

      if (response.status === 404) {
        return NextResponse.json(
          { error: "Repository not found or you don't have access" },
          { status: 404 }
        )
      }

      if (response.status === 403) {
        return NextResponse.json(
          { error: "GitHub API rate limit exceeded" },
          { status: 403 }
        )
      }

      return NextResponse.json(
        { error: `GitHub API error: ${errorData.message || "Unknown error"}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Filter based on type (issue vs PR)
    // GitHub API returns both issues and PRs in the /issues endpoint
    // PRs have a "pull_request" property
    const filtered = data.filter((item: any) => {
      if (type === "pr") {
        return item.pull_request !== undefined
      } else {
        return item.pull_request === undefined
      }
    })

    // Transform to match our FilteredIssue type
    const issues = filtered.map((item: any) => ({
      id: item.id,
      number: item.number,
      title: item.title,
      state: item.state,
      html_url: item.html_url,
      created_at: item.created_at,
      updated_at: item.updated_at,
      comments: item.comments,
      user: {
        login: item.user.login,
        avatar_url: item.user.avatar_url,
      },
      labels: item.labels.map((label: any) => ({
        name: label.name,
        color: label.color,
      })),
    }))

    return NextResponse.json({ issues })
  } catch (error) {
    console.error("Error fetching issues:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch issues"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
