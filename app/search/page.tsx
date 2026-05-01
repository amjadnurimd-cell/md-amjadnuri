"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { EagleLogo } from "@/components/eagle-logo"
import { SearchBar } from "@/components/search-bar"
import { QuickLinks } from "@/components/quick-links"
import { Globe, ExternalLink } from "lucide-react"

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  // Mock search results for demonstration
  const results = [
    {
      title: `${query} - Wikipedia`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
      displayUrl: "en.wikipedia.org",
      description: `Learn more about ${query}. Comprehensive information, history, and details from the world's largest encyclopedia.`,
    },
    {
      title: `${query} | Latest News & Updates`,
      url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
      displayUrl: "news.google.com",
      description: `Get the latest news and updates about ${query}. Breaking stories, in-depth analysis, and real-time coverage.`,
    },
    {
      title: `${query} - YouTube`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      displayUrl: "youtube.com",
      description: `Watch videos about ${query}. Tutorials, reviews, documentaries, and more from creators worldwide.`,
    },
    {
      title: `${query} Images - EAGLE`,
      url: `https://images.google.com/search?q=${encodeURIComponent(query)}`,
      displayUrl: "images.eagle.com",
      description: `Browse high-quality images of ${query}. Photos, illustrations, and graphics from across the web.`,
    },
    {
      title: `Buy ${query} Online - Shopping`,
      url: `https://shopping.google.com/search?q=${encodeURIComponent(query)}`,
      displayUrl: "shopping.google.com",
      description: `Find the best deals on ${query}. Compare prices from trusted retailers and get the best value.`,
    },
  ]

  const resultCount = "2,450,000,000"
  const searchTime = "0.42"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <a href="/" className="flex-shrink-0">
              <EagleLogo className="w-10 h-10" showName />
            </a>
            <div className="flex-1 max-w-2xl">
              <SearchBar defaultValue={query} compact />
            </div>
          </div>
          <div className="mt-4 -mb-1">
            <QuickLinks />
          </div>
        </div>
      </header>

      {/* Results */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Results stats */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl font-black tracking-tight text-primary">EAGLE</span>
          <span className="text-sm text-muted-foreground">
            About {resultCount} results ({searchTime} seconds)
          </span>
        </div>

        {/* Search results */}
        <div className="space-y-8">
          {results.map((result, index) => (
            <article key={index} className="group">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    {result.displayUrl}
                  </span>
                </div>
              </div>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <h2 className="text-xl text-primary hover:underline font-medium mb-1 flex items-center gap-2">
                  {result.title}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h2>
              </a>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.description}
              </p>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-12 py-8">
          <span className="text-2xl font-bold tracking-tight text-primary">E</span>
          <span className="text-2xl font-bold tracking-tight text-foreground">a</span>
          <span className="text-2xl font-bold tracking-tight text-primary">g</span>
          <span className="text-2xl font-bold tracking-tight text-foreground">l</span>
          <span className="text-2xl font-bold tracking-tight text-primary">e</span>
          <span className="text-2xl font-bold tracking-tight text-foreground">e</span>
          <span className="text-2xl font-bold tracking-tight text-primary">e</span>
          <span className="text-2xl font-bold tracking-tight text-foreground">e</span>
          <span className="text-2xl font-bold tracking-tight text-primary">e</span>
        </div>
        <div className="flex items-center justify-center gap-4 text-sm">
          <button className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors">
            Previous
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded-full transition-colors ${
                page === 1
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors">
            Next
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-6">
            <span>United States</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Settings</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <EagleLogo className="w-16 h-16 animate-pulse" />
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}
