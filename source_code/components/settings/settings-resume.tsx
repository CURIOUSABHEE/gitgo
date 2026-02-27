"use client"

import { useState, useCallback } from "react"
import { Upload, FileText, X, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useGitHub } from "@/hooks/use-github"

export function SettingsResume() {
  const { profile } = useGitHub()
  const userLogin = profile?.user.login || "user"
  
  const [file, setFile] = useState<{ name: string; size: string } | null>({
    name: `${userLogin}_resume_2025.pdf`,
    size: "245 KB",
  })
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile({
        name: droppedFile.name,
        size: `${Math.round(droppedFile.size / 1024)} KB`,
      })
    }
  }, [])

  return (
    <div className="max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Resume</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload or update your resume to improve AI matching. Re-uploading will
          re-trigger the matching algorithm.
        </p>
      </div>

      <Separator className="my-6" />

      {/* Current file */}
      {file && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{file.name}</p>
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">
                {file.size} &middot; Uploaded 3 days ago
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => setFile(null)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-muted-foreground/30"
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
          <Upload className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">
          {file ? "Replace your resume" : "Upload your resume"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Drag and drop your PDF here, or click to browse
        </p>
        <label>
          <input type="file" accept=".pdf" className="sr-only" />
          <Button variant="secondary" size="sm" className="mt-4 h-8 text-xs" asChild>
            <span>Browse Files</span>
          </Button>
        </label>
      </div>

      <Separator className="my-6" />

      <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Your resume is processed locally and used only for matching. It is never shared
          with third parties or repository maintainers.
        </p>
      </div>
    </div>
  )
}
