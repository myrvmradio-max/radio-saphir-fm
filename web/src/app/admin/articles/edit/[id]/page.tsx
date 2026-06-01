"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2, Globe, Image as ImageIcon, FileText, Eye, Music } from "lucide-react";
import Link from "next/link";
import FileUploader from "@/components/admin/FileUploader";
import { useToast } from "@/context/ToastContext";

export default function EditArticle() {
  const { showToast } = useToast();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    cover_image: "",
    category: "Général",
    status: "published",
    audio_url: ""
  });

  useEffect(() => {
    if (id) fetchArticle();
  }, [id]);

  async function fetchArticle() {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt || "",
          cover_image: data.cover_image || "",
          category: data.category || "Général",
          status: data.status || "published",
          audio_url: data.audio_url || ""
        });
      }
    } catch (err) {
      console.error("Error fetching article:", err);
      router.push("/admin/articles");
    } finally {
      setLoading(false);
    }
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content || !formData.slug) {
      showToast("Veuillez remplir les champs obligatoires (Titre, Contenu, Slug)", "warning");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("articles")
        .update({
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          excerpt: formData.excerpt,
          cover_image: formData.cover_image || null,
          audio_url: formData.audio_url || null,
          category: formData.category,
          status: formData.status
        })
        .eq("id", id);

      if (error) throw error;

      showToast("Article mis à jour avec succès !", "success");
      router.push("/admin/articles");
    } catch (error: any) {
      console.error("Error updating article:", error);
      showToast("Erreur lors de la mise à jour : " + error.message, "error");
    } finally {
      setSaving(false);
    }
  };


  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-saphir-navy/20" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/articles" className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-saphir-navy hover:text-saphir-electric transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-saphir-navy">Modifier l'Article</h1>
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
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-saphir-navy text-white rounded-2xl font-bold text-sm hover:bg-saphir-electric transition-all shadow-lg disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "Mise à jour..." : "Enregistrer"}
          </button>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Titre de l'article *</label>
            <input 
              type="text" 
              className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20" 
              value={formData.title}
              onChange={handleTitleChange}
            />
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest flex items-center gap-2"><Globe size={12}/> Slug (URL) *</label>
            <input 
              type="text" 
              className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20" 
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Catégorie</label>
            <select 
              className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option>Général</option>
              <option>Politique</option>
              <option>Culture</option>
              <option>Économie</option>
              <option>Sport</option>
            </select>
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Statut</label>
            <select 
              className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="published">Publié</option>
              <option value="draft">Brouillon</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <FileUploader
            type="image"
            folder="articles"
            value={formData.cover_image}
            onChange={(url) => setFormData({...formData, cover_image: url})}
            label="Image de couverture"
          />
        </div>

        <div className="space-y-4">
          <FileUploader
            type="audio"
            folder="articles"
            value={formData.audio_url}
            onChange={(url) => setFormData({...formData, audio_url: url})}
            label="Audio de l'article (optionnel)"
          />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Résumé court</label>
          <textarea 
            className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-medium text-saphir-navy h-20 resize-none focus:ring-2 focus:ring-saphir-electric/20" 
            value={formData.excerpt}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
          ></textarea>
        </div>

        <div className="space-y-4">
           <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest flex items-center gap-2"><FileText size={12}/> Contenu de l'article (Markdown ou HTML supporté)</label>
           <textarea 
             className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-medium text-saphir-navy h-96 resize-none focus:ring-2 focus:ring-saphir-electric/20" 
             value={formData.content}
             onChange={(e) => setFormData({...formData, content: e.target.value})}
           ></textarea>
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
