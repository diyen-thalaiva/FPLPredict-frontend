"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; // 1. Added Link import

export default function TransferPlannerCard() {
  const [hasLogin, setHasLogin] = useState(false); // 2. Added auth state

  useEffect(() => {
    // 3. Sync with Navbar's authentication logic
    const id = localStorage.getItem("fpl_manager_id");
    setHasLogin(!!id);
  }, []);

  const transfers = [
    { outPlayer: "Solanke", outKit: "/Kits/Spurs.png", inPlayer: "Haaland", inKit: "/Kits/Man City.png" },
    { outPlayer: "Palmer", outKit: "/Kits/Chelsea.png", inPlayer: "Saka", inKit: "/Kits/Arsenal.png" },
  ];

  return (
    <div className="bg-[#0f1d19] border border-white/10 shadow-xl p-8 rounded-2xl text-white w-full space-y-10 hover:-translate-y-1.5 transition-all duration-300">
      <div>
        <h3 className="text-3xl font-bold mb-4">Transfer Planner</h3>
      </div>

      {/* ===== VISUAL PANEL - Fixed Height ===== */}
      <div className="bg-emerald-950 p-4 rounded-xl border border-white/10 w-full min-h-[260px] flex flex-col justify-center gap-3">
        {transfers.map((t, i) => (
          <div key={i} className="flex items-center justify-between bg-black/40 px-4 py-3 rounded-lg border border-white/5">
            {/* Outgoing */}
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <Image src={t.outKit} alt={t.outPlayer} fill className="object-contain" />
              </div>
              <span className="text-sm font-semibold truncate">{t.outPlayer}</span>
            </div>

            {/* Arrow */}
            <span className="text-green-500 font-bold px-2">≫</span>

            {/* Incoming */}
            <div className="flex items-center gap-2 text-right">
              <span className="text-sm font-semibold truncate">{t.inPlayer}</span>
              <div className="relative w-10 h-10">
                <Image src={t.inKit} alt={t.inPlayer} fill className="object-contain" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <p className="text-white/80 text-lg leading-relaxed">
          Plan transfers ahead with fixture swings, value tracking and predicted
          points across upcoming gameweeks to maximise returns.
        </p>
      </div>

      {/* 4. Updated Button to Link */}
      <div>
        <Link 
          href={hasLogin ? "/planner" : "/login"}
          className="inline-block border border-white/20 px-8 py-3 rounded-lg hover:bg-white/10 transition text-center"
        >
          Open Planner
        </Link>
      </div>
    </div>
  );
}