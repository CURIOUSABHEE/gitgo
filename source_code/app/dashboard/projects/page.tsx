import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  FolderGit2,
  GitPullRequest,
  GitCommit,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
} from "lucide-react"
import Link from "next/link"

const trackedProjects = [
  {
    name: "next.js",
    owner: "vercel",
    slug: "vercel-nextjs",
    language: "TypeScript",
    languageColor: "#3178c6",
    status: "in-progress" as const,
    prTitle: "fix: resolve hydration mismatch in app router",
    prNumber: 58234,
    prStatus: "open" as const,
    progress: 65,
    lastActivity: "2 hours ago",
    issuesCompleted: 1,
    issuesTotal: 3,
    stars: 128000,
  },
  {
    name: "fastapi",
    owner: "tiangolo",
    slug: "tiangolo-fastapi",
    language: "Python",
    languageColor: "#3572A5",
    status: "merged" as const,
    prTitle: "docs: add tutorial for WebSocket authentication",
    prNumber: 12045,
    prStatus: "merged" as const,
    progress: 100,
    lastActivity: "3 days ago",
    issuesCompleted: 2,
    issuesTotal: 2,
    stars: 79000,
  },
  {
    name: "excalidraw",
    owner: "excalidraw",
    slug: "excalidraw-excalidraw",
    language: "TypeScript",
    languageColor: "#3178c6",
    status: "in-progress" as const,
    prTitle: "feat: add keyboard shortcut for shape rotation",
    prNumber: 8891,
    prStatus: "review" as const,
    progress: 85,
    lastActivity: "5 hours ago",
    issuesCompleted: 1,
    issuesTotal: 1,
    stars: 87000,
  },
  {
    name: "supabase",
    owner: "supabase",
    slug: "supabase-supabase",
    language: "TypeScript",
    languageColor: "#3178c6",
    status: "saved" as const,
    prTitle: "",
    prNumber: 0,
    prStatus: "open" as const,
    progress: 0,
    lastActivity: "1 week ago",
    issuesCompleted: 0,
    issuesTotal: 2,
    stars: 74000,
  },
]

function StatusBadge({ status }: { status: string }) {
  if (status === "merged") {
    return (
      <Badge className="border-0 bg-primary/15 text-primary">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Merged
      </Badge>
    )
  }
  if (status === "in-progress") {
    return (
      <Badge className="border-0 bg-amber-500/15 text-amber-400">
        <Clock className="mr-1 h-3 w-3" />
        In Progress
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="border-border text-muted-foreground">
      <Star className="mr-1 h-3 w-3" />
      Saved
    </Badge>
  )
}

function PRStatusIndicator({ status }: { status: string }) {
  if (status === "merged") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-primary">
        <GitPullRequest className="h-3.5 w-3.5" />
        Merged
      </span>
    )
  }
  if (status === "review") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-amber-400">
        <AlertCircle className="h-3.5 w-3.5" />
        In Review
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <GitPullRequest className="h-3.5 w-3.5" />
      Open
    </span>
  )
}

export default function ProjectsPage() {
  const inProgress = trackedProjects.filter((p) => p.status === "in-progress")
  const merged = trackedProjects.filter((p) => p.status === "merged")
  const saved = trackedProjects.filter((p) => p.status === "saved")

  return (
    <div className="flex flex-col">
      <DashboardHeader title="My Projects" />

      <div className="flex-1 p-6">
        {/* Overview stats */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FolderGit2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              My Projects
            </h2>
            <p className="text-sm text-muted-foreground">
              Track your contributions, pull requests, and saved repos
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-foreground">
                {trackedProjects.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Projects</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-primary">
                {merged.length}
              </p>
              <p className="text-xs text-muted-foreground">PRs Merged</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-amber-400">
                {inProgress.length}
              </p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-foreground">
                {trackedProjects.reduce(
                  (sum, p) => sum + p.issuesCompleted,
                  0
                )}
              </p>
              <p className="text-xs text-muted-foreground">Issues Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Project sections */}
        {inProgress.length > 0 && (
          <section className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4 text-amber-400" />
              In Progress ({inProgress.length})
            </h3>
            <div className="grid gap-4">
              {inProgress.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </section>
        )}

        {merged.length > 0 && (
          <section className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Merged ({merged.length})
            </h3>
            <div className="grid gap-4">
              {merged.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </section>
        )}

        {saved.length > 0 && (
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Star className="h-4 w-4" />
              Saved ({saved.length})
            </h3>
            <div className="grid gap-4">
              {saved.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function ProjectCard({
  project,
}: {
  project: (typeof trackedProjects)[number]
}) {
  return (
    <Card className="border-border bg-card transition-colors hover:border-primary/30">
      <CardHeader className="flex flex-row items-start justify-between gap-4 p-5 pb-3">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <Link
              href={`/dashboard/project/${project.slug}`}
              className="text-base font-semibold text-foreground hover:text-primary transition-colors"
            >
              {project.owner}/{project.name}
            </Link>
            <StatusBadge status={project.status} />
          </div>
          {project.prTitle && (
            <div className="flex items-center gap-2">
              <PRStatusIndicator status={project.prStatus} />
              <span className="text-sm text-muted-foreground">
                {project.prTitle}
              </span>
              {project.prNumber > 0 && (
                <span className="font-mono text-xs text-muted-foreground">
                  #{project.prNumber}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: project.languageColor }}
          />
          <span className="text-xs text-muted-foreground">
            {project.language}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            {project.status !== "saved" && (
              <div className="mb-2">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Progress
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    {project.progress}%
                  </span>
                </div>
                <Progress
                  value={project.progress}
                  className="h-1.5 bg-secondary [&>div]:bg-primary"
                />
              </div>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <GitCommit className="h-3 w-3" />
                {project.issuesCompleted}/{project.issuesTotal} issues
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {project.lastActivity}
              </span>
            </div>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href={`/dashboard/project/${project.slug}`}>
              <ExternalLink className="mr-1 h-3.5 w-3.5" />
              View
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
