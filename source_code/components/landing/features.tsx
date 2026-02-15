import {
  Brain,
  GitBranch,
  FileText,
  Target,
  Zap,
  Shield,
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description:
      "Our AI analyzes your skills from GitHub and resume to find issues perfectly suited to your experience level.",
  },
  {
    icon: Target,
    title: "Match Score",
    description:
      "See exactly why a project matches you with a transparent scoring system based on your tech stack.",
  },
  {
    icon: GitBranch,
    title: "Smart Onboarding",
    description:
      "Get AI-generated architecture breakdowns so you understand any codebase before making your first PR.",
  },
  {
    icon: FileText,
    title: "Portfolio Generation",
    description:
      "Auto-generate a beautiful portfolio website from your GitHub activity and open source contributions.",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description:
      "Get notified when new issues match your profile. Never miss a great first contribution opportunity.",
  },
  {
    icon: Shield,
    title: "Beginner Friendly",
    description:
      "We filter for good-first-issue labels and welcoming maintainers, so you always feel supported.",
  },
]

export function Features() {
  return (
    <section id="features" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">
            Features
          </p>
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Everything you need to start contributing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From finding the right project to generating your portfolio, gitgo
            has every step covered.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30 hover:bg-secondary/50"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
