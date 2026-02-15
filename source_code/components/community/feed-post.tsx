"use client"

import { useState } from "react"
import { Heart, MessageCircle, ExternalLink, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface FeedPostProps {
  author: {
    name: string
    handle: string
    initials: string
  }
  content: string
  codeSnippet?: {
    language: string
    code: string
  }
  likes: number
  comments: number
  repoLink?: string
  timeAgo: string
}

export function FeedPost({
  author,
  content,
  codeSnippet,
  likes,
  comments,
  repoLink,
  timeAgo,
}: FeedPostProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-border/80">
      {/* Author header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-secondary text-xs font-medium text-foreground">
              {author.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">{author.name}</p>
            <p className="text-xs text-muted-foreground">
              {author.handle} &middot; {timeAgo}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </div>

      {/* Content */}
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">{content}</p>

      {/* Code snippet */}
      {codeSnippet && (
        <div className="mt-3 overflow-hidden rounded-lg border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">
              {codeSnippet.language}
            </span>
          </div>
          <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-foreground/80">
            <code>{codeSnippet.code}</code>
          </pre>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 gap-1.5 px-2.5 text-xs ${liked ? "text-red-400 hover:text-red-400" : "text-muted-foreground"}`}
          onClick={() => {
            setLiked(!liked)
            setLikeCount((c) => (liked ? c - 1 : c + 1))
          }}
        >
          <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} />
          {likeCount}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {comments}
        </Button>
        {repoLink && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Repo
          </Button>
        )}
      </div>
    </div>
  )
}
