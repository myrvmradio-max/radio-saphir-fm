"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Youtube, Loader2 } from "lucide-react";
import Link from "next/link";
import FileUploader from "@/components/admin/FileUploader";

export default function NewVideo() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    video_url: "",
    thumbnail: "",
    category: "Replay"
  });

  const handleSubmit = async () => {
    if (!formData.title || !formData.video_url) {
      alert("Le titre et l'URL de la vidéo sont obligatoires");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("videos").insert([
        {
          title: formData.title,
          video_url: formData.video_url,
          thumbnail: formData.thumbnail || null,
          category: formData.category
        }
      ]);

      if (error) throw error;

      alert("Vidéo ajoutée avec succès !");
      router.push("/admin/videos");
    } catch (error: any) {
      console.error("Error adding video:", error);
      alert("Erreur lors de l'ajout : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/videos" className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-saphir-navy hover:text-saphir-electric transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-saphir-navy">Ajouter une Vidéo</h1>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-saphir-navy text-white rounded-2xl font-bold text-sm hover:bg-saphir-electric transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? "Ajout..." : "Enregistrer"}
        </button>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
        <div className="space-y-4">
          <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Titre de la vidéo</label>
          <input 
            type="text" 
            placeholder="Ex: Interview Exclusive - Artiste X" 
            className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">URL de la vidéo (YouTube, etc.)</label>
            <input 
              type="text" 
              placeholder="https://youtube.com/watch?v=..." 
              className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20" 
              value={formData.video_url}
              onChange={(e) => setFormData({...formData, video_url: e.target.value})}
            />
          </div>
          <div className="space-y-4">
            <FileUploader
              type="image"
              folder="videos"
              value={formData.thumbnail}
              onChange={(url) => setFormData({...formData, thumbnail: url})}
              label="Miniature de la vidéo"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Catégorie</label>
          <select 
            className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option>Replay</option>
            <option>Live Studio</option>
            <option>Clip Vidéo</option>
            <option>Autre</option>
          </select>
        </div>
      </div>
    </div>
  );
}
