-- ====================================================================
-- SCRIPT DE CRÉATION DES TABLES MANQUANTES POUR SAPHIR FM
-- À exécuter dans l'éditeur SQL de votre console Supabase.
-- ====================================================================

-- 1. Table des Programmes (pour la grille des programmes et le player)
CREATE TABLE IF NOT EXISTS public.programmes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    host TEXT NOT NULL,
    day TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    type TEXT NOT NULL, -- 'Direct' ou 'Enregistré'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activation de la sécurité RLS
ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité pour 'programmes'
-- Lecture publique pour tout le monde (visiteurs du site)
CREATE POLICY "Lecture publique des programmes" 
ON public.programmes FOR SELECT USING (true);

-- Contrôle total pour les administrateurs connectés
CREATE POLICY "Accès complet admin sur les programmes" 
ON public.programmes FOR ALL TO authenticated USING (true);


-- 2. Table des Profils (pour la gestion des membres de l'équipe)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'Animateur', -- 'Administrateur', 'Animateur', 'Journaliste'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activation de la sécurité RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité pour 'profiles'
-- Lecture publique pour tout le monde (pour afficher l'équipe sur la page d'accueil)
CREATE POLICY "Lecture publique des profils" 
ON public.profiles FOR SELECT USING (true);

-- Contrôle total pour les administrateurs connectés
CREATE POLICY "Accès complet admin sur les profils" 
ON public.profiles FOR ALL TO authenticated USING (true);
