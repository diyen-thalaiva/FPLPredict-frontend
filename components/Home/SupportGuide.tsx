export default function SupportGuide() {
  return (
    <section id="support-guide" className="py-32 bg-[#0a1411] text-white">
      <div className="max-w-5xl mx-auto px-8">
        <h2 className="text-5xl font-bold mb-6">Mastering FPL</h2>
        <p className="text-xl text-white/60 mb-16 max-w-2xl">
          New to the game? Our guide covers the basics of Fantasy Premier League 
          and how our data-driven tools turn complex stats into winning strategies.
        </p>

        {/* Support Material Grid */}
        <div className="space-y-12">
          
          {/* Section 1: The Basics */}
          <div className="bg-[#0f1d19] p-10 rounded-2xl border border-white/10">
            <h3 className="text-3xl font-bold mb-6 text-green-500">1. FPL Fundamentals</h3>
            <p className="text-white/80 leading-relaxed mb-6">
              FPL is a game of management. You have £100m to build a squad of 15 players. 
              Each week, you must select your "Starting 11" and choose a Captain (who scores double points). 
              Success isn't just about picking the best players; it's about <strong>fixture management</strong> 
              and knowing when to rotate your squad.
            </p>
            <div className="bg-black/40 p-6 rounded-lg border border-white/5">
              <h4 className="font-bold mb-2 underline">Why it matters:</h4>
              <p className="text-white/70 italic">"The most successful managers plan 3-5 gameweeks ahead, rather than chasing points from last week's star performer."</p>
            </div>
          </div>

          {/* Section 2: How We Help */}
          <div className="bg-[#0f1d19] p-10 rounded-2xl border border-white/10">
            <h3 className="text-3xl font-bold mb-6 text-green-500">2. Bridging the Data Gap</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-lg mb-2">Projections</h4>
                <p className="text-white/70">Our AI analyzes player form and upcoming opponent difficulty to provide <strong>Expected Points (xP)</strong>, helping you avoid bad transfers.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">The Planner</h4>
                <p className="text-white/70">Visualise your squad's future. Our planner tracks fixture difficulty across the entire season, ensuring you're never caught off-guard by a "Blank Gameweek."</p>
              </div>
            </div>
          </div>

          {/* Section 3: Getting Started */}
          <div className="bg-[#0f1d19] p-10 rounded-2xl border border-white/10">
            <h3 className="text-3xl font-bold mb-6 text-green-500">3. Quick-Start Workflow</h3>
            <ul className="space-y-4 text-white/80">
              <li className="flex gap-4"><span>✅</span> Check <strong>Player Data</strong> for high-value prospects.</li>
              <li className="flex gap-4"><span>✅</span> Use the <strong>Planner</strong> to map out your next 3 transfers.</li>
              <li className="flex gap-4"><span>✅</span> Get insight about players from <strong>Elite data</strong>.</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}