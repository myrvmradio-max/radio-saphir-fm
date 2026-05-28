"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, ShoppingBag, Loader2, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import FileUploader from "@/components/admin/FileUploader";

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    category: "Vêtements",
    image_urls: "",
    whatsapp_message: ""
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      alert("Le nom et le prix sont obligatoires");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("products").insert([
        {
          name: formData.name,
          slug: formData.slug || generateSlug(formData.name),
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0,
          category: formData.category,
          images: formData.image_urls.split(",").map(url => url.trim()).filter(url => url),
          whatsapp_message: formData.whatsapp_message,
          active: true
        }
      ]);

      if (error) throw error;

      alert("Produit ajouté avec succès !");
      router.push("/admin/boutique");
    } catch (error: any) {
      console.error("Error creating product:", error);
      alert("Erreur lors de la création : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/boutique" className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-saphir-navy hover:text-saphir-electric transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-saphir-navy">Nouveau Produit</h1>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-saphir-navy text-white rounded-2xl font-bold text-sm hover:bg-saphir-electric transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? "Création..." : "Ajouter au catalogue"}
        </button>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Nom du produit</label>
            <input 
              type="text" 
              placeholder="Ex: T-shirt Saphir FM" 
              className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20" 
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest flex items-center gap-2">
              Slug SEO <LinkIcon size={12} />
            </label>
            <input 
              type="text" 
              placeholder="t-shirt-saphir-fm" 
              className="w-full bg-gray-50/50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy/40 text-xs focus:ring-2 focus:ring-saphir-electric/20" 
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Catégorie</label>
            <select 
              className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option>Vêtements</option>
              <option>Accessoires</option>
              <option>Maison</option>
              <option>Équipement</option>
              <option>Autre</option>
            </select>
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Prix (FCFA)</label>
            <input 
              type="number" 
              placeholder="25.00" 
              className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20" 
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Stock</label>
            <input 
              type="number" 
              placeholder="50" 
              className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20" 
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-4">
          <FileUploader
            type="images"
            folder="products"
            value={formData.image_urls}
            onChange={(urls) => setFormData({...formData, image_urls: urls})}
            label="Images du produit"
          />
        </div>

        <div className="space-y-4">
            <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Message WhatsApp personnalisé (Optionnel)</label>
            <input 
              type="text" 
              placeholder="Ex: Je souhaite commander ce t-shirt en taille L" 
              className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20" 
              value={formData.whatsapp_message}
              onChange={(e) => setFormData({...formData, whatsapp_message: e.target.value})}
            />
        </div>

        <div className="space-y-4">
           <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest">Description détaillée</label>
           <textarea 
             className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-medium text-saphir-navy h-40 resize-none focus:ring-2 focus:ring-saphir-electric/20" 
             placeholder="Détails du produit, matériaux, guide des tailles..."
             value={formData.description}
             onChange={(e) => setFormData({...formData, description: e.target.value})}
           ></textarea>
        </div>
      </div>
    </div>
  );
}
