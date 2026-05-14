"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-saphir-navy text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              {/* LOGO ENCORE PLUS GRAND DANS LE FOOTER */}
              <div className="relative w-64 h-24 bg-white rounded-2xl p-3 shadow-xl">
                <Image 
                  src="/logo.png" 
                  alt="Saphir FM Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed">
              Votre radio de référence pour l'actualité, la culture et le divertissement. Écoutez-nous sur 106.8 FM et partout dans le monde via notre plateforme digitale.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-saphir-electric transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-saphir-electric transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-saphir-electric transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-saphir-electric transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-saphir-electric text-[10px]">Navigation</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li><Link href="/" className="hover:text-white transition-colors">Direct Radio</Link></li>
              <li><Link href="/articles" className="hover:text-white transition-colors">Actualités</Link></li>
              <li><Link href="/podcasts" className="hover:text-white transition-colors">Podcasts</Link></li>
              <li><Link href="/videos" className="hover:text-white transition-colors">Vidéos & Replays</Link></li>
              <li><Link href="/boutique" className="hover:text-white transition-colors">Boutique Officielle</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-saphir-electric text-[10px]">Contact</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-saphir-electric flex-shrink-0" />
                <span>123 Avenue de la Radio, <br />75000 Saphir City</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-saphir-electric flex-shrink-0" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-saphir-electric flex-shrink-0" />
                <span>contact@saphirfm.fr</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-saphir-electric text-[10px]">Newsletter</h4>
            <p className="text-white/40 text-[10px] mb-6 font-bold uppercase tracking-widest">Inscrivez-vous</p>
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="bg-transparent border-none text-xs px-3 py-2 flex-1 focus:outline-none"
              />
              <button className="bg-white text-saphir-navy px-4 py-2 rounded-lg font-bold text-[10px] hover:bg-saphir-electric hover:text-white transition-all">
                OK
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
            © 2026 Saphir FM 106.8. Tous droits réservés.
          </p>
          <div className="flex gap-8 text-[10px] font-bold text-white/20 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
            <a href="#" className="hover:text-white transition-colors">Publicité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
