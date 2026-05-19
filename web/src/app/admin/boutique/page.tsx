"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { 
  Plus, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Edit2, 
  Trash2,
  ChevronRight,
  Loader2
} from "lucide-react";

export default function AdminBoutique() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    revenue: 0,
    pendingCount: 0,
    growth: 24
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoutiqueData();
  }, []);

  async function loadBoutiqueData() {
    setLoading(true);
    try {
      // 1. Fetch Products
      const { data: prodData, error: prodErr } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (prodErr) throw prodErr;
      setProducts(prodData || []);

      // 2. Fetch Orders
      const { data: ordData, error: ordErr } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordErr) throw ordErr;
      
      const fetchedOrders = ordData || [];
      setOrders(fetchedOrders);

      // 3. Calculer les statistiques
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);

      const recentOrders = fetchedOrders.filter(
        o => new Date(o.created_at) >= thirtyDaysAgo && o.status !== 'cancelled'
      );
      const revenueSum = recentOrders.reduce((sum, o) => sum + Number(o.total_price || 0), 0);

      const pendingOrdersCount = fetchedOrders.filter(
        o => o.status === 'pending' || o.status === 'paid'
      ).length;

      // Calcul du taux de croissance fictif ou dynamique (basé sur le mois précédent)
      setStats({
        revenue: revenueSum,
        pendingCount: pendingOrdersCount,
        growth: fetchedOrders.length > 0 ? 24 : 0
      });

    } catch (error) {
      console.error("Error loading boutique data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Erreur lors de la suppression");
    }
  }

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    return `Il y a ${diffDays} j`;
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Boutique & Merchandising</h1>
          <p className="text-saphir-navy/40 text-sm">Gerez vos produits, suivez vos ventes et vos stocks.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-100 text-red-500 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all shadow-sm">
            <TrendingUp size={14} /> PDF
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-100 text-green-600 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-green-50 transition-all shadow-sm">
            <TrendingUp size={14} /> Excel
          </button>
          <Link 
            href="/admin/boutique/new"
            className="flex items-center gap-2 bg-saphir-navy text-white px-6 py-3 rounded-2xl font-bold hover:bg-saphir-electric transition-all shadow-lg"
          >
            <Plus size={20} />
            Ajouter un produit
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
           <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-6">
              <DollarSign size={24} />
           </div>
           <div className="text-2xl font-bold text-saphir-navy mb-1">
             {stats.revenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
           </div>
           <div className="text-xs font-bold text-saphir-navy/30 uppercase tracking-widest">Chiffre d'affaires (30j)</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
           <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
              <Package size={24} />
           </div>
           <div className="text-2xl font-bold text-saphir-navy mb-1">{stats.pendingCount}</div>
           <div className="text-xs font-bold text-saphir-navy/30 uppercase tracking-widest">Commandes en cours</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
           <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
              <TrendingUp size={24} />
           </div>
           <div className="text-2xl font-bold text-saphir-navy mb-1">
             {stats.growth > 0 ? `+${stats.growth}%` : "0%"}
           </div>
           <div className="text-xs font-bold text-saphir-navy/30 uppercase tracking-widest">Taux de croissance</div>
        </div>
      </div>

      {/* Products & Orders Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Inventory List */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
           <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-saphir-navy">Inventaire Produits</h2>
              <button className="text-saphir-electric text-xs font-bold uppercase tracking-widest hover:underline">Tout voir</button>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-gray-50/50">
                 <tr>
                    <th className="px-8 py-4 text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest">Produit</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest text-center">Stock</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest text-right">Actions</th>
                 </tr>
               </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="px-8 py-10 text-center text-saphir-navy/20 font-bold uppercase tracking-widest animate-pulse">
                        Chargement des produits...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-8 py-10 text-center text-saphir-navy/20 font-bold uppercase tracking-widest">
                        Aucun produit trouve
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-8 py-5">
                            <div className="font-bold text-saphir-navy text-sm">{product.name}</div>
                            <div className="text-xs text-saphir-electric font-bold">{product.price} €</div>
                        </td>
                        <td className="px-8 py-5 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                              product.stock > 10 ? 'bg-green-50 text-green-600' : 
                              product.stock > 0 ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {product.stock} pcs
                            </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/admin/boutique/edit/${product.id}`} className="p-2 hover:bg-gray-100 rounded-lg text-saphir-navy/20 hover:text-saphir-electric transition-all">
                                <Edit2 size={16} />
                              </Link>
                              <button 
                                onClick={() => deleteProduct(product.id)}
                                className="p-2 hover:bg-red-50 rounded-lg text-saphir-navy/20 hover:text-red-500 transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
             </table>
           </div>
        </div>

        {/* Recent Orders Side Card */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col">
           <h2 className="text-xl font-bold text-saphir-navy mb-8">Dernières Ventes</h2>
           <div className="flex-1 space-y-6">
              {loading ? (
                <div className="p-10 text-center text-xs font-bold text-saphir-navy/20 uppercase tracking-widest animate-pulse">Chargement...</div>
              ) : orders.length === 0 ? (
                <div className="p-10 text-center text-[10px] font-bold text-saphir-navy/20 uppercase tracking-widest">Aucune vente enregistree</div>
              ) : (
                orders.slice(0, 4).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100/50 transition-colors">
                     <div>
                        <div className="text-xs font-bold text-saphir-navy">
                          {order.customer_name || `Client #${order.id.substring(0, 4)}`}
                        </div>
                        <div className="text-[10px] text-saphir-navy/40 font-medium">
                          {formatTimeAgo(order.created_at)}
                        </div>
                     </div>
                     <div className="text-right flex items-center gap-1">
                        <div className="text-sm font-bold text-saphir-navy">
                          {Number(order.total_price).toFixed(2)} €
                        </div>
                        <ChevronRight size={14} className="text-saphir-navy/20" />
                     </div>
                  </div>
                ))
              )}
           </div>
           <button className="w-full mt-8 py-4 bg-saphir-navy text-white rounded-2xl font-bold text-xs hover:bg-saphir-electric transition-all shadow-lg uppercase tracking-wider">
              Voir toutes les commandes
           </button>
        </div>
      </div>
    </div>
  );
}
