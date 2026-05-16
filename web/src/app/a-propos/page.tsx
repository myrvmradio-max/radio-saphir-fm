import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Info, MapPin, Phone, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function AboutPage() {
  // Valeurs par défaut
  let aboutText = "Saphir FM 106.8 est votre station de radio de référence basée au cœur de Bouaké, en Côte d'Ivoire. Moderne, dynamique et proche de son audience, Saphir FM vous accompagne au quotidien avec une programmation riche et variée.";
  let contactAddress = "Air France 2 rue wattao, Bouaké, Côte d'Ivoire";
  let contactPhone = "(+225) 07 07 93 19 06\n(+225) 01 01 72 73 75\n(+225) 27 31 60 08 62";
  let contactEmail = "radiosaphirfm@gmail.com";

  try {
    // Récupération des données depuis Supabase
    const { data: about } = await supabase.from('settings').select('*').eq('key', 'about').single();
    const { data: addr } = await supabase.from('settings').select('*').eq('key', 'address').single();
    const { data: ph } = await supabase.from('settings').select('*').eq('key', 'phone').single();
    const { data: em } = await supabase.from('settings').select('*').eq('key', 'email').single();

    if (about) aboutText = about.value;
    if (addr) contactAddress = addr.value;
    if (ph) contactPhone = ph.value;
    if (em) contactEmail = em.value;
  } catch (error) {
    console.error("Error fetching settings:", error);
  }

  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-saphir-electric/10 px-4 py-2 rounded-full mb-6">
              <Info size={16} className="text-saphir-electric" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-saphir-electric">À Propos</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-saphir-navy mb-6 tracking-tight">
              L'Histoire de <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saphir-electric to-saphir-navy">Saphir FM</span>
            </h1>
            <p className="text-lg text-saphir-navy/40 font-medium max-w-2xl mx-auto">
              Découvrez qui nous sommes, nos valeurs et comment nous contacter.
            </p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-xl shadow-saphir-navy/5 mb-12">
            <p className="text-xl text-saphir-navy/70 font-medium mb-6 leading-relaxed">
              {aboutText}
            </p>
          </div>

          {/* Contact Cards */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-saphir-navy/5 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={24} className="text-saphir-electric" />
              </div>
              <h3 className="text-lg font-bold text-saphir-navy mb-2">Adresse</h3>
              <p className="text-sm text-saphir-navy/40 font-medium">{contactAddress}</p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-saphir-navy/5 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={24} className="text-saphir-electric" />
              </div>
              <h3 className="text-lg font-bold text-saphir-navy mb-2">Téléphones</h3>
              <div className="text-sm text-saphir-navy/40 font-medium">
                {contactPhone.split('\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-saphir-navy/5 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-saphir-electric" />
              </div>
              <h3 className="text-lg font-bold text-saphir-navy mb-2">Email</h3>
              <p className="text-sm text-saphir-navy/40 font-medium">{contactEmail}</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
