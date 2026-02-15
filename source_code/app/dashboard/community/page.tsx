import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PostComposer } from "@/components/community/post-composer"
import { FeedPost } from "@/components/community/feed-post"
import { MilestoneCard } from "@/components/community/milestone-card"

const feedItems = [
  {
    type: "post" as const,
    data: {
      author: { name: "Marcus Chen", handle: "@marcusc", initials: "MC" },
      content:
        "Just shipped a fix for the SSR hydration mismatch in Next.js. Turns out the issue was with how we handled timezone-dependent date formatting. Here's the solution:",
      codeSnippet: {
        language: "TypeScript",
        code: `// Before: hydration mismatch on server vs client
const date = new Date().toLocaleDateString()

// After: consistent formatting
import { formatDate } from '@/lib/utils'
const date = formatDate(timestamp, 'UTC')`,
      },
      likes: 47,
      comments: 12,
      repoLink: "vercel/next.js",
      timeAgo: "2h ago",
    },
  },
  {
    type: "milestone" as const,
    data: {
      milestoneType: "pr-merged" as const,
      author: { name: "Alex Rivera", initials: "AR" },
      message: "Alex just merged their first PR to SpaceScope!",
      detail: "Fixed API rate limiting in data-fetcher module",
      timeAgo: "3h ago",
    },
  },
  {
    type: "post" as const,
    data: {
      author: { name: "Priya Sharma", handle: "@priyadev", initials: "PS" },
      content:
        "Been contributing to Supabase for 2 weeks now and the community is incredible. The maintainers are super responsive and the codebase is really well documented. Highly recommend it as a first open source project!",
      likes: 89,
      comments: 23,
      timeAgo: "4h ago",
    },
  },
  {
    type: "milestone" as const,
    data: {
      milestoneType: "badge-earned" as const,
      author: { name: "Sarah Kim", initials: "SK" },
      message: "Sarah earned a 'Python Pro' badge!",
      detail: "Completed 10 contributions to Python repos",
      timeAgo: "5h ago",
    },
  },
  {
    type: "post" as const,
    data: {
      author: { name: "Jordan Lee", handle: "@jordanl", initials: "JL" },
      content:
        "Anyone else working on the Excalidraw canvas refactor? I'm tackling the touch event handlers. Would love to pair on the gesture recognition logic.",
      codeSnippet: {
        language: "TypeScript",
        code: `// Working on multi-touch gesture support
const handlePinch = (e: TouchEvent) => {
  const distance = getDistance(
    e.touches[0], e.touches[1]
  )
  const scale = distance / initialDistance
  canvas.setZoom(scale * baseZoom)
}`,
      },
      likes: 31,
      comments: 8,
      repoLink: "excalidraw/excalidraw",
      timeAgo: "6h ago",
    },
  },
  {
    type: "milestone" as const,
    data: {
      milestoneType: "first-contribution" as const,
      author: { name: "Tom Nguyen", initials: "TN" },
      message: "Tom made their first open source contribution!",
      detail: "Added dark mode toggle to cal.com dashboard",
      timeAgo: "7h ago",
    },
  },
  {
    type: "post" as const,
    data: {
      author: { name: "Emily Zhang", handle: "@emilyzhang", initials: "EZ" },
      content:
        "TIL: FastAPI's dependency injection system is incredibly powerful for testing. You can override any dependency at test time without mocking. Clean architecture FTW.",
      likes: 63,
      comments: 15,
      repoLink: "tiangolo/fastapi",
      timeAgo: "8h ago",
    },
  },
  {
    type: "milestone" as const,
    data: {
      milestoneType: "first-star" as const,
      author: { name: "Dev Patel", initials: "DP" },
      message: "Dev's contribution to LangChain got 50 stars!",
      detail: "New retrieval chain for structured documents",
      timeAgo: "9h ago",
    },
  },
]

export default function CommunityPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader title="Community" />

      <div className="mx-auto w-full max-w-2xl flex-1 p-6">
        {/* Composer */}
        <PostComposer />

        {/* Feed */}
        <div className="mt-6 flex flex-col gap-4">
          {feedItems.map((item, i) => {
            if (item.type === "milestone") {
              return (
                <MilestoneCard
                  key={i}
                  type={item.data.milestoneType}
                  author={item.data.author}
                  message={item.data.message}
                  detail={item.data.detail}
                  timeAgo={item.data.timeAgo}
                />
              )
            }

            return (
              <FeedPost
                key={i}
                author={item.data.author!}
                content={item.data.content!}
                codeSnippet={item.data.codeSnippet}
                likes={item.data.likes!}
                comments={item.data.comments!}
                repoLink={item.data.repoLink}
                timeAgo={item.data.timeAgo}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
