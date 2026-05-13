"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Mic, Headphones } from "lucide-react";
import Link from "next/link";

export default function NewPodcast() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/podcasts" className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-saphir-navy hover:text-saphir-electric transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-saphir-navy">Nouvelle Série Podcast</h1>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-saphir-navy text-white rounded-2xl font-bold text-sm hover:bg-saphir-electric transition-all shadow-lg">
          <Save size={18} /> Créer la série
        </button>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Titre de l'émission</label>
            <input type="text" placeholder="Ex: Les Voix de la Ville" className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy" />
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Fréquence</label>
            <select className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy">
              <option>Quotidien</option>
              <option>Hebdomadaire</option>
              <option>Mensuel</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
           <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Description</label>
           <textarea className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-medium text-saphir-navy h-32 resize-none" placeholder="Décrivez le concept du podcast..."></textarea>
        </div>
      </div>
    </div>
  );
}
