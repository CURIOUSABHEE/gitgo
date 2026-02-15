"use client"

import { Camera } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function SettingsProfile() {
  return (
    <div className="max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your public developer profile information.
        </p>
      </div>

      <Separator className="my-6" />

      {/* Avatar section */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-secondary text-lg font-semibold text-foreground">
              JD
            </AvatarFallback>
          </Avatar>
          <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <Camera className="h-3.5 w-3.5" />
            <span className="sr-only">Change avatar</span>
          </button>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Profile Photo</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            JPG, PNG, or GIF. Max 2MB.
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Form fields */}
      <div className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName" className="text-sm text-foreground">
              First Name
            </Label>
            <Input
              id="firstName"
              defaultValue="Jane"
              className="border-border bg-background text-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lastName" className="text-sm text-foreground">
              Last Name
            </Label>
            <Input
              id="lastName"
              defaultValue="Doe"
              className="border-border bg-background text-foreground"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="title" className="text-sm text-foreground">
            Title
          </Label>
          <Input
            id="title"
            defaultValue="Full-Stack Developer"
            className="border-border bg-background text-foreground"
          />
          <p className="text-xs text-muted-foreground">
            Displayed on your portfolio and community profile.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="username" className="text-sm text-foreground">
            Username
          </Label>
          <Input
            id="username"
            defaultValue="janedoe"
            className="border-border bg-background text-foreground"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="bio" className="text-sm text-foreground">
            Bio
          </Label>
          <textarea
            id="bio"
            rows={3}
            defaultValue="Passionate about open source and building tools that help developers."
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex justify-end">
        <Button className="px-6">Save Changes</Button>
      </div>
    </div>
  )
}
