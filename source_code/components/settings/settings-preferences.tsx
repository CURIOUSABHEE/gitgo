"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

interface PreferenceToggle {
  id: string
  label: string
  description: string
  defaultValue: boolean
}

const emailPrefs: PreferenceToggle[] = [
  {
    id: "email-matches",
    label: "New Match Alerts",
    description: "Get notified when new repositories match your profile.",
    defaultValue: true,
  },
  {
    id: "email-digest",
    label: "Weekly Digest",
    description: "A weekly summary of your top matches and community highlights.",
    defaultValue: true,
  },
  {
    id: "email-social",
    label: "Social Activity",
    description: "Likes, comments, and follows from other developers.",
    defaultValue: false,
  },
  {
    id: "email-pr-updates",
    label: "PR Updates",
    description: "Status updates on pull requests you're involved with.",
    defaultValue: true,
  },
]

const pushPrefs: PreferenceToggle[] = [
  {
    id: "push-matches",
    label: "High-Priority Matches",
    description: "Instant alerts for 90%+ match score repositories.",
    defaultValue: true,
  },
  {
    id: "push-mentions",
    label: "Mentions",
    description: "When someone mentions you in a post or comment.",
    defaultValue: true,
  },
  {
    id: "push-milestones",
    label: "Milestones",
    description: "Celebrate your achievements like first PR merged or badges earned.",
    defaultValue: true,
  },
]

function ToggleRow({ pref }: { pref: PreferenceToggle }) {
  const [enabled, setEnabled] = useState(pref.defaultValue)

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <Label
          htmlFor={pref.id}
          className="text-sm font-medium text-foreground"
        >
          {pref.label}
        </Label>
        <p className="mt-0.5 text-xs text-muted-foreground">{pref.description}</p>
      </div>
      <Switch id={pref.id} checked={enabled} onCheckedChange={setEnabled} />
    </div>
  )
}

export function SettingsPreferences() {
  return (
    <div className="max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Preferences</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Control how and when gitgo sends you notifications.
        </p>
      </div>

      <Separator className="my-6" />

      {/* Email Notifications */}
      <div>
        <h3 className="text-sm font-semibold text-foreground">Email Notifications</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Sent to jane.doe@email.com
        </p>
        <div className="mt-3 flex flex-col divide-y divide-border">
          {emailPrefs.map((pref) => (
            <ToggleRow key={pref.id} pref={pref} />
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Push Notifications */}
      <div>
        <h3 className="text-sm font-semibold text-foreground">Push Notifications</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Delivered to your browser or mobile device
        </p>
        <div className="mt-3 flex flex-col divide-y divide-border">
          {pushPrefs.map((pref) => (
            <ToggleRow key={pref.id} pref={pref} />
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex justify-end">
        <Button className="px-6">Save Preferences</Button>
      </div>
    </div>
  )
}
