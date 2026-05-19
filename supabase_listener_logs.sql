-- ==========================================
-- SCRIPT DE CRÉATION DE LA TELEMETRIE AUDIO
-- ==========================================

-- 1. Création de la table des logs d'écoute
CREATE TABLE IF NOT EXISTS public.listener_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    country TEXT DEFAULT 'International' NOT NULL,
    city TEXT DEFAULT 'Inconnu' NOT NULL,
    platform TEXT DEFAULT 'web' NOT NULL -- 'web' ou 'mobile'
);

-- 2. Création d'index pour optimiser les performances des graphiques de l'admin
CREATE INDEX IF NOT EXISTS idx_listener_logs_created_at ON public.listener_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_listener_logs_country ON public.listener_logs(country);

-- 3. Configuration de la sécurité RLS (Row Level Security)
ALTER TABLE public.listener_logs ENABLE ROW LEVEL SECURITY;

-- Autoriser l'insertion de logs par tout le monde (depuis le site ou l'application mobile)
CREATE POLICY "Allow anonymous inserts" 
ON public.listener_logs 
FOR INSERT 
WITH CHECK (true);

-- Autoriser la lecture des logs (pour afficher les stats sur le tableau de bord admin)
CREATE POLICY "Allow public select" 
ON public.listener_logs 
FOR SELECT 
USING (true);
