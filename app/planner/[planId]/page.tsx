"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPlanById, Plan, updatePlan } from "@/lib/plannerStorage";
import PlannerPitch from "@/components/Planner/PlannerPitch";
import TransferSidebar from "@/components/Planner/TransferSidebar";
import TransferModal from "@/components/Planner/TransferModal";

export default function PlannerEditorPage() {
  const { planId } = useParams();
  const router = useRouter();
  
  // --- Original States ---
  const [plan, setPlan] = useState<Plan | null>(null);
  const [freeTransfers, setFreeTransfers] = useState<number | null>(null);
  const [bank, setBank] = useState<number | null>(null);
  const [availableChips, setAvailableChips] = useState<string[]>([]);
  const [chipHistory, setChipHistory] = useState<{name: string, gw: number}[]>([]);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [playerToReplace, setPlayerToReplace] = useState<any | null>(null);
  // This holds the team exactly as it was when the modal was opened
  const [originalSquad, setOriginalSquad] = useState<any[]>([]);
  const [draftSquad, setDraftSquad] = useState<any[]>([]);
  const [transferMap, setTransferMap] = useState<Record<string, any>>({});
  const [transferCount, setTransferCount] = useState(0);
  const [transferCost, setTransferCost] = useState(0);



  const handleInitiateTransfer = (player: any) => {
    setOriginalSquad([...plan!.squad]);
    setPlayerToReplace(player);
    setTransferModalOpen(true);
  };

  const handleSaveAndExit = () => {
    router.push("/planner");
  };


  const handleConfirmTransfer = (newPlayer: any) => {
      if (!playerToReplace || !plan) return;

      // 1. Prevent duplicate players
      if (draftSquad.some(p => p.web_name === newPlayer.web_name)) {
        alert("Player is already in your team!");
        return;
      }

      // 2. Max 3 players per team
      const currentTeamCount = draftSquad.filter(
        p =>
          p.team === newPlayer.team_name &&
          p.web_name !== playerToReplace.web_name
      ).length;

      if (currentTeamCount >= 3) {
        alert("Cannot have more than 3 players from same team!");
        return;
      }

      const replacedPlayer = draftSquad.find(
        p => p.web_name === playerToReplace.web_name
      );

      if (!replacedPlayer) return;

      // Bank calculation
      const sellPrice = replacedPlayer.value;
      const buyPrice = newPlayer.value;

      const newBank = (bank ?? 0) + sellPrice - buyPrice;
      setBank(newBank);

      // Transfer count
      const newTransferCount = transferCount + 1;
      setTransferCount(newTransferCount);

      if (freeTransfers !== null) {
        const extraTransfers = Math.max(0, newTransferCount - freeTransfers);
        setTransferCost(extraTransfers * 4);
      }

      // Perform swap
      const newSquad = draftSquad.map(p =>
        p.web_name === playerToReplace.web_name
          ? {
              ...newPlayer,
              team: newPlayer.team_name,
              is_bench: p.is_bench
            }
          : p
      );

      // Store transfer mapping
      setTransferMap(prev => ({
        ...prev,
        [newPlayer.web_name]: replacedPlayer
      }));

      setDraftSquad(newSquad);

      setTransferModalOpen(false);
      setPlayerToReplace(null);
  };

  const handleCloseModal = () => {
    setTransferModalOpen(false);
    setPlayerToReplace(null);
  
    setDraftSquad(originalSquad);
  };


  useEffect(() => {
    const mId = localStorage.getItem("fpl_manager_id");
    if (!mId || !planId) {
      router.push("/planner");
      return;
    }

    const currentPlan = getPlanById(mId, planId as string);
    if (!currentPlan) {
      router.push("/planner");
      return;
    }

    setPlan(currentPlan);
    // restore planner state
    setDraftSquad(currentPlan.squad);
    setBank(currentPlan.bank ?? 0);
    setTransferCount(currentPlan.transferCount ?? 0);
    setTransferCost(currentPlan.transferCost ?? 0);
    setActiveChip(currentPlan.activeChip ?? null);
    fetch(`https://fplpredict-backend.onrender.com/manager/${mId}/planner`)
      .then(res => res.json())
      .then(data => {
        setFreeTransfers(data.free_transfers);
        setAvailableChips(data.available_chips);
        setChipHistory(data.chip_history);
        // ONLY set bank from API if the plan doesn't have a bank value yet 
        if (currentPlan.bank === undefined || currentPlan.bank === null) {
          setBank(data.bank);
        }
      })
      .catch(err => console.error("Planner fetch failed:", err));
    
    fetch(`https://fplpredict-backend.onrender.com/predict/next-gw/${currentPlan.gw}`)
      .then(res => res.json())
      .then(data => {
        setAllPlayers(data.predictions || []);
        setLoadingPlayers(false);
      })
      .catch(err => {
        console.error("Predictions fetch failed:", err);
        setLoadingPlayers(false);
      });

  }, [planId, router]);

  useEffect(() => {
    if (plan) setDraftSquad(plan.squad);
    }, [plan]);

    useEffect(() => {
    if (!plan) return;

    const mId = localStorage.getItem("fpl_manager_id");
    if (!mId) return;

    const updatedPlan = {
      ...plan,
      squad: draftSquad,
      bank: bank ?? 0,
      transferCount,
      transferCost,
      activeChip
    };

    setPlan(updatedPlan);
    updatePlan(mId, updatedPlan);

  }, [draftSquad]);

  // 3. Define the removal logic here
  const handleRemovePlayer = (name: string) => {

    // If player was transferred in → restore original
    if (transferMap[name]) {

      const originalPlayer = transferMap[name];

      const transferredPlayer = draftSquad.find(
        p => p.web_name === name
      );

      if (!transferredPlayer) return;

      // Restore bank (reverse transfer)
      const newBank =
        (bank ?? 0) - originalPlayer.value + transferredPlayer.value;

      setBank(newBank);

      // Reduce transfer count
      const newTransferCount = Math.max(0, transferCount - 1);
      setTransferCount(newTransferCount);

      // Recalculate transfer cost
      if (freeTransfers !== null) {
        const extraTransfers = Math.max(0, newTransferCount - freeTransfers);
        setTransferCost(extraTransfers * 4);
      }

      // Restore original player in squad
      const newSquad = draftSquad.map(p =>
        p.web_name === name
          ? { ...originalPlayer, is_bench: p.is_bench }
          : p
      );

      setDraftSquad(newSquad);

      // Remove mapping
      setTransferMap(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });

      return;
    }

      // Normal remove (for players not transferred)
    const newSquad = draftSquad.map(p => 
      p.web_name === name ? { ...p, is_removed: true } : p
    );

    setDraftSquad(newSquad);
  };



  if (!plan) return (
    <div className="min-h-screen bg-[#02110c] flex items-center justify-center text-white font-medium">
      Loading your plan...
    </div>
  );

  const totalXP = draftSquad.reduce((sum, p) => {

    // Skip bench players unless Bench Boost is active
    if (p.is_bench && activeChip !== "bboost") {
      return sum;
    }

    let points = p.pred_points;

    // Triple Captain
    if (activeChip === "3xc" && p.is_captain) {
      points = p.pred_points_base * 3;
    }

    return sum + points;

  }, 0);





  const isChipUsed = (chipId: string) => chipHistory.some(h => h.name === chipId);

  const getGwUsed = (chipId: string) => {
    const histories = chipHistory.filter(h => h.name === chipId);
    if (histories.length === 0) return "";
    return histories.map(h => `Used GW${h.gw}`).join(" & ");
  };

  const getChipStatus = (chipId: string) => {
    if (!availableChips.includes(chipId)) return "used";
    if (activeChip === chipId) return "active";
    return "available";
  };

  const handleChipClick = (chipId: string) => {
    if (!availableChips.includes(chipId)) return;
    setActiveChip(prev => prev === chipId ? null : chipId);
  };

  return (
    <main className="min-h-screen bg-[#02110c] pt-20 pb-10 px-4">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-white text-3xl sm:text-4xl font-black uppercase tracking-tighter">
            GW{plan.gw} <span className="text-green-500">PLAN</span>
          </h1>
          <div className="h-1 w-20 bg-green-500 rounded-full mt-2" />
        </div>
        <button
          onClick={handleSaveAndExit}
          className="-mt-1 bg-green-500 hover:bg-green-400 text-black font-black text-xs px-4 py-2 rounded-lg shadow-lg transition-all"
        >
          Save & Exit
        </button>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatBox 
            label="Transfers"
            value={
              activeChip === "wildcard"
                ? "Wildcard"
                : activeChip === "freehit"
                ? "Free Hit"
                : freeTransfers !== null
                ? `${transferCount} / ${freeTransfers}`
                : "..."
            }
          />

          <StatBox
            label="Cost"
            value={
              activeChip === "wildcard" || activeChip === "freehit"
                ? "0"
                : transferCost > 0
                ? `-${transferCost}`
                : "0"
            }
          />


          <StatBox 
            label="Bank" 
            value={bank !== null ? bank.toFixed(1) : "..."}
          />
          <StatBox label="xP Points" value={`${totalXP}`} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          <div className="w-full lg:w-[65%] flex flex-col gap-4">
            <div className="bg-[#05211a]/30 rounded-2xl p-4 border border-green-500/10 shadow-inner">
              <PlannerPitch 
                players={draftSquad} 
                onUpdateSquad={setDraftSquad}
                onTransferClick={handleInitiateTransfer}
                onRemovePlayer={handleRemovePlayer}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <ChipButton 
                label="Wildcard" 
                status={getChipStatus("wildcard")} 
                subText={getGwUsed("wildcard")}
                onClick={() => handleChipClick("wildcard")}
              />
              <ChipButton 
                label="Free Hit" 
                status={getChipStatus("freehit")}
                subText={getGwUsed("freehit")}
                onClick={() => handleChipClick("freehit")}
              />
              <ChipButton 
                label="Triple Captain" 
                status={getChipStatus("3xc")}
                subText={getGwUsed("3xc")}
                onClick={() => handleChipClick("3xc")}
              />
              <ChipButton 
                label="Bench Boost" 
                status={getChipStatus("bboost")}
                subText={getGwUsed("bboost")}
                onClick={() => handleChipClick("bboost")}
              />
            </div>
          </div>

          <div className="w-full lg:w-[40%] bg-[#041f17] rounded-xl border border-green-500/10 min-h-[800px] sticky top-24 shadow-2xl flex flex-col overflow-hidden">
             <TransferSidebar players={allPlayers} isLoading={loadingPlayers} />
          </div>
        </div>
      </div>


      {transferModalOpen && (
        <TransferModal 
          bank={bank || 0}
          allPlayers={allPlayers}
          onClose={handleCloseModal}
          onSelect={handleConfirmTransfer}
          fixedPosition={playerToReplace.position}
        />
      )}


    </main>
  );
}

