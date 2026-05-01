"use client"

import { Globe, Image, Newspaper, Video, MapPin, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { label: "Web", icon: Globe, active: true, href: "https://www.google.com" },
  { label: "Images", icon: Image, active: false, href: "https://images.google.com" },
  { label: "News", icon: Newspaper, active: false, href: "https://news.google.com" },
  { label: "Videos", icon: Video, active: false, href: "https://www.youtube.com" },
  { label: "Maps", icon: MapPin, active: false, href: "https://maps.google.com" },
  { label: "Shopping", icon: ShoppingBag, active: false, href: "https://shopping.google.com" },
]

export function QuickLinks() {
  return (
    <div className="flex items-center justify-center gap-1 md:gap-2 flex-wrap">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            link.active
              ? "bg-primary/10 text-primary border border-primary/30"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}
        >
          <link.icon className="h-4 w-4" />
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  )
}
