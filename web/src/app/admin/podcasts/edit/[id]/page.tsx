"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import FileUploader from "@/components/admin/FileUploader";
import { useToast } from "@/context/ToastContext";

export default function EditPodcast() {
  const { showToast } = useToast();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    audio_url: "",
    duration: "",
    cover_image: ""
  });

  useEffect(() => {
    if (id) fetchPodcast();
  }, [id]);

  async function fetchPodcast() {
    try {
      const { data, error } = await supabase
        .from("podcasts")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title,
          description: data.description || "",
          audio_url: data.audio_url || "",
          duration: data.duration?.toString() || "0",
          cover_image: data.cover_image || ""
        });
      }
    } catch (err: any) {
      console.error("Error fetching podcast:", err);
      showToast("Erreur lors du chargement : " + err.message, "error");
      router.push("/admin/podcasts");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.audio_url) {
      showToast("Le titre et le fichier audio sont obligatoires", "warning");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("podcasts")
        .update({
          title: formData.title,
          description: formData.description,
          audio_url: formData.audio_url,
          duration: parseInt(formData.duration) || 0,
          cover_image: formData.cover_image || null
        })
        .eq("id", id);

      if (error) throw error;

      showToast("Podcast mis à jour avec succès !", "success");
      router.push("/admin/podcasts");
    } catch (error: any) {
      console.error("Error updating podcast:", error);
      showToast("Erreur lors de la mise à jour : " + error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-saphir-navy/20" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/podcasts" className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-saphir-navy hover:text-saphir-electric transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-saphir-navy">Modifier le Podcast</h1>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-saphir-navy text-white rounded-2xl font-bold text-sm hover:bg-saphir-electric transition-all shadow-lg disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
        <div className="space-y-4">
          <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Titre du podcast</label>
          <input 
            type="text" 
            className="w-full bg-gray-50 border-none rounded-xl py-3.5 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FileUploader
              type="audio"
              folder="audios"
              value={formData.audio_url}
              onChange={(url) => setFormData({...formData, audio_url: url})}
              onAudioDuration={(dur) => setFormData(prev => ({...prev, duration: dur.toString()}))}
              label="Fichier audio (MP3)"
            />
            
            <div className="space-y-4">
              <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Durée (secondes)</label>
              <input 
                type="number" 
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20" 
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              />
            </div>
          </div>
          
          <div>
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
             value={formData.description}
             onChange={(e) => setFormData({...formData, description: e.target.value})}
           ></textarea>
        </div>
      </div>
    </div>
  );
}