/* Helper Components kept as original */

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-[#041f17] p-4 rounded-xl border border-green-500/10 flex flex-col items-center shadow-lg group hover:border-green-500/30 transition-all">
      <span className="text-[10px] text-green-500/60 uppercase font-black tracking-[0.15em] mb-1">{label}</span>
      <span className="text-white text-2xl font-black">{value}</span>
    </div>
  );
}

interface ChipButtonProps {
  label: string;
  status: "active" | "used" | "available";
  subText?: string;
  onClick: () => void;
}

function ChipButton({ label, status, subText, onClick }: ChipButtonProps) {
  const isUsed = status === "used";
  const isActive = status === "active";

  return (
    <button 
      onClick={onClick}
      disabled={isUsed}
      className={`p-3 rounded-xl flex flex-col items-center justify-center border transition-all duration-300 min-h-[64px] ${
        isActive 
          ? 'bg-green-600/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] scale-[1.02] z-10' 
          : isUsed 
            ? 'bg-yellow-500 border-yellow-600 cursor-not-allowed shadow-inner' 
            : 'bg-[#041f17] border-green-500/10 hover:bg-[#05211a] hover:border-green-500/40'
      }`}
    >
      <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-tighter sm:tracking-wider transition-all ${
        isActive ? 'text-green-400' : isUsed ? 'text-black/70 line-through' : 'text-white'
      }`}>
        {label}
      </span>
      
      {subText && (
        <span className={`text-[8px] sm:text-[9px] mt-1 font-bold ${
          isUsed ? 'text-black/50' : 'text-white/30'
        }`}>
          {subText}
        </span>
      )}
    </button>
  );
}