"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  Settings, 
  Globe, 
  Share2, 
  Radio as RadioIcon, 
  Mail,
  MapPin,
  Phone,
  Link as LinkIcon,
  Loader2,
  Check
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/context/ToastContext";

export default function AdminSettings() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [config, setConfig] = useState({
    radio_name: "Saphir FM",
    slogan: "Écoutez. Informez-vous. Vivez.",
    seo_description: "Saphir FM 106.8, votre radio de référence. Moderne, proche de son audience et engagée.",
    email: "contact@saphirfm.fr",
    phone: "+225 0707931906",
    address: "Air France 2 rue wattao, Bouaké, Côte d'Ivoire",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    stream_url: "https://stream.radiosaphir.com/listen/radiosaphir-106.8-fm/radio.mp3",
    stats_api: "https://stats.saphirfm.ci/api/v1"
  });

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("*");
        
        if (data) {
          const newConfig = { ...config };
          data.forEach((item: any) => {
            if (item.key in newConfig) {
              // @ts-ignore
              newConfig[item.key] = item.value;
            }
          });
          setConfig(newConfig);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(config).map(([key, value]) => ({
        key,
        value
      }));

      const { error } = await supabase
        .from("settings")
        .upsert(updates, { onConflict: 'key' });

      if (error) throw error;
      
      setSaved(true);
      showToast("Configuration sauvegardée avec succès !", "success");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      showToast("Erreur lors de la sauvegarde", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-saphir-electric" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Configuration Globale</h1>
          <p className="text-saphir-navy/40 text-sm italic">Modifiez l'identité et les réglages techniques de Saphir FM.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-saphir-navy text-white px-8 py-3 rounded-2xl font-bold hover:bg-saphir-electric transition-all shadow-xl shadow-saphir-navy/20 disabled:opacity-50"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : saved ? <Check size={20} /> : <Save size={20} />}
          {saving ? "Sauvegarde..." : saved ? "Enregistré !" : "Enregistrer tout"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-100 pb-px">
        {[
          { id: 'general', label: 'Général', icon: Settings },
          { id: 'contact', label: 'Contact', icon: Mail },
          { id: 'social', label: 'Réseaux Sociaux', icon: Share2 },
          { id: 'stream', label: 'Streaming', icon: RadioIcon },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition-all relative ${
              activeTab === tab.id ? "text-saphir-navy" : "text-saphir-navy/30 hover:text-saphir-navy/60"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-saphir-navy rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {/* Settings Form Content */}
      <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-10">
        
        {activeTab === 'general' && (
          <div className="grid md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-4">
              <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Nom de la Radio</label>
              <input 
                type="text" 
                value={config.radio_name} 
                onChange={(e) => setConfig({...config, radio_name: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20 transition-all" 
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Slogan (Tagline)</label>
              <input 
                type="text" 
                value={config.slogan} 
                onChange={(e) => setConfig({...config, slogan: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20 transition-all" 
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Description SEO</label>
              <textarea 
                value={config.seo_description}
                onChange={(e) => setConfig({...config, seo_description: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-medium text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20 transition-all h-32 resize-none"
              ></textarea>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="grid md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-bold text-saphir-navy/40 uppercase tracking-widest"><Mail size={14}/> Email de contact</label>
              <input 
                type="email" 
                value={config.email} 
                onChange={(e) => setConfig({...config, email: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy" 
              />
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-bold text-saphir-navy/40 uppercase tracking-widest"><Phone size={14}/> Téléphone</label>
              <input 
                type="text" 
                value={config.phone} 
                onChange={(e) => setConfig({...config, phone: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy" 
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <label className="flex items-center gap-2 text-xs font-bold text-saphir-navy/40 uppercase tracking-widest"><MapPin size={14}/> Adresse des studios</label>
              <input 
                type="text" 
                value={config.address} 
                onChange={(e) => setConfig({...config, address: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy" 
              />
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
             {['facebook', 'instagram', 'twitter', 'youtube'].map(soc => (
               <div key={soc} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-saphir-navy font-bold text-[10px] uppercase">{soc.substring(0,2)}</div>
                 <input 
                   type="text" 
                   // @ts-ignore
                   value={config[soc]}
                   onChange={(e) => setConfig({...config, [soc]: e.target.value})}
                   placeholder={`Lien ${soc}`} 
                   className="flex-1 bg-transparent border-none font-bold text-saphir-navy text-sm outline-none" 
                 />
               </div>
             ))}
          </div>
        )}

        {activeTab === 'stream' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
             <div className="bg-saphir-navy/5 p-6 rounded-2xl border border-saphir-navy/5 space-y-4">
                <label className="flex items-center gap-2 text-xs font-bold text-saphir-navy/40 uppercase tracking-widest"><LinkIcon size={14}/> URL du flux Icecast (MP3)</label>
                <input 
                  type="text" 
                  value={config.stream_url} 
                  onChange={(e) => setConfig({...config, stream_url: e.target.value})}
                  className="w-full bg-white border border-gray-100 rounded-xl py-3 px-4 font-bold text-saphir-navy text-sm" 
                />
             </div>
             <div className="bg-saphir-navy/5 p-6 rounded-2xl border border-saphir-navy/5 space-y-4">
                <label className="flex items-center gap-2 text-xs font-bold text-saphir-navy/40 uppercase tracking-widest"><LinkIcon size={14}/> URL API Statistiques</label>
                <input 
                  type="text" 
                  value={config.stats_api} 
                  onChange={(e) => setConfig({...config, stats_api: e.target.value})}
                  className="w-full bg-white border border-gray-100 rounded-xl py-3 px-4 font-bold text-saphir-navy text-sm" 
                />
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
