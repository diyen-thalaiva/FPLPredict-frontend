"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getPlans,
  createPlan,
  deletePlan,
  duplicatePlan,
  renamePlan, // Added this from your lib
  Plan,
  PlannerPlayer,
} from "@/lib/plannerStorage";

export default function PlannerHubPage() {
  const router = useRouter();
  const [managerId, setManagerId] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Rename States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const maxPlans = 5;

  useEffect(() => {
    const id = localStorage.getItem("fpl_manager_id");
    if (!id) {
      router.push("/login");
      return;
    }
    setManagerId(id);
    setPlans(getPlans(id));
  }, [router]);

  const refreshPlans = () => {
    if (managerId) {
      const freshPlans = getPlans(managerId);
      setPlans([...freshPlans]); // Spread to force React re-render
    }
  };

  //  CREATE
  const handleCreatePlan = async () => {

    if (plans.length >= maxPlans) {
      alert("You cannot create more than 5 plans. Please delete any unused plan first.");
      return;
    }

    if (isCreating) return;

    try {
      setIsCreating(true);

      const res = await fetch(`https://fplpredict-backend.onrender.com/manager/${managerId}/planner`);

      if (!res.ok) {
        const error = await res.json();
        alert(error.detail || "Planner closed.");
        return;
      }

      const data = await res.json();

      const newPlan = createPlan(managerId!, data.prediction_gw, data.team);

      if (!newPlan) {
        alert("You cannot create more than 2 plans. Please delete an unused plan first.");
        return;
      }

      refreshPlans();

    } catch (e) {
      alert("Failed to create plan");
    } finally {
      setIsCreating(false);
    }
  };  

  //  DELETE
  const handleDelete = (id: string) => {
    if (window.confirm("Delete this plan? This cannot be undone.")) {
      deletePlan(managerId!, id);
      refreshPlans();
    }
  };

  //  DUPLICATE
  const handleDuplicate = (id: string) => {
    if (plans.length >= maxPlans) {
      alert("Maximum 2 plans allowed in guest mode.");
      return;
    }
    duplicatePlan(managerId!, id);
    refreshPlans();
  };

  //  RENAME logic
  const handleRenameSubmit = (id: string) => {
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }
    renamePlan(managerId!, id, editName);
    setEditingId(null);
    refreshPlans();
  };

  if (!managerId) return null;

  return (
    <main className="min-h-screen bg-[#02110c] pt-24 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
              Transfer Planner
            </h1>
            <p className="text-white/50 text-sm mt-1 font-medium">
              Saved Plans ({plans.length}/{maxPlans})
            </p>
          </div>

          <button
            onClick={handleCreatePlan}
            disabled={isCreating}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all border ${
              plans.length >= maxPlans || isCreating
                ? "border-whites/10 text-white/20 cursor-not-allowed"
                : "border-[#00ff85]/40 text-[#00ff85] hover:bg-[#00ff85]/10 hover:border-[#00ff85]"
            }`}
          >
            {isCreating ? "Fetching Squad..." : "+ New Plan"}
          </button>
        </div>

        {/* LIST SECTION */}
        <div className="flex flex-col gap-4">
          {plans.map(plan => (
            <div key={plan.id} className="flex items-center justify-between border border-white/10 rounded-xl p-5 bg-white/5 backdrop-blur group transition-all hover:bg-white/[0.07]">
              <div className="flex-1">
                {editingId === plan.id ? (
                  <input
                    autoFocus
                    className="bg-white/10 border border-[#00ff85]/50 text-white px-2 py-1 rounded outline-none text-lg font-bold w-full max-w-[300px]"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameSubmit(plan.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    onBlur={() => handleRenameSubmit(plan.id)}
                  />
                ) : (
                  <div className="flex items-center gap-3 group/name">
                    <div className="text-white font-bold text-lg group-hover:text-[#00ff85] transition-colors leading-none">
                        {plan.name}
                    </div>
                
                    {/* The Pen Icon - Now larger and easier to see on hover */}
                    <button 
                        onClick={() => {
                            setEditingId(plan.id);
                            setEditName(plan.name);
                        }}
                        className="
                            opacity-0 group-hover/name:opacity-100 
                            text-white/40 hover:text-[#00ff85] 
                            transition-all duration-200 
                            p-1.5 rounded-md hover:bg-white/5
                            text-base /* Increased from text-xs to text-base */

                        "
                        title="Rename Plan"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="18" 
                            height="18" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </button>
                </div>
                )}
                <div className="text-white/40 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  Gameweek {plan.gw} • Created {new Date(plan.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <button 
                  onClick={() => router.push(`/planner/${plan.id}`)} 
                  className="text-[#00ff85] font-bold text-sm hover:brightness-125 transition"
                >
                  View
                </button>
                <button 
                  onClick={() => handleDuplicate(plan.id)} 
                  className="text-white/40 hover:text-white text-sm transition"
                >
                  Duplicate
                </button>
                <button 
                  onClick={() => handleDelete(plan.id)} 
                  className="text-red-500/60 hover:text-red-500 text-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {plans.length === 0 && !isCreating && (
          <div className="border border-dashed border-white/10 rounded-2xl p-20 text-center bg-white/[0.02]">
             <p className="text-white/30 italic">No plans found. Start by creating your first strategy.</p>
          </div>
        )}
      </div>
    </main>
  );
}