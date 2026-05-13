"use client";

import Link from "next/link";
import { 
  Plus, 
  Search, 
  Play, 
  Youtube, 
  ExternalLink,
  Edit2, 
  Trash2,
  Calendar
} from "lucide-react";

export default function AdminVideos() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Vidéos & Replays</h1>
          <p className="text-saphir-navy/40">Gérez vos contenus vidéo et lives studio.</p>
        </div>
        <button className="flex items-center gap-2 bg-saphir-navy text-white px-6 py-3 rounded-2xl font-bold hover:bg-saphir-electric transition-all shadow-lg shadow-saphir-navy/10">
          <Plus size={20} />
          Ajouter une Vidéo
        </button>
      </div>

      {/* Video Table/List */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50 flex gap-4">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-saphir-navy/20" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher une vidéo..." 
                className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20 transition-all text-sm"
              />
           </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 p-8 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group flex flex-col space-y-4">
               <div className="aspect-video bg-gray-50 rounded-3xl relative overflow-hidden border border-gray-100 flex items-center justify-center">
                  <Play size={24} className="text-saphir-navy/10 group-hover:text-saphir-electric transition-colors" />
                  <div className="absolute top-4 right-4 bg-saphir-navy/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                    12:45
                  </div>
               </div>
               <div>
                  <h4 className="font-bold text-saphir-navy text-sm leading-snug group-hover:text-saphir-electric transition-colors mb-2">Live Studio : Interview Exclusive de l'artiste X</h4>
                  <div className="flex items-center justify-between">
                     <span className="flex items-center gap-1 text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest italic">
                        <Calendar size={12} /> 12 Mai 2026
                     </span>
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-gray-50 text-saphir-navy/40 hover:text-saphir-electric rounded-lg transition-all"><Edit2 size={14} /></button>
                        <button className="p-2 bg-gray-50 text-saphir-navy/40 hover:text-red-500 rounded-lg transition-all"><Trash2 size={14} /></button>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
