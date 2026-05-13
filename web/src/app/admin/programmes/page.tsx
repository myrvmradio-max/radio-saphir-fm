"use client";

import { useState } from "react";
import { 
  Plus, 
  Clock, 
  User, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2
} from "lucide-react";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const PROGRAMMES = [
  { time: "07:00 - 10:00", name: "Le Grand Matin Saphir", host: "Jean-Michel", type: "Direct" },
  { time: "10:00 - 12:00", name: "Culture & Musique", host: "Sarah L.", type: "Playlist" },
  { time: "12:00 - 14:00", name: "Le JT de Saphir", host: "Marc O.", type: "Direct" },
  { time: "14:00 - 17:00", name: "Après-midi Détente", host: "Amélie", type: "Playlist" },
];

export default function AdminProgrammes() {
  const [activeDay, setActiveDay] = useState("Lundi");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Grille des Programmes</h1>
          <p className="text-saphir-navy/40 text-sm">Gérez l'occupation de l'antenne 24h/24.</p>
        </div>
        <button className="flex items-center gap-2 bg-saphir-navy text-white px-6 py-3 rounded-2xl font-bold hover:bg-saphir-electric transition-all shadow-lg">
          <Plus size={20} />
          Ajouter un créneau
        </button>
      </div>

      {/* Day Selector */}
      <div className="flex bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto gap-2">
        {DAYS.map((day) => (
          <button 
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDay === day 
              ? "bg-saphir-navy text-white shadow-lg" 
              : "text-saphir-navy/30 hover:bg-gray-50"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule List */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <CalendarIcon className="text-saphir-electric" size={24} />
              <h2 className="text-xl font-bold text-saphir-navy">Programmation du {activeDay}</h2>
           </div>
           <div className="text-xs font-bold text-saphir-navy/30 uppercase tracking-widest italic">
              4 créneaux programmés
           </div>
        </div>

        <div className="divide-y divide-gray-50">
          {PROGRAMMES.map((prog, i) => (
            <div key={i} className="p-8 hover:bg-gray-50/50 transition-colors group flex items-center gap-10">
               {/* Time Col */}
               <div className="w-40 flex items-center gap-3">
                  <div className="w-10 h-10 bg-saphir-navy/5 rounded-xl flex items-center justify-center text-saphir-navy">
                    <Clock size={18} />
                  </div>
                  <span className="font-bold text-saphir-navy">{prog.time}</span>
               </div>

               {/* Info Col */}
               <div className="flex-1">
                  <h3 className="text-lg font-bold text-saphir-navy group-hover:text-saphir-electric transition-colors">{prog.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                     <span className="flex items-center gap-1 text-xs text-saphir-navy/40 font-medium">
                        <User size={14} /> {prog.host}
                     </span>
                     <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                       prog.type === 'Direct' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                     }`}>
                       {prog.type}
                     </span>
                  </div>
               </div>

               {/* Actions */}
               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-white rounded-lg text-saphir-navy/20 hover:text-saphir-electric shadow-sm transition-all"><Edit2 size={16} /></button>
                  <button className="p-2 hover:bg-red-50 rounded-lg text-saphir-navy/20 hover:text-red-500 shadow-sm transition-all"><Trash2 size={16} /></button>
               </div>
            </div>
          ))}
        </div>

        {/* Empty Slot Placeholder */}
        <div className="p-12 bg-gray-50/30 border-t border-gray-50 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-gray-50 transition-all">
           <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 group-hover:text-saphir-electric group-hover:border-saphir-electric transition-all">
             <Plus size={24} />
           </div>
           <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Ajouter une émission après 17:00</p>
        </div>
      </div>
    </div>
  );
}
