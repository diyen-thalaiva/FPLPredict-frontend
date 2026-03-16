"use client";

import { useState, useMemo, useEffect } from "react";

interface Player {
  web_name: string;
  position: string;
  team_name: string;
  ownership_pct: number;
  pred_points: number;
  value: number;
  fixtures?: string[];
}

interface Fixture {
  gw: number;
  home: string;
  away: string;
  home_score: number | null;
  away_score: number | null;
  time: string | null;
  display_date: string | null;
  started: boolean;
  finished: boolean;
  finished_provisional: boolean;
  is_live: boolean;
}

export default function TransferSidebar({
  players,
  isLoading
}: {
  players: Player[];
  isLoading: boolean;
}) {

  const [activeTab, setActiveTab] = useState<"players" | "fixtures">("players");

  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [targetGw, setTargetGw] = useState<number | null>(null);

  const [posFilter, setPosFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("pred_points");

  /* Fetch fixtures when tab opens */
  useEffect(() => {

    if (activeTab !== "fixtures") return;

    fetch("https://fplpredict-backend.onrender.com/fixtures")
      .then(res => res.json())
      .then(data => {
        setFixtures(data.fixtures);
        setTargetGw(data.target_gw);
      });

  }, [activeTab]);

  /* Player filtering */
  const filtered = useMemo(() => {
    return players
      .filter(p => posFilter === "All" || p.position.toLowerCase() === posFilter.toLowerCase())
      .filter(p => p.web_name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (b[sortBy as keyof Player] as number) - (a[sortBy as keyof Player] as number));
  }, [players, posFilter, search, sortBy]);

  const gwFixtures = fixtures.filter(f => f.gw === targetGw);

  /* Group fixtures by day */
  const groupedFixtures = useMemo(() => {
    return gwFixtures.reduce<Record<string, Fixture[]>>((acc, fixture) => {

      const key = fixture.display_date || "TBD";

      if (!acc[key]) acc[key] = [];

      acc[key].push(fixture);

      return acc;

    }, {});
  }, [gwFixtures]);

  return (
    <div className="flex flex-col h-full bg-[#041f17]">

      {/* Tabs */}
      <div className="flex border-b border-green-500/10 bg-black/20">

        <button
          onClick={() => setActiveTab("players")}
          className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest ${
            activeTab === "players"
              ? "text-white border-b-2 border-green-500 bg-[#05211a]"
              : "text-white/40 hover:bg-white/5"
          }`}
        >
          Players
        </button>

        <button
          onClick={() => setActiveTab("fixtures")}
          className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest ${
            activeTab === "fixtures"
              ? "text-white border-b-2 border-green-500 bg-[#05211a]"
              : "text-white/40 hover:bg-white/5"
          }`}
        >
          Fixtures
        </button>

      </div>

      {/* PLAYERS TAB */}
      {activeTab === "players" && (
        <>
          {/* Filters */}
          <div className="p-4 bg-black/10 flex flex-col gap-3 border-b border-green-500/10">

            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
              {["All", "GK", "DEF", "MID", "FWD"].map(pos => (
                <button
                  key={pos}
                  onClick={() => setPosFilter(pos)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase ${
                    posFilter === pos
                      ? "bg-yellow-500 text-black"
                      : "bg-[#1a3a32] text-white/40 hover:bg-[#254d42]"
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Search players..."
                className="bg-[#02110c] border border-white/10 rounded px-3 py-2 text-xs text-white"
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="bg-[#02110c] border border-white/10 rounded px-3 py-2 text-xs text-white"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="pred_points">Sort by xP</option>
                <option value="value">Sort by Price</option>
                <option value="ownership_pct">Sort by Owned</option>
              </select>
            </div>

          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[1fr_55px_60px_50px_90px] text-[9px] font-black uppercase border-b border-white/10">
            <div className="bg-yellow-500 py-2 px-4">Player</div>
            <div className="text-center text-white/40">Owned</div>
            <div className="text-center text-white/40">xP</div>
            <div className="text-center text-white/40">£</div>
            <div className="text-center text-white/40">Next 3</div>
          </div>

          {/* Player List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">

            {isLoading ? (
              <div className="p-20 text-center text-white/20 text-xs italic">
                Loading predictions...
              </div>
            ) : filtered.map((p, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_55px_60px_50px_90px] py-3 px-4 border-b border-white/5 hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-2">
                  <img src={`/Kits/${p.team_name}.png`} className="w-5 h-auto"/>
                  <span className="text-[11px] font-bold text-white">{p.web_name}</span>
                </div>

                <div className="text-center text-white/60 text-[10px]">
                  {p.ownership_pct}%
                </div>

                <div className="text-center text-yellow-500 font-black text-[10px]">
                  {p.pred_points}
                </div>

                <div className="text-center text-white/80 text-[10px]">
                  {p.value.toFixed(1)}
                </div>

                <div className="flex gap-1 justify-center">
                  {p.fixtures?.slice(0,3).map((f, idx) => (
                    <div key={idx} className="w-6 h-5 bg-gray-200 text-black flex items-center justify-center text-[8px] font-bold">
                      {f?.slice(0,3)}
                    </div>
                  ))}
                </div>

              </div>
            ))}

          </div>
        </>
      )}

      {/* FIXTURES TAB */}
      {activeTab === "fixtures" && (

        <div className="flex-1 overflow-y-auto custom-scrollbar text-xs text-white">

          <div className="px-3 py-2 text-[10px] font-bold uppercase text-white/40 border-b border-white/10">
            GW {targetGw}
          </div>

          {Object.entries(groupedFixtures).map(([date, games]) => (

            <div key={date}>

              {/* Date header */}
              <div className="px-3 py-1 text-[9px] uppercase text-white/40 bg-black/20">
                {date}
              </div>

              {games.map((f, i) => {

                const center = !f.started
                  ? f.time || "TBD"
                  : `${f.home_score ?? 0}-${f.away_score ?? 0}`;

                return (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_auto_1fr] items-center px-3 py-2 border-t border-white/5"
                  >

                    <div className="flex items-center gap-1 justify-end">
                      <span className="font-semibold">{f.home}</span>
                      <img src={`/logos/${f.home}.png`} className="w-4 h-4"/>
                    </div>

                    <div className="text-center text-white/60 text-[10px] font-bold px-3">
                      {center}
                    </div>

                    <div className="flex items-center gap-1">
                      <img src={`/logos/${f.away}.png`} className="w-4 h-4"/>
                      <span className="font-semibold">{f.away}</span>
                    </div>

                  </div>
                );

              })}

            </div>

          ))}

        </div>

      )}

    </div>
  );
}