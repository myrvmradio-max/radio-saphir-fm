"use client";

import { useState } from "react";
import { 
  Search, 
  Mail, 
  MailOpen, 
  Trash2, 
  Star,
  ChevronRight,
  MoreVertical,
  Reply
} from "lucide-react";

const MESSAGES = [
  { id: 1, from: "Thomas Durand", subject: "Demande de dédicace", date: "Il y a 12m", read: false, important: true },
  { id: 2, from: "Sophie Martin", subject: "Suggestion programme", date: "Il y a 2h", read: true, important: false },
  { id: 3, from: "Jean Dupont", subject: "Publicité sur l'antenne", date: "Hier", read: true, important: false },
  { id: 4, from: "Marie Leroy", subject: "Problème d'écoute mobile", date: "Hier", read: true, important: true },
];

export default function AdminMessages() {
  const [selected, setSelected] = useState(1);

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Messagerie Auditeurs</h1>
          <p className="text-saphir-navy/40 text-sm italic">Gérez vos contacts et les interactions avec votre audience.</p>
        </div>
        <div className="flex gap-2">
           <button className="p-3 bg-white border border-gray-100 rounded-xl text-saphir-navy/30 hover:text-red-500 transition-all shadow-sm"><Trash2 size={20}/></button>
           <button className="flex items-center gap-2 bg-saphir-navy text-white px-6 py-3 rounded-2xl font-bold hover:bg-saphir-electric transition-all shadow-lg shadow-saphir-navy/10">
              <Reply size={18} />
              Répondre
           </button>
        </div>
      </div>

      {/* Inbox Layout */}
      <div className="flex-1 bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex">
        
        {/* Messages List */}
        <div className="w-1/3 border-r border-gray-50 flex flex-col">
           <div className="p-6 border-b border-gray-50">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-saphir-navy/20" size={16} />
                 <input 
                   type="text" 
                   placeholder="Rechercher..." 
                   className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-saphir-navy focus:ring-1 focus:ring-saphir-electric/20 outline-none"
                 />
              </div>
           </div>
           <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {MESSAGES.map(msg => (
                <div 
                  key={msg.id}
                  onClick={() => setSelected(msg.id)}
                  className={`p-6 cursor-pointer transition-all relative ${selected === msg.id ? 'bg-saphir-navy/5' : 'hover:bg-gray-50/50'}`}
                >
                   {selected === msg.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-saphir-electric"></div>}
                   <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-bold ${msg.read ? 'text-saphir-navy/40' : 'text-saphir-navy'}`}>{msg.from}</span>
                      <span className="text-[8px] font-bold text-saphir-navy/20 uppercase tracking-widest">{msg.date}</span>
                   </div>
                   <h4 className={`text-xs mb-1 truncate ${msg.read ? 'text-saphir-navy/40 font-medium' : 'text-saphir-navy font-bold'}`}>{msg.subject}</h4>
                   <div className="flex items-center gap-2 mt-2">
                      {msg.important && <Star size={10} className="fill-yellow-400 text-yellow-400" />}
                      {!msg.read && <div className="w-1.5 h-1.5 bg-saphir-electric rounded-full"></div>}
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Message Content Placeholder */}
        <div className="flex-1 bg-gray-50/30 flex flex-col">
           {selected ? (
             <div className="p-10 space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-start">
                   <div className="flex gap-4">
                      <div className="w-14 h-14 bg-saphir-navy rounded-2xl flex items-center justify-center text-white font-bold text-xl">TD</div>
                      <div>
                         <h2 className="text-xl font-bold text-saphir-navy">Thomas Durand</h2>
                         <p className="text-xs font-medium text-saphir-navy/40 italic">thomas.durand@email.com</p>
                      </div>
                   </div>
                   <div className="text-right text-[10px] font-bold text-saphir-navy/20 uppercase tracking-widest">
                      12 Mai 2026 à 14:32
                   </div>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm leading-relaxed text-saphir-navy/70 space-y-4">
                   <h3 className="text-lg font-bold text-saphir-navy">Objet : Demande de dédicace</h3>
                   <p>Bonjour l'équipe de Saphir FM !</p>
                   <p>Je vous écoute tous les matins depuis la Zone Nord. J'aimerais beaucoup passer une dédicace à ma fille Clara qui fête son anniversaire demain. Est-il possible de passer "Happy" de Pharrell Williams vers 8h15 ?</p>
                   <p>Merci pour votre super programmation, ne changez rien !</p>
                   <p className="pt-4 border-t border-gray-50">Bien à vous,<br /><span className="font-bold">Thomas</span></p>
                </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-saphir-navy/10 gap-4">
                <MailOpen size={80} />
                <p className="font-bold uppercase tracking-widest text-xs">Sélectionnez un message à lire</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
