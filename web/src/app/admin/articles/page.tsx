"use client";

import Link from "next/link";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink 
} from "lucide-react";

export default function AdminArticles() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Gestion des Articles</h1>
          <p className="text-saphir-navy/40">Gérez vos publications, blogs et actualités.</p>
        </div>
        <Link 
          href="/admin/articles/new"
          className="flex items-center gap-2 bg-saphir-navy text-white px-6 py-3 rounded-2xl font-bold hover:bg-saphir-electric transition-all shadow-lg shadow-saphir-navy/10"
        >
          <Plus size={20} />
          Nouvel Article
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-saphir-navy/20" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par titre, auteur..." 
            className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20 transition-all"
          />
        </div>
        <select className="bg-gray-50 border-none rounded-xl px-4 py-3 text-saphir-navy font-bold text-sm outline-none">
          <option>Toutes les catégories</option>
          <option>Politique</option>
          <option>Culture</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Titre</th>
              <th className="px-8 py-5 text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Catégorie</th>
              <th className="px-8 py-5 text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-xs font-bold text-saphir-navy/40 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-5">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-10 bg-gray-100 rounded-lg flex-shrink-0"></div>
                      <div>
                        <div className="font-bold text-saphir-navy text-sm">Actualité Saphir #{i}</div>
                        <div className="text-[10px] font-bold text-saphir-navy/30 uppercase tracking-tighter">Publié le 12/05/2026</div>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-5">
                   <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest">Politique</span>
                </td>
                <td className="px-8 py-5">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs font-bold text-saphir-navy/60">Publié</span>
                   </div>
                </td>
                <td className="px-8 py-5 text-right">
                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-saphir-navy/40 hover:text-saphir-electric transition-all"><Edit2 size={16} /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-saphir-navy/40 hover:text-saphir-electric transition-all"><ExternalLink size={16} /></button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-saphir-navy/40 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
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
