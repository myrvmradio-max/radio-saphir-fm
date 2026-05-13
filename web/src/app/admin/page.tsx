"use client";

import { 
  Users, 
  Newspaper, 
  Headphones, 
  TrendingUp, 
  ArrowUpRight 
} from "lucide-react";

const STATS = [
  { label: "Articles", value: "24", icon: Newspaper, color: "bg-blue-500" },
  { label: "Podcasts", value: "156", icon: Headphones, color: "bg-purple-500" },
  { label: "Auditeurs", value: "1.2k", icon: Users, color: "bg-green-500" },
  { label: "Vues Total", value: "45.8k", icon: TrendingUp, color: "bg-orange-500" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Bonjour, Admin</h1>
          <p className="text-saphir-navy/40">Voici ce qui se passe sur Saphir FM aujourd'hui.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-100 text-saphir-navy px-6 py-3 rounded-2xl font-bold text-xs hover:bg-gray-50 transition-all shadow-sm">
             Rapport Global (PDF)
          </button>
          <button className="flex items-center gap-2 bg-saphir-navy text-white px-6 py-3 rounded-2xl font-bold text-xs hover:bg-saphir-electric transition-all shadow-lg shadow-saphir-navy/10">
             Export Data (Excel)
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-2xl text-white`}>
                <stat.icon size={24} />
              </div>
              <span className="flex items-center gap-1 text-green-500 font-bold text-xs">
                +12% <ArrowUpRight size={14} />
              </span>
            </div>
            <div className="text-2xl font-bold text-saphir-navy mb-1">{stat.value}</div>
            <div className="text-xs font-bold text-saphir-navy/30 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Articles */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-saphir-navy">Derniers Articles</h2>
            <button className="text-saphir-electric text-xs font-bold uppercase tracking-widest hover:underline">Voir tout</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-16 h-12 bg-gray-50 rounded-xl flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-saphir-navy text-sm truncate">Le nouveau plan de développement urbain...</h4>
                  <p className="text-xs text-saphir-navy/30">Publié il y a 2h • Par Admin</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Podcast Activity */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-saphir-navy">Top Podcasts</h2>
            <button className="text-saphir-electric text-xs font-bold uppercase tracking-widest hover:underline">Détails</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-saphir-navy rounded-full flex items-center justify-center text-white text-xs font-bold">#{i}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-saphir-navy text-sm truncate">Les Voix de la Ville - Ep. {10-i}</h4>
                  <p className="text-xs text-saphir-navy/30">{1200 - i*100} écoutes cette semaine</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
