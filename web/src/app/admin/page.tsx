"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, 
  Newspaper, 
  Headphones, 
  TrendingUp, 
  ArrowUpRight,
  Loader2 
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ articles: 0, series: 0 });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [recentEpisodes, setRecentEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: artCount },
          { count: serCount },
          { data: artData },
          { data: epData }
        ] = await Promise.all([
          supabase.from("articles").select("*", { count: 'exact', head: true }),
          supabase.from("series").select("*", { count: 'exact', head: true }),
          supabase.from("articles").select("*").order("created_at", { ascending: false }).limit(3),
          supabase.from("podcasts").select("*, series(title)").order("created_at", { ascending: false }).limit(3)
        ]);

        setCounts({ 
          articles: artCount || 0, 
          series: serCount || 0 
        });
        setRecentArticles(artData || []);
        setRecentEpisodes(epData || []);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const STATS = [
    { label: "Articles", value: counts.articles.toString(), icon: Newspaper, color: "bg-blue-500" },
    { label: "Séries Podcasts", value: counts.series.toString(), icon: Headphones, color: "bg-purple-500" },
    { label: "Auditeurs", value: "0", icon: Users, color: "bg-green-500" },
    { label: "Vues Total", value: "0", icon: TrendingUp, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Bonjour, Admin</h1>
          <p className="text-saphir-navy/40">Voici ce qui se passe sur Saphir FM aujourd'hui.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-100 text-saphir-navy px-6 py-3 rounded-2xl font-bold text-xs hover:bg-gray-50 transition-all shadow-sm">
             Rapport Global (PDF)
          </button>
          <button className="flex items-center gap-2 bg-saphir-navy text-white px-6 py-3 rounded-2xl font-bold text-xs hover:bg-saphir-electric transition-all shadow-lg shadow-saphir-navy/10">
             Export Data (Excel)
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-2xl text-white`}>
                <stat.icon size={24} />
              </div>
              <span className="flex items-center gap-1 text-green-500 font-bold text-xs">
                Actif <ArrowUpRight size={14} />
              </span>
            </div>
            <div className="text-2xl font-bold text-saphir-navy mb-1">
              {loading ? <Loader2 size={24} className="animate-spin text-saphir-navy/10" /> : stat.value}
            </div>
            <div className="text-xs font-bold text-saphir-navy/30 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Articles */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-saphir-navy">Derniers Articles</h2>
            <Link href="/admin/articles" className="text-saphir-electric text-xs font-bold uppercase tracking-widest hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="animate-spin text-saphir-navy/10" /></div>
            ) : recentArticles.length === 0 ? (
              <p className="text-center text-saphir-navy/20 py-10 font-bold uppercase tracking-widest text-xs">Aucun article</p>
            ) : (
              recentArticles.map((article) => (
                <Link href={`/admin/articles/edit/${article.id}`} key={article.id} className="flex gap-4 items-center group">
                  <div className="w-16 h-12 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden">
                    {article.cover_image && <img src={article.cover_image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-saphir-navy text-sm truncate group-hover:text-saphir-electric transition-colors">{article.title}</h4>
                    <p className="text-xs text-saphir-navy/30">
                      {new Date(article.created_at).toLocaleDateString()} • {article.category}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Podcast Activity */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-saphir-navy">Derniers Épisodes</h2>
            <Link href="/admin/podcasts" className="text-saphir-electric text-xs font-bold uppercase tracking-widest hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="animate-spin text-saphir-navy/10" /></div>
            ) : recentEpisodes.length === 0 ? (
              <p className="text-center text-saphir-navy/20 py-10 font-bold uppercase tracking-widest text-xs">Aucun épisode</p>
            ) : (
              recentEpisodes.map((ep, i) => (
                <div key={ep.id} className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-saphir-navy rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">#{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-saphir-navy text-sm truncate">{ep.title}</h4>
                    <p className="text-xs text-saphir-navy/30">{ep.series?.title || 'Podcast'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
