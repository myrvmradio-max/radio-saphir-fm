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

  const STREAM_URL = "https://stream.radiosaphir.com/listen/radiosaphir-106.8-fm/radio.mp3";

  // Fetch current program logic
  useEffect(() => {
    async function fetchCurrentProgram() {
      try {
        const { supabase } = await import("@/lib/supabase");
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
        const currentDay = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"][now.getDay()];

        const { data } = await supabase
          .from('programmes')
          .select('*')
          .eq('day', currentDay)
          .lte('start_time', currentTime)
          .gte('end_time', currentTime)
          .single();

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

    fetchCurrentProgram();
    const interval = setInterval(fetchCurrentProgram, 60000);
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
        audio.src = STREAM_URL + "?t=" + Date.now();
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
