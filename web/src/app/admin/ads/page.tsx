"use client";

import { 
  Plus, 
  Megaphone, 
  Eye, 
  MousePointer2, 
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink
} from "lucide-react";

const ADS = [
  { name: 'Campagne Été Saphir', type: 'Bannière Home', status: 'Actif', views: '12.4k', clicks: '850' },
  { name: 'Promo Boutique', type: 'Sidebar Articles', status: 'Actif', views: '4.2k', clicks: '320' },
  { name: 'Sponsor Matinale', type: 'Audio Pre-roll', status: 'Pause', views: '2.1k', clicks: '-' },
];

export default function AdminAds() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Publicités & Bannières</h1>
          <p className="text-saphir-navy/40 text-sm italic">Gérez vos campagnes et analysez leur performance.</p>
        </div>
        <button className="flex items-center gap-2 bg-saphir-navy text-white px-6 py-3 rounded-2xl font-bold hover:bg-saphir-electric transition-all shadow-lg">
          <Plus size={20} />
          Nouvelle Campagne
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ADS.map((ad, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="aspect-[21/9] bg-gray-50 flex items-center justify-center border-b border-gray-50 relative group">
               <Megaphone className="text-gray-200" size={40} />
               <div className="absolute inset-0 bg-saphir-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button className="p-3 bg-white rounded-full text-saphir-navy hover:scale-110 transition-transform"><Edit2 size={20}/></button>
                  <button className="p-3 bg-white rounded-full text-saphir-navy hover:scale-110 transition-transform"><ExternalLink size={20}/></button>
               </div>
            </div>
            
            <div className="p-8 space-y-6 flex-1">
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-saphir-navy">{ad.name}</h3>
                    <p className="text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest">{ad.type}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                    ad.status === 'Actif' ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'
                  }`}>
                    {ad.status}
                  </span>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl space-y-1">
                     <div className="flex items-center gap-2 text-saphir-navy/40">
                        <Eye size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Vues</span>
                     </div>
                     <div className="text-xl font-bold text-saphir-navy">{ad.views}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl space-y-1">
                     <div className="flex items-center gap-2 text-saphir-navy/40">
                        <MousePointer2 size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Clics</span>
                     </div>
                     <div className="text-xl font-bold text-saphir-navy">{ad.clicks}</div>
                  </div>
               </div>
            </div>

            <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
               <div className="flex items-center gap-2 text-xs text-saphir-navy/40 font-bold italic">
                  <Calendar size={14} /> Finit le 30/06
               </div>
               <button className="text-red-400 hover:text-red-500 transition-colors">
                 <Trash2 size={16} />
               </button>
            </div>
          </div>
        ))}

        {/* Add New Campaign Card */}
        <div className="bg-gray-50/30 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-12 gap-4 cursor-pointer hover:bg-gray-50 hover:border-saphir-electric/20 transition-all group">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-200 group-hover:text-saphir-electric shadow-sm transition-all">
              <Plus size={32} />
           </div>
           <div className="text-center">
              <p className="font-bold text-gray-300 text-sm mb-1">Créer une campagne</p>
              <p className="text-[10px] font-bold text-gray-200 uppercase tracking-widest">Bannière ou Audio</p>
           </div>
        </div>
      </div>
    </div>
  );
}
