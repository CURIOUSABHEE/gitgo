import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Star,
  GitPullRequest,
  GitFork,
} from "lucide-react"

const contributions = [
  {
    repo: "vercel/next.js",
    title: "Fix middleware redirect handling for i18n routes",
    type: "PR Merged",
    date: "Jan 2026",
  },
  {
    repo: "tiangolo/fastapi",
    title: "Add typed dependency injection examples to docs",
    type: "PR Merged",
    date: "Dec 2025",
  },
  {
    repo: "supabase/supabase",
    title: "Improve RLS policy documentation with examples",
    type: "PR Merged",
    date: "Nov 2025",
  },
]

const projects = [
  {
    name: "SpaceScope",
    description:
      "A real-time satellite tracking dashboard built with React and Three.js",
    tech: ["React", "Three.js", "Python"],
    stars: 48,
  },
  {
    name: "DevNotes",
    description:
      "Markdown-based note-taking app with AI-powered code summarization",
    tech: ["Next.js", "TypeScript", "OpenAI"],
    stars: 126,
  },
  {
    name: "QueryBuilder",
    description:
      "Visual SQL query builder for PostgreSQL with real-time previews",
    tech: ["React", "PostgreSQL", "Node.js"],
    stars: 89,
  },
]

export function PortfolioPreview() {
  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-destructive/50" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
          <div className="h-3 w-3 rounded-full bg-primary/50" />
        </div>
        <div className="mx-auto flex items-center gap-2 rounded-md bg-secondary px-4 py-1 text-xs text-muted-foreground">
          <span>janedoe.dev</span>
          <ExternalLink className="h-3 w-3" />
        </div>
      </div>

      {/* Portfolio content */}
      <div className="p-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            JD
          </div>
          <h1 className="text-2xl font-bold text-foreground">Jane Doe</h1>
          <p className="mt-1 text-muted-foreground">
            Full-Stack Developer | Open Source Contributor
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <Github className="h-4 w-4" />
              GitHub
            </button>
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </button>
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <Mail className="h-4 w-4" />
              Email
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-primary">
              <GitPullRequest className="h-4 w-4" />
              <span className="text-xl font-bold text-foreground">12</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">PRs Merged</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-primary">
              <Star className="h-4 w-4" />
              <span className="text-xl font-bold text-foreground">263</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Stars Earned</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-primary">
              <GitFork className="h-4 w-4" />
              <span className="text-xl font-bold text-foreground">6</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Repos Contributed</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "React",
              "TypeScript",
              "Python",
              "Next.js",
              "Node.js",
              "PostgreSQL",
              "Docker",
              "Git",
              "REST APIs",
              "Tailwind CSS",
            ].map((skill) => (
              <span
                key={skill}
                className="rounded-md border border-border bg-secondary px-3 py-1 text-sm text-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Open Source Contributions */}
        <div className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Open Source Contributions
          </h2>
          <div className="space-y-3">
            {contributions.map((contrib) => (
              <div
                key={contrib.title}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary">
                    {contrib.repo}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {contrib.date}
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground">{contrib.title}</p>
                <span className="mt-2 inline-block rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {contrib.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.name}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">
                    {project.name}
                  </h3>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3" />
                    {project.stars}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {project.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
