"use client";
import Image from "next/image";
import Link from "next/link"; // 1. Import Link

export default function PlayerdataCard() {
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
          Player Data
        </h3>
      </div>

      {/* ===== VISUAL PANEL ===== */}
      <div className="bg-emerald-950 p-6 rounded-xl border border-white/10 w-full min-h-[260px] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-green-500/5 blur-3xl" />
        
        {/* Cunha Image */}
        <div className="relative w-40 h-40">
          <Image
            src="/cunha.png"
            alt="Matheus Cunha"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* ===== TEXT SECTION ===== */}
      <div>
        <p className="text-white/80 text-lg leading-relaxed">
          Elite data of players for decision making
        </p>
      </div>

      {/* ===== BUTTON SECTION ===== */}
      <div>
        <Link 
          href="/players"
          className="inline-block border border-white/20 px-8 py-3 rounded-lg hover:bg-white/10 transition text-center"
        >
          View data
        </Link>
      </div>
    </div>
  );
}