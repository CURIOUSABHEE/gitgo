import { Github, FileSearch, Rocket } from "lucide-react"

const steps = [
  {
    icon: Github,
    step: "01",
    title: "Connect GitHub",
    description:
      "Link your GitHub account and upload your resume. We analyze your repos, languages, and skills in seconds.",
  },
  {
    icon: FileSearch,
    step: "02",
    title: "Get Matched",
    description:
      "Our AI matches you with open source projects and issues based on your exact skill level and interests.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Start Contributing",
    description:
      "Dive into projects with AI-powered code explanations, then auto-generate a portfolio showcasing your work.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">
            How It Works
          </p>
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Three steps to your first PR
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item, i) => (
            <div key={item.step} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="absolute left-1/2 top-10 hidden h-px w-full bg-border md:block" />
              )}
              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card">
                <item.icon className="h-8 w-8 text-primary" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {item.step}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
