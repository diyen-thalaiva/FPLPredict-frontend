"use client";

import { useEffect, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Player {
  web_name: string;
  position: string;
  team_name: string;
  ownership_pct: number;
  pred_points: number;
  total_points: number;
  value: number;
  fixtures?: string[];
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [posFilter, setPosFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("total_points");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const fixtureRes = await fetch("https://fplpredict-backend.onrender.com/fixtures");
        const fixtureData = await fixtureRes.json();
        const targetGw = fixtureData.target_gw;
        const predictionRes = await fetch(`https://fplpredict-backend.onrender.com/predict/next-gw/${targetGw}`);
        const predictionData = await predictionRes.json();
        setPlayers(predictionData.predictions);
      } catch (error) {
        console.error("Failed to fetch dynamic data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = useMemo(() => {
    if (!Array.isArray(players)) return [];
    return players
      .filter(p => posFilter === "All" || p.position.toLowerCase() === posFilter.toLowerCase())
      .filter(p => p.web_name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (b[sortBy as keyof Player] as number) - (a[sortBy as keyof Player] as number));
  }, [players, posFilter, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginatedPlayers = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [posFilter, search, sortBy]);

  return (
    <main className="min-h-screen bg-[#02110c] pt-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-3xl font-black mb-8">Players</h1>

        <div className="bg-[#041f17] rounded-xl border border-green-500/10 overflow-hidden">
          <div className="p-4 bg-black/10 flex flex-col gap-3 border-b border-green-500/10">
            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
              {["All", "GK", "DEF", "MID", "FWD"].map(pos => (
                <button key={pos} onClick={() => setPosFilter(pos)} className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase whitespace-nowrap ${posFilter === pos ? "bg-yellow-500 text-black" : "bg-[#1a3a32] text-white/40 hover:bg-[#254d42]"}`}>
                  {pos}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Search..." className="bg-[#02110c] border border-white/10 rounded px-3 py-2 text-xs text-white" onChange={(e) => setSearch(e.target.value)} />
              <select className="bg-[#02110c] border border-white/10 rounded px-2 py-2 text-[10px] text-white" onChange={(e) => setSortBy(e.target.value)}>
                <option value="total_points">Total Pts</option>
                <option value="pred_points">xP</option>
                <option value="value">Price</option>
              </select>
            </div>
          </div>

          {/* Grid Header */}
          <div className="grid grid-cols-[1fr_55px_55px_40px_85px] sm:grid-cols-[1fr_80px_80px_60px_120px] text-[8px] sm:text-[10px] font-black uppercase border-b border-white/10">
            <div className="bg-yellow-500 py-3 px-2 sm:px-4">Player</div>
            <div className="text-center text-white/40 py-3">Pts</div>
            <div className="text-center text-white/40 py-3">Own</div>
            <div className="text-center text-white/40 py-3">£</div>
            <div className="text-center text-white/40 py-3">Next 3</div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? <div className="p-20 text-center text-white/20 text-xs italic">Loading...</div> : 
              paginatedPlayers.map((p, i) => (
                <div key={i} className="grid grid-cols-[1fr_55px_55px_40px_85px] sm:grid-cols-[1fr_80px_80px_60px_120px] py-3 px-2 sm:px-4 border-b border-white/5 hover:bg-white/[0.03] items-center">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img src={`/kits/${p.team_name}.png`} className="w-4 h-auto sm:w-5" />
                    <div className="flex flex-col truncate">
                      <span className="text-[9px] sm:text-[11px] font-bold text-white truncate">{p.web_name}</span>
                      <span className="text-[7px] sm:text-[8px] text-white/30 uppercase font-bold">{p.position} {p.team_name.slice(0,3)}</span>
                    </div>
                  </div>
                  <div className="text-center text-green-400 font-black text-[9px] sm:text-[11px]">{p.total_points}</div>
                  <div className="text-center text-white/60 text-[8px] sm:text-[10px] truncate">{p.ownership_pct}%</div>
                  <div className="text-center text-white/80 text-[8px] sm:text-[10px]">{p.value.toFixed(1)}</div>
                  <div className="flex gap-[1px] sm:gap-1 justify-center">
                    {p.fixtures?.slice(0,3).map((f, idx) => (
                      <div key={idx} className="w-5 h-5 sm:w-7 sm:h-6 bg-[#e7e7e7] text-black flex items-center justify-center text-[7px] sm:text-[8px] font-black rounded-[2px]">
                        {f === "-" ? "-" : f.slice(0,3)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          <div className="flex items-center justify-center gap-4 py-4 bg-black/20 border-t border-white/5 text-white">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-1 disabled:opacity-30 hover:bg-white/10 rounded"><ChevronLeft size={20} /></button>
            <span className="text-[10px] font-bold uppercase tracking-widest">{currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-1 disabled:opacity-30 hover:bg-white/10 rounded"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>
    </main>
  );
}