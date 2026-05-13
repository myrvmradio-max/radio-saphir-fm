"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Newspaper, 
  Headphones, 
  Youtube, 
  ShoppingBag, 
  Radio as RadioIcon, 
  Calendar,
  Users,
  Megaphone,
  MessageSquare,
  Settings,
  LogOut,
  Home
} from "lucide-react";
import Image from "next/image";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/admin" },
  { icon: RadioIcon, label: "Stats Radio", href: "/admin/radio" },
  { icon: Calendar, label: "Programmes", href: "/admin/programmes" },
  { icon: Newspaper, label: "Articles", href: "/admin/articles" },
  { icon: Headphones, label: "Podcasts", href: "/admin/podcasts" },
  { icon: Youtube, label: "Vidéos", href: "/admin/videos" },
  { icon: ShoppingBag, label: "Boutique", href: "/admin/boutique" },
  { icon: Megaphone, label: "Publicités", href: "/admin/ads" },
  { icon: MessageSquare, label: "Messages", href: "/admin/messages" },
  { icon: Users, label: "Équipe", href: "/admin/users" },
  { icon: Settings, label: "Paramètres", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-saphir-navy text-white flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-white/5 flex-shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-full h-12 bg-white rounded-xl p-1 shadow-lg">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-xs ${
                isActive 
                ? "bg-saphir-electric text-white shadow-lg shadow-saphir-electric/20" 
                : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-1 flex-shrink-0">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/30 hover:text-white transition-all text-xs"
        >
          <Home size={18} />
          Retour au site
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400/60 hover:bg-red-400/10 hover:text-red-400 transition-all text-xs">
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
