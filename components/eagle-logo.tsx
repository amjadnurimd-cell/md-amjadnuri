"use client"

import { cn } from "@/lib/utils"

interface EagleLogoProps {
  className?: string
  showName?: boolean
}

export function EagleLogo({ className, showName = false }: EagleLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Eagle head silhouette */}
        <path
          d="M50 10 C30 10 20 25 20 40 C20 50 25 58 30 62 L25 75 L35 68 L40 80 L45 70 L50 85 L55 70 L60 80 L65 68 L75 75 L70 62 C75 58 80 50 80 40 C80 25 70 10 50 10Z"
          fill="currentColor"
          className="text-primary"
        />
        {/* Eagle eye */}
        <circle cx="42" cy="35" r="5" fill="currentColor" className="text-background" />
        <circle cx="42" cy="35" r="2.5" fill="currentColor" className="text-foreground" />
        {/* Beak */}
        <path
          d="M55 38 L75 42 L55 46 Z"
          fill="currentColor"
          className="text-primary"
        />
      </svg>
      {showName && (
        <span className="text-2xl font-bold tracking-tight text-primary">
          EAGLE
        </span>
      )}
    </div>
  )
}
