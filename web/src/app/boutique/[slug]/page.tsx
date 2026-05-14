"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  ChevronLeft, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  ArrowRight,
  Plus,
  Minus,
  Star,
  ShieldCheck,
  Truck
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .single();

        if (data) {
          setProduct(data);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const phoneNumber = "2250707931906"; // Numéro par défaut
    const message = encodeURIComponent(
      `Bonjour Saphir FM ! Je souhaite commander le produit suivant :\n\n` +
      `*Produit :* ${product.name}\n` +
      `*Prix :* ${product.price} €\n` +
      `*Quantité :* ${quantity}\n\n` +
      `Lien : ${window.location.href}`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-saphir-navy border-t-saphir-electric rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black text-saphir-navy mb-4">Produit introuvable</h1>
        <p className="text-saphir-navy/40 mb-8">Ce produit n'existe plus ou a été déplacé.</p>
        <button 
          onClick={() => router.push("/boutique")}
          className="bg-saphir-navy text-white px-8 py-4 rounded-2xl font-bold hover:bg-saphir-electric transition-all"
        >
          Retour à la boutique
        </button>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : ["/logo.png"];

  return (
    <main className="min-h-screen bg-[#FDFDFF]">
      <Navbar />
      
      <div className="pt-32 pb-20 container mx-auto px-6">
        {/* Breadcrumbs & Navigation */}
        <div className="flex justify-between items-center mb-10">
          <button 
            onClick={() => router.push("/boutique")}
            className="flex items-center gap-2 text-saphir-navy/40 hover:text-saphir-navy font-bold text-xs uppercase tracking-widest transition-all group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Retour Boutique
          </button>
          <div className="flex gap-3">
            <button 
              onClick={copyToClipboard}
              className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-saphir-navy hover:bg-gray-50 transition-all shadow-sm"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
            <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-saphir-navy hover:bg-gray-50 transition-all shadow-sm">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-2xl shadow-saphir-navy/5 relative group">
              <Image 
                src={images[activeImage]} 
                alt={product.name}
                fill
                className="object-contain p-10 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6">
                <span className="bg-saphir-navy text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  Officiel
                </span>
              </div>
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img: string, i: number) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square rounded-2xl border-2 transition-all overflow-hidden relative bg-white ${
                      activeImage === i ? "border-saphir-electric shadow-lg scale-105" : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <span className="text-xs font-bold text-saphir-navy/20">4.9 (12 avis)</span>
              </div>
              <p className="text-saphir-electric font-black text-xs uppercase tracking-[0.2em] mb-2">{product.category}</p>
              <h1 className="text-4xl md:text-5xl font-black text-saphir-navy mb-4 tracking-tight leading-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-playfair font-black text-saphir-navy">{product.price} €</span>
                {product.stock > 0 ? (
                   <span className="text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">En Stock</span>
                ) : (
                   <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest">Épuisé</span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-saphir-navy/5 mb-8">
               <h3 className="text-xs font-black uppercase tracking-widest text-saphir-navy/30 mb-4">Description</h3>
               <p className="text-saphir-navy/60 leading-relaxed font-medium">
                 {product.description || "Aucune description disponible pour ce produit."}
               </p>
            </div>

            {/* Actions */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl p-1">
                   <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-saphir-navy hover:bg-white rounded-xl transition-all"
                   >
                     <Minus size={16} />
                   </button>
                   <span className="w-12 text-center font-bold text-saphir-navy">{quantity}</span>
                   <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-saphir-navy hover:bg-white rounded-xl transition-all"
                   >
                     <Plus size={16} />
                   </button>
                </div>
                <p className="text-xs font-bold text-saphir-navy/30 uppercase tracking-widest">Quantité</p>
              </div>

              <button 
                onClick={handleWhatsAppOrder}
                className="w-full bg-saphir-navy text-white py-6 rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:bg-saphir-electric transition-all shadow-2xl shadow-saphir-navy/20 transform active:scale-95 group"
              >
                <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
                Commander sur WhatsApp
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <Truck size={20} className="text-saphir-electric" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-saphir-navy">Livraison</p>
                      <p className="text-[10px] font-bold text-saphir-navy/40">Bouaké & Partout CI</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <ShieldCheck size={20} className="text-saphir-electric" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-saphir-navy">Qualité</p>
                      <p className="text-[10px] font-bold text-saphir-navy/40">Garantie Officielle</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section Placeholder */}
        <div className="mt-32 pt-20 border-t border-gray-100">
           <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-saphir-electric font-black text-xs uppercase tracking-[0.2em] mb-2">Découvrez aussi</p>
                <h2 className="text-4xl font-black text-saphir-navy tracking-tight">Produits Similaires</h2>
              </div>
              <button onClick={() => router.push("/boutique")} className="flex items-center gap-2 text-saphir-navy/40 hover:text-saphir-electric font-bold text-xs uppercase tracking-widest transition-all">
                Voir tout <ArrowRight size={16} />
              </button>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* This would be populated by real data in a full implementation */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-100 rounded-[2.5rem] mb-4"></div>
                  <div className="h-4 bg-gray-100 w-2/3 rounded-full mb-2"></div>
                  <div className="h-4 bg-gray-100 w-1/3 rounded-full"></div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
