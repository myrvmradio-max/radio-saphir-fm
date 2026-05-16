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
    { name: "ACCUEIL", href: "/" },
    { name: "ACTUALITÉS", href: "/articles" },
    { name: "LA RADIO", href: "/la-radio" },
    { name: "MÉDIATHÈQUE", subItems: [
        { name: "PODCAST", href: "/podcasts" },
        { name: "SAPHIR TV", href: "/videos" },
      ]
    },
    { name: "BOUTIQUE", href: "/boutique" },
    { name: "À PROPOS", href: "/a-propos" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-[110] transition-all duration-300 bg-saphir-navy border-b border-white/5 py-4 shadow-xl`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-36 md:w-44 lg:w-52 h-10 md:h-12 lg:h-14 transition-transform hover:scale-105 active:scale-95 bg-white rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/logo.png"
                alt="Saphir FM Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* NAVIGATION DESKTOP */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-bold text-white/80 tracking-[0.1em] uppercase">
            {navLinks.map((link) => (
              link.subItems ? (
                <div key={link.name} className="relative group py-2 cursor-pointer">
                  <div className="hover:text-white transition-all flex items-center gap-1">
                    {link.name}
                    <ChevronRight size={12} className="rotate-90 group-hover:rotate-[270deg] transition-transform" />
                  </div>
                  <div className="absolute top-full left-0 bg-[#060B1F] border border-white/5 shadow-2xl rounded-xl py-2 w-48 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-50">
                    {link.subItems.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-all"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-white transition-all relative group py-2"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-saphir-electric transition-all group-hover:w-full shadow-[0_0_8px_rgba(106,124,255,0.8)]"></span>
                </Link>
              )
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* BOUTON ÉCOUTER */}
            <Link 
              href="/contact"
              className="hidden lg:flex bg-gradient-to-r from-saphir-electric to-[#8B99FF] text-white px-6 py-2.5 rounded-full font-bold text-xs tracking-widest transition-all transform hover:scale-105 hover:shadow-[0_0_20px_rgba(106,124,255,0.4)] active:scale-95 uppercase items-center gap-2 border border-white/20"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_#fff]"></div>
              <span>Nous Contacter</span>
            </Link>

            {/* BOUTON HAMBURGER */}
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

      {/* OVERLAY MENU MOBILE - Drawer Style */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${
          isMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop sombre semi-transparent */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Drawer content - Prend 80% de la largeur */}
        <div
          className={`absolute top-0 right-0 h-full w-[80%] max-w-xs bg-[#060B1F] shadow-[-10px_0_40px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out border-l border-white/5 flex flex-col pt-24 pb-10 px-6 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Gradients subtils dans le drawer */}
          <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-saphir-electric/10 to-transparent pointer-events-none"></div>

          <div className="flex flex-col gap-2 relative z-10">
            {navLinks.map((link, index) => (
              link.subItems ? (
                <div key={link.name} className={`border-b border-white/5 transition-all duration-500 ${isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`} style={{ transitionDelay: `${index * 50}ms` }}>
                  <div className="flex items-center justify-between py-4">
                    <span className="text-xl font-bold text-white/90 tracking-widest uppercase">
                      {link.name}
                    </span>
                  </div>
                  <div className="pl-4 pb-2 space-y-2">
                    {link.subItems.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between py-2 text-white/50 hover:text-saphir-electric transition-all"
                      >
                        <span className="text-base font-bold uppercase tracking-wider">{sub.name}</span>
                        <ChevronRight size={14} />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`group flex items-center justify-between py-4 border-b border-white/5 transition-all duration-500 ${
                    isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <span className="text-xl font-bold text-white/90 tracking-widest uppercase group-hover:text-saphir-electric transition-all">
                    {link.name}
                  </span>
                  <ChevronRight className="text-white/20 group-hover:text-saphir-electric transition-colors" size={18} />
                </Link>
              )
            ))}
          </div>
          
          <div className="mt-auto space-y-4 relative z-10">
            <button className="w-full bg-saphir-electric text-white px-6 py-4 rounded-xl font-bold text-xs tracking-widest transition-all shadow-[0_10px_30px_rgba(106,124,255,0.3)] flex items-center justify-center gap-3 active:scale-[0.98] uppercase">
              <Radio size={18} className="animate-pulse" />
              Écouter Live
            </button>
            
            <Link 
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="w-full bg-gradient-to-r from-saphir-electric to-[#8B99FF] text-white px-6 py-4 rounded-xl font-bold text-xs tracking-widest transition-all shadow-[0_10px_30px_rgba(106,124,255,0.3)] flex items-center justify-center gap-3 active:scale-[0.98] uppercase"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_#fff]"></div>
              <span>Nous Contacter</span>
            </Link>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-white/30 text-[8px] font-bold uppercase tracking-widest mb-1">Fréquence</span>
                <span className="text-white/80 text-xs font-bold">106.8 FM</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-white/30 text-[8px] font-bold uppercase tracking-widest mb-1">Ville</span>
                <span className="text-white/80 text-xs font-bold">Bouaké, CI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
