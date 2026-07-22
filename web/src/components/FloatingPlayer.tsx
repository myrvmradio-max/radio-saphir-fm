"use client";

import { useAudio } from "@/context/AudioContext";
import { Play, Pause, Radio, Loader2 } from "lucide-react";

export default function FloatingPlayer() {
  const { isPlaying, isBuffering, togglePlay, currentProgram, isStreamOffline, isLiveBroadcast } = useAudio();

  // Show only when radio is active (playing/buffering) or has failed to load
  if (!isPlaying && !isBuffering && !isStreamOffline) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] bg-[#060B1F]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 max-w-sm transition-all duration-300 animate-bounce-short">
      {/* Visualizer animation when playing */}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white relative overflow-hidden flex-shrink-0 shadow-lg ${isStreamOffline ? 'bg-gray-800' : 'bg-gradient-to-tr from-saphir-electric to-[#8B99FF]'}`}>
        {isBuffering ? (
          <Loader2 className="animate-spin text-white" size={20} />
        ) : (
          <Radio size={20} className={isPlaying ? "animate-pulse" : ""} />
        )}
      </div>

      <div className="flex-1 min-w-0 pr-2">
        {isStreamOffline ? (
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Flux indisponible</p>
          </div>
        ) : isLiveBroadcast ? (
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <p className="text-[9px] font-black uppercase text-red-500 tracking-widest">En Direct</p>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-[9px] font-black uppercase text-white/60 tracking-widest">Radio Saphir</p>
          </div>
        )}
        <h4 className="text-white text-xs font-bold truncate leading-tight">{currentProgram.name}</h4>
        <p className="text-white/40 text-[9px] truncate">106.8 FM • Bouaké</p>
      </div>

      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-white text-saphir-navy flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md hover:bg-saphir-electric hover:text-white flex-shrink-0"
      >
        {isPlaying ? (
          <Pause size={16} fill="currentColor" />
        ) : (
          <Play size={16} fill="currentColor" className="ml-0.5" />
        )}
      </button>
    </div>
  );
}
