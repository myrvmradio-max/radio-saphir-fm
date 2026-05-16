"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("messages")
        .insert([
          {
            sender_name: formData.name,
            sender_email: formData.email,
            subject: formData.subject,
            content: formData.message,
            is_read: false,
            is_important: false
          }
        ]);

      if (error) throw error;

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      console.error("Error sending message:", err);
      setStatus("error");
      setErrorMessage(err.message || "Une erreur est survenue lors de l'envoi du message.");
    }
  };

  return (
    <div className="min-h-screen bg-[#060B1F] text-white pt-32 pb-20 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-saphir-electric/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-saphir-navy/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
            <span className="text-[10px] font-bold tracking-widest uppercase text-saphir-electric">Contact</span>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Parlons <span className="text-transparent bg-clip-text bg-gradient-to-r from-saphir-electric to-[#8B99FF]">Ensemble</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Une question, une suggestion ou un partenariat ? N'hésitez pas à nous laisser un message. Notre équipe vous répondra dans les plus brefs délais.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Address Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:border-saphir-electric/30 transition-all group">
              <div className="w-12 h-12 bg-saphir-electric/20 rounded-2xl flex items-center justify-center text-saphir-electric mb-6 group-hover:scale-110 transition-transform">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Notre Adresse</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Air France 2 rue wattao,<br />Bouaké, Côte d'Ivoire
              </p>
            </div>

            {/* Phone Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:border-saphir-electric/30 transition-all group">
              <div className="w-12 h-12 bg-saphir-electric/20 rounded-2xl flex items-center justify-center text-saphir-electric mb-6 group-hover:scale-110 transition-transform">
                <Phone size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Téléphone</h3>
              <div className="text-white/60 text-sm space-y-1">
                <p>(+225) 07 07 93 19 06</p>
                <p>(+225) 01 01 72 73 75</p>
                <p>(+225) 27 31 60 08 62</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:border-saphir-electric/30 transition-all group">
              <div className="w-12 h-12 bg-saphir-electric/20 rounded-2xl flex items-center justify-center text-saphir-electric mb-6 group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Email</h3>
              <p className="text-white/60 text-sm">
                radiosaphirfm@gmail.com
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-12 rounded-[2.5rem] relative">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-saphir-electric to-transparent rounded-t-[2.5rem]"></div>
            
            <h2 className="text-2xl font-bold mb-8">Envoyez-nous un message</h2>

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-2">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-green-400">Message envoyé avec succès !</h3>
                <p className="text-white/60 text-sm max-w-sm">
                  Merci pour votre message. Nous reviendrons vers vous dès que possible.
                </p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="mt-4 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold text-white/40 uppercase tracking-widest">Nom Complet</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Jean Dupont"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:ring-1 focus:ring-saphir-electric focus:border-saphir-electric outline-none transition-all text-white placeholder:text-white/20"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold text-white/40 uppercase tracking-widest">Email</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Ex: jean.dupont@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:ring-1 focus:ring-saphir-electric focus:border-saphir-electric outline-none transition-all text-white placeholder:text-white/20"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-bold text-white/40 uppercase tracking-widest">Objet</label>
                  <input 
                    type="text" 
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Sujet de votre message"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:ring-1 focus:ring-saphir-electric focus:border-saphir-electric outline-none transition-all text-white placeholder:text-white/20"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-bold text-white/40 uppercase tracking-widest">Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Votre message ici..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:ring-1 focus:ring-saphir-electric focus:border-saphir-electric outline-none transition-all text-white placeholder:text-white/20 resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-400 font-bold uppercase tracking-widest">{errorMessage}</p>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={status === "loading"}
                  className="w-full bg-gradient-to-r from-saphir-electric to-[#8B99FF] text-white py-4 px-6 rounded-xl font-bold text-xs tracking-widest transition-all shadow-[0_10px_30px_rgba(106,124,255,0.3)] flex items-center justify-center gap-3 active:scale-[0.98] uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
