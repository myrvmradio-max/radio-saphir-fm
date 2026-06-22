"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  User as UserIcon, 
  Shield, 
  Mic, 
  Newspaper,
  MoreVertical,
  Mail,
  Edit2,
  Trash2,
  Loader2,
  X
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/context/ToastContext";
import FileUploader from "@/components/admin/FileUploader";

export default function AdminTeam() {
  const { confirm, showToast } = useToast();
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [savingMember, setSavingMember] = useState(false);
  const [newMember, setNewMember] = useState({
    full_name: "",
    email: "",
    role: "Animateur",
    avatar_url: ""
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: true });
      
      if (data) setTeam(data);
    } catch (err) {
      console.error("Error fetching team:", err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteMember(id: string) {
    const ok = await confirm({
      title: "Supprimer le collaborateur",
      message: "Voulez-vous vraiment supprimer ce membre de votre équipe ? Il perdra immédiatement ses accès à l'administration. Cette action est irréversible.",
      confirmText: "Supprimer",
      cancelText: "Annuler",
      type: "danger"
    });
    
    if (!ok) return;
    
    try {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) throw error;
      setTeam(team.filter(m => m.id !== id));
      showToast("Membre de l'équipe supprimé", "success");
    } catch (err: any) {
      console.error("Error deleting member:", err);
      showToast("Erreur lors de la suppression", "error");
    }
  }

  const handleAddMember = async () => {
    if (!newMember.full_name || !newMember.email) {
      showToast("Veuillez remplir tous les champs obligatoires", "warning");
      return;
    }
    
    setSavingMember(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert([
          {
            full_name: newMember.full_name,
            email: newMember.email,
            role: newMember.role,
            avatar_url: newMember.avatar_url || null,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      setTeam([...team, data]);
      showToast("Membre ajouté avec succès !", "success");
      setModalOpen(false);
      setNewMember({ full_name: "", email: "", role: "Animateur", avatar_url: "" });
    } catch (err: any) {
      console.error("Error creating member:", err);
      showToast("Erreur lors de la création : " + err.message, "error");
    } finally {
      setSavingMember(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Gestion de l'Équipe</h1>
          <p className="text-saphir-navy/40 text-sm italic">Gérez les accès et les profils de vos collaborateurs.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-saphir-navy text-white px-6 py-3 rounded-2xl font-bold hover:bg-saphir-electric transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} />
          Ajouter un membre
        </button>
      </div>

      {/* Roles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Administrateurs', count: team.filter(m => m.role === 'Administrateur').length, icon: Shield, color: 'text-saphir-navy' },
           { label: 'Animateurs', count: team.filter(m => m.role === 'Animateur').length, icon: Mic, color: 'text-purple-500' },
           { label: 'Journalistes', count: team.filter(m => m.role === 'Journaliste').length, icon: Newspaper, color: 'text-blue-500' },
         ].map(role => (
           <div key={role.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                 <div className="text-2xl font-bold text-saphir-navy">{loading ? '...' : role.count}</div>
                 <div className="text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest">{role.label}</div>
              </div>
              <div className={`p-3 rounded-2xl bg-gray-50 ${role.color}`}>
                 <role.icon size={20} />
              </div>
           </div>
         ))}
      </div>

      {/* Team Table */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest">Membre</th>
              <th className="px-8 py-5 text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest text-center">Rôle</th>
              <th className="px-8 py-5 text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest text-center">Statut</th>
              <th className="px-8 py-5 text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center"><Loader2 className="animate-spin mx-auto text-saphir-navy/20" /></td>
              </tr>
            ) : team.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-saphir-navy/20 font-bold uppercase tracking-widest">Aucun membre trouvé</td>
              </tr>
            ) : (
              team.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                        {member.avatar_url ? (
                          <div className="w-12 h-12 rounded-2xl overflow-hidden relative border border-gray-100 flex-shrink-0 flex items-center justify-center">
                            <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className={`w-12 h-12 bg-saphir-navy rounded-2xl flex items-center justify-center text-white font-bold text-sm uppercase`}>
                             {member.full_name?.substring(0,2) || '??'}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-saphir-navy text-sm">{member.full_name}</div>
                          <div className="text-xs text-saphir-navy/30 flex items-center gap-1 font-medium italic"><Mail size={12}/> {member.email}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="px-4 py-1.5 bg-gray-100 text-saphir-navy/60 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                       {member.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-green-500`}></div>
                        <span className="text-[10px] font-bold text-saphir-navy/60 uppercase">Actif</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-saphir-navy/20 hover:text-saphir-electric transition-all"><Edit2 size={16} /></button>
                        <button 
                          onClick={() => deleteMember(member.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-saphir-navy/20 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PREMIUM MEMBER CREATION MODAL */}
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
                <UserIcon size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0D1B4C] tracking-tight">Ajouter un Collaborateur</h3>
                <p className="text-[10px] font-bold text-[#0D1B4C]/40 uppercase tracking-widest">Nouveau membre de l'équipe</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#0D1B4C]/40 uppercase tracking-widest block">Nom Complet *</label>
                <input 
                  type="text" 
                  placeholder="Ex: Kouamé Konan"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 font-bold text-saphir-navy text-sm outline-none focus:ring-2 focus:ring-saphir-electric/20 focus:bg-white transition-all"
                  value={newMember.full_name}
                  onChange={(e) => setNewMember({...newMember, full_name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#0D1B4C]/40 uppercase tracking-widest block">Adresse Email *</label>
                <input 
                  type="email" 
                  placeholder="Ex: k.konan@saphirfm.com"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 font-bold text-saphir-navy text-sm outline-none focus:ring-2 focus:ring-saphir-electric/20 focus:bg-white transition-all"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#0D1B4C]/40 uppercase tracking-widest block">Photo de profil</label>
                <FileUploader
                  type="images"
                  folder="profiles"
                  value={newMember.avatar_url}
                  onChange={(url) => setNewMember({...newMember, avatar_url: url})}
                  label="Photo du collaborateur"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#0D1B4C]/40 uppercase tracking-widest block">Rôle / Accès *</label>
                <select
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 font-bold text-saphir-navy text-sm outline-none focus:ring-2 focus:ring-saphir-electric/20 focus:bg-white transition-all"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                >
                  <option>Administrateur</option>
                  <option>Directeur</option>
                  <option>Animateur</option>
                  <option>Journaliste</option>
                  <option>Technicien</option>
                </select>
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
                onClick={handleAddMember}
                disabled={savingMember}
                className="flex-1 px-5 py-4 bg-[#6A7CFF] hover:bg-[#5365E6] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#6A7CFF]/20 transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingMember ? <Loader2 size={14} className="animate-spin" /> : null}
                {savingMember ? "Création..." : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
