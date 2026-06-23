"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { logListenerSession } from "@/lib/telemetry";

interface AudioContextType {
  isPlaying: boolean;
  isBuffering: boolean;
  togglePlay: () => Promise<void>;
  currentProgram: {
    name: string;
    host: string;
    time: string;
    isLoading: boolean;
  };
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentProgram, setCurrentProgram] = useState({
    name: "Saphir FM - En Direct",
    host: "Direct",
    time: "24/7",
    isLoading: true
  });

  const [streamUrl, setStreamUrl] = useState("https://play.radioking.io/saphir-fm2");

  // Fetch current program and settings logic
  useEffect(() => {
    async function fetchRadioData() {
      try {
        const { supabase } = await import("@/lib/supabase");
        
        // 1. Fetch Stream URL from settings
        try {
          const { data: streamData } = await supabase
            .from("settings")
            .select("value")
            .eq("key", "stream_url")
            .maybeSingle();
          
          if (streamData && streamData.value && streamData.value.includes("http")) {
            setStreamUrl(streamData.value);
          }
        } catch (streamErr) {
          console.error("Error fetching stream_url in Context:", streamErr);
        }

        // 2. Fetch current program
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
        const currentDay = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"][now.getDay()];

        const { data } = await supabase
          .from('programmes')
          .select('*')
          .eq('day', currentDay)
          .lte('start_time', currentTime)
          .gte('end_time', currentTime)
          .maybeSingle();

        if (data) {
          setCurrentProgram({
            name: data.name,
            host: data.host,
            time: `${data.start_time.substring(0, 5)} - ${data.end_time.substring(0, 5)}`,
            isLoading: false
          });
        } else {
          setCurrentProgram({
            name: "Saphir FM - En Direct",
            host: "Direct",
            time: "24/7",
            isLoading: false
          });
        }
      } catch (err) {
        console.error("Error fetching program in Context:", err);
        setCurrentProgram({
          name: "Saphir FM - En Direct",
          host: "Direct",
          time: "24/7",
          isLoading: false
        });
      }
    }

    fetchRadioData();
    const interval = setInterval(fetchRadioData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Initialize and synchronize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        audio.currentTime = 0;
        audio.removeAttribute("src");
        audio.load();
        setIsPlaying(false);
      } else {
        setIsBuffering(true);
        audio.src = streamUrl + "?t=" + Date.now();
        audio.crossOrigin = "anonymous";
        await audio.play();
        setIsPlaying(true);
        logListenerSession("web");
      }
    } catch (error) {
      console.error("Global audio play error:", error);
      setIsPlaying(false);
      setIsBuffering(false);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, isBuffering, togglePlay, currentProgram }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
