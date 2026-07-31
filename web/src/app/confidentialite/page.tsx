import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, Eye, Radio, Mail, MapPin, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | Saphir FM 106.8',
  description: 'Politique de confidentialité et de protection des données personnelles de Saphir FM 106.8.',
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#06040F] text-white pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saphir-electric/10 text-saphir-electric text-sm font-semibold border border-saphir-electric/20">
            <Shield className="w-4 h-4" />
            <span>Protection des Données</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-saphir-electric bg-clip-text text-transparent">
            Politique de Confidentialité
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Dernière mise à jour : 31 juillet 2026
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-10 text-gray-300 leading-relaxed text-sm md:text-base">
          {/* Introduction */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-saphir-electric" />
              1. Introduction
            </h2>
            <p>
              La présente Politique de Confidentialité s&apos;applique à l&apos;application mobile <strong>Saphir FM</strong> ainsi qu&apos;au site web officiel <strong>radiosaphir.com</strong> (ci-après dénommés « les Services »), édités par <strong>Saphir FM 106.8</strong>.
            </p>
            <p>
              Nous accordons une importance capitale au respect de votre vie privée et à la protection de vos données personnelles. Cette politique a pour objectif de vous informer de manière claire et transparente sur les données collectées, l&apos;utilisation qui en est faite et vos droits.
            </p>
          </section>

          {/* Collecte de données */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-saphir-electric" />
              2. Données Collectées
            </h2>
            <p>
              L&apos;application <strong>Saphir FM</strong> est conçue pour respecter au maximum votre anonymat. Nous ne collectons <strong>aucune donnée personnelle nominative</strong> (nom, prénom, adresse e-mail, numéro de téléphone) pour l&apos;écoute de la radio en direct.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-gray-300">
              <li><strong>Données d&apos;utilisation anonymes :</strong> Statistiques d&apos;écoute (durée d&apos;écoute, type d&apos;appareil, pays de connexion) afin d&apos;améliorer la qualité de nos flux.</li>
              <li><strong>Autorisations techniques de l&apos;application mobile :</strong>
                <ul className="list-circle list-inside pl-6 mt-1 space-y-1 text-gray-400">
                  <li><code>FOREGROUND_SERVICE</code> / <code>MEDIA_PLAYBACK</code> : Permet la lecture audio en arrière-plan lorsque vous verrouillez votre écran ou changez d&apos;application.</li>
                  <li><code>POST_NOTIFICATIONS</code> : Permet de vous informer des émissions spéciales ou événements majeurs (avec votre accord explicite).</li>
                  <li><code>WAKE_LOCK</code> : Empêche l&apos;interruption du flux radio lorsque le téléphone se met en veille.</li>
                </ul>
              </li>
            </ul>
          </section>

          {/* Traitement et finalité */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-saphir-electric" />
              3. Utilisation des Données
            </h2>
            <p>Les informations techniques et anonymes sont uniquement utilisées pour :</p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-gray-300">
              <li>Assurer la continuité de la diffusion audio en direct et à la demande (Podcasts).</li>
              <li>Afficher les métadonnées des titres en cours de lecture (Nom de la chanson, artiste).</li>
              <li>Garantir la stabilité technique et les performances du flux radio.</li>
            </ul>
          </section>

          {/* Stockage et Sécurité */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-saphir-electric" />
              4. Partage et Sécurité des Données
            </h2>
            <p>
              Vos données ne sont <strong>jamais vendues, louées ou cédées</strong> à des tiers à des fins commerciales. Les serveurs de diffusion et de données utilisent des protocoles sécurisés (HTTPS / SSL).
            </p>
          </section>

          {/* Vos Droits */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-saphir-electric" />
              5. Vos Droits
            </h2>
            <p>
              Conformément à la réglementation en vigueur, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition aux données vous concernant. Vous pouvez exercer ces droits à tout moment en nous contactant.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-r from-saphir-electric/20 to-purple-900/30 border border-saphir-electric/30 rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-saphir-electric" />
              6. Contact
            </h2>
            <p>Pour toute question concernant cette Politique de Confidentialité, vous pouvez nous contacter :</p>
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
          <Link href="/cgu" className="hover:text-white transition-colors">
            Conditions Générales d&apos;Utilisation
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
