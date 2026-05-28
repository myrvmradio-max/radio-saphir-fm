"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2, Mic, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import FileUploader from "@/components/admin/FileUploader";
import { useToast } from "@/context/ToastContext";

export default function EditSeries() {
  const { showToast } = useToast();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cover_image: ""
  });

  useEffect(() => {
    if (id) fetchSeries();
  }, [id]);

  async function fetchSeries() {
    try {
      const { data, error } = await supabase
        .from("series")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title,
          description: data.description || "",
          cover_image: data.cover_image || ""
        });
      }
    } catch (err) {
      console.error("Error fetching series:", err);
      router.push("/admin/podcasts");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async () => {
    if (!formData.title) {
      showToast("Le titre est obligatoire", "warning");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("series")
        .update({
          title: formData.title,
          description: formData.description,
          cover_image: formData.cover_image || null
        })
        .eq("id", id);

      if (error) throw error;

      showToast("Série mise à jour avec succès !", "success");
      router.push("/admin/podcasts");
    } catch (error: any) {
      console.error("Error updating series:", error);
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
          <Link href="/admin/podcasts" className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-saphir-navy hover:text-saphir-electric transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-saphir-navy">Modifier la Série</h1>
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
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Titre de l'émission</label>
            <input 
              type="text" 
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
             value={formData.description}
             onChange={(e) => setFormData({...formData, description: e.target.value})}
           ></textarea>
        </div>
      </div>
    </div>
  );
}
