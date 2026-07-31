import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Shield, Radio, CheckCircle, Mail, MapPin, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | Saphir FM 106.8",
  description: "Conditions Générales d'Utilisation (CGU) des services web et mobile de Saphir FM 106.8.",
};

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-[#06040F] text-white pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saphir-electric/10 text-saphir-electric text-sm font-semibold border border-saphir-electric/20">
            <FileText className="w-4 h-4" />
            <span>Conditions d&apos;Utilisation</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-saphir-electric bg-clip-text text-transparent">
            Conditions Générales d&apos;Utilisation (CGU)
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Dernière mise à jour : 31 juillet 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-gray-300 leading-relaxed text-sm md:text-base">
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-saphir-electric" />
              1. Objet
            </h2>
            <p>
              Les présentes Conditions Générales d&apos;Utilisation ont pour objet de définir les modalités de mise à disposition des services du site web <strong>radiosaphir.com</strong> et de l&apos;application mobile <strong>Saphir FM</strong>, édités par la station radio <strong>Saphir FM 106.8</strong>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-saphir-electric" />
              2. Accès aux Services
            </h2>
            <p>
              L&apos;accès à l&apos;écoute en direct de Saphir FM 106.8 et à ses contenus (podcasts, articles de presse, événements) est entièrement gratuit et accessible à tout utilisateur disposant d&apos;une connexion Internet.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-saphir-electric" />
              3. Propriété Intellectuelle
            </h2>
            <p>
              L&apos;ensemble des éléments constituant les Services (logos, marques, visuels, textes, flux audio, podcasts) sont la propriété exclusive de <strong>Saphir FM 106.8</strong> ou font l&apos;objet d&apos;une autorisation légale d&apos;utilisation. Toute reproduction, distribution ou diffusion sans autorisation préalable est strictement interdite.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-saphir-electric" />
              4. Responsabilité
            </h2>
            <p>
              Saphir FM s&apos;efforce d&apos;assurer la disponibilité continue des flux et contenus. Toutefois, Saphir FM ne saurait être tenue responsable des interruptions de service dues à des pannes de réseau tiers ou à des opérations de maintenance technique.
            </p>
          </section>

          <section className="bg-gradient-to-r from-saphir-electric/20 to-purple-900/30 border border-saphir-electric/30 rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-saphir-electric" />
              5. Contact
            </h2>
            <div className="space-y-2 pt-2 text-sm text-gray-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-saphir-electric shrink-0" />
                Air France 2 rue wattao, Bouaké, Côte d&apos;Ivoire
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-saphir-electric shrink-0" />
                (+225) 07 07 93 19 06 / 01 01 72 73 75 / 27 31 60 08 62
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-saphir-electric shrink-0" />
                radiosaphirfm@gmail.com
              </p>
            </div>
          </section>
        </div>

        {/* Footer links */}
        <div className="text-center pt-8 border-t border-white/10 text-sm text-gray-400 space-x-6">
          <Link href="/confidentialite" className="hover:text-white transition-colors">
            Politique de Confidentialité
          </Link>
          <span>•</span>
          <Link href="/mentions-legales" className="hover:text-white transition-colors">
            Mentions Légales
          </Link>
        </div>
      </div>
    </div>
  );
}
