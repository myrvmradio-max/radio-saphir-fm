"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Clock, 
  User, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
  Loader2,
  X
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/context/ToastContext";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function AdminProgrammes() {
  const { confirm, showToast } = useToast();
  const [activeDay, setActiveDay] = useState("Lundi");
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [savingSlot, setSavingSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({
    name: "",
    host: "",
    day: activeDay,
    start_time: "08:00",
    end_time: "10:00",
    type: "Direct"
  });

  // Keep modal's day updated with selected active day when opening
  useEffect(() => {
    setNewSlot(prev => ({ ...prev, day: activeDay }));
  }, [activeDay, modalOpen]);

  useEffect(() => {
    fetchProgrammes();
  }, [activeDay]);

  async function fetchProgrammes() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('programmes')
        .select('*')
        .eq('day', activeDay)
        .order('start_time', { ascending: true });

      if (data) setProgrammes(data);
    } catch (err) {
      console.error("Error fetching programmes:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Supprimer le créneau",
      message: "Voulez-vous vraiment supprimer ce créneau de la grille des programmes ? Cette action est irréversible.",
      confirmText: "Supprimer",
      cancelText: "Annuler",
      type: "danger"
    });
    
    if (!ok) return;
    
    try {
      const { error } = await supabase.from('programmes').delete().eq('id', id);
      if (error) throw error;
      setProgrammes(prev => prev.filter(p => p.id !== id));
      showToast("Créneau supprimé avec succès", "success");
    } catch (err: any) {
      console.error("Error deleting slot:", err);
      showToast("Erreur lors de la suppression", "error");
    }
  };

  const handleAddSlot = async () => {
    if (!newSlot.name || !newSlot.host || !newSlot.start_time || !newSlot.end_time) {
      showToast("Veuillez remplir tous les champs obligatoires", "warning");
      return;
    }

    setSavingSlot(true);
    try {
      // Format times to have standard seconds syntax HH:MM:SS if needed
      const formattedStartTime = newSlot.start_time.length === 5 ? `${newSlot.start_time}:00` : newSlot.start_time;
      const formattedEndTime = newSlot.end_time.length === 5 ? `${newSlot.end_time}:00` : newSlot.end_time;

      const { data, error } = await supabase
        .from('programmes')
        .insert([
          {
            name: newSlot.name,
            host: newSlot.host,
            day: newSlot.day,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            type: newSlot.type
          }
        ])
        .select()
        .single();

      if (error) throw error;

      showToast("Créneau ajouté avec succès !", "success");
      setModalOpen(false);
      setNewSlot({
        name: "",
        host: "",
        day: activeDay,
        start_time: "08:00",
        end_time: "10:00",
        type: "Direct"
      });

      // Reload if it matches the current viewed day
      if (newSlot.day === activeDay) {
        fetchProgrammes();
      }
    } catch (err: any) {
      console.error("Error creating programme slot:", err);
      showToast("Erreur lors de l'ajout : " + err.message, "error");
    } finally {
      setSavingSlot(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Grille des Programmes</h1>
          <p className="text-saphir-navy/40 text-sm">Gérez l'occupation de l'antenne 24h/24.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-saphir-navy text-white px-6 py-3 rounded-2xl font-bold hover:bg-saphir-electric transition-all shadow-lg active:scale-95"
        >
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
              {programmes.length} créneaux programmés
           </div>
        </div>

        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-20 flex justify-center">
              <Loader2 className="animate-spin text-saphir-electric" size={40} />
            </div>
          ) : programmes.length > 0 ? (
            programmes.map((prog) => (
              <div key={prog.id} className="p-8 hover:bg-gray-50/50 transition-colors group flex items-center gap-10">
                {/* Time Col */}
                <div className="w-40 flex items-center gap-3">
                    <div className="w-10 h-10 bg-saphir-navy/5 rounded-xl flex items-center justify-center text-saphir-navy">
                      <Clock size={18} />
                    </div>
                    <span className="font-bold text-saphir-navy">{prog.start_time.substring(0, 5)} - {prog.end_time.substring(0, 5)}</span>
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
                    <button 
                      onClick={() => handleDelete(prog.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-saphir-navy/20 hover:text-red-500 shadow-sm transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-saphir-navy/20 font-bold uppercase tracking-widest">
              Aucun programme pour ce jour
            </div>
          )}
        </div>

        {/* Empty Slot Placeholder */}
        <div 
          onClick={() => setModalOpen(true)}
          className="p-12 bg-gray-50/30 border-t border-gray-50 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-gray-50 transition-all"
        >
           <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 group-hover:text-saphir-electric group-hover:border-saphir-electric transition-all">
             <Plus size={24} />
           </div>
           <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Ajouter une émission</p>
        </div>
      </div>

      {/* PREMIUM PROGRAMME CREATION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#0D1B4C]/50 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal Box */}
          <div className="relative bg-white rounded-[2.5rem] w-full max-w-md p-8 border border-gray-100 shadow-2xl shadow-saphir-navy/20 overflow-hidden transform transition-all duration-300 scale-100 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 text-[#0D1B4C]/40 hover:text-[#0D1B4C] transition-all p-1.5 rounded-xl hover:bg-gray-50"
            >
              <X size={18} />
            </button>

            {/* Header Icon & Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-saphir-electric">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0D1B4C] tracking-tight">Ajouter un Programme</h3>
                <p className="text-[10px] font-bold text-[#0D1B4C]/40 uppercase tracking-widest">Nouveau créneau horaire</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 mb-8">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#0D1B4C]/40 uppercase tracking-widest block">Nom de l'émission *</label>
                <input 
                  type="text" 
                  placeholder="Ex: Le Morning Saphir"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 font-bold text-saphir-navy text-sm outline-none focus:ring-2 focus:ring-saphir-electric/20 focus:bg-white transition-all"
                  value={newSlot.name}
                  onChange={(e) => setNewSlot({...newSlot, name: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#0D1B4C]/40 uppercase tracking-widest block">Animateur / Présentateur *</label>
                <input 
                  type="text" 
                  placeholder="Ex: DJ Saphir & Invité"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 font-bold text-saphir-navy text-sm outline-none focus:ring-2 focus:ring-saphir-electric/20 focus:bg-white transition-all"
                  value={newSlot.host}
                  onChange={(e) => setNewSlot({...newSlot, host: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#0D1B4C]/40 uppercase tracking-widest block">Jour *</label>
                  <select
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 font-bold text-saphir-navy text-sm outline-none focus:ring-2 focus:ring-saphir-electric/20 focus:bg-white transition-all"
                    value={newSlot.day}
                    onChange={(e) => setNewSlot({...newSlot, day: e.target.value})}
                  >
                    {DAYS.map(d => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#0D1B4C]/40 uppercase tracking-widest block">Type *</label>
                  <select
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 font-bold text-saphir-navy text-sm outline-none focus:ring-2 focus:ring-saphir-electric/20 focus:bg-white transition-all"
                    value={newSlot.type}
                    onChange={(e) => setNewSlot({...newSlot, type: e.target.value})}
                  >
                    <option>Direct</option>
                    <option>Enregistré</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#0D1B4C]/40 uppercase tracking-widest block">Heure de début *</label>
                  <input 
                    type="time" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 font-bold text-saphir-navy text-sm outline-none focus:ring-2 focus:ring-saphir-electric/20 focus:bg-white transition-all"
                    value={newSlot.start_time}
                    onChange={(e) => setNewSlot({...newSlot, start_time: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#0D1B4C]/40 uppercase tracking-widest block">Heure de fin *</label>
                  <input 
                    type="time" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 font-bold text-saphir-navy text-sm outline-none focus:ring-2 focus:ring-saphir-electric/20 focus:bg-white transition-all"
                    value={newSlot.end_time}
                    onChange={(e) => setNewSlot({...newSlot, end_time: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-[#0D1B4C]/50 hover:bg-gray-100 hover:text-[#0D1B4C] transition-all duration-200 active:scale-95"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAddSlot}
                disabled={savingSlot}
                className="flex-1 px-5 py-4 bg-[#6A7CFF] hover:bg-[#5365E6] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#6A7CFF]/20 transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingSlot ? <Loader2 size={14} className="animate-spin" /> : null}
                {savingSlot ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
