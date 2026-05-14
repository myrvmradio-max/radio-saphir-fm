"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, Radio, ChevronRight } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: "DIRECT", href: "/" },
    { name: "PODCASTS", href: "/podcasts" },
    { name: "ACTUALITÉS", href: "/articles" },
    { name: "VIDÉOS", href: "/videos" },
    { name: "BOUTIQUE", href: "/boutique" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
          isScrolled || isMenuOpen
            ? "bg-saphir-navy/95 backdrop-blur-2xl py-3 shadow-2xl border-b border-white/10"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 z-[110]">
            <div className="relative w-36 lg:w-44 h-10 lg:h-12 transition-transform hover:scale-105 active:scale-95">
              {/* Logo avec un fond léger et élégant au lieu d'un bloc blanc massif */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-lg border border-white/20"></div>
              <Image
                src="/logo.png"
                alt="Saphir FM Logo"
                fill
                className="object-contain p-2 relative z-10"
                priority
              />
            </div>
          </Link>

          {/* NAVIGATION DESKTOP */}
          <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold text-white/80 tracking-[0.2em] uppercase">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-white transition-all relative group py-2"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-saphir-electric transition-all group-hover:w-full shadow-[0_0_8px_rgba(106,124,255,0.8)]"></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 z-[110]">
            {/* BOUTON ÉCOUTER - Design plus intégré */}
            <button className="hidden sm:flex bg-gradient-to-r from-saphir-electric to-[#8B99FF] text-white px-6 py-2.5 rounded-full font-bold text-[10px] tracking-widest transition-all transform hover:scale-105 hover:shadow-[0_0_20px_rgba(106,124,255,0.4)] active:scale-95 uppercase items-center gap-2 border border-white/20">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_#fff]"></div>
              <span>DIRECT</span>
            </button>

            {/* BOUTON HAMBURGER - Plus stylé */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all active:scale-90"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* OVERLAY MENU MOBILE - Version ultra-premium */}
      <div
        className={`fixed inset-0 z-[90] lg:hidden transition-all duration-700 ease-in-out ${
          isMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Gradients de fond complexes pour éviter l'aspect "trop blanc" ou trop plat */}
        <div className="absolute inset-0 bg-[#060B1F]">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-saphir-electric/20 via-transparent to-transparent opacity-50"></div>
           <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-saphir-navy via-transparent to-transparent opacity-50"></div>
        </div>
        
        {/* Menu content */}
        <div className="relative h-full flex flex-col pt-32 pb-10 px-8">
          <div className="flex flex-col gap-4">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`group flex items-center justify-between py-5 border-b border-white/5 transition-all duration-500 ${
                  isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span className="text-3xl font-black text-white/90 tracking-tighter uppercase group-hover:text-saphir-electric group-hover:pl-2 transition-all">
                  {link.name}
                </span>
                <ChevronRight className="text-white/20 group-hover:text-saphir-electric transition-colors" size={24} />
              </Link>
            ))}
          </div>
          
          <div 
            className={`mt-auto space-y-6 transition-all duration-700 delay-500 ${
              isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <button className="w-full bg-white text-saphir-navy px-8 py-5 rounded-2xl font-black text-sm tracking-[0.2em] transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 active:scale-[0.98] uppercase">
              <Radio size={20} className="text-saphir-electric animate-pulse" />
              Écouter le Direct
            </button>
            
            <div className="flex justify-between items-center px-2">
              <div className="flex flex-col">
                <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">Fréquence</span>
                <span className="text-white/80 text-sm font-bold">106.8 FM</span>
              </div>
              <div className="h-10 w-px bg-white/10"></div>
              <div className="flex flex-col text-right">
                <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">Localisation</span>
                <span className="text-white/80 text-sm font-bold">Paris, France</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
