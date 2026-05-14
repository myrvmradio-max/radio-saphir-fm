"use client";

import { useState, useEffect } from "react";
import { Clock, User, Calendar as CalendarIcon, ChevronRight, Radio } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function ProgrammesPage() {
  const [activeDay, setActiveDay] = useState("");
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"][new Date().getDay()];
    setActiveDay(today === "Dimanche" ? "Dimanche" : today);
  }, []);

  useEffect(() => {
    if (!activeDay) return;

    async function fetchProgrammes() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('programmes')
          .select('*')
          .eq('day', activeDay)
          .order('start_time', { ascending: true });

        if (data) {
          setProgrammes(data);
        }
      } catch (err) {
        console.error("Error fetching programmes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProgrammes();
  }, [activeDay]);

  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-saphir-electric/10 px-4 py-2 rounded-full mb-6">
              <CalendarIcon size={16} className="text-saphir-electric" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-saphir-electric">Grille des Antennes</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-saphir-navy mb-6 tracking-tight">
              Votre Semaine <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saphir-electric to-saphir-navy">Sur Saphir FM</span>
            </h1>
            <p className="text-lg text-saphir-navy/40 font-medium max-w-2xl mx-auto">
              Découvrez notre programmation variée, entre actualités, culture et musique, pour vous accompagner tout au long de la journée.
            </p>
          </div>

          {/* Day Selector */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="flex bg-white p-2 rounded-[2rem] border border-gray-100 shadow-xl shadow-saphir-navy/5 overflow-x-auto gap-2 no-scrollbar">
              {DAYS.map((day) => (
                <button 
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-8 py-4 rounded-2xl text-xs font-black transition-all whitespace-nowrap tracking-widest uppercase ${
                    activeDay === day 
                    ? "bg-saphir-navy text-white shadow-2xl shadow-saphir-navy/20 scale-105" 
                    : "text-saphir-navy/30 hover:bg-gray-50 hover:text-saphir-navy"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Content */}
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-white rounded-[2rem] animate-pulse border border-gray-100"></div>
                ))}
              </div>
            ) : programmes.length > 0 ? (
              <div className="space-y-6">
                {programmes.map((prog, i) => (
                  <div 
                    key={prog.id} 
                    className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-saphir-navy/5 hover:shadow-2xl hover:shadow-saphir-navy/10 transition-all group flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden"
                  >
                    {/* Time Indicator */}
                    <div className="flex flex-col items-center justify-center min-w-[120px]">
                      <span className="text-2xl font-black text-saphir-navy">{prog.start_time.substring(0, 5)}</span>
                      <div className="w-px h-6 bg-gray-100 my-2"></div>
                      <span className="text-sm font-bold text-saphir-navy/20 uppercase tracking-widest">{prog.end_time.substring(0, 5)}</span>
                    </div>

                    {/* Program Info */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${
                          prog.type === 'Direct' 
                          ? 'bg-red-50 text-red-500 border border-red-100' 
                          : 'bg-blue-50 text-blue-500 border border-blue-100'
                        }`}>
                          {prog.type}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-saphir-navy mb-2 group-hover:text-saphir-electric transition-colors">{prog.name}</h3>
                      <div className="flex items-center justify-center md:justify-start gap-4">
                        <span className="flex items-center gap-2 text-sm text-saphir-navy/40 font-bold">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-saphir-navy/20">
                            <User size={14} />
                          </div>
                          {prog.host}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="hidden md:block">
                      <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-200 group-hover:text-saphir-electric group-hover:border-saphir-electric transition-all">
                        <ChevronRight size={24} />
                      </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gray-50 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-xl">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Radio size={40} className="text-gray-200" />
                </div>
                <h3 className="text-2xl font-bold text-saphir-navy mb-2">Pas de programme</h3>
                <p className="text-saphir-navy/40 font-medium">Aucune émission n'est programmée pour ce jour.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
