"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface Integration {
  name: string
  description: string
  connected: boolean
  icon: React.ReactNode
  username?: string
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const integrations: Integration[] = [
  {
    name: "GitHub",
    description: "Used to analyze your repositories and find matching open source projects.",
    connected: true,
    icon: <GitHubIcon />,
    username: "janedoe",
  },
  {
    name: "LinkedIn",
    description: "Import your experience and skills to improve match accuracy.",
    connected: false,
    icon: <LinkedInIcon />,
  },
]

export function SettingsIntegrations() {
  return (
    <div className="max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Integrations</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect your accounts to improve matching accuracy.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-foreground">
                {integration.icon}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <p className="text-sm font-semibold text-foreground">
                    {integration.name}
                  </p>
                  {integration.connected ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                      Not connected
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {integration.description}
                </p>
                {integration.username && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Signed in as{" "}
                    <span className="font-medium text-foreground">
                      @{integration.username}
                    </span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {integration.connected ? (
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Re-sync Data
                </Button>
              ) : (
                <Button size="sm" className="h-8 text-xs">
                  Connect
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Last synced: 2 hours ago. gitgo only reads public repository data and does not
          modify any of your accounts.
        </p>
      </div>
    </div>
  )
}
