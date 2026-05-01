"use client"

import { useState, useEffect } from "react"
import { SearchBar } from "@/components/search-bar"
import { Stats } from "@/components/stats"
import { EagleLogo } from "@/components/eagle-logo"
import { QuickLinks } from "@/components/quick-links"
import { ArrowUpRight } from "lucide-react"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-2">
          <EagleLogo className="w-8 h-8 md:w-10 md:h-10" showName />
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Products
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            Enterprise <ArrowUpRight className="h-3 w-3" />
          </a>
        </nav>
        <button className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity">
          Sign in
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-0">
        <div
          className={`flex flex-col items-center gap-8 md:gap-10 w-full max-w-4xl transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Logo & Title */}
          <div className="flex flex-col items-center gap-4">
            <EagleLogo className="w-20 h-20 md:w-28 md:h-28" />
            <div className="text-center">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-foreground">
                EAGLE
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mt-2 tracking-widest uppercase">
                See Further. Find Faster.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full mt-4">
            <SearchBar />
          </div>

          {/* Quick Links */}
          <QuickLinks />

          {/* Trending Searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="text-xs uppercase tracking-wider mr-2">
              Trending:
            </span>
            {["AI breakthroughs", "Climate summit 2026", "Tech earnings", "Space missions"].map(
              (term) => (
                <a
                  key={term}
                  href={`https://www.google.com/search?q=${encodeURIComponent(term)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full border border-border hover:border-muted-foreground hover:text-foreground transition-all"
                >
                  {term}
                </a>
              )
            )}
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <Stats />

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 gap-4">
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Settings
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Eagle Search. Precision vision across the web.
          </p>
        </div>
      </footer>
    </div>
  )
}
