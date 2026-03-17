"use client";
import { useState } from "react";
import PlannerPlayerCard from "./PlannerPlayerCard";
import PlayerModal from "./PlayerModal";

type PlannerApiPlayer = {
  web_name: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  fixtures: string[];
  team: string;
  form: number;
  value: number;
  ownership_pct?: number;
  pred_points: number;
  pred_points_base: number;
  is_captain: boolean;
  is_vice_captain: boolean;
  is_bench: boolean;
  is_removed?: boolean;
};

interface PlannerPitchProps {
  players: PlannerApiPlayer[];
  onUpdateSquad: (newSquad: PlannerApiPlayer[]) => void;
  onTransferClick: (player: PlannerApiPlayer) => void;
  onRemovePlayer: (name: string) => void;
}

export default function PlannerPitch({ players, onUpdateSquad, onTransferClick,onRemovePlayer }: PlannerPitchProps) {
  // activeSubId stores the web_name of the player whose LEFT ICON was clicked
  const [activeSubId, setActiveSubId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlannerApiPlayer | null>(null);

  if (!players) return null;

  /**
   * TRIGGER: Called only when the SwapVertIcon (left icon) is clicked.
   */
    const handleSubIconClick = (e: React.MouseEvent, p: PlannerApiPlayer) => {
        e.stopPropagation(); // Stop card click (modal) from firing immediately
        if (p.is_removed) {
            const newSquad = players.map((player) => 
                player.web_name === p.web_name ? { ...player, is_removed: false } : player
            );
            onUpdateSquad(newSquad);
             return;
         }

        // Otherwise, handle the standard substitution selection
        setActiveSubId(prev => prev === p.web_name ? null : p.web_name);
    };

  /**
   * ACTION: Updated to handle both Sub Mode logic and Modal Opening logic
   */
  const handleCardClick = (targetPlayer: PlannerApiPlayer) => {
    // 1. If we are in "Sub Mode", handle the swap logic
    if (activeSubId) {
      const sourcePlayer = players.find((p) => p.web_name === activeSubId);
      
      const isValid = sourcePlayer && 
                      sourcePlayer.position === targetPlayer.position && 
                      sourcePlayer.is_bench !== targetPlayer.is_bench;

      if (isValid) {
        const newSquad = players.map((p) => {
          if (p.web_name === sourcePlayer.web_name) return { ...p, is_bench: targetPlayer.is_bench };
          if (p.web_name === targetPlayer.web_name) return { ...p, is_bench: sourcePlayer.is_bench };
          return p;
        });

        onUpdateSquad(newSquad);
        setActiveSubId(null); // Exit sub mode
      } else if (activeSubId !== targetPlayer.web_name) {
        setActiveSubId(null);
      }
      return; // Stop execution here if we were in sub mode
    }

    // 2. If NOT in sub mode, open the Player Modal
    setSelectedPlayer(targetPlayer);
    setIsModalOpen(true);
  };


  const renderPlayer = (p: PlannerApiPlayer, i: number) => {
    const isSubbing = activeSubId === p.web_name;
    const sourcePlayer = players.find((pl) => pl.web_name === activeSubId);
    
    // A target is valid only if it's the SAME position but on the OTHER section (Bench vs XI)
    const isValidTarget = !!(
      activeSubId &&
      !isSubbing &&
      sourcePlayer?.position === p.position &&
      sourcePlayer?.is_bench !== p.is_bench
    );

    return (
      <div 
        // Combined key ensures unique identity even if multiple slots are "Empty"
        key={`${p.web_name}-${i}`} 
        onClick={() => handleCardClick(p)} 
        className={"relative group"}
      >
        <PlannerPlayerCard
          {...p}
          name={p.web_name}
          is_removed={p.is_removed}
          points={!p.is_bench ? p.pred_points : p.pred_points_base}
          value={p.value}
          is_bench={p.is_bench}
          form={p.form}
          position={p.position}
          fixtures={p.fixtures}
          kit={`/Kits/${p.team}.png`}
          captain={p.is_captain}
          viceCaptain={p.is_vice_captain}
          isSubbing={isSubbing}
          isValidTarget={isValidTarget}
          onSubClick={(e) => handleSubIconClick(e,p)} 
          onRemoveClick={() => onRemovePlayer(p.web_name)}
        />
      </div>
    );
  };

  // Helper to split players for the UI
  const starters = players.filter(p => !p.is_bench);
  const bench = players.filter(p => p.is_bench);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-[580px] h-[75vh] sm:h-[80vh] max-h-[800px] rounded-xl overflow-hidden border border-green-500/20 shadow-2xl bg-[#041f17]">
        {/* Pitch Visuals */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#114d3b] via-[#0a3528] to-[#041f17]" />
        <div className="absolute inset-0 opacity-[0.1] bg-[radial-gradient(circle_at_center,_#00ff88_1px,_transparent_1px)] [background-size:10px_10px]" />
        
        {/* Pitch Lines (SVG) */}
        <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="116" rx="1" fill="none" stroke="rgba(0,255,150,0.2)" strokeWidth="0.3" />
          <line x1="2" y1="60" x2="98" y2="60" stroke="rgba(0,255,150,0.2)" strokeWidth="0.3" />
          <circle cx="50" cy="60" r="8" fill="none" stroke="rgba(0,255,150,0.2)" strokeWidth="0.3" />
          <rect x="20" y="2" width="60" height="15" fill="none" stroke="rgba(0,255,150,0.2)" strokeWidth="0.3" />
        </svg>
        
        {/* All Players Container */}
        <div className="absolute inset-0 flex flex-col justify-between w-full">
          
          {/* Starters Section */}
          <div className="flex flex-col justify-between h-[79%] pt-1 pb-4">
            <div className="flex justify-center w-full scale-[0.85] sm:scale-100 -mt-2 h-[25%]">
              {starters.filter(p => p.position === "GK").map((p, i) => renderPlayer(p, i))}
            </div>
            <div className="flex justify-around px-2 w-full scale-[0.85] sm:scale-100">
              {starters.filter(p => p.position === "DEF").map((p, i) => renderPlayer(p, i))}
            </div>
            <div className="flex justify-around px-2 w-full scale-[0.85] sm:scale-100">
              {starters.filter(p => p.position === "MID").map((p, i) => renderPlayer(p, i))}
            </div>
            <div className="flex justify-center gap-4 sm:gap-12 w-full scale-[0.85] sm:scale-100">
              {starters.filter(p => p.position === "FWD").map((p, i) => renderPlayer(p, i))}
            </div>
          </div>

          {/* Integrated Bench */}
          <div className="mt-auto bg-black/40 backdrop-blur-sm border-t border-white/5 pt-0.4 pb-2">
            <div className="flex justify-center mb-1">
               <span className="text-white/30 text-[9px] uppercase tracking-[0.3em] font-bold">Bench</span>
            </div>
            <div className="flex justify-around px-2 w-full scale-[0.8] sm:scale-90">
              {bench.map((p, i) => renderPlayer(p, i))}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && selectedPlayer && (
        <PlayerModal 
          player={selectedPlayer}
          currentGw={31} // Pass your current GW
          onClose={() => setIsModalOpen(false)}
          onSub={() => {
            setActiveSubId(selectedPlayer.web_name); // Trigger the "Sub Mode" glow
            setIsModalOpen(false); // Close the modal
          }}
          onRemove={() => {
            onRemovePlayer(selectedPlayer.web_name);
            setIsModalOpen(false);
          }}
          onTransfer={() => {
            setIsModalOpen(false); // Close current modal
            onTransferClick(selectedPlayer); // Trigger parent transfer modal
          }}
        />
      )}
    </div>
  );
}