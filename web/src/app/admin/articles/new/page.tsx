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
  Loader2,
  Music
} from "lucide-react";
import Link from "next/link";
import FileUploader from "@/components/admin/FileUploader";
import { useToast } from "@/context/ToastContext";

export default function NewArticle() {
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Politique",
    content: "",
    status: "published",
    cover_image: "",
    audio_url: ""
  });

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      showToast("Veuillez remplir tous les champs obligatoires", "warning");
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
          audio_url: formData.audio_url || null,
          published_at: formData.status === "published" ? new Date().toISOString() : null
        }
      ]);

      if (error) throw error;

      showToast("Article publié avec succès !", "success");
      router.push("/admin/articles");
    } catch (error: any) {
      console.error("Error publishing article:", error);
      showToast("Erreur lors de la publication : " + error.message, "error");
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
          <button 
            type="button"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-6 py-3 border border-gray-100 bg-white text-saphir-navy rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all"
          >
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
           <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
             <FileUploader
               type="image"
               folder="articles"
               value={formData.cover_image}
               onChange={(url) => setFormData({...formData, cover_image: url})}
               label="Image de couverture"
             />
           </div>

           {/* Fichier audio */}
           <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
             <FileUploader
               type="audio"
               folder="articles"
               value={formData.audio_url}
               onChange={(url) => setFormData({...formData, audio_url: url})}
               label="Audio de l'article (optionnel)"
             />
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

      {/* Modal d'aperçu de l'article */}
      {showPreview && (
        <div className="fixed inset-0 z-[150] bg-saphir-navy/60 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 overflow-y-auto animate-fade-in">
          <div className="bg-[#FDFDFF] w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="font-bold text-saphir-navy text-lg">Aperçu de la publication</h3>
                <p className="text-xs text-saphir-navy/40 font-medium">Voici à quoi ressemblera votre article sur le site public.</p>
              </div>
              <button 
                onClick={() => setShowPreview(false)}
                className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-saphir-navy rounded-xl font-bold text-xs transition-all"
              >
                Fermer l'aperçu
              </button>
            </div>
            
            {/* Modal Body (Scrollable Article content) */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8">
              <style>{`
                .preview-html-content p { margin-bottom: 1.5rem; line-height: 1.8; font-size: 1.05rem; color: rgba(13, 27, 76, 0.75); }
                .preview-html-content h2 { font-size: 1.5rem; font-weight: 800; color: #0D1B4C; margin-top: 2rem; margin-bottom: 1rem; }
                .preview-html-content h3 { font-size: 1.25rem; font-weight: 700; color: #0D1B4C; margin-top: 1.5rem; margin-bottom: 0.75rem; }
                .preview-html-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; color: rgba(13, 27, 76, 0.75); }
                .preview-html-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.5rem; color: rgba(13, 27, 76, 0.75); }
                .preview-html-content li { margin-bottom: 0.5rem; }
                .preview-html-content a { color: #6A7CFF; text-decoration: underline; font-weight: 600; }
                .preview-html-content blockquote { border-left: 4px solid #6A7CFF; padding-left: 1.25rem; font-style: italic; margin: 1.5rem 0; color: rgba(13, 27, 76, 0.6); }
              `}</style>

              <article className="max-w-3xl mx-auto space-y-8">
                <header className="space-y-4">
                  <div className="flex items-center gap-3 text-xs font-bold text-saphir-navy/30 uppercase tracking-widest">
                    <span className="bg-saphir-electric/10 text-saphir-electric px-3 py-1 rounded-full">
                      {formData.category}
                    </span>
                    <span>•</span>
                    <span>{new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-saphir-navy font-playfair tracking-tight leading-tight">
                    {formData.title || "Sans titre"}
                  </h1>
                </header>

                {/* Cover image preview */}
                <div className="aspect-[21/9] w-full bg-gray-50 rounded-[2rem] border border-gray-100 overflow-hidden relative shadow-md">
                  {formData.cover_image ? (
                    <img src={formData.cover_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex flex-col items-center justify-center text-saphir-navy/10 gap-2">
                      <ImageIcon size={40} className="text-saphir-navy/10" />
                      <span className="font-bold tracking-widest text-[10px] uppercase">Aperçu de la couverture</span>
                    </div>
                  )}
                </div>

                {/* Inline Premium Audio Player Preview */}
                {formData.audio_url && (
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-md flex items-center gap-4">
                    <div className="w-10 h-10 bg-saphir-navy text-white rounded-xl flex items-center justify-center flex-shrink-0">
                      <Music size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-saphir-navy truncate">Audio de l'article</p>
                      <p className="text-[10px] text-saphir-navy/40 font-medium truncate">{formData.audio_url}</p>
                    </div>
                    <div className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">
                      Téléchargement Actif
                    </div>
                  </div>
                )}

                {/* Rendered HTML Content */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-inner">
                  <div 
                    className="preview-html-content text-saphir-navy/80 font-medium"
                    dangerouslySetInnerHTML={{ __html: formData.content || "<p class='italic text-gray-350'>Aucun contenu rédigé pour le moment...</p>" }}
                  />
                </div>
              </article>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
