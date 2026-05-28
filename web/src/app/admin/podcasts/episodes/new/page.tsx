"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Mic, Music, Loader2 } from "lucide-react";
import Link from "next/link";
import FileUploader from "@/components/admin/FileUploader";

function NewEpisodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seriesId = searchParams.get("series");
  
  const [loading, setLoading] = useState(false);
  const [seriesName, setSeriesName] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    audio_url: "",
    duration: ""
  });

  useEffect(() => {
    if (!seriesId) {
      router.push("/admin/podcasts");
      return;
    }
    fetchSeries();
  }, [seriesId]);

  async function fetchSeries() {
    const { data } = await supabase.from("series").select("title").eq("id", seriesId).single();
    if (data) setSeriesName(data.title);
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.audio_url) {
      alert("Le titre et l'URL audio sont obligatoires");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("podcasts").insert([
        {
          title: formData.title,
          description: formData.description,
          audio_url: formData.audio_url,
          duration: parseInt(formData.duration) || 0,
          series_id: seriesId,
          published_at: new Date().toISOString()
        }
      ]);

      if (error) throw error;

      alert("Épisode ajouté avec succès !");
      router.push(`/admin/podcasts/episodes?series=${seriesId}`);
    } catch (error: any) {
      console.error("Error adding episode:", error);
      alert("Erreur lors de l'ajout : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href={`/admin/podcasts/episodes?series=${seriesId}`} className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-saphir-navy hover:text-saphir-electric transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-saphir-navy">Nouvel Épisode</h1>
            <p className="text-xs font-bold text-saphir-navy/30 uppercase tracking-widest">Dans : {seriesName}</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-saphir-navy text-white rounded-2xl font-bold text-sm hover:bg-saphir-electric transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? "Ajout..." : "Publier l'épisode"}
        </button>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
        <div className="space-y-4">
          <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Titre de l'épisode</label>
          <input 
            type="text" 
            placeholder="Ex: Épisode 1 - L'ouverture" 
            className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <FileUploader
              type="audio"
              folder="audios"
              value={formData.audio_url}
              onChange={(url) => setFormData({...formData, audio_url: url})}
              onAudioDuration={(dur) => setFormData(prev => ({...prev, duration: dur.toString()}))}
              label="Fichier audio (MP3)"
            />
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Durée (secondes)</label>
            <input 
              type="number" 
              placeholder="Ex: 1800 (calculé automatiquement)" 
              className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20" 
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-4">
           <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Description / Notes de l'épisode</label>
           <textarea 
             className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-medium text-saphir-navy h-40 resize-none focus:ring-2 focus:ring-saphir-electric/20" 
             placeholder="De quoi parle cet épisode ?"
             value={formData.description}
             onChange={(e) => setFormData({...formData, description: e.target.value})}
           ></textarea>
        </div>
      </div>
    </div>
  );
}

export default function NewEpisode() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="animate-spin text-saphir-navy/20" size={40} /></div>}>
      <NewEpisodeContent />
    </Suspense>
  );
}
