import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saphir TV | L'Image du Son en Vidéo",
  description: "Regardez les émissions, interviews et reportages de Saphir FM sur Saphir TV. Votre plateforme média digitale à Bouaké et en Côte d'Ivoire.",
  keywords: [
    "Saphir TV", "Vidéos Saphir FM", "Télévision Bouaké", 
    "Média digital Côte d'Ivoire", "Regarder Saphir TV", "Web TV ivoirienne"
  ],
};

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
