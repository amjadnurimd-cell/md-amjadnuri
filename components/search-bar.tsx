"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRight, Mic, Camera } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  defaultValue?: string
  compact?: boolean
}

export function SearchBar({ defaultValue = "", compact = false }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Navigate to Eagle Search results page
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", compact ? "max-w-2xl" : "max-w-3xl mx-auto")}>
      <div
        className={cn(
          "relative flex items-center gap-3 rounded-full border bg-card transition-all duration-300",
          compact ? "px-4 py-2" : "px-6 py-4",
          isFocused
            ? "border-primary shadow-[0_0_30px_rgba(215,160,70,0.15)]"
            : "border-border hover:border-muted-foreground/50"
        )}
      >
        <Search className={cn("text-muted-foreground shrink-0", compact ? "h-4 w-4" : "h-5 w-5")} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search anything..."
          className={cn(
            "flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none",
            compact ? "text-base" : "text-lg"
          )}
        />
        <div className="flex items-center gap-1">
          {!compact && (
            <>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="Voice search"
              >
                <Mic className="h-5 w-5 text-muted-foreground" />
              </button>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="Image search"
              >
                <Camera className="h-5 w-5 text-muted-foreground" />
              </button>
            </>
          )}
          <button
            type="submit"
            className={cn(
              "rounded-full transition-all duration-300",
              compact ? "p-2" : "p-3",
              query.trim()
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            )}
            aria-label="Search"
          >
            <ArrowRight className={cn(compact ? "h-4 w-4" : "h-5 w-5")} />
          </button>
        </div>
      </div>
    </form>
  )
}
