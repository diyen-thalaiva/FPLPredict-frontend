import FixtureRow from "./FixtureRow"

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
  is_live: boolean
}

export default function FixtureList({ fixtures }: { fixtures: Fixture[] }) {

  const grouped = fixtures.reduce<Record<string, Fixture[]>>((acc, fixture) => {
    const key = fixture.display_date || "TBD"

    if (!acc[key]) acc[key] = []
    acc[key].push(fixture)

    return acc
  }, {})

  return (
    <div>

      {Object.entries(grouped).map(([date, games]: [string, Fixture[]]) => (

        <div key={date} className="mb-6">

          <div className="text-white/60 text-xs font-bold px-4 py-2 uppercase border-b border-white/10">
            {date}
          </div>

          {games.map((f: Fixture, i: number) => (
            <FixtureRow key={i} fixture={f}/>
          ))}

        </div>

      ))}

    </div>
  )
}