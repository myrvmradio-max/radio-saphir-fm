import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Saphir FM 106.8 | Écoutez, Informez-vous, Vivez le Direct",
  description: "Écoutez Saphir FM 106.8 en direct, la radio de référence à Bouaké et en Côte d'Ivoire. Actualités, musique ivoirienne, podcasts et Saphir TV.",
  icons: {
    icon: "/icon.png",
  },
  keywords: [
    "Saphir FM", "Radio Saphir", "Saphir FM 106.8", "Radio Saphir Bouaké", 
    "Saphir TV", "Radio Bouaké", "Radio en direct Côte d'Ivoire", 
    "Écouter radio ivoirienne", "Streaming radio Bouaké", "Radio live Côte d'Ivoire",
    "Musique ivoirienne", "Actualités Bouaké", "Podcast radio ivoirienne"
  ],
  openGraph: {
    title: "Saphir FM 106.8 | Écoutez, Informez-vous, Vivez le Direct",
    description: "Écoutez Saphir FM 106.8 en direct, la radio de référence à Bouaké et en Côte d'Ivoire.",
    url: "https://radiosaphir.com",
    siteName: "Saphir FM",
    images: [
      {
        url: "/logo.png",
        width: 500,
        height: 500,
        alt: "Saphir FM Logo",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saphir FM 106.8 | Écoutez, Informez-vous, Vivez le Direct",
    description: "Écoutez Saphir FM 106.8 en direct, la radio de référence à Bouaké et en Côte d'Ivoire.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
