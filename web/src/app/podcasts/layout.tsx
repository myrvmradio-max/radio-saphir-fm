import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Podcasts & Séries | Saphir FM 106.8",
  description: "Retrouvez toutes nos émissions en replay, des enquêtes exclusives et nos playlists thématiques sur Saphir FM. Écoutez vos programmes préférés quand vous voulez.",
  keywords: [
    "Podcast Côte d'Ivoire", "Podcast Bouaké", "Podcast radio ivoirienne", 
    "Replay radio", "Podcast Saphir FM", "Émissions radio replay"
  ],
};

export default function PodcastsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
