"use client"

import Link from "next/link"
import { useSession, signIn } from "next-auth/react"
import { Github, LayoutDashboard, ArrowRight, GitBranch, Star, GitPullRequest } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  const { data: session } = useSession()

  const handleGetStarted = () => {
    if (session) {
      // Already logged in, go to dashboard
      window.location.href = "/dashboard"
    } else {
      // Not logged in, sign in with GitHub
      signIn("github", { callbackUrl: "/onboarding" })
    }
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16">
      {/* Background grid effect */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(hsl(0_0%_14%/0.5)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_14%/0.5)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_40%,transparent_100%)]" />

      {/* Glow effect */}
      <div className="pointer-events-none absolute top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-primary" />
          Now matching 10,000+ open source projects
        </div>

        <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
          Launch your Open
          <br />
          <span className="text-primary">Source Career.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
          Upload your resume and connect GitHub. We{"'"}ll match you with issues
          you can actually solve.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="h-12 bg-primary px-8 text-base font-medium text-primary-foreground hover:bg-primary/90 glow-green"
            onClick={handleGetStarted}
          >
            {session ? (
              <>
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                <Github className="mr-2 h-5 w-5" />
                Get Started via GitHub
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 border-t border-border pt-10">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-primary">
              <GitBranch className="h-5 w-5" />
              <span className="text-2xl font-bold text-foreground md:text-3xl">10K+</span>
            </div>
            <span className="text-sm text-muted-foreground">Open Source Projects</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-primary">
              <Star className="h-5 w-5" />
              <span className="text-2xl font-bold text-foreground md:text-3xl">98%</span>
            </div>
            <span className="text-sm text-muted-foreground">Match Accuracy</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-primary">
              <GitPullRequest className="h-5 w-5" />
              <span className="text-2xl font-bold text-foreground md:text-3xl">5K+</span>
            </div>
            <span className="text-sm text-muted-foreground">PRs Merged</span>
          </div>
        </div>
      </div>
    </section>
  )
}
