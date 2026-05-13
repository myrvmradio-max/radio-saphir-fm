"use client";

import Link from "next/link";
import { 
  Plus, 
  Search, 
  Play, 
  Mic, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Headphones 
} from "lucide-react";

export default function AdminPodcasts() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Gestion des Podcasts</h1>
          <p className="text-saphir-navy/40">Gérez vos séries, émissions et épisodes.</p>
        </div>
        <Link 
          href="/admin/podcasts/new"
          className="flex items-center gap-2 bg-saphir-navy text-white px-6 py-3 rounded-2xl font-bold hover:bg-saphir-electric transition-all shadow-lg shadow-saphir-navy/10"
        >
          <Plus size={20} />
          Nouvelle Série
        </Link>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-saphir-electric/10 rounded-2xl flex items-center justify-center text-saphir-electric">
              <Headphones size={24} />
           </div>
           <div>
              <div className="text-xl font-bold text-saphir-navy">12</div>
              <div className="text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest">Séries Actives</div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
              <Mic size={24} />
           </div>
           <div>
              <div className="text-xl font-bold text-saphir-navy">156</div>
              <div className="text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest">Épisodes Total</div>
           </div>
        </div>
      </div>

      {/* Series Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="aspect-video bg-gray-50 flex items-center justify-center text-saphir-navy/5 font-bold text-3xl italic">
              PODCAST
            </div>
            <div className="p-8">
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-saphir-navy">Les Voix de la Ville</h3>
                    <p className="text-xs text-saphir-navy/40 uppercase font-bold tracking-widest">Culture • Hebdomadaire</p>
                  </div>
                  <button className="p-2 hover:bg-gray-50 rounded-lg text-saphir-navy/20">
                    <MoreVertical size={18} />
                  </button>
               </div>
               <div className="flex items-center gap-6 mb-8 text-xs font-bold text-saphir-navy/60">
                  <span>24 Épisodes</span>
                  <span>1.2k Écoutes</span>
               </div>
               <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl font-bold text-xs text-saphir-navy hover:bg-saphir-navy hover:text-white transition-all">
                    <Edit2 size={14} /> Gérer
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center bg-saphir-electric/10 text-saphir-electric rounded-xl hover:bg-saphir-electric hover:text-white transition-all">
                    <Plus size={20} />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
