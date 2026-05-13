"use client";

import { 
  Users, 
  Activity, 
  Clock, 
  Globe, 
  Play, 
  TrendingUp, 
  BarChart3,
  Signal
} from "lucide-react";

export default function AdminRadioStats() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Statistiques Radio</h1>
          <p className="text-saphir-navy/40 text-sm italic">Analyse d'audience en temps réel et historique de diffusion.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-100 text-red-500 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all shadow-sm">
            <Activity size={14} /> PDF
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-100 text-green-600 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-green-50 transition-all shadow-sm">
            <Activity size={14} /> Excel
          </button>
          <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest">
             <Signal size={12} className="animate-pulse" /> LIVE
          </div>
        </div>
      </div>

      {/* Real-time Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-saphir-navy text-white p-8 rounded-[2.5rem] shadow-2xl shadow-saphir-navy/20 relative overflow-hidden group">
           <div className="relative z-10">
              <div className="text-4xl font-bold mb-2">1,284</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                 <Users size={12} className="text-saphir-electric" /> Auditeurs en direct
              </div>
           </div>
           <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
              <Users size={120} />
           </div>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
           <div className="text-2xl font-bold text-saphir-navy mb-2">42m 12s</div>
           <div className="text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest flex items-center gap-2">
              <Clock size={12} className="text-saphir-electric" /> Durée d'écoute moy.
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
           <div className="text-2xl font-bold text-saphir-navy mb-2">5,412</div>
           <div className="text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={12} className="text-green-500" /> Pic d'audience (24h)
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
           <div className="text-2xl font-bold text-saphir-navy mb-2">HD / 192kbps</div>
           <div className="text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest flex items-center gap-2">
              <Activity size={12} className="text-saphir-electric" /> Qualité du flux
           </div>
        </div>
      </div>

      {/* Main Charts & Analytics */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Audience Graph Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm flex flex-col">
           <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-bold text-saphir-navy flex items-center gap-3">
                 <BarChart3 className="text-saphir-electric" /> Courbe d'Audience
              </h2>
              <div className="flex bg-gray-50 p-1 rounded-xl">
                 {['24h', '7j', '30j'].map(t => (
                   <button key={t} className={`px-4 py-1.5 text-[10px] font-bold rounded-lg ${t === '24h' ? 'bg-white shadow-sm text-saphir-navy' : 'text-saphir-navy/30'}`}>{t}</button>
                 ))}
              </div>
           </div>
           {/* Fake Graph Visual */}
           <div className="flex-1 flex items-end gap-2 h-64">
              {[...Array(24)].map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-saphir-electric/10 rounded-t-lg relative group cursor-help hover:bg-saphir-electric/30 transition-all"
                  style={{ height: `${20 + Math.random() * 80}%` }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-saphir-navy text-white text-[8px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {Math.floor(Math.random() * 2000)} aud.
                  </div>
                </div>
              ))}
           </div>
           <div className="flex justify-between mt-6 text-[8px] font-bold text-saphir-navy/20 uppercase tracking-widest">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
           </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm flex flex-col">
           <h2 className="text-xl font-bold text-saphir-navy mb-8 flex items-center gap-3">
              <Globe className="text-saphir-electric" /> Top Régions
           </h2>
           <div className="space-y-6 flex-1">
              {[
                { name: 'Région Saphir', val: 65 },
                { name: 'Zone Nord', val: 18 },
                { name: 'International', val: 10 },
                { name: 'Autres', val: 7 },
              ].map(reg => (
                <div key={reg.name} className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-saphir-navy">{reg.name}</span>
                      <span className="text-saphir-electric">{reg.val}%</span>
                   </div>
                   <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full bg-saphir-electric" style={{ width: `${reg.val}%` }}></div>
                   </div>
                </div>
              ))}
           </div>
           <div className="mt-10 p-4 bg-saphir-navy/5 rounded-2xl border border-saphir-navy/5 text-center">
              <p className="text-[10px] text-saphir-navy/40 font-bold uppercase">Audience Max ce mois</p>
              <p className="text-xl font-bold text-saphir-navy">12,458 <span className="text-xs text-green-500">+15%</span></p>
           </div>
        </div>
      </div>
    </div>
  );
}
