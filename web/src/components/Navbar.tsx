"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, Radio } from "lucide-react";

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

  // Fermer le menu si la fenêtre est redimensionnée en mode desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Bloquer le scroll quand le menu est ouvert
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
            ? "bg-saphir-navy py-4 shadow-2xl border-b border-white/5"
            : "bg-saphir-navy/95 backdrop-blur-xl py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 z-50">
            <div className="relative w-40 lg:w-48 h-12 lg:h-14 bg-white rounded-xl px-4 py-2 shadow-inner hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="Saphir FM Logo"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
          </Link>

          {/* NAVIGATION DESKTOP */}
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold text-white/70 tracking-[0.2em] uppercase">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-saphir-electric transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-saphir-electric transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* BOUTON ÉCOUTER (Caché sur très petits mobiles) */}
            <button className="hidden sm:flex bg-white text-saphir-navy hover:bg-saphir-electric hover:text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-full font-bold text-[10px] tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-xl uppercase items-center gap-2">
              <Radio size={14} className="animate-pulse" />
              <span className="hidden md:inline">ÉCOUTER DIRECT</span>
              <span className="md:hidden">DIRECT</span>
            </button>

            {/* BOUTON HAMBURGER */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors z-50"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* OVERLAY MENU MOBILE */}
      <div
        className={`fixed inset-0 z-[90] lg:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop glassmorphism */}
        <div 
          className="absolute inset-0 bg-saphir-navy/98 backdrop-blur-2xl"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu content */}
        <div
          className={`relative h-full flex flex-col justify-center items-center px-6 transition-transform duration-500 ease-out ${
            isMenuOpen ? "translate-y-0" : "translate-y-10"
          }`}
        >
          <div className="flex flex-col items-center gap-8 w-full max-w-xs">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-2xl font-black text-white tracking-[0.2em] uppercase transition-all duration-300 hover:text-saphir-electric hover:scale-110 ${
                  isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {link.name}
              </Link>
            ))}
            
            <div 
              className={`mt-10 w-full pt-10 border-t border-white/10 flex flex-col items-center gap-6 ${
                isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${navLinks.length * 100}ms` }}
            >
              <button className="w-full bg-saphir-electric text-white px-8 py-4 rounded-2xl font-bold text-sm tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95">
                <Radio size={20} className="animate-pulse" />
                ÉCOUTER LE DIRECT
              </button>
              
              <p className="text-white/40 text-[10px] tracking-[0.3em] font-medium uppercase">
                Saphir FM • 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
