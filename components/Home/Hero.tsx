"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import InfoIcon from '@mui/icons-material/Info'; // 1. Import your icon

export default function Hero() {
  const { scrollYProgress } = useScroll();

  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 40,
  });

  const scale = useTransform(smooth, [0, 0.6], [1, 1.18]);
  const opacity = useTransform(smooth, [0, 0.5], [1, 0]);
  const blur = useTransform(smooth, [0, 0.6], ["blur(0px)", "blur(8px)"]);
  const y = useTransform(smooth, [0, 0.6], [0, -120]);

  // Scroll handler for Feature Highlights
  const handleExploreScroll = () => {
    const element = document.getElementById("feature-highlights");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll handler for Support Guide
  const handleSupportScroll = () => {
    const element = document.getElementById("support-guide");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* ================= DESKTOP HERO ================= */}
      <section className="relative h-screen -mt-16 overflow-hidden text-black hidden lg:block">
        <Image
          src="/player_pass2.jpg"
          alt="player"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-bottom-left"
        />

        <motion.div
          style={{ scale, opacity, filter: blur, y }}
          className="relative z-40 flex items-center justify-end h-full pr-20 md:pr-32"
        >
          <div className="max-w-2xl">
            <h1 className="text-7xl md:text-8xl font-black leading-[0.95] tracking-tight mb-8">
              <span className="text-white">FPL</span>
              <span className="text-green-500">Predict</span>
            </h1>

            <p className="text-white/70 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
              Machine-learning powered projections, transfer planning, and lineup optimisation
              to help you make smarter FPL decisions before every gameweek.
            </p>

            {/* Flex container for the buttons */}
            <div className="flex gap-4">
              <button 
                onClick={handleExploreScroll}
                className="bg-transparent hover:bg-white/10 border-2 border-white/30 px-10 py-4 rounded-full uppercase tracking-wide text-white transition"
              >
                Explore Tools
              </button>
              
              <button 
                onClick={handleSupportScroll}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border-2 border-transparent px-10 py-4 rounded-full uppercase tracking-wide text-white transition"
              >
                <InfoIcon />
                Support Guide
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= MOBILE HERO ================= */}
      <section className="relative h-screen overflow-hidden text-white lg:hidden">
        <Image
          src="/player_mobile.jpg"
          alt="player"
          fill
          priority
          className="object-cover object-bottom-left"
        />

        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="text-5xl font-black leading-tight">
            <span className="text-white">FPL</span>
            <span className="text-green-500">Predict</span>
          </h1>
          <div className="mt-6 backdrop-blur bg-black/40 border border-white/10 rounded-xl p-5 max-w-md">
            <p className="text-white/90 text-lg leading-relaxed">
              Machine-learning projections, transfer planning and player data
              to make smarter FPL decisions every gameweek.
            </p>
          </div>

          {/* Mobile Buttons - Vertical Stack */}
          <div className="flex flex-col gap-4 mt-8 w-full max-w-[280px]">
            <button 
              onClick={handleExploreScroll}
              className="border border-white/20 px-8 py-3 rounded-lg hover:bg-white/10"
            >
              Explore Tools
            </button>
            <button 
              onClick={handleSupportScroll}
              className="flex items-center justify-center gap-2 bg-white/10 border border-transparent px-8 py-3 rounded-lg hover:bg-white/20"
            >
              <InfoIcon />
              Support Guide
            </button>
          </div>
        </div>
      </section>
    </>
  );
}