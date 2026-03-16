"use client";
import { useState, useMemo } from "react";

export default function TransferModal({ 
  bank, 
  allPlayers, 
  onClose, 
  onSelect,
  fixedPosition
}: { 
  bank: number, 
  allPlayers: any[], 
  onClose: () => void, 
  onSelect: (p: any) => void
  fixedPosition?: string 
}) {
  const [posFilter, setPosFilter] = useState(fixedPosition || "All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("pred_points");
  

  // Logic copied/adapted from TransferSidebar
  const filtered = useMemo(() => {
    return allPlayers
        .filter(p => {
        // If fixedPosition is passed, force it. Otherwise, use local posFilter.
        const matchesPosition = fixedPosition ? p.position === fixedPosition : (posFilter === "All" || p.position === posFilter);
        const matchesSearch = p.web_name.toLowerCase().includes(search.toLowerCase());
        return matchesPosition && matchesSearch;
    })
    .sort((a, b) => (b[sortBy as keyof typeof b] as number) - (a[sortBy as keyof typeof a] as number));
  }, [allPlayers, fixedPosition, posFilter, search, sortBy]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#041f17] w-full max-w-2xl rounded-2xl border border-green-500/20 shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-green-500/10 flex justify-between items-center bg-black/20">
          <h2 className="text-white font-black uppercase tracking-widest">Select Replacement (Bank: {bank.toFixed(1)})</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white text-xl">✕</button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-green-500/10 grid grid-cols-2 gap-2">
           <input 
            type="text" placeholder="Search players..." 
            className="bg-[#02110c] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-green-500/40"
            onChange={(e) => setSearch(e.target.value)}
           />
           <select 
            className="bg-[#02110c] border border-white/10 rounded px-3 py-2 text-xs text-white outline-none focus:border-green-500/40"
            onChange={(e) => setSortBy(e.target.value)}
           >
            <option value="pred_points">Sort by xP</option>
            <option value="value">Sort by Price</option>
            <option value="ownership_pct">Sort by Owned</option>
           </select>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-[1fr_50px_50px_50px_80px] items-center text-[9px] font-black uppercase tracking-widest border-b border-white/10 py-2 px-4 text-white/40">
          <div>Player</div>
          <div className="text-center">Owned</div>
          <div className="text-center">xP</div>
          <div className="text-center">£</div>
          <div className="text-center">Next 3</div>
        </div>

        {/* Player List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filtered.map((p, i) => (
            <div 
              key={`${p.web_name}-${i}`} 
              onClick={() => onSelect(p)} 
              className="grid grid-cols-[1fr_50px_50px_50px_80px] py-3 px-4 border-b border-white/5 hover:bg-green-500/10 cursor-pointer items-center group"
            >
              <div className="flex items-center gap-3">
                <img src={`/Kits/${p.team_name}.png`} className="w-6 h-auto opacity-90" alt="" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white group-hover:text-green-400 transition-colors leading-none">{p.web_name}</span>
                  <span className="text-[8px] text-white/30 uppercase font-bold mt-1">{p.position} | {p.team_name}</span>
                </div>
              </div>

              <div className="text-[10px] text-center font-bold text-white/60">{p.ownership_pct}%</div>
              <div className="text-[10px] text-center font-black text-green-500">{p.pred_points}</div>
              <div className="text-[10px] text-center font-bold text-white/80">{p.value.toFixed(1)}</div>
              
              <div className="flex gap-0.5 justify-end">
                {p.fixtures?.slice(0, 3).map((f: string, idx: number) => (
                  <div key={idx} className="w-6 h-5 rounded-[2px] bg-[#e7e7e7] text-black flex items-center justify-center text-[8px] font-black">
                    {f === "-" ? "-" : f.slice(0, 3)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}