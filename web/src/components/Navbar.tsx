"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
        ? "bg-saphir-navy py-4 shadow-2xl border-b border-white/5" 
        : "bg-saphir-navy/95 backdrop-blur-xl py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          {/* LOGO MIEUX CADRÉ ET PLUS RESPIRANT */}
          <div className="relative w-48 h-14 bg-white rounded-xl px-4 py-2 shadow-inner hover:scale-105 transition-transform">
            <Image 
              src="/logo.png" 
              alt="Saphir FM Logo" 
              fill 
              className="object-contain p-1"
              priority
            />
          </div>
        </Link>

        {/* NAVIGATION AVEC PLUS D'ESPACE */}
        <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold text-white/70 tracking-[0.2em] uppercase">
          <Link href="/" className="hover:text-saphir-electric transition-colors relative group">
            DIRECT
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-saphir-electric transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/podcasts" className="hover:text-saphir-electric transition-colors relative group">
            PODCASTS
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-saphir-electric transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/articles" className="hover:text-saphir-electric transition-colors relative group">
            ACTUALITÉS
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-saphir-electric transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/videos" className="hover:text-saphir-electric transition-colors relative group">
            VIDÉOS
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-saphir-electric transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/boutique" className="hover:text-saphir-electric transition-colors relative group">
            BOUTIQUE
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-saphir-electric transition-all group-hover:w-full"></span>
          </Link>
        </div>

        {/* BOUTON PLUS ÉPURÉ */}
        <button className="bg-white text-saphir-navy hover:bg-saphir-electric hover:text-white px-8 py-3 rounded-full font-bold text-[10px] tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-xl uppercase">
          ÉCOUTER DIRECT
        </button>
      </div>
    </nav>
  );
}
