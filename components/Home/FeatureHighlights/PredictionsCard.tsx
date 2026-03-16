"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link"; // Added Import

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function cellVars() {
  return {
    "--tx": `${rand(-40, 40)}px`,
    "--ty": `${rand(-40, 40)}px`,
    "--delay": `${rand(0, 3)}s`,
  } as React.CSSProperties;
}

export default function PredictionsCard() {
  const [mounted, setMounted] = useState(false);
  const [hasLogin, setHasLogin] = useState(false); // Added Auth State

  useEffect(() => {
    setMounted(true);
    // Sync with your existing auth check
    const id = localStorage.getItem("fpl_manager_id");
    setHasLogin(!!id);
  }, []);

  return (
    <div
      className="
        bg-[#0f1d19]
        border border-white/10
        shadow-xl
        p-8 rounded-2xl text-white w-full
        space-y-10
        hover:-translate-y-1.5 transition-all duration-300
      "
    >
      {/* ===== TITLE SECTION ===== */}
      <div>
        <h3 className="text-3xl font-bold mb-4">
          Prediction Model
        </h3>
      </div>

      {/* ===== TABLE SECTION ===== */}
      <div className="bg-emerald-950 p-1 rounded-xl border border-white/10 w-full min-h-[260px] flex items-center">
        <table className="w-full text-center border-separate border-spacing-y-3 text-sm">
          <thead className="text-green-300/80">
            <tr>
              <th>Player</th>
              <th>GW23</th>
              <th>GW24</th>
              <th>GW25</th>
            </tr>
          </thead>

          <tbody>
            {[
              ["Haaland", 6.3, 6.7, 4.6],
              ["Salah", 7.1, 6.8, 5.2],
              ["Palmer", 4.1, 6.5, 6.3],
            ].map(([name, a, b, c]) => (
              <tr key={name as string}>
                <td className="px-4 py-3 rounded-lg bg-emerald-900 border-white/15">
                  {name}
                </td>

                {[a, b, c].map((val, i) => (
                  <td
                    key={i}
                    className="proj-cell px-6 py-3 rounded-lg bg-black border border-white/15 font-semibold"
                    style={mounted ? cellVars() : undefined}
                  >
                    {val as number}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== TEXT SECTION ===== */}
      <div>
        <p className="text-white/80 text-lg leading-relaxed">
          Machine learning–powered predictions with full planning and solving
          capabilities, trusted by top FPL managers.
        </p>
      </div>

      {/* ===== BUTTON SECTION ===== */}
      <div>
        <Link 
          href={hasLogin ? "/prediction" : "/login"}
          className="inline-block border border-white/20 px-8 py-3 rounded-lg hover:bg-white/10 transition"
        >
          View Predictions
        </Link>
      </div>
    </div>
  );
}