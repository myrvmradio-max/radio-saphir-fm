"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import FileUploader from "@/components/admin/FileUploader";
import { useToast } from "@/context/ToastContext";

function EditEpisodeContent() {
  const { showToast } = useToast();
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const querySeriesId = searchParams.get("series");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seriesName, setSeriesName] = useState("");
  const [allSeries, setAllSeries] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    audio_url: "",
    duration: "",
    cover_image: "",
    series_id: ""
  });

  useEffect(() => {
    if (id) {
      fetchEpisodeAndSeries();
    }
  }, [id]);

  async function fetchEpisodeAndSeries() {
    try {
      const [episodeRes, seriesRes] = await Promise.all([
        supabase
          .from("podcasts")
          .select("*, series(title)")
          .eq("id", id)
          .single(),
        supabase
          .from("series")
          .select("id, title")
          .order("created_at", { ascending: false })
      ]);

      if (seriesRes.data) {
        setAllSeries(seriesRes.data);
      }

      if (episodeRes.error) throw episodeRes.error;
      const data = episodeRes.data;
      if (data) {
        setFormData({
          title: data.title,
          description: data.description || "",
          audio_url: data.audio_url || "",
          duration: data.duration?.toString() || "0",
          cover_image: data.cover_image || "",
          series_id: data.series_id || ""
        });
        if (data.series) {
          setSeriesName(data.series.title);
        }
      }
    } catch (err: any) {
      console.error("Error fetching episode:", err);
      showToast("Erreur lors du chargement de l'épisode : " + err.message, "error");
      router.push("/admin/podcasts");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.audio_url) {
      showToast("Le titre et l'URL audio sont obligatoires", "warning");
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
          series_id: formData.series_id || null,
          cover_image: formData.cover_image || null
        })
        .eq("id", id);

      if (error) throw error;

      showToast("Épisode mis à jour avec succès !", "success");
      
      const targetSeriesId = formData.series_id || querySeriesId;
      if (targetSeriesId) {
        router.push(`/admin/podcasts/episodes?series=${targetSeriesId}`);
      } else {
        router.push("/admin/podcasts");
      }
    } catch (error: any) {
      console.error("Error updating episode:", error);
      showToast("Erreur lors de la mise à jour : " + error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const backUrl = `/admin/podcasts/episodes?series=${formData.series_id || querySeriesId || ""}`;

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
          <Link href={backUrl} className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-saphir-navy hover:text-saphir-electric transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-saphir-navy">Modifier l'Épisode</h1>
            {seriesName && (
              <p className="text-xs font-bold text-saphir-navy/30 uppercase tracking-widest">Dans : {seriesName}</p>
            )}
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-saphir-navy text-white rounded-2xl font-bold text-sm hover:bg-saphir-electric transition-all shadow-lg disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
        <div className="space-y-4">
          <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest block">Série / Émission d'appartenance</label>
          <select 
            className="w-full bg-gray-50 border-none rounded-xl py-3.5 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20"
            value={formData.series_id || ""}
            onChange={(e) => {
              const val = e.target.value;
              setFormData({ ...formData, series_id: val });
              const found = allSeries.find(s => s.id === val);
              setSeriesName(found ? found.title : "");
            }}
          >
            <option value="">-- Podcast indépendant / Aucun --</option>
            {allSeries.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>

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
          <div className="space-y-6">
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
            <FileUploader
              type="image"
              folder="covers"
              value={formData.cover_image}
              onChange={(url) => setFormData({...formData, cover_image: url})}
              label="Image de couverture (optionnelle)"
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

export default function EditEpisode() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="animate-spin text-saphir-navy/20" size={40} /></div>}>
      <EditEpisodeContent />
    </Suspense>
  );
}
