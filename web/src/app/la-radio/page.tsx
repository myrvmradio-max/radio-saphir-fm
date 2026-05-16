import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Radio } from "lucide-react";

export default function LaRadioPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-saphir-electric/10 px-4 py-2 rounded-full mb-6">
              <Radio size={16} className="text-saphir-electric" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-saphir-electric">La Radio</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-saphir-navy mb-6 tracking-tight">
              Saphir FM <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saphir-electric to-saphir-navy">106.8 FM</span>
            </h1>
            <p className="text-lg text-saphir-navy/40 font-medium max-w-2xl mx-auto">
              La fréquence de référence au cœur de Bouaké.
            </p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-xl shadow-saphir-navy/5 mb-12">
            <p className="text-xl text-saphir-navy/70 font-medium mb-6 leading-relaxed">
              Saphir FM émet sur la fréquence **106.8 FM** depuis la ville de Bouaké, en Côte d'Ivoire.
            </p>
            <p className="text-lg text-saphir-navy/60 font-medium mb-6 leading-relaxed">
              Nous couvrons toute la région de Gbêkê et au-delà, apportant l'information, la culture et le divertissement au plus près de nos auditeurs.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
