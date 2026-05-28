"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  ChevronLeft, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle,
  Calendar,
  Newspaper,
  Loader2,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchArticleData() {
      setLoading(true);
      try {
        // Query current article
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .single();

        if (error) throw error;

        if (data) {
          setArticle(data);
          
          // Query related articles in same category
          const { data: relatedData } = await supabase
            .from("articles")
            .select("*")
            .eq("status", "published")
            .eq("category", data.category)
            .neq("id", data.id)
            .order("published_at", { ascending: false })
            .limit(3);
          
          setRelatedArticles(relatedData || []);
        }
      } catch (err) {
        console.error("Error fetching article details:", err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      fetchArticleData();
    }
  }, [slug]);

  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    if (typeof window !== "undefined" && article) {
      const message = encodeURIComponent(
        `Découvrez cet article sur RADIO SAPHIR :\n\n*${article.title}*\n\nLien : ${window.location.href}`
      );
      window.open(`https://wa.me/?text=${message}`, "_blank");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-saphir-electric" size={48} />
          <p className="text-saphir-navy/40 font-bold uppercase tracking-widest text-[10px]">Chargement de la publication...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-32">
          <Newspaper size={64} className="text-saphir-navy/10 mb-6" />
          <h1 className="text-4xl font-black text-saphir-navy mb-4 tracking-tight">Article introuvable</h1>
          <p className="text-saphir-navy/40 mb-8 max-w-md font-medium text-sm leading-relaxed">
            Ce contenu n'existe pas, a été archivé ou a été temporairement mis hors ligne.
          </p>
          <button 
            onClick={() => router.push("/articles")}
            className="bg-saphir-navy text-white px-8 py-4 rounded-2xl font-bold hover:bg-saphir-electric transition-all shadow-lg active:scale-95"
          >
            Consulter les actualités
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFDFF]">
      <Navbar />

      {/* Inject custom styles dynamically to make the database HTML look premium */}
      <style>{`
        .article-html-content p {
          margin-bottom: 1.75rem;
          line-height: 1.8;
          font-size: 1.125rem;
          color: rgba(13, 27, 76, 0.75);
        }
        .article-html-content h2 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0D1B4C;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }
        .article-html-content h3 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #0D1B4C;
          margin-top: 2rem;
          margin-bottom: 1rem;
          letter-spacing: -0.015em;
        }
        .article-html-content ul {
          list-style-type: disc;
          padding-left: 1.75rem;
          margin-bottom: 1.75rem;
          color: rgba(13, 27, 76, 0.75);
          font-size: 1.125rem;
          line-height: 1.8;
        }
        .article-html-content ol {
          list-style-type: decimal;
          padding-left: 1.75rem;
          margin-bottom: 1.75rem;
          color: rgba(13, 27, 76, 0.75);
          font-size: 1.125rem;
          line-height: 1.8;
        }
        .article-html-content li {
          margin-bottom: 0.5rem;
        }
        .article-html-content a {
          color: #6A7CFF;
          text-decoration: underline;
          font-weight: 600;
          transition: color 0.2s;
        }
        .article-html-content a:hover {
          color: #0D1B4C;
        }
        .article-html-content blockquote {
          border-left: 4px solid #6A7CFF;
          padding-left: 1.5rem;
          font-style: italic;
          margin: 2rem 0;
          color: rgba(13, 27, 76, 0.6);
        }
      `}</style>

      <div className="pt-32 pb-20 container mx-auto px-6">
        {/* Navigation & Controls */}
        <div className="flex justify-between items-center mb-10 max-w-4xl mx-auto">
          <button 
            onClick={() => router.push("/articles")}
            className="flex items-center gap-2 text-saphir-navy/40 hover:text-saphir-navy font-bold text-xs uppercase tracking-widest transition-all group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Toutes les actus
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={copyToClipboard}
              className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-saphir-navy hover:bg-gray-50 transition-all shadow-sm group"
              title="Copier le lien"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="group-hover:scale-105 transition-transform" />}
            </button>
            <button 
              onClick={shareOnWhatsApp}
              className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-saphir-navy hover:bg-gray-50 transition-all shadow-sm group"
              title="Partager sur WhatsApp"
            >
              <MessageCircle size={18} className="text-emerald-500 group-hover:scale-105 transition-transform" />
            </button>
          </div>
        </div>

        {/* Article Details Container */}
        <article className="max-w-4xl mx-auto">
          
          {/* Header Info */}
          <header className="mb-10 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-saphir-navy/30 uppercase tracking-widest mb-4">
              <span className="bg-saphir-electric/10 text-saphir-electric px-3 py-1.5 rounded-full">
                {article.category}
              </span>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{new Date(article.published_at || article.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-saphir-navy font-playfair tracking-tight leading-tight">
              {article.title}
            </h1>
          </header>

          {/* Giant Hero Image */}
          <div className="aspect-[21/9] w-full bg-gray-50 rounded-[2.5rem] md:rounded-[3.5rem] border border-gray-100 overflow-hidden shadow-2xl shadow-saphir-navy/5 relative mb-12">
            {article.cover_image ? (
              <img 
                src={article.cover_image} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex flex-col items-center justify-center text-saphir-navy/10 gap-3">
                <Newspaper size={64} />
                <span className="font-bold tracking-widest text-xs uppercase">SAPHIR FM ACTUALITÉS</span>
              </div>
            )}
          </div>

          {/* Rich Content Body */}
          <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-50 shadow-xl shadow-saphir-navy/5 mb-16">
            <div 
              className="article-html-content text-saphir-navy/80 leading-relaxed font-medium"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

        </article>

        {/* Related Articles Recommender Module */}
        {relatedArticles.length > 0 && (
          <div className="mt-20 pt-20 border-t border-gray-100 max-w-5xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-saphir-electric font-black text-xs uppercase tracking-[0.2em] mb-2">Restez informé</p>
                <h2 className="text-4xl font-black text-saphir-navy tracking-tight font-playfair">Articles Similaires</h2>
              </div>
              <button 
                onClick={() => router.push("/articles")} 
                className="flex items-center gap-2 text-saphir-navy/40 hover:text-saphir-electric font-bold text-xs uppercase tracking-widest transition-all"
              >
                Tout voir <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {relatedArticles.map((rel) => (
                <Link 
                  href={`/articles/${rel.slug}`} 
                  key={rel.id} 
                  className="group cursor-pointer flex flex-col space-y-4"
                >
                  <div className="aspect-[16/10] bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 relative shadow-sm">
                    {rel.cover_image ? (
                      <img 
                        src={rel.cover_image} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-saphir-navy/10 font-bold italic text-xs">
                        SAPHIR FM
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] font-bold text-saphir-electric uppercase tracking-widest">{rel.category}</span>
                       <span className="text-[10px] text-saphir-navy/30 uppercase font-bold tracking-tighter">
                        {new Date(rel.published_at || rel.created_at).toLocaleDateString()}
                       </span>
                    </div>
                    <h3 className="text-md font-bold text-saphir-navy group-hover:text-saphir-electric transition-colors leading-snug">
                      {rel.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
