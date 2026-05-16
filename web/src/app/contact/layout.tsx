import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nous Contacter | Saphir FM 106.8",
  description: "Contactez la radio Saphir FM à Bouaké. Envoyez-nous vos messages, demandes de partenariat, dédicaces ou suggestions.",
  keywords: [
    "Contact Saphir FM", "Radio Saphir contact", "Contacter radio Bouaké", 
    "Message radio Saphir", "Saphir FM adresse", "Saphir FM telephone"
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
