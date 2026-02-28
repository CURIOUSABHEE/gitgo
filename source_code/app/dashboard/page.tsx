"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { RepoCard } from "@/components/dashboard/repo-card"
import { RepoDetailsModal } from "@/components/dashboard/repo-details-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles } from "lucide-react"

const repos = [
  {
    name: "next.js",
    owner: "vercel",
    description:
      "The React Framework for the Web. Used by some of the world's largest companies, Next.js enables you to create full-stack web applications.",
    stars: 128000,
    forks: 27200,
    matchScore: 98,
    matchReason:
      'Matches your React and TypeScript skills from Resume. Similar to your "portfolio-site" repo.',
    language: "TypeScript",
    languageColor: "#3178c6",
    tags: ["good-first-issue", "React", "TypeScript", "help-wanted"],
  },
  {
    name: "fastapi",
    owner: "tiangolo",
    description:
      "FastAPI framework, high performance, easy to learn, fast to code, ready for production.",
    stars: 79000,
    forks: 6600,
    matchScore: 94,
    matchReason:
      "Matches your Python skill from Resume. REST API experience from your GitHub repos.",
    language: "Python",
    languageColor: "#3572A5",
    tags: ["good-first-issue", "Python", "API", "beginner-friendly"],
  },
  {
    name: "supabase",
    owner: "supabase",
    description:
      "The open source Firebase alternative. Build in a weekend, scale to millions.",
    stars: 74000,
    forks: 7100,
    matchScore: 91,
    matchReason:
      'Matches your PostgreSQL and TypeScript skills. Similar to your "SpaceScope" repo.',
    language: "TypeScript",
    languageColor: "#3178c6",
    tags: ["TypeScript", "PostgreSQL", "help-wanted", "documentation"],
  },
  {
    name: "excalidraw",
    owner: "excalidraw",
    description:
      "Virtual whiteboard for sketching hand-drawn like diagrams. Collaborative and end-to-end encrypted.",
    stars: 87000,
    forks: 8200,
    matchScore: 87,
    matchReason:
      "Matches your React and TypeScript skills. Great beginner-friendly codebase.",
    language: "TypeScript",
    languageColor: "#3178c6",
    tags: ["good-first-issue", "React", "Canvas", "beginner-friendly"],
  },
  {
    name: "langchain",
    owner: "langchain-ai",
    description:
      "Build context-aware reasoning applications with LangChain's flexible framework.",
    stars: 98000,
    forks: 15600,
    matchScore: 82,
    matchReason:
      "Matches your Python skill. Growing AI/ML community with excellent contribution guides.",
    language: "Python",
    languageColor: "#3572A5",
    tags: ["Python", "AI", "good-first-issue", "documentation"],
  },
  {
    name: "cal.com",
    owner: "calcom",
    description:
      "Scheduling infrastructure for absolutely everyone. Open source Calendly alternative.",
    stars: 33000,
    forks: 8100,
    matchScore: 79,
    matchReason:
      "Matches your Node.js and React skills. Active community, welcoming maintainers.",
    language: "TypeScript",
    languageColor: "#3178c6",
    tags: ["TypeScript", "React", "Next.js", "help-wanted"],
  },
]

function DashboardContent() {
  const searchParams = useSearchParams()
  const filter = searchParams?.get("filter")
  const [userSkills, setUserSkills] = useState<string[]>([])
  const [filteredRepos, setFilteredRepos] = useState(repos)
  const [selectedRepo, setSelectedRepo] = useState<{ owner: string; repo: string } | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleRepoClick = (owner: string, repo: string) => {
    setSelectedRepo({ owner, repo })
    setModalOpen(true)
  }

  // Fetch user skills for filtering
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/github/skills")
        if (response.ok) {
          const data = await response.json()
          const allSkills = [...(data.languages || []), ...(data.skills || [])]
          setUserSkills(allSkills)
        }
      } catch (error) {
        console.error("Failed to fetch skills:", error)
      }
    }

    fetchSkills()
  }, [])

  // Apply filter based on query parameter
  useEffect(() => {
    if (filter === "techstack" && userSkills.length > 0) {
      // Filter repos that match user's tech stack
      const filtered = repos.filter((repo) => {
        const repoTechs = [repo.language, ...repo.tags]
        return repoTechs.some((tech) =>
          userSkills.some((skill) =>
            tech.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(tech.toLowerCase())
          )
        )
      })
      setFilteredRepos(filtered)
    } else if (filter === "trending") {
      // Sort by stars for trending
      const sorted = [...repos].sort((a, b) => b.stars - a.stars)
      setFilteredRepos(sorted)
    } else {
      setFilteredRepos(repos)
    }
  }, [filter, userSkills])

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Dashboard" />

      <div className="flex-1 p-6">
        {/* Welcome banner */}
        <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {filter === "techstack"
                  ? "Matches Your Tech Stack"
                  : filter === "trending"
                  ? "Trending Projects"
                  : "Recommended for You"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {filter === "techstack"
                  ? `Showing ${filteredRepos.length} projects matching your skills`
                  : filter === "trending"
                  ? "Most popular open source projects"
                  : "Personalized matches based on your Resume and GitHub profile"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 bg-secondary">
            <TabsTrigger value="all">All Matches</TabsTrigger>
            <TabsTrigger value="high">High Match (90%+)</TabsTrigger>
            <TabsTrigger value="beginner">Beginner Friendly</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredRepos.map((repo) => (
                <RepoCard 
                  key={`${repo.owner}/${repo.name}`} 
                  {...repo} 
                  onCardClick={handleRepoClick}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="high">
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredRepos
                .filter((r) => r.matchScore >= 90)
                .map((repo) => (
                  <RepoCard 
                    key={`${repo.owner}/${repo.name}`} 
                    {...repo} 
                    onCardClick={handleRepoClick}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="beginner">
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredRepos
                .filter((r) => r.tags.includes("beginner-friendly"))
                .map((repo) => (
                  <RepoCard 
                    key={`${repo.owner}/${repo.name}`} 
                    {...repo} 
                    onCardClick={handleRepoClick}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Repository Details Modal */}
        {selectedRepo && (
          <RepoDetailsModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            owner={selectedRepo.owner}
            repo={selectedRepo.repo}
          />
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col">
        <DashboardHeader title="Dashboard" />
        <div className="flex-1 p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
