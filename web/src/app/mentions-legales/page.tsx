import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Building, MapPin, Phone, Mail, Globe, Server } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mentions Légales | Saphir FM 106.8',
  description: 'Mentions légales et informations éditoriales de Saphir FM 106.8.',
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#06040F] text-white pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saphir-electric/10 text-saphir-electric text-sm font-semibold border border-saphir-electric/20">
            <Building className="w-4 h-4" />
            <span>Informations Légales</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-saphir-electric bg-clip-text text-transparent">
            Mentions Légales
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Dernière mise à jour : 31 juillet 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-gray-300 leading-relaxed text-sm md:text-base">
          {/* Éditeur */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-saphir-electric" />
              1. Éditeur de l&apos;Application et du Site Web
            </h2>
            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Raison Sociale / Nom :</strong> Saphir FM 106.8</p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-saphir-electric shrink-0" />
                <strong>Siège social :</strong> Air France 2 rue wattao, Bouaké, Côte d&apos;Ivoire
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-saphir-electric shrink-0" />
                <strong>Téléphone :</strong> (+225) 07 07 93 19 06 / 01 01 72 73 75 / 27 31 60 08 62
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-saphir-electric shrink-0" />
                <strong>Email :</strong> radiosaphirfm@gmail.com
              </p>
            </div>
          </section>

          {/* Directeur de publication */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-saphir-electric" />
              2. Direction de la Publication
            </h2>
            <p><strong>Directeur de la publication :</strong> La Direction Général de Saphir FM 106.8.</p>
          </section>

          {/* Hébergement */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-saphir-electric" />
              3. Hébergement
            </h2>
            <p><strong>Hébergement du site web :</strong> Vercel Inc., 340 S Lemon Ave #4133 Walnut, CA 91789, USA.</p>
            <p><strong>Hébergement des flux audio :</strong> Contabo GmbH, Aschauer Straße 32a, 81549 Munich, Allemagne.</p>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-r from-saphir-electric/20 to-purple-900/30 border border-saphir-electric/30 rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-saphir-electric" />
              4. Nous Contacter
            </h2>
            <p>
              Pour toute question ou signalement de contenu, vous pouvez nous contacter par e-mail à : <strong>radiosaphirfm@gmail.com</strong>
            </p>
          </section>
        </div>

        {/* Footer links */}
        <div className="text-center pt-8 border-t border-white/10 text-sm text-gray-400 space-x-6">
          <Link href="/confidentialite" className="hover:text-white transition-colors">
            Politique de Confidentialité
          </Link>
          <span>•</span>
          <Link href="/cgu" className="hover:text-white transition-colors">
            Conditions Générales d&apos;Utilisation
          </Link>
        </div>
      </div>
    </div>
  );
}
