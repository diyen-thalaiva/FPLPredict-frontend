interface Fixture {
  home: string
  away: string
  home_score: number | null
  away_score: number | null
  time: string | null
  started: boolean
  finished: boolean
  finished_provisional: boolean // Added to handle FPL provisional status
  is_live: boolean
}

export default function FixtureRow({ fixture }: { fixture: Fixture }) {

  const center = !fixture.started
    ? fixture.time || "TBD"
    : `${fixture.home_score ?? 0} - ${fixture.away_score ?? 0}`

  // Updated logic: match is only live if started, not finished, AND not provisionally finished
  const isLive = fixture.started && !fixture.finished && !fixture.finished_provisional

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-2 border-b border-white/5">

      {/* Home */}
      <div className="flex items-center justify-end gap-2 text-white font-semibold">
        <span>{fixture.home}</span>
        <img src={`/logos/${fixture.home}.png`} className="w-5 h-5"/>
      </div>

      {/* Center - Includes Live Icon if game is active */}
      <div className="flex flex-col items-center px-4">
        <div className="text-white/80 font-bold text-sm">
          {center}
        </div>
        {isLive && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Live</span>
          </div>
        )}
      </div>

      {/* Away */}
      <div className="flex items-center gap-2 text-white font-semibold">
        <img src={`/logos/${fixture.away}.png`} className="w-5 h-5"/>
        <span>{fixture.away}</span>
      </div>

    </div>
  )
}