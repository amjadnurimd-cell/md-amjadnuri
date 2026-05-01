"use client"

import { useEffect, useState } from "react"

interface StatProps {
  value: string
  label: string
  delay?: number
}

function Stat({ value, label, delay = 0 }: StatProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`flex flex-col transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <span className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
        {value}
      </span>
      <span className="text-sm md:text-base text-muted-foreground mt-1">
        {label}
      </span>
    </div>
  )
}

export function Stats() {
  return (
    <div className="w-full border-t border-border">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
        <div className="p-6 md:p-8">
          <Stat value="50B+" label="Pages indexed daily" delay={100} />
        </div>
        <div className="p-6 md:p-8">
          <Stat value="0.3s" label="Average response time" delay={200} />
        </div>
        <div className="p-6 md:p-8">
          <Stat value="99.9%" label="Uptime guarantee" delay={300} />
        </div>
        <div className="p-6 md:p-8">
          <Stat value="180+" label="Countries served" delay={400} />
        </div>
      </div>
    </div>
  )
}
