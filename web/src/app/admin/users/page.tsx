"use client";

import { 
  Plus, 
  User, 
  Shield, 
  Mic, 
  Newspaper,
  MoreVertical,
  Mail,
  Edit2,
  Trash2
} from "lucide-react";

const TEAM = [
  { name: 'Admin Principal', role: 'Administrateur', email: 'admin@saphirfm.fr', status: 'Actif', color: 'bg-saphir-navy' },
  { name: 'Jean-Michel', role: 'Animateur', email: 'jeanmichel@saphirfm.fr', status: 'Actif', color: 'bg-purple-500' },
  { name: 'Sarah L.', role: 'Animateur', email: 'sarah@saphirfm.fr', status: 'Hors-ligne', color: 'bg-orange-500' },
  { name: 'Marc O.', role: 'Journaliste', email: 'marc@saphirfm.fr', status: 'Actif', color: 'bg-blue-500' },
];

export default function AdminTeam() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Gestion de l'Équipe</h1>
          <p className="text-saphir-navy/40 text-sm italic">Gérez les accès et les profils de vos collaborateurs.</p>
        </div>
        <button className="flex items-center gap-2 bg-saphir-navy text-white px-6 py-3 rounded-2xl font-bold hover:bg-saphir-electric transition-all shadow-lg">
          <Plus size={20} />
          Ajouter un membre
        </button>
      </div>

      {/* Roles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Administrateurs', count: 1, icon: Shield, color: 'text-saphir-navy' },
           { label: 'Animateurs', count: 2, icon: Mic, color: 'text-purple-500' },
           { label: 'Journalistes', count: 1, icon: Newspaper, color: 'text-blue-500' },
         ].map(role => (
           <div key={role.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                 <div className="text-2xl font-bold text-saphir-navy">{role.count}</div>
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
            {TEAM.map((member, i) => (
              <tr key={i} className="hover:bg-gray-50/30 transition-colors group">
                <td className="px-8 py-5">
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${member.color} rounded-2xl flex items-center justify-center text-white font-bold text-sm`}>
                        {member.name.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-saphir-navy text-sm">{member.name}</div>
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
                      <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'Actif' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-[10px] font-bold text-saphir-navy/60 uppercase">{member.status}</span>
                   </div>
                </td>
                <td className="px-8 py-5 text-right">
                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-saphir-navy/20 hover:text-saphir-electric transition-all"><Edit2 size={16} /></button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-saphir-navy/20 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
