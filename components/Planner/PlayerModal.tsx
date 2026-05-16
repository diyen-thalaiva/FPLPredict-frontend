"use client";
import SyncIcon from '@mui/icons-material/Sync';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

interface PlayerModalProps {
  player: any;
  currentGw: number;
  onClose: () => void;
  onSub: () => void;
  onRemove: () => void;
  onTransfer: () => void;
  
}


export default function PlayerModal({ player, currentGw, onClose, onSub, onRemove,onTransfer }: PlayerModalProps) {
  return (
    // Backdrop
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-[#041f17] border border-green-500/20 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        {/* HEADER: Kit left, Name middle, X right */}
        <div className="flex items-center gap-4 p-4 border-b border-white/5 bg-gradient-to-r from-green-900/40 to-transparent">
          <img src={`/Kits/${player.team}.png`} alt="kit" className="w-10 h-10 object-contain" />
          <div className="flex-1">
            <h2 className="text-lg font-black text-white uppercase italic">{player.web_name}</h2>
            <p className="text-green-500 text-[9px] font-bold tracking-widest uppercase">{player.position} • {player.team}</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white">✕</button>
        </div>

        {/* Info Grid */}
        {/* STATS: Price and Ownership */}
        <div className="p-4 grid grid-cols-2 gap-4">
          <div className="bg-black/20 p-3 rounded-lg text-center">
            <p className="text-[9px] text-white/40 uppercase font-bold">Price</p>
            <p className="text-white font-black">£{player.value?.toFixed(1)}m</p>
          </div>
          <div className="bg-black/20 p-3 rounded-lg text-center">
            <p className="text-[9px] text-white/40 uppercase font-bold">Ownership</p>
            <p className="text-white font-black">{player.ownership_pct}%</p>
          </div>
        </div>

        {/* FIXTURES SECTION */}
        <div className="px-4 pb-4">
            <p className="text-[9px] text-white/40 uppercase font-bold mb-2">Next 3 Fixtures</p>
            <div className="grid grid-cols-3 gap-2">
                {player.fixtures?.slice(0, 3).map((fixture: string, index: number) => {
                const targetGw = currentGw + index;
                const isNoFixture = fixture === "-"; 
                
                return (
                    <div key={index} className="bg-black/20 p-2 rounded-lg flex flex-col items-center">
                    {/* GW Label */}
                    <span className="text-[8px] text-green-500 font-black uppercase mb-1">GW{targetGw}</span>
                    
                    {/* DYNAMIC LOGO IMAGE */}
                    {!isNoFixture && (
                        <img 
                            src={`/logos/${fixture.toUpperCase()}.png`} 
                            alt={fixture} 
                            className="w-6 h-6 object-contain mb-1"
                            onError={(e) => {
                            // Fallback if the logo file is missing
                            (e.target as HTMLImageElement).src = '/logos/default.png'; 
                            }}
                        />
                    )}

                    {/* Team Name */}
                    <span className="text-[9px] text-white font-bold">{fixture}</span>
                    </div>
                );
                })}
            </div>
        </div>
        

        {/* ACTIONS */}
        <div className="p-4 bg-black/20 grid grid-cols-3 gap-2">
          <button 
            onClick={onSub}
            className="bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold py-2 rounded transition-all flex flex-col items-center gap-1"
          >
            <SyncIcon fontSize="small" />
            Substitute
          </button>
          <button 
            onClick={onTransfer} // Now it triggers the function that opens the modal
            className="bg-white/5 hover:bg-white/10 text-white ..."
          >
            <SwapVertIcon fontSize="small" />
            Transfer
          </button>                  
          <button 
            onClick={() => {
              onRemove(); // Triggers the removal logic passed from PlannerPitch
            }}
            className="bg-white/5 hover:bg-red-500/20 text-white text-[10px] font-bold py-2 rounded border border-red-500/10 transition-all flex flex-col items-center gap-1"
          >
            <HighlightOffIcon fontSize="small" />
            Remove
          </button>
        </div>
        

      </div>
    </div>
  );
}