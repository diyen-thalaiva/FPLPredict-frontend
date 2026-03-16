"use client";
import Image from "next/image";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SyncIcon from '@mui/icons-material/Sync';


export interface PlannerPlayerCardProps {
  name?: string; // Made optional for empty state
  points?: number;
  form?: number;
  value?: number; 
  fixtures?: string[];
  kit: string;
  captain?: boolean;
  is_bench?:boolean;
  position?:string;
  viceCaptain?: boolean;
  is_removed?: boolean;
  
  // NEW PROPS FOR LOGIC
  isSubbing?: boolean;       // Is this player selected to be moved?
  isValidTarget?: boolean;   // Can this player be the destination of a sub?
  onSubClick?: (e: React.MouseEvent) => void;   // Triggered by the Swap icon
  onRemoveClick?: () => void; // Triggered by the X icon
}

export default function PlannerPlayerCard({
  name,
  is_removed,
  points,
  form,
  value,
  fixtures = [],
  kit,
  captain,
  viceCaptain,
  isSubbing,
  is_bench,
  position,
  isValidTarget,
  onSubClick,
  onRemoveClick
}: PlannerPlayerCardProps) {
  
  const boxStyle = "flex items-center justify-center bg-[#05211a]/90 border border-green-500/30 backdrop-blur-[1px] shadow-[0_0_4px_rgba(0,255,150,0.15)] group-hover:bg-[#0a3d30] group-hover:border-green-400 transition-colors duration-200 rounded-[2px] sm:rounded-sm";

  // --- STATE 1: EMPTY SLOT (NOW TRIGGERED BY FLAG) ---
  if (is_removed) {
    return (
      <div className="group relative flex flex-col items-center cursor-pointer transition-all duration-200 w-[55px] sm:w-[75px]">
        {/* SYNC ICON: On the right, triggers the revert logic */}
        <div className="absolute top-1 -right-1 z-50">
          <button 
            onClick={(e) => onSubClick?.(e)} // Calls handleSubIconClick
            className="p-1 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20 transition-all shadow-sm"
          >
            <SyncIcon sx={{ fontSize: { xs: '12px', sm: '16px' } }} />
          </button>
        </div>

        <div className="relative w-[75%] h-auto mb-1 mt-2">
          <Image src="/kits/empty_kit.png" alt="Empty" width={80} height={56} className="w-full h-auto object-contain" priority />
        </div>

        
        {/* Dark Green Name Plate: Shows the ORIGINAL name even though kit is empty */}
        <div className="w-full bg-[#0a3d30] py-1 rounded-[4px] border border-white/5 flex items-center justify-center shadow-lg">
          <span className="text-[9px] sm:text-[11px] text-[#00ff85] font-bold uppercase">
             {name} 
          </span>
        </div>
      </div>
    );
  }

  // --- STATE 2: FILLED SLOT ---
  return (
    <div className={`group relative flex flex-col items-center cursor-pointer transition-all duration-200 w-[55px] sm:w-[75px] ${
      isSubbing ? "scale-110 z-40" :  "group-hover:brightness-110 group-hover:drop-shadow-[0_0_8px_rgba(0,255,150,0.6)]"
    }`}>

      {/* NEW: TOP ACTION ICONS */}
      {/* Swap Icon (Top Left) */}
      <div className="absolute -top-2 -left-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); onSubClick?.(e); }}
          className={`p-0.5 rounded-full bg-black/60 shadow-lg ${isSubbing ? 'text-yellow-400' : 'text-white hover:text-green-400'}`}
        >
          <SwapVertIcon sx={{ fontSize: { xs: '14px', sm: '18px' } }} />
        </button>
      </div>
      {/* TOP ACTION ICONS */}


      {/* REMOVE ICON: Only action visible on an active player (Top Right) */}
      <div className="absolute -top-2 -right-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); onRemoveClick?.(); }}
          className="p-0.5 rounded-full bg-black/60 text-white hover:text-red-500 shadow-md transition-colors"
        >
          <HighlightOffIcon sx={{ fontSize: { xs: '14px', sm: '18px' } }} />
        </button>
      </div>

      {/* --- YOUR EXISTING BADGES --- */}
      <div className="absolute -top-1 left-0 flex flex-col gap-[2px] z-30">
        {captain && ( <div className="bg-yellow-400 text-black text-[7px] sm:text-[9px] font-bold px-1 py-[1px] rounded-sm shadow-sm">C</div> )}
        {viceCaptain && ( <div className="bg-white text-black border border-gray-300 text-[7px] sm:text-[9px] font-bold px-1 py-[1px] rounded-sm shadow-sm">V</div> )}
      </div>

      <div className="absolute top-[40%] right-[-4px] bg-[#05211a]/90 border border-white/20 text-gray-100 text-[7px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-[1px] rounded-sm z-30 shadow-md">
        £{value?.toFixed(1)}
      </div>

      {/* --- KIT & DATA --- */}
      <div className={`relative w-[75%] h-auto transition-all duration-200 z-10 ${
        isSubbing ? "brightness-150 drop-shadow-[0_0_10px_rgba(255,255,0,0.5)]" : 
        isValidTarget ? "animate-pulse brightness-125" : "group-hover:brightness-125"
      }`}>
        <Image src={kit} alt={name || "Player"} width={80} height={56} className="w-full h-auto object-contain block drop-shadow-md" />
      </div>

      <div className="flex flex-col w-[60px] sm:w-[80px] gap-[2px] -mt-1 z-20">
        <div className={`${boxStyle} w-full py-[2px] sm:py-1`}>
          <span className="text-white text-[8px] sm:text-[10px] font-bold leading-none truncate px-1">{name}</span>
        </div>

        <div className="flex w-full gap-[2px]">
          <div className={`${boxStyle} flex-1 flex-col py-[2px] sm:py-[4px]`}>
            <span className="text-[5px] sm:text-[6px] text-green-400 font-bold uppercase leading-none">Xp PTS</span>
            <span className="text-white text-[8px] sm:text-[10px] font-bold mt-[1px]">{points}</span>
          </div>
          <div className={`${boxStyle} flex-1 flex-col py-[2px] sm:py-[4px]`}>
            <span className="text-[5px] sm:text-[6px] text-[#5d5dff] font-bold uppercase leading-none">FORM</span>
            <span className="text-white text-[8px] sm:text-[10px] font-bold mt-[1px]">{form}</span>
          </div>
        </div>
        {/* --- CONDITIONAL POSITION BADGE --- */}
        {name && is_bench && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <div className="bg-black/80 backdrop-blur-sm border border-white/10 px-2 py-[0.5px] rounded-full shadow-lg">
              <span className="text-[7px] sm:text-[9px] text-[#00ff85] font-black uppercase tracking-[0.1em]">
                {position}
              </span>
            </div>
          </div>
        )}

        <div className="flex w-full gap-[2px]">
          {fixtures.map((opp, index) => (
            <div key={index} className={`${boxStyle} flex-1 py-[3px] sm:py-[5px]`}>
              <span className="text-white/80 text-[6px] sm:text-[7px] font-medium leading-[0.8] truncate uppercase">{opp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}