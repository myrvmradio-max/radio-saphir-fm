"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Mic, Headphones, Loader2, Info } from "lucide-react";
import Link from "next/link";
import FileUploader from "@/components/admin/FileUploader";
import { useToast } from "@/context/ToastContext";

export default function NewPodcast() {
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cover_image: ""
  });

  const handleSubmit = async () => {
    if (!formData.title) {
      showToast("Le titre est obligatoire", "warning");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("series").insert([
        {
          title: formData.title,
          description: formData.description,
          cover_image: formData.cover_image || null
        }
      ]);

      if (error) throw error;

      showToast("Série créée avec succès !", "success");
      router.push("/admin/podcasts");
    } catch (error: any) {
      console.error("Error creating series:", error);
      showToast("Erreur lors de la création : " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/podcasts" className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-saphir-navy hover:text-saphir-electric transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-saphir-navy">Nouvelle Série Podcast</h1>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-saphir-navy text-white rounded-2xl font-bold text-sm hover:bg-saphir-electric transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? "Création..." : "Créer la série"}
        </button>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
        {/* Info Banner */}
        <div className="flex gap-4 bg-saphir-electric/[0.03] border border-saphir-electric/10 rounded-2xl p-5 items-start">
          <div className="w-10 h-10 rounded-xl bg-saphir-electric/10 flex items-center justify-center text-saphir-electric flex-shrink-0">
            <Info size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-saphir-navy">Pourquoi pas de fichier audio ici ?</h4>
            <p className="text-xs text-saphir-navy/65 leading-relaxed font-medium">
              Une <strong>série de podcasts</strong> (comme une émission de radio) regroupe plusieurs épisodes. Vous pourrez téléverser les fichiers audio (.mp3) individuellement pour chaque épisode dès que la série aura été créée.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Titre de l'émission</label>
            <input 
              type="text" 
              placeholder="Ex: Les Voix de la Ville" 
              className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="space-y-4">
            <FileUploader
              type="image"
              folder="covers"
              value={formData.cover_image}
              onChange={(url) => setFormData({...formData, cover_image: url})}
              label="Image de couverture"
            />
          </div>
        </div>
        <div className="space-y-4">
           <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Description</label>
           <textarea 
             className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-medium text-saphir-navy h-32 resize-none focus:ring-2 focus:ring-saphir-electric/20" 
             placeholder="Décrivez le concept du podcast..."
             value={formData.description}
             onChange={(e) => setFormData({...formData, description: e.target.value})}
           ></textarea>
        </div>
      </div>
    </div>
  );
}
