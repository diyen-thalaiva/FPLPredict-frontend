"use client";
import PlayerCard from "./PCard/PlayerCard";

type ApiPlayer = {
  web_name: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  opponent: string;
  team: string;
  pred_points: number;
  pred_points_base: number;
  is_captain: boolean;
  is_vice_captain: boolean; // 1. Added this to the type
  is_bench: boolean;
};

export default function Pitch({
  players,
  activeChip,
}: {
  players: ApiPlayer[];
  activeChip?: string | null;
}) {
  if (!players) return null;

  const isBenchBoost = activeChip === "bboost";

  const getPoints = (p: ApiPlayer) => {
    if (!p.is_bench) return p.pred_points;
    return isBenchBoost ? p.pred_points : p.pred_points_base;
  };

  const starters = players.filter(p => !p.is_bench);
  const bench = players.filter(p => p.is_bench);

  // Helper to render players to avoid repeating props logic 5 times
  const renderPlayer = (p: ApiPlayer) => (
    <PlayerCard 
      key={p.web_name} 
      name={p.web_name} 
      opponent={p.opponent} 
      points={getPoints(p)} 
      kit={`/Kits/${p.team}.png`} 
      captain={p.is_captain}           // 2. Pass Captain flag
      viceCaptain={p.is_vice_captain}  // 3. Pass Vice Captain flag
    />
  );

  const gk = starters.filter(p => p.position === "GK");
  const def = starters.filter(p => p.position === "DEF");
  const mid = starters.filter(p => p.position === "MID");
  const fwd = starters.filter(p => p.position === "FWD");

  return (
    <div className="w-full flex flex-col items-center gap-0">
      <div className="relative w-full max-w-[750px] min-h-[560px] sm:min-h-0 sm:aspect-[4/5] rounded-t-2xl sm:overflow-hidden border-x border-t border-green-500/20 shadow-2xl">
        
        {/* Pitch Background SVG & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#062b20] via-[#041f17] to-[#02110c] rounded-t-2xl" />
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_center,_#00ff88_1px,_transparent_1px)] [background-size:12px_12px]" />

        <svg viewBox="0 0 100 150" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <rect x="1" y="1" width="98" height="148" rx="2" ry="2" fill="none" stroke="rgba(0,255,150,0.3)" strokeWidth="0.6" />
          <line x1="1" y1="75" x2="99" y2="75" stroke="rgba(0,255,150,0.3)" strokeWidth="0.6" />
          <circle cx="50" cy="75" r="12" fill="none" stroke="rgba(0,255,150,0.3)" strokeWidth="0.6" />
          <rect x="25" y="1" width="50" height="25" fill="none" stroke="rgba(0,255,150,0.3)" strokeWidth="0.6" />
          <rect x="37" y="1" width="26" height="10" fill="none" stroke="rgba(0,255,150,0.3)" strokeWidth="0.6" />
          <rect x="25" y="124" width="50" height="25" fill="none" stroke="rgba(0,255,150,0.3)" strokeWidth="0.6" />
        </svg>

        <div className="absolute inset-0 flex flex-col justify-between py-4 sm:py-6 min-h-[560px] sm:min-h-0 w-full">
          {/* GK */}
          <div className="flex justify-center w-full">
            {gk.map(p => renderPlayer(p))}
          </div>

          {/* DEF */}
          <div className="flex justify-between px-2 sm:px-6 w-full">
            {def.map(p => renderPlayer(p))}
          </div>

          {/* MID */}
          <div className="flex justify-between px-2 sm:px-6 w-full">
            {mid.map(p => renderPlayer(p))}
          </div>

          {/* FWD */}
          <div className="flex justify-around px-8 sm:px-20 w-full">
            {fwd.map(p => renderPlayer(p))}
          </div>
        </div>
      </div>

      {/* Bench Section */}
      <div className="relative w-full max-w-[750px] rounded-b-2xl overflow-hidden border-x border-b border-green-500/20 shadow-2xl">
        <div className="absolute inset-0 bg-[#02110c]" />
        
        <div className="relative z-10 py-3 sm:py-4">
          <div className="flex items-center gap-3 px-6 mb-2 sm:mb-4">
            <div className="h-px flex-1 bg-green-500/20" />
            <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium">Bench</span>
            <div className="h-px flex-1 bg-green-500/20" />
          </div>

          <div className="flex justify-between px-2 sm:px-6 w-full">
            {/* The Bench map now correctly passes captain/viceCaptain flags */}
            {bench.map(p => renderPlayer(p))}
          </div>
        </div>
      </div>
    </div>
  );
}