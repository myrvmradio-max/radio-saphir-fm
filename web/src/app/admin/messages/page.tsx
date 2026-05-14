"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Mail, 
  MailOpen, 
  Trash2, 
  Star,
  ChevronRight,
  MoreVertical,
  Reply,
  Loader2,
  User
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (data) {
        setMessages(data);
        if (data.length > 0 && !selectedId) {
          setSelectedId(data[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Supprimer ce message ?")) return;
    try {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
      setMessages(messages.filter(m => m.id !== id));
      if (selectedId === id) setSelectedId(messages[0]?.id || null);
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  }

  const selectedMessage = messages.find(m => m.id === selectedId);

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Messagerie Auditeurs</h1>
          <p className="text-saphir-navy/40 text-sm italic">Gérez vos contacts et les interactions avec votre audience.</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => selectedId && deleteMessage(selectedId)}
            className="p-3 bg-white border border-gray-100 rounded-xl text-saphir-navy/30 hover:text-red-500 transition-all shadow-sm disabled:opacity-50"
            disabled={!selectedId}
           >
            <Trash2 size={20}/>
           </button>
           <button 
            className="flex items-center gap-2 bg-saphir-navy text-white px-6 py-3 rounded-2xl font-bold hover:bg-saphir-electric transition-all shadow-lg shadow-saphir-navy/10 disabled:opacity-50"
            disabled={!selectedId}
           >
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
              {loading ? (
                <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-saphir-navy/20" /></div>
              ) : messages.length === 0 ? (
                <div className="p-10 text-center text-[10px] font-bold text-saphir-navy/20 uppercase tracking-widest">Aucun message</div>
              ) : (
                messages.map(msg => (
                  <div 
                    key={msg.id}
                    onClick={() => setSelectedId(msg.id)}
                    className={`p-6 cursor-pointer transition-all relative ${selectedId === msg.id ? 'bg-saphir-navy/5' : 'hover:bg-gray-50/50'}`}
                  >
                    {selectedId === msg.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-saphir-electric"></div>}
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold ${msg.is_read ? 'text-saphir-navy/40' : 'text-saphir-navy'}`}>{msg.sender_name}</span>
                        <span className="text-[8px] font-bold text-saphir-navy/20 uppercase tracking-widest">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <h4 className={`text-xs mb-1 truncate ${msg.is_read ? 'text-saphir-navy/40 font-medium' : 'text-saphir-navy font-bold'}`}>{msg.subject}</h4>
                    <div className="flex items-center gap-2 mt-2">
                        {msg.is_important && <Star size={10} className="fill-yellow-400 text-yellow-400" />}
                        {!msg.is_read && <div className="w-1.5 h-1.5 bg-saphir-electric rounded-full"></div>}
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>

        {/* Message Content Content */}
        <div className="flex-1 bg-gray-50/30 flex flex-col overflow-y-auto">
           {selectedMessage ? (
             <div className="p-10 space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-start">
                   <div className="flex gap-4">
                      <div className="w-14 h-14 bg-saphir-navy rounded-2xl flex items-center justify-center text-white font-bold text-xl uppercase">
                        {selectedMessage.sender_name?.substring(0,2)}
                      </div>
                      <div>
                         <h2 className="text-xl font-bold text-saphir-navy">{selectedMessage.sender_name}</h2>
                         <p className="text-xs font-medium text-saphir-navy/40 italic">{selectedMessage.sender_email}</p>
                      </div>
                   </div>
                   <div className="text-right text-[10px] font-bold text-saphir-navy/20 uppercase tracking-widest">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                   </div>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm leading-relaxed text-saphir-navy/70 space-y-4">
                   <h3 className="text-lg font-bold text-saphir-navy">Objet : {selectedMessage.subject}</h3>
                   <div className="whitespace-pre-wrap">{selectedMessage.content}</div>
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
