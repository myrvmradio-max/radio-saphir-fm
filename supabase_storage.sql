-- SCRIPT SQL POUR INITIALISER LE STOCKAGE SUPABASE (SAPHIR STORAGE)
-- À exécuter dans l'éditeur SQL de votre console Supabase.

-- 1. Créer le bucket public 'saphir-media'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('saphir-media', 'saphir-media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Configurer les Politiques de Sécurité (RLS) sur storage.objects

-- Permettre à tout le monde de lire les fichiers (public)
CREATE POLICY "Lecture publique pour tous" ON storage.objects
FOR SELECT USING (bucket_id = 'saphir-media');

-- Permettre aux utilisateurs authentifiés d'uploader des fichiers
CREATE POLICY "Insertion réservée aux admins" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'saphir-media');

-- Permettre aux utilisateurs authentifiés de modifier leurs fichiers
CREATE POLICY "Modification réservée aux admins" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'saphir-media');

-- Permettre aux utilisateurs authentifiés de supprimer des fichiers
CREATE POLICY "Suppression réservée aux admins" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'saphir-media');
