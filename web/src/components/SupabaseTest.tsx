"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SupabaseTest() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from("articles").select("count");
        if (error) throw error;
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    }
    testConnection();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 p-4 rounded-xl backdrop-blur-md border border-white/10 z-[100]">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${
          status === "loading" ? "bg-yellow-500 animate-pulse" : 
          status === "success" ? "bg-green-500" : "bg-red-500"
        }`} />
        <span className="text-xs font-bold text-white uppercase tracking-widest">
          Supabase: {status}
        </span>
      </div>
    </div>
  );
}
