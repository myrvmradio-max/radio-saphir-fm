import { supabase } from './supabase';

/**
 * Enregistre une session d'écoute en géolocalisant l'auditeur anonymement.
 * @param platform La plateforme ('web' ou 'mobile')
 */
export async function logListenerSession(platform: 'web' | 'mobile' = 'web'): Promise<void> {
  try {
    // 1. Geolocalisation gratuite et respectueuse de la vie privée (sans clé d'API)
    const response = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
    let country = 'International';
    let city = 'Inconnu';

    if (response.ok) {
      const data = await response.json();
      if (data.country_name) {
        // Traduction ou formatage du pays si nécessaire
        country = data.country_name === 'Ivory Coast' ? 'Côte d\'Ivoire' : data.country_name;
      }
      if (data.city) {
        city = data.city;
      }
    }

    // 2. Enregistrement dans Supabase
    const { error } = await supabase
      .from('listener_logs')
      .insert([
        {
          country: country,
          city: city,
          platform: platform
        }
      ]);

    if (error) {
      console.warn("Erreur d'insertion télémétrie Supabase:", error.message);
    }
  } catch (err) {
    // Échec silencieux pour ne pas impacter la lecture de l'utilisateur final
    console.log("Impossible d'enregistrer la télémétrie:", err);
  }
}
