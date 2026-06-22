import { supabase } from './supabase';

/**
 * Traduit les noms de pays courants en français pour uniformiser les statistiques.
 */
function translateCountryToFrench(country: string): string {
  const translations: { [key: string]: string } = {
    "United States": "États-Unis",
    "United States of America": "États-Unis",
    "US": "États-Unis",
    "USA": "États-Unis",
    "Canada": "Canada",
    "United Kingdom": "Royaume-Uni",
    "UK": "Royaume-Uni",
    "Ivory Coast": "Côte d'Ivoire",
    "Cote d'Ivoire": "Côte d'Ivoire",
    "CI": "Côte d'Ivoire",
    "Benin": "Bénin",
    "Senegal": "Sénégal",
    "Cameroon": "Cameroun",
    "Guinea": "Guinée",
    "Morocco": "Maroc",
    "Algeria": "Algérie",
    "Tunisia": "Tunisie",
    "Belgium": "Belgique",
    "Switzerland": "Suisse",
    "Germany": "Allemagne",
    "Spain": "Espagne",
    "Italy": "Italie",
    "Netherlands": "Pays-Bas",
    "Brazil": "Brésil",
    "Burkina Faso": "Burkina Faso",
    "Togo": "Togo",
    "Mali": "Mali",
    "Niger": "Niger",
    "Gabon": "Gabon",
    "Congo": "Congo",
    "Democratic Republic of the Congo": "RDC (Congo)",
    "Madagascar": "Madagascar"
  };
  
  return translations[country] || country;
}

/**
 * Enregistre une session d'écoute en géolocalisant l'auditeur anonymement.
 * @param platform La plateforme ('web' ou 'mobile')
 */
export async function logListenerSession(platform: 'web' | 'mobile' = 'web'): Promise<void> {
  let country = 'International';
  let city = 'Inconnu';

  // Chaîne d'APIs GeoIP avec fallback automatique
  
  // 1. Essai avec freeipapi.com (très stable, HTTPS, 60 req/min)
  try {
    const response = await fetch('https://freeipapi.com/api/json', { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      if (data.countryName) {
        country = translateCountryToFrench(data.countryName);
        city = data.cityName || 'Inconnu';
      }
    }
  } catch (err) {
    console.warn("Échec de géolocalisation avec freeipapi.com:", err);
  }

  // 2. Fallback avec ipwho.is (si freeipapi a échoué ou n'a pas retourné de pays valide)
  if (country === 'International') {
    try {
      const response = await fetch('https://ipwho.is/?lang=fr', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.country) {
          country = data.country; // Déjà traduit en français par l'API
          city = data.city || 'Inconnu';
        }
      }
    } catch (err) {
      console.warn("Échec de géolocalisation avec ipwho.is:", err);
    }
  }

  // 3. Dernier recours avec ipapi.co (l'API historique)
  if (country === 'International') {
    try {
      const response = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        if (data.country_name) {
          country = translateCountryToFrench(data.country_name);
          city = data.city || 'Inconnu';
        }
      }
    } catch (err) {
      console.warn("Échec de géolocalisation avec ipapi.co:", err);
    }
  }

  try {
    // Enregistrement dans Supabase
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
    console.log("Impossible d'enregistrer la télémétrie dans Supabase:", err);
  }
}
