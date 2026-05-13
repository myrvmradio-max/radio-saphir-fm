"use client";

import Link from "next/link";
import { 
  Plus, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Edit2, 
  Trash2,
  ChevronRight
} from "lucide-react";

const PRODUCTS = [
  { name: 'T-shirt Saphir Classic', price: '25.00 €', stock: 45, status: 'En stock' },
  { name: 'Casquette Logo 106.8', price: '18.50 €', stock: 12, status: 'Stock bas' },
  { name: 'Mug Saphir FM', price: '12.00 €', stock: 0, status: 'Rupture' },
];

export default function AdminBoutique() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Boutique & Merchandising</h1>
          <p className="text-saphir-navy/40 text-sm">Gérez vos produits, suivez vos ventes et vos stocks.</p>
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
           <div className="text-2xl font-bold text-saphir-navy mb-1">1 245.50 €</div>
           <div className="text-xs font-bold text-saphir-navy/30 uppercase tracking-widest">Chiffre d'affaires (30j)</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
           <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
              <Package size={24} />
           </div>
           <div className="text-2xl font-bold text-saphir-navy mb-1">56</div>
           <div className="text-xs font-bold text-saphir-navy/30 uppercase tracking-widest">Commandes en cours</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
           <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
              <TrendingUp size={24} />
           </div>
           <div className="text-2xl font-bold text-saphir-navy mb-1">+24%</div>
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
                 {PRODUCTS.map((product) => (
                   <tr key={product.name} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-5">
                         <div className="font-bold text-saphir-navy text-sm">{product.name}</div>
                         <div className="text-xs text-saphir-electric font-bold">{product.price}</div>
                      </td>
                      <td className="px-8 py-5 text-center">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                           product.status === 'En stock' ? 'bg-green-50 text-green-600' : 
                           product.status === 'Stock bas' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                         }`}>
                           {product.stock} pcs
                         </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <div className="flex justify-end gap-2">
                           <button className="p-2 hover:bg-gray-100 rounded-lg text-saphir-navy/20 hover:text-saphir-electric transition-all"><Edit2 size={16} /></button>
                           <button className="p-2 hover:bg-red-50 rounded-lg text-saphir-navy/20 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                         </div>
                      </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Recent Orders Side Card */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col">
           <h2 className="text-xl font-bold text-saphir-navy mb-8">Dernières Ventes</h2>
           <div className="flex-1 space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                   <div>
                      <div className="text-xs font-bold text-saphir-navy">Commande #125{i}</div>
                      <div className="text-[10px] text-saphir-navy/40 font-medium">Il y a 10 minutes</div>
                   </div>
                   <div className="text-right">
                      <div className="text-sm font-bold text-saphir-navy">45.00 €</div>
                      <ChevronRight size={14} className="text-saphir-navy/20 inline" />
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-8 py-4 bg-saphir-navy text-white rounded-2xl font-bold text-xs hover:bg-saphir-electric transition-all shadow-lg">
              VOIR TOUTES LES COMMANDES
           </button>
        </div>
      </div>
    </div>
  );
}
