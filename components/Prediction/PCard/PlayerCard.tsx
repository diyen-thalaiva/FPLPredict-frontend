"use client";

import Image from "next/image";

interface PlayerCardProps {
  name: string;
  opponent: string;
  points: number;
  kit: string;
  captain?: boolean;
  viceCaptain?: boolean;
}

export default function PlayerCard({
  name,
  opponent,
  points,
  kit,
  captain,
  viceCaptain,
}: PlayerCardProps) {
  return (
    <div className="group relative flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105 w-[75px] sm:w-[100px]">

      {/* 1. BADGE CONTAINER (Fixed nesting here) */}
      <div className="absolute top-0 left-0 sm:left-2 flex flex-col gap-1 z-20">
        {captain && (
          <div className="bg-yellow-400 text-black text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-[0.5px] sm:py-[1px] rounded shadow-sm">
            C
          </div>
        )}

        {viceCaptain && (
          <div className="bg-white text-black border border-gray-300 text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-[0.5px] sm:py-[1px] rounded shadow-sm">
            V
          </div>
        )}
      </div>

      {/* 2. KIT IMAGE */}
      <div className="relative w-full h-auto transition-filter duration-200 group-hover:brightness-125">
        <Image
          src={kit}
          alt={name}
          width={100}
          height={70}
          className="w-full h-auto object-contain block"
        />
      </div>

      {/* 3. INFO RECTANGLE */}
      <div className="
        flex flex-col items-center
        w-[80px] sm:w-[110px]
        px-1 sm:px-3 py-1 sm:py-1.5
        rounded-sm sm:rounded-md
        bg-[#05211a]/90
        border border-green-500/30
        backdrop-blur-[1px]
        shadow-[0_0_6px_rgba(0,255,150,0.15)]
        transition-colors duration-200
        group-hover:bg-[#0a3d30]
        group-hover:border-green-400
        -mt-1
      ">
        <div className="text-white text-[9px] sm:text-xs font-semibold leading-none truncate w-full text-center">
          {name}
        </div>

        <div className="text-white/60 text-[8px] sm:text-[10px] leading-none mt-0.5 sm:mt-1">
          {opponent}
        </div>
        
        <div className="text-[9px] sm:text-[11px] font-bold leading-none mt-[2px] sm:mt-[4px]">
          <span className="text-green-400">Xp PTS:</span>
          <span className="text-white"> {points}</span>
        </div>
      </div>

    </div>
  );
}