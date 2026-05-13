"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  Type, 
  Layers, 
  Eye,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function NewArticle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Politique",
    content: "",
    status: "published",
    cover_image: ""
  });

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    try {
      const slug = generateSlug(formData.title);
      
      const { error } = await supabase.from("articles").insert([
        {
          title: formData.title,
          slug,
          content: formData.content,
          category: formData.category,
          status: formData.status,
          cover_image: formData.cover_image || null,
          published_at: formData.status === "published" ? new Date().toISOString() : null
        }
      ]);

      if (error) throw error;

      alert("Article publié avec succès !");
      router.push("/admin/articles");
    } catch (error: any) {
      console.error("Error publishing article:", error);
      alert("Erreur lors de la publication : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header avec bouton retour */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/articles" 
            className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-saphir-navy hover:text-saphir-electric transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-saphir-navy">Rédiger un article</h1>
            <p className="text-saphir-navy/40 text-sm italic">Créez une nouvelle publication pour vos auditeurs.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-100 bg-white text-saphir-navy rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all">
            <Eye size={18} />
            Aperçu
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-saphir-navy text-white rounded-2xl font-bold text-sm hover:bg-saphir-electric transition-all shadow-lg shadow-saphir-navy/10 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loading ? "Publication..." : "Publier l'article"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Colonne Principale (Édition) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Titre */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
            <label className="flex items-center gap-2 text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">
              <Type size={14} /> Titre de l'article
            </label>
            <input 
              type="text" 
              placeholder="Ex: Le nouveau festival Saphir arrive bientôt..." 
              className="w-full text-2xl font-bold text-saphir-navy border-none focus:ring-0 placeholder:text-gray-200"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* Contenu */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4 min-h-[400px]">
             <label className="flex items-center gap-2 text-xs font-bold text-saphir-navy/40 uppercase tracking-widest border-b border-gray-50 pb-4">
              Contenu de la publication
            </label>
            <textarea 
              placeholder="Commencez à rédiger ici..." 
              className="w-full h-full min-h-[300px] border-none focus:ring-0 text-saphir-navy leading-relaxed resize-none"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </div>
        </div>

        {/* Colonne Latérale (Paramètres) */}
        <div className="space-y-6">
           {/* Image de couverture */}
           <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
             <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Image de couverture (URL)</label>
             <input 
               type="text"
               placeholder="https://exple.com/image.jpg"
               className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-xs text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20"
               value={formData.cover_image}
               onChange={(e) => setFormData({...formData, cover_image: e.target.value})}
             />
             <div className="aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100/50 transition-all group overflow-hidden">
                {formData.cover_image ? (
                  <img src={formData.cover_image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-300 group-hover:text-saphir-electric shadow-sm">
                       <ImageIcon size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">Aperçu de l'image</span>
                  </>
                )}
             </div>
           </div>

           {/* Catégories */}
           <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
             <label className="flex items-center gap-2 text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">
                <Layers size={14} /> Catégorie
             </label>
             <select 
               className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-saphir-navy font-bold text-sm outline-none"
               value={formData.category}
               onChange={(e) => setFormData({...formData, category: e.target.value})}
             >
                <option>Politique</option>
                <option>Société</option>
                <option>Musique</option>
                <option>Culture</option>
                <option>Sport</option>
             </select>
           </div>

           {/* Visibilité */}
           <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
              <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Statut de publication</label>
              <div className="flex flex-col gap-2">
                 {[
                   { id: 'published', label: 'Public' },
                   { id: 'draft', label: 'Brouillon' }
                 ].map((s) => (
                   <button 
                     key={s.id}
                     onClick={() => setFormData({...formData, status: s.id})}
                     className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                       formData.status === s.id 
                       ? "bg-saphir-navy text-white" 
                       : "bg-gray-50 text-saphir-navy/40 hover:bg-gray-100"
                     }`}
                   >
                     {s.label}
                     {formData.status === s.id && <div className="w-2 h-2 rounded-full bg-saphir-electric"></div>}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
