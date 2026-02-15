"use client"

import {
  RefreshCw,
  Palette,
  Download,
  Rocket,
  Github,
  Layout,
  Type,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const themes = [
  { name: "Midnight", color: "bg-background", active: true },
  { name: "Ocean", color: "bg-blue-950" },
  { name: "Forest", color: "bg-emerald-950" },
  { name: "Slate", color: "bg-slate-900" },
]

export function PortfolioControls() {
  return (
    <div className="flex h-full w-72 shrink-0 flex-col border-l border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">
          Portfolio Builder
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Customize and deploy your portfolio
        </p>
      </div>

      <div className="flex-1 overflow-auto p-5">
        {/* Actions */}
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-border text-foreground"
          >
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
            Regenerate from GitHub
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-border text-foreground"
          >
            <Github className="h-4 w-4 text-muted-foreground" />
            Sync Latest Activity
          </Button>
        </div>

        <Separator className="my-5" />

        {/* Theme Selection */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Theme
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.name}
                className={`flex items-center gap-2 rounded-lg border p-2.5 text-sm transition-colors ${
                  theme.active
                    ? "border-primary/40 bg-primary/5 text-foreground"
                    : "border-border text-muted-foreground hover:border-border hover:bg-secondary"
                }`}
              >
                <div className={`h-4 w-4 rounded-full ${theme.color} border border-border`} />
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        <Separator className="my-5" />

        {/* Layout Options */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Layout className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Layout
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-lg border border-primary/40 bg-primary/5 p-3 text-xs text-foreground">
              Centered
            </button>
            <button className="rounded-lg border border-border p-3 text-xs text-muted-foreground hover:bg-secondary">
              Two Column
            </button>
          </div>
        </div>

        <Separator className="my-5" />

        {/* Typography */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Font
            </span>
          </div>
          <div className="space-y-2">
            <button className="w-full rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 text-left text-sm text-foreground">
              <span className="font-sans">Geist Sans</span>
            </button>
            <button className="w-full rounded-lg border border-border px-3 py-2 text-left text-sm text-muted-foreground hover:bg-secondary">
              <span className="font-mono">Geist Mono</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-border p-4">
        <div className="space-y-2">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-green">
            <Rocket className="mr-2 h-4 w-4" />
            Deploy Portfolio
          </Button>
          <Button
            variant="outline"
            className="w-full border-border text-foreground"
          >
            <Download className="mr-2 h-4 w-4" />
            Export HTML
          </Button>
        </div>
      </div>
    </div>
  )
}
