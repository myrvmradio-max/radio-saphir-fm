-- SCHEMA POUR SAPHIR FM 106.8

-- 1. Table des Articles (Blog)
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    category TEXT DEFAULT 'Général',
    status TEXT DEFAULT 'draft', -- draft, published, scheduled
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    author_id UUID REFERENCES auth.users(id)
);

-- 2. Table des Podcasts
CREATE TABLE IF NOT EXISTS series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS podcasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    audio_url TEXT NOT NULL,
    cover_image TEXT,
    series_id UUID REFERENCES series(id) ON DELETE SET NULL,
    duration INTEGER, -- en secondes
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table des Vidéos
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    video_url TEXT NOT NULL, -- YouTube, Vimeo ou S3
    thumbnail TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. E-commerce : Produits
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    images TEXT[], -- Array d'URLs
    category TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. E-commerce : Commandes
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'pending', -- pending, paid, shipped, delivered, cancelled
    total_price DECIMAL(10,2) NOT NULL,
    customer_email TEXT,
    customer_name TEXT,
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(10,2) NOT NULL
);

-- 6. Politiques de Sécurité (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour tout le monde
CREATE POLICY "Articles publics" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Podcasts publics" ON podcasts FOR SELECT USING (true);
CREATE POLICY "Produits publics" ON products FOR SELECT USING (active = true);

-- Gestion réservée aux admins (à affiner selon les rôles)
CREATE POLICY "Admin full access articles" ON articles FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access podcasts" ON podcasts FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access products" ON products FOR ALL TO authenticated USING (true);
