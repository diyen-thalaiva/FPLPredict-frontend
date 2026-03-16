"use client"

import { useEffect, useState } from "react"
import FixtureList from "@/components/fixtures/FixtureList"

type Fixture = {
  gw: number
  home: string
  away: string
  home_score: number | null
  away_score: number | null
  time: string | null
  display_date: string | null
  started: boolean
  finished: boolean
  finished_provisional: boolean
  is_live: boolean;
}

export default function FixturesPage() {

  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [currentGw, setCurrentGw] = useState<number | null>(null)

  useEffect(() => {

    fetch("https://fplpredict-backend.onrender.com/fixtures")
      .then(res => res.json())
      .then(data => {

        setFixtures(data.fixtures)

        // automatically open the target GW
        setCurrentGw(data.target_gw)

      })

  }, [])

  // wait until gw is loaded
  if (!currentGw) {
    return (
      <main className="min-h-screen bg-[#02110c] flex items-center justify-center text-white">
        Loading fixtures...
      </main>
    )
  }

  const gws = [...new Set(fixtures.map(f => f.gw))]
    .filter(Boolean)
    .sort((a, b) => a - b)

  const currentIndex = gws.indexOf(currentGw)

  const gwFixtures = fixtures.filter(f => f.gw === currentGw)

  return (
    <main className="min-h-screen bg-[#02110c] pt-24 px-6">

      <div className="max-w-4xl mx-auto">

        {/* Title */}
        <h1 className="text-white text-3xl font-black mb-8">
          Fixtures
        </h1>

        {/* GW Navigation */}
        <div className="flex items-center justify-between mb-6">

          <button
            disabled={currentIndex <= 0}
            onClick={() => setCurrentGw(gws[currentIndex - 1])}
            className="text-white hover:text-green-500 disabled:opacity-30 transition"
          >
            ← Previous
          </button>

          <h2 className="text-white font-bold text-lg">
            Gameweek {currentGw}
          </h2>

          <button
            disabled={currentIndex >= gws.length - 1}
            onClick={() => setCurrentGw(gws[currentIndex + 1])}
            className="text-white hover:text-green-500 disabled:opacity-30 transition"
          >
            Next →
          </button>

        </div>

        {/* Fixtures */}
        <FixtureList fixtures={gwFixtures} />

      </div>

    </main>
  )
}