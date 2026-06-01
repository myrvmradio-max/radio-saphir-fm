"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2, Globe, Image as ImageIcon, FileText } from "lucide-react";
import Link from "next/link";
import FileUploader from "@/components/admin/FileUploader";
import { useToast } from "@/context/ToastContext";

export default function EditArticle() {
  const { showToast } = useToast();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
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
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-saphir-navy text-white rounded-2xl font-bold text-sm hover:bg-saphir-electric transition-all shadow-lg disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "Mise à jour..." : "Enregistrer"}
        </button>
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
      </div>
    </div>
  );
}
