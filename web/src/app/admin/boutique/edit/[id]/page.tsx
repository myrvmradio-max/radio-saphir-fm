"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2, Package, Tag, Trash2, Globe, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import FileUploader from "@/components/admin/FileUploader";
import { useToast } from "@/context/ToastContext";

export default function EditProduct() {
  const { showToast } = useToast();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "Vêtements",
    active: true,
    images: "",
    slug: "",
    whatsapp_message: ""
  });

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  async function fetchProduct() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      if (data) {
        setFormData({
          name: data.name,
          description: data.description || "",
          price: data.price.toString(),
          stock: data.stock.toString(),
          category: data.category || "Vêtements",
          active: data.active,
          images: data.images?.join(", ") || "",
          slug: data.slug || "",
          whatsapp_message: data.whatsapp_message || ""
        });
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      router.push("/admin/boutique");
    } finally {
      setLoading(false);
    }
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.slug) {
      showToast("Veuillez remplir tous les champs obligatoires (Nom, Prix, Slug)", "warning");
      return;
    }

    setSaving(true);
    try {
      const imagesArray = formData.images.split(",").map(url => url.trim()).filter(url => url !== "");

      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0,
          category: formData.category,
          active: formData.active,
          images: imagesArray,
          slug: formData.slug,
          whatsapp_message: formData.whatsapp_message || null
        })
        .eq("id", id);

      if (error) throw error;

      showToast("Produit mis à jour avec succès !", "success");
      router.push("/admin/boutique");
    } catch (error: any) {
      console.error("Error updating product:", error);
      showToast("Erreur lors de la mise à jour : " + error.message, "error");
    } finally {
      setSaving(false);
    }
  };


  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-saphir-navy/20" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/boutique" className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-saphir-navy hover:text-saphir-electric transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-saphir-navy">Modifier le Produit</h1>
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
        
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Nom du produit *</label>
            <input 
              type="text" 
              className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20" 
              value={formData.name}
              onChange={handleNameChange}
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

        {/* Pricing & Inventory */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Prix (FCFA) *</label>
            <input 
              type="number" 
              className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20" 
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Stock</label>
            <input 
              type="number" 
              className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20" 
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
            />
          </div>
          <div className="space-y-4 col-span-2 md:col-span-1">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Catégorie</label>
            <select 
              className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option>Vêtements</option>
              <option>Accessoires</option>
              <option>Équipements</option>
              <option>Autre</option>
            </select>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <FileUploader
            type="images"
            folder="products"
            value={formData.images}
            onChange={(urls) => setFormData({...formData, images: urls})}
            label="Images du produit"
          />
        </div>

        {/* Description */}
        <div className="space-y-4">
           <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Description détaillée</label>
           <textarea 
             className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-medium text-saphir-navy h-40 resize-none focus:ring-2 focus:ring-saphir-electric/20" 
             value={formData.description}
             onChange={(e) => setFormData({...formData, description: e.target.value})}
           ></textarea>
        </div>

        {/* WhatsApp Customization */}
        <div className="bg-green-50/50 p-8 rounded-[2.5rem] border border-green-100 space-y-6">
           <div className="flex items-center gap-3 text-green-600 font-bold uppercase text-xs tracking-widest">
              <Package size={18} /> Commande WhatsApp
           </div>
           <div className="space-y-4">
              <label className="text-[10px] font-bold text-green-700/50 uppercase tracking-widest">Message pré-rempli (Optionnel)</label>
              <textarea 
                className="w-full bg-white border-none rounded-xl py-3 px-4 font-medium text-green-800 focus:ring-2 focus:ring-green-200 h-20 resize-none text-sm shadow-sm" 
                placeholder="Ex: Bonjour Saphir FM, je souhaite commander ce produit..."
                value={formData.whatsapp_message}
                onChange={(e) => setFormData({...formData, whatsapp_message: e.target.value})}
              ></textarea>
              <p className="text-[9px] text-green-600/60 italic">* Si laissé vide, un message standard sera généré automatiquement.</p>
           </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
           <input 
            type="checkbox" 
            id="active" 
            className="w-5 h-5 rounded border-gray-300 text-saphir-electric focus:ring-saphir-electric"
            checked={formData.active}
            onChange={(e) => setFormData({...formData, active: e.target.checked})}
           />
           <label htmlFor="active" className="text-sm font-bold text-saphir-navy">Produit visible sur la boutique</label>
        </div>
      </div>
    </div>
  );
}
