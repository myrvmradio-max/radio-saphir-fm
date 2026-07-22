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
  isStreamOffline: boolean;
  isLiveBroadcast: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isStreamOffline, setIsStreamOffline] = useState(false);
  const [isLiveBroadcast, setIsLiveBroadcast] = useState(false);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentProgram, setCurrentProgram] = useState({
    name: "Saphir FM",
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
            name: "Saphir FM",
            host: "Direct",
            time: "24/7",
            isLoading: false
          });
        }
      } catch (err) {
        console.error("Error fetching program in Context:", err);
        setCurrentProgram({
          name: "Saphir FM",
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

  // Poll AzuraCast API to detect live broadcast status
  useEffect(() => {
    async function fetchLiveStatus() {
      try {
        const res = await fetch("https://stream.radiosaphir.com/api/nowplaying", { cache: 'no-store' });
        if (res.ok) {
          const payload = await res.json();
          const station = Array.isArray(payload) ? payload[0] : payload;
          const liveStatus = station?.live?.is_live === true || Boolean(station?.live?.streamer_name);
          setIsLiveBroadcast(liveStatus);
        }
      } catch (err) {
        console.error("Error fetching live status:", err);
      }
    }

    fetchLiveStatus();
    const interval = setInterval(fetchLiveStatus, 15000);
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
      setIsStreamOffline(false);
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
    };
    const handleError = (e: Event) => {
      console.error("Audio stream error event:", e);
      setIsStreamOffline(true);
      setIsPlaying(false);
      setIsBuffering(false);
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      try {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      } catch (err) {
        console.error("Error pausing audio on stream error:", err);
      }
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("error", handleError);
    audio.addEventListener("stalled", handleError);

    return () => {
      audio.pause();
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("stalled", handleError);
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
        setIsStreamOffline(false); // Reset status on manual play attempt
        audio.src = streamUrl + "?t=" + Date.now();
        audio.crossOrigin = "anonymous";
        
        // Start connection timeout (8 seconds)
        if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = setTimeout(() => {
          if (audio.paused || audio.seeking || audio.readyState < 3) {
            console.warn("Connection timeout: stream might be offline");
            setIsStreamOffline(true);
            setIsBuffering(false);
            setIsPlaying(false);
            try {
              audio.pause();
              audio.removeAttribute("src");
              audio.load();
            } catch (err) {
              console.error("Error resetting audio on connection timeout:", err);
            }
          }
        }, 8000);

        await audio.play();
        setIsPlaying(true);
        logListenerSession("web");
      }
    } catch (error) {
      console.error("Global audio play error:", error);
      setIsPlaying(false);
      setIsBuffering(false);
      setIsStreamOffline(true);
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, isBuffering, togglePlay, currentProgram, isStreamOffline, isLiveBroadcast }}>
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
