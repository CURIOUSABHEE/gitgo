import Link from "next/link"
import { Terminal, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Terminal className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">gitgo</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="#" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Built for junior developers, by developers.
        </p>
      </div>
    </footer>
  )
}
