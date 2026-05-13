"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteArticle(id: string) {
    if (!confirm("Voulez-vous vraiment supprimer cet article ?")) return;
    
    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
      setArticles(articles.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Erreur lors de la suppression");
    }
  }

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
            {loading ? (
              <tr>
                <td colSpan={4} className="px-8 py-10 text-center text-saphir-navy/20 font-bold uppercase tracking-widest animate-pulse">
                  Chargement des articles...
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-10 text-center text-saphir-navy/20 font-bold uppercase tracking-widest">
                  Aucun article trouvé
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {article.cover_image ? (
                        <img src={article.cover_image} alt="" className="w-12 h-10 object-cover rounded-lg flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-10 bg-gray-100 rounded-lg flex-shrink-0"></div>
                      )}
                      <div>
                        <div className="font-bold text-saphir-navy text-sm">{article.title}</div>
                        <div className="text-[10px] font-bold text-saphir-navy/30 uppercase tracking-tighter">
                          Publié le {new Date(article.published_at || article.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {article.category || 'Général'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${article.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span className="text-xs font-bold text-saphir-navy/60">
                        {article.status === 'published' ? 'Publié' : 'Brouillon'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/articles/edit/${article.id}`} className="p-2 hover:bg-gray-100 rounded-lg text-saphir-navy/40 hover:text-saphir-electric transition-all">
                        <Edit2 size={16} />
                      </Link>
                      <Link href={`/articles/${article.slug}`} className="p-2 hover:bg-gray-100 rounded-lg text-saphir-navy/40 hover:text-saphir-electric transition-all">
                        <ExternalLink size={16} />
                      </Link>
                      <button 
                        onClick={() => deleteArticle(article.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-saphir-navy/40 hover:text-red-500 transition-all"
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
    </div>
  );
}
