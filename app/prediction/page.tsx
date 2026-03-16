"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Added for smooth fade-in
import Pitch from "@/components/Prediction/Pitch";

type ApiPlayer = {
  web_name: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  opponent: string;
  team: string;
  pred_points: number;
  pred_points_base: number;
  is_captain: boolean;
  is_bench: boolean;
};

type ManagerResponse = {
  manager_name: string;
  team_name: string;
  prediction_gw: number;
  team_source_gw: number;
  total_predicted_points: number;
  active_chip: string | null;
  team: ApiPlayer[];
};

export default function PredictionPage() {
  const router = useRouter();
  const [data, setData] = useState<ManagerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getChipName = (chip: string | null) => {
    if (!chip) return null;
    const names: Record<string, string> = {
      "3xc": "Triple Captain",
      "bboost": "Bench Boost",
      "wildcard": "Wildcard",
      "freehit": "Free Hit",
    };
    return names[chip] || chip;
  };

  useEffect(() => {
    const managerId = localStorage.getItem("fpl_manager_id");
    
    if (!managerId) {
      router.push("/login");
      return;
    }

    fetch(`https://fplpredict-backend.onrender.com/manager/${managerId}/prediction`)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setIsLoading(false);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  // ===== LOADING SCREEN =====
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#02110c] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mb-6"></div>
        <p className="text-green-500/80 uppercase tracking-[0.2em] text-xs font-bold animate-pulse">
          Retrieving Predictions...
        </p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <motion.main 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#02110c] pt-24 px-6"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-10">
        {/* ===== INFO HEADER ===== */}
        <div className="w-full max-w-[720px]">
          <div className="text-center mb-6">
            <div className="text-white/70 text-sm uppercase tracking-wide">Gameweek</div>
            <div className="text-3xl font-bold text-white">{data.prediction_gw}</div>
            <div className="mt-5 text-white/70 text-sm uppercase tracking-wide">Total Predicted Points</div>
            <div className="text-2xl font-semibold text-green-400">{data.total_predicted_points}</div>
          </div>

          {Number(data.team_source_gw) < Number(data.prediction_gw) && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-yellow-400 text-sm font-medium">
                Picks for GW{data.prediction_gw} not available. Showing predictions for your 
                <span className="font-bold text-white mx-1">GW{data.team_source_gw}</span> lineup.
              </p>
            </div>
          )}

          <div className="flex justify-between items-end text-white/80 text-sm md:text-base">
            <div>
              <span className="text-white/50">Team:</span> {data.team_name}
            </div>
            <div className="flex flex-col items-end">
              {data.active_chip && (
                <div className="mb-4 px-2 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  Active Chip: {getChipName(data.active_chip)}
                </div>
              )}
              <div>
                <span className="text-white/50">Manager:</span> {data.manager_name}
              </div>
            </div>
          </div>
        </div>

        {/* ===== PITCH ===== */}
        <Pitch players={data.team} activeChip={data.active_chip} />
      </div>
    </motion.main>
  );
}