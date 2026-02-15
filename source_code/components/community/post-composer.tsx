"use client"

import { Code, ImageIcon, Link2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function PostComposer() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-secondary text-xs font-medium text-foreground">
            JD
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div
            className="min-h-[60px] w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground transition-colors focus-within:border-primary/40 focus-within:text-foreground"
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-label="What are you building today?"
            data-placeholder="What are you building today?"
          />
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Code className="h-3.5 w-3.5" />
                Code
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Image
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Link2 className="h-3.5 w-3.5" />
                Link
              </Button>
            </div>
            <Button size="sm" className="h-8 px-4 text-xs font-medium">
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
