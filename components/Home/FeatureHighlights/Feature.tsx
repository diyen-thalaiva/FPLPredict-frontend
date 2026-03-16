"use client";

import { motion } from "framer-motion";
import PredictionsCard from "./PredictionsCard";
import TransferPlannerCard from "./TransferPlannerCard";
import LineupSuggestorCard from "./Playerdatacard";

const fadeUp = {
  hidden: { opacity: 0, y: 80 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.25, duration: 0.8 },
  }),
};

export default function FeatureHighlights() {
  return (
    <section
      id="feature-highlights"
      className="relative py-32 bg-linear-to-br from-[#0a0f0d] via-[#0f2a22] to-[#1a4d3e] text-white overflow-hidden">
      
      {/* Dark cinematic overlay (same feel as hero) */}
      <div className="absolute inset-0 bg-black/70 z-0" />
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-200 h-100 bg-green-900/20 blur-3xl rounded-full" />


      {/* Soft green glow for depth */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-225 h-100 bg-green-900/20 blur-3xl rounded-full z-0" />

      {/* Content */}
      <div className="relative z-10">
        <h2 className="text-5xl font-bold text-center mb-6">
          Powerful Features for Smart Managers
        </h2>

        <p className="text-center text-white/60 max-w-2xl mx-auto mb-20">
          Everything you need to plan, predict and optimise your Fantasy Premier League season using machine learning insights.
        </p>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10 px-8">
          {[PredictionsCard, TransferPlannerCard, LineupSuggestorCard].map(
            (Card, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false }}
                variants={fadeUp}
              >
                <Card />
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
