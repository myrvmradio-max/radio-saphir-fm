import React, { useState, useEffect, useRef } from 'react';
import SplashScreen from './SplashScreen';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  ScrollView,
  TextInput,
  Share,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from './lib/supabase';

import TrackPlayer, { Capability } from 'react-native-track-player';

const { width, height } = Dimensions.get('window');

// ─────────────────────────────────────────────────────
//  Components
// ─────────────────────────────────────────────────────

// Silk Aurora & Twinkling Stardust elegant background components
function SilkAuroraBlob({ size, color, initialX, initialY, driftX, driftY, duration, opacity = 0.08 }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, { toValue: driftX, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(translateX, { toValue: -driftX, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: driftY, duration: duration * 1.35, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -driftY, duration: duration * 1.35, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.15, duration: duration * 0.85, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.9, duration: duration * 0.85, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: initialX - size / 2,
        top: initialY - size / 2,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        transform: [{ translateX }, { translateY }, { scale }],
        opacity,
      }}
    />
  );
}

function TwinklingStar({ size, top, left, duration, maxOpacity }) {
  const opacityAnim = useRef(new Animated.Value(0.1 + Math.random() * 0.2)).current;

  useEffect(() => {
    const twinkle = () => {
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: maxOpacity * (0.3 + Math.random() * 0.7),
          duration: duration * (0.8 + Math.random() * 0.4),
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.05 + Math.random() * 0.15,
          duration: duration * (0.8 + Math.random() * 0.4),
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ]).start(() => twinkle());
    };
    
    const timer = setTimeout(twinkle, Math.random() * 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#FFFFFF',
        opacity: opacityAnim,
      }}
    />
  );
}

const STARS_COUNT = 45;
const STARS_DATA = Array.from({ length: STARS_COUNT }).map((_, index) => {
  return {
    id: index,
    size: Math.random() < 0.8 ? 1.5 : 2.5,
    left: Math.random() * width,
    top: Math.random() * height * 0.95,
    duration: 2000 + Math.random() * 3000,
    maxOpacity: 0.4 + Math.random() * 0.4,
  };
});

// RippleHalo supprimé

function VisualizerBar({ delay, isPlaying }) {
  const anim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    if (isPlaying) {
      const loop = Animated.loop(Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 300 + Math.random() * 400, easing: Easing.inOut(Easing.ease), useNativeDriver: true, delay }),
        Animated.timing(anim, { toValue: 0.2, duration: 300 + Math.random() * 400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]));
      loop.start();
      return () => loop.stop();
    } else { Animated.timing(anim, { toValue: 0.3, duration: 400, useNativeDriver: true }).start(); }
  }, [isPlaying]);
  return <Animated.View style={[styles.vizBar, { transform: [{ scaleY: anim }] }]} />;
}

// ─────────────────────────────────────────────────────
//  Screens
// ─────────────────────────────────────────────────────

// MarqueeText supprimé

function Accueil({ isPlaying, isBuffering, togglePlayback, pulseAnim, spin, glowOpacity, currentTitle, currentArtist, isLiveBroadcast }) {
  return (
    <View style={styles.tabContent}>
      {/* Live / Station status badge */}
      <View style={styles.liveIndicatorContainer}>
        {isLiveBroadcast ? (
          <View style={styles.onAirBadge}>
            <View style={styles.onAirDot} />
            <Text style={styles.onAirText}>EN DIRECT</Text>
          </View>
        ) : (isPlaying || isBuffering) ? (
          <View style={[styles.onAirBadge, { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgba(59, 130, 246, 0.4)' }]}>
            <View style={[styles.onAirDot, { backgroundColor: '#3B82F6' }]} />
            <Text style={[styles.onAirText, { color: '#60A5FA' }]}>SAPHIR FM 106.8</Text>
          </View>
        ) : null}
      </View>

      {/* Mic play button in center */}
      <View style={styles.playControlContainer}>
        {/* Deuxième contour (animé sur play) */}
        <Animated.View style={[
          styles.outerCircle, 
          { transform: [{ scale: isPlaying ? pulseAnim : 1 }] }
        ]} />

        {/* Premier cercle */}
        <View style={styles.innerCircle}>
          <TouchableOpacity onPress={togglePlayback} activeOpacity={0.85} style={styles.playBtnCenter}>
            {isBuffering ? (
              <ActivityIndicator color="#fff" size="large" />
            ) : (
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={46} 
                color="#fff" 
                style={!isPlaying ? { marginLeft: 6 } : null} 
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Track info perfectly centered */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{currentTitle}</Text>
        <Text style={styles.trackArtist}>{currentArtist}</Text>
      </View>

      {/* Bottom badge */}
      <View style={styles.customBadge}>
        <Text style={styles.badgeLarge}>106.8 FM</Text>
        <Text style={styles.badgeSmall}>BOUAKE</Text>
      </View>
    </View>
  );
}

function translateCountryToFrench(country: string): string {
  const translations: { [key: string]: string } = {
    "United States": "États-Unis",
    "United States of America": "États-Unis",
    "US": "États-Unis",
    "USA": "États-Unis",
    "Canada": "Canada",
    "United Kingdom": "Royaume-Uni",
    "UK": "Royaume-Uni",
    "Ivory Coast": "Côte d'Ivoire",
    "Cote d'Ivoire": "Côte d'Ivoire",
    "CI": "Côte d'Ivoire",
    "Benin": "Bénin",
    "Senegal": "Sénégal",
    "Cameroon": "Cameroun",
    "Guinea": "Guinée",
    "Morocco": "Maroc",
    "Algeria": "Algérie",
    "Tunisia": "Tunisie",
    "Belgium": "Belgique",
    "Switzerland": "Suisse",
    "Germany": "Allemagne",
    "Spain": "Espagne",
    "Italy": "Italie",
    "Netherlands": "Pays-Bas",
    "Brazil": "Brésil",
    "Burkina Faso": "Burkina Faso",
    "Togo": "Togo",
    "Mali": "Mali",
    "Niger": "Niger",
    "Gabon": "Gabon",
    "Congo": "Congo",
    "Democratic Republic of the Congo": "RDC (Congo)",
    "Madagascar": "Madagascar"
  };
  return translations[country] || country;
}

async function logListenerSessionMobile() {
  let country = 'International';
  let city = 'Inconnu';

  // 1. Essai avec freeipapi.com (stable, HTTPS, 60 req/min)
  try {
    const response = await fetch('https://freeipapi.com/api/json');
    if (response.ok) {
      const data = await response.json();
      if (data.countryName) {
        country = translateCountryToFrench(data.countryName);
        city = data.cityName || 'Inconnu';
      }
    }
  } catch (err) {
    console.warn("Échec de géolocalisation mobile avec freeipapi.com:", err);
  }

  // 2. Fallback avec ipwho.is (10 000 req/jour)
  if (country === 'International') {
    try {
      const response = await fetch('https://ipwho.is/?lang=fr');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.country) {
          country = data.country; // Traduit par l'API
          city = data.city || 'Inconnu';
        }
      }
    } catch (err) {
      console.warn("Échec de géolocalisation mobile avec ipwho.is:", err);
    }
  }

  // 3. Dernier recours avec ipapi.co
  if (country === 'International') {
    try {
      const response = await fetch('https://ipapi.co/json/', { headers: { 'Accept': 'application/json' } });
      if (response.ok) {
        const data = await response.json();
        if (data.country_name) {
          country = translateCountryToFrench(data.country_name);
          city = data.city || 'Inconnu';
        }
      }
    } catch (err) {
      console.warn("Échec de géolocalisation mobile avec ipapi.co:", err);
    }
  }

  try {
    await supabase.from('listener_logs').insert([
      { country, city, platform: 'mobile' }
    ]);
  } catch (e) {
    console.log("Telemetry error on saving mobile session:", e);
  }
}

// ─────────────────────────────────────────────────────
//  Main App
// ─────────────────────────────────────────────────────

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [activeTab, setActiveTab] = useState('accueil');
  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [streamUrl, setStreamUrl] = useState('https://stream.radiosaphir.com/listen/radiosaphir-106.8-fm/radio.mp3');
  const [currentTitle, setCurrentTitle] = useState('Saphir FM');
  const [currentArtist, setCurrentArtist] = useState('La Radio Qui Vous Ressemble');
  const [isLiveBroadcast, setIsLiveBroadcast] = useState(false);
  const [aboutText, setAboutText] = useState(`Saphir FM
106.8 FM
Votre fréquence de référence à Bouaké. Découvrez notre histoire et comment nous contacter.

Saphir FM 106.8 est votre station de radio de référence basée au cœur de Bouaké, en Côte d'Ivoire. Moderne, dynamique et proche de son audience, Saphir FM vous accompagne au quotidien avec une programmation riche et variée.

Retrouvez le meilleur de la musique ivoirienne et africaine (Zouglou, Coupé Décalé, Afrobeat), des flashs d'information en direct pour rester connecté à l'actualité de Bouaké et de la Côte d'Ivoire, ainsi que des émissions culturelles et des talk-shows passionnants.

Saphir FM, c'est l'image du son ! Nous nous engageons à vous offrir le meilleur du divertissement et de l'information.`);
  const [contactAddress, setContactAddress] = useState("Air France 2 rue wattao, Bouaké, Côte d'Ivoire");
  const [contactPhone, setContactPhone] = useState("(+225) 07 07 93 19 06\n(+225) 01 01 72 73 75\n(+225) 27 31 60 08 62");
  const [contactEmail, setContactEmail] = useState("radiosaphirfm@gmail.com");
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;
  const mountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(mountAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
    fetchData();
    fetchStreamUrl();
    fetchAboutText();
    fetchContactInfo();
    
    // Audio mode configuration removed (handled by TrackPlayer)
    return () => {};
  }, []);

  async function fetchStreamUrl() {
    try {
      const { data } = await supabase.from('settings').select('*').eq('key', 'stream_url').single();
      if (data && data.value && data.value.includes('http')) {
        let url = data.value;
        if (url.includes('/public/')) {
          url = 'https://stream.radiosaphir.com/listen/radiosaphir-106.8-fm/radio.mp3';
        }
        setStreamUrl(url);
      }
    } catch (e) {
      console.log("Using default stream URL");
    }
  }

  async function fetchData() {
    try {
      const { data: p } = await supabase.from('products').select('*').limit(10);
      const { data: a } = await supabase.from('articles').select('*').limit(5);
      setProducts(p || []);
      setArticles(a || []);
    } catch (e) {
      console.log("Error in fetchData:", e);
    }
  }

  async function fetchNowPlaying() {
    try {
      const response = await fetch('https://stream.radiosaphir.com/api/nowplaying');
      const data = await response.json();
      
      const station = Array.isArray(data) ? data[0] : data;
      
      if (station && station.now_playing && station.now_playing.song) {
        let title = station.now_playing.song.title || 'Saphir FM';
        let artist = station.now_playing.song.artist || '';

        // If artist is empty, try to parse it from the title using common separators
        if (!artist && title.includes(' - ')) {
          const parts = title.split(' - ');
          artist = parts[0].trim();
          title = parts.slice(1).join(' - ').trim();
        } else if (!artist && title.includes('  ')) {
          const parts = title.split('  ');
          artist = parts[0].trim();
          title = parts.slice(1).join('  ').trim();
        } else if (!artist && title.includes(' -')) {
          const parts = title.split(' -');
          artist = parts[0].trim();
          title = parts.slice(1).join(' -').trim();
        } else if (!artist && title.includes('- ')) {
          const parts = title.split('- ');
          artist = parts[0].trim();
          title = parts.slice(1).join('- ').trim();
        } else if (!artist && title.includes('-')) {
          const parts = title.split('-');
          artist = parts[0].trim();
          title = parts.slice(1).join('-').trim();
        }

        // Clean up whitespace
        title = title.trim();
        artist = artist.trim();

        // Fallbacks
        if (!artist) {
          artist = 'Saphir FM';
        }
        if (!title || title.toLowerCase() === 'saphir fm') {
          title = 'Saphir FM';
          artist = 'La Radio Qui Vous Ressemble';
        }

        setCurrentTitle(title);
        setCurrentArtist(artist);
        
        try {
          TrackPlayer.updateNowPlayingMetadata({
            title: title,
            artist: artist,
          });
        } catch (err) {
          // Player might not be setup yet
        }
      }

      // Always update live broadcast status even if song object is minimal
      if (station) {
        const isLive = station?.live?.is_live === true || Boolean(station?.live?.streamer_name);
        setIsLiveBroadcast(isLive);
      }
    } catch (error) {
      console.log("Erreur NowPlaying:", error);
    }
  }

  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 20000);
    return () => clearInterval(interval);
  }, []);

  const isPlayerSetup = useRef(false);
  useEffect(() => {
    if (showSplash) return;
    if (!streamUrl) return;

    async function setup() {
      if (isPlayerSetup.current) return;
      try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
          ],
          notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
          ],
        });
        isPlayerSetup.current = true;
      } catch (e) {
        console.log(e);
      }
    }
    setup();
  }, [showSplash, streamUrl]);



  async function fetchAboutText() {
    try {
      const { data, error } = await supabase.from('settings').select('*').eq('key', 'about');
      console.log("About fetch result:", data, error);
      if (data && data.length > 0) {
        setAboutText(data[0].value);
      }
    } catch (e) {
      console.log("Error in fetchAboutText:", e);
    }
  }

  async function fetchContactInfo() {
    try {
      const { data: address } = await supabase.from('settings').select('*').eq('key', 'address');
      const { data: phone } = await supabase.from('settings').select('*').eq('key', 'phone');
      const { data: email } = await supabase.from('settings').select('*').eq('key', 'email');

      console.log("Contact fetch result:", { address, phone, email });

      if (address && address.length > 0) setContactAddress(address[0].value);
      if (phone && phone.length > 0) setContactPhone(phone[0].value);
      if (email && email.length > 0) setContactEmail(email[0].value);
    } catch (e) {
      console.log("Error in fetchContactInfo:", e);
    }
  }

  async function sendMessage() {
    if (!formName || !formEmail || !formMessage) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setIsSending(true);
    try {
      const { error } = await supabase
        .from("messages")
        .insert([
          {
            sender_name: formName,
            sender_email: formEmail,
            subject: formSubject,
            content: formMessage,
            is_read: false,
            is_important: false
          }
        ]);

      if (error) throw error;

      alert("Message envoyé avec succès !");
      setFormName('');
      setFormEmail('');
      setFormSubject('');
      setFormMessage('');
    } catch (e) {
      console.error("Error sending message:", e);
      alert("Erreur lors de l'envoi du message.");
    } finally {
      setIsSending(false);
    }
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Écoutez Saphir FM 106.8 - La Radio Qui Vous Ressemble ! Retrouvez-nous sur : https://www.radiosaphir.com/",
        url: "https://www.radiosaphir.com/",
      });
    } catch (error: any) {
      console.log("Erreur de partage:", error.message);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])).start();
      Animated.loop(Animated.timing(rotateAnim, { toValue: 1, duration: 10000, easing: Easing.linear, useNativeDriver: true })).start();
      Animated.loop(Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 1500, useNativeDriver: true }),
      ])).start();
    } else { pulseAnim.stopAnimation(); rotateAnim.stopAnimation(); glowAnim.stopAnimation(); }
  }, [isPlaying]);

  const togglePlayback = async () => {
    try {
      if (isPlaying) {
        // STOP COMPLET
        await TrackPlayer.stop();
        // Vide totalement la queue
        await TrackPlayer.reset();
        setIsPlaying(false);
      } else {
        setIsBuffering(true);
        // Reset propre avant reload
        await TrackPlayer.reset();
        // Ajoute le stream frais
        await TrackPlayer.add({
          id: 'radiosaphir',
          url: streamUrl + '?t=' + Date.now(),
          title: currentTitle,
          artist: currentArtist,
        });
        // Lance lecture
        await TrackPlayer.play();
        setIsPlaying(true);
        setIsBuffering(false);
        logListenerSessionMobile();
      }
    } catch (e) {
      console.error("Playback error:", e);
      setIsBuffering(false);
      setIsPlaying(false);
      
      // Test stream fallback
      const TEST_STREAM = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      if (streamUrl !== TEST_STREAM) {
        alert("Erreur de lecture. Tentative avec le flux de test.");
        setStreamUrl(TEST_STREAM);
        try {
          await TrackPlayer.reset();
          await TrackPlayer.add({
            id: 'test',
            url: TEST_STREAM + '?t=' + Date.now(),
            title: 'Flux de Test',
            artist: 'Saphir FM',
          });
          await TrackPlayer.play();
          setIsPlaying(true);
        } catch(err) { console.error(err); }
      }
    }
  };

  if (showSplash) return <SplashScreen onDone={() => setShowSplash(false)} />;

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const glowOpacity = glowAnim;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {/* Elegant Celestial Velvet Background */}
      <LinearGradient
        colors={['#080415', '#0E0728', '#160B3E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Silk Aurora Blobs (Slowly drifting & breathing glowing halos) */}
      <SilkAuroraBlob size={width * 1.3} color="#8A2BE2" initialX={width * 0.2} initialY={height * 0.25} driftX={40} driftY={35} duration={25000} opacity={0.09} />
      <SilkAuroraBlob size={width * 1.5} color="#3B82F6" initialX={width * 0.8} initialY={height * 0.75} driftX={-50} driftY={-40} duration={30000} opacity={0.08} />
      <SilkAuroraBlob size={width * 1.2} color="#EC4899" initialX={width * 0.5} initialY={height * 0.5} driftX={35} driftY={-35} duration={28000} opacity={0.07} />
      <SilkAuroraBlob size={width * 1.0} color="#F59E0B" initialX={width * 0.85} initialY={height * 0.15} driftX={-30} driftY={30} duration={22000} opacity={0.05} />

      {/* Twinkling Stardust (Micro-particles floating in deep space) */}
      {STARS_DATA.map(star => (
        <TwinklingStar
          key={star.id}
          size={star.size}
          top={star.top}
          left={star.left}
          duration={star.duration}
          maxOpacity={star.maxOpacity}
        />
      ))}

      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <View style={styles.headerLogoWhiteBg}>
            <Image source={require('./assets/Logo-Saphir_officiel.png')} style={styles.headerLogo} resizeMode="contain" />
          </View>
        </View>

        <Animated.View style={[styles.main, { opacity: mountAnim }]}>
          {activeTab === 'accueil' && <Accueil {...{ isPlaying, isBuffering, togglePlayback, pulseAnim, spin, glowOpacity, currentTitle, currentArtist, isLiveBroadcast }} />}
          {activeTab === 'histoire' && (
            <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 100 }}>
              <Text style={styles.title}>Notre Histoire</Text>
              <View style={styles.card}><Text style={styles.text}>{aboutText}</Text></View>
            </ScrollView>
          )}
          {activeTab === 'produit' && (
            <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 100 }}>
              <Text style={styles.title}>Boutique</Text>
              <View style={styles.grid}>
                {products.map(p => (
                  <View key={p.id} style={styles.pcard}>
                    <Ionicons name="gift-outline" size={32} color="#A855F7" />
                    <Text style={styles.pname}>{p.name}</Text>
                    <Text style={styles.pprice}>{p.price} €</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
          {activeTab === 'contact' && (
            <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 100 }}>
              <Text style={styles.title}>Contact</Text>
                {/* Card Adresse */}
                <View style={[styles.card, { marginBottom: 15, flexDirection: 'row', alignItems: 'center', gap: 15 }]}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(168,85,247,0.1)', justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="location-outline" size={20} color="#A855F7" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 2 }}>Adresse</Text>
                    <Text style={styles.text}>{contactAddress}</Text>
                  </View>
                </View>

                {/* Card Téléphones */}
                <View style={[styles.card, { marginBottom: 15, flexDirection: 'row', alignItems: 'center', gap: 15 }]}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(168,85,247,0.1)', justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="call-outline" size={20} color="#A855F7" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 2 }}>Téléphones</Text>
                    {contactPhone.split(/\\n|\n/).map((p, i) => (
                      <Text key={i} style={styles.text}>{p}</Text>
                    ))}
                  </View>
                </View>

                {/* Card Email */}
                <View style={[styles.card, { flexDirection: 'row', alignItems: 'center', gap: 15 }]}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(168,85,247,0.1)', justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="mail-outline" size={20} color="#A855F7" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 2 }}>Email</Text>
                    <Text style={styles.text}>{contactEmail}</Text>
                  </View>
                </View>

                {/* Formulaire de Contact */}
                <View style={[styles.card, { marginTop: 20, marginBottom: 20 }]}>
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Envoyez-nous un message</Text>
                  
                  <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 5 }}>Nom *</Text>
                  <TextInput 
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }} 
                    placeholder="Votre nom" 
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={formName}
                    onChangeText={setFormName}
                  />
                  
                  <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 5 }}>Email *</Text>
                  <TextInput 
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }} 
                    placeholder="Votre email" 
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={formEmail}
                    onChangeText={setFormEmail}
                    keyboardType="email-address"
                  />
                  
                  <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 5 }}>Sujet</Text>
                  <TextInput 
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }} 
                    placeholder="Sujet du message" 
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={formSubject}
                    onChangeText={setFormSubject}
                  />
                  
                  <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 5 }}>Message *</Text>
                  <TextInput 
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', height: 100, textAlignVertical: 'top' }} 
                    multiline 
                    placeholder="Votre message..." 
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={formMessage}
                    onChangeText={setFormMessage}
                  />
                  
                  <TouchableOpacity 
                    style={{ backgroundColor: '#A855F7', padding: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', opacity: isSending ? 0.7 : 1 }} 
                    onPress={sendMessage}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Envoyer</Text>
                        <Ionicons name="send" size={16} color="#fff" style={{ marginLeft: 5 }} />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
            </ScrollView>
          )}
        </Animated.View>

        <View style={styles.navbar}>
          <NavBtn icon="radio" label="Radio" active={activeTab === 'accueil'} onPress={() => setActiveTab('accueil')} />
          <NavBtn icon="book" label="Histoire" active={activeTab === 'histoire'} onPress={() => setActiveTab('histoire')} />
          <NavBtn icon="cart" label="Produit" active={activeTab === 'produit'} onPress={() => setActiveTab('produit')} />
          <NavBtn icon="call" label="Contact" active={activeTab === 'contact'} onPress={() => setActiveTab('contact')} />
          <NavBtn icon="share-social" label="Partager" active={false} onPress={handleShare} />
        </View>
      </SafeAreaView>
    </View>
  );
}

function NavBtn({ icon, label, active, onPress }) {
  const tintColor = active ? '#000000' : 'rgba(0, 0, 0, 0.45)';
  const fontWeight = active ? '900' : '600';
  return (
    <TouchableOpacity style={styles.navbtn} onPress={onPress}>
      <Ionicons name={active ? icon : `${icon}-outline`} size={24} color={tintColor} />
      <Text style={[styles.navlabel, { color: tintColor, fontWeight }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 55, paddingHorizontal: 24 },
  headerLogoWhiteBg: { backgroundColor: '#fff', padding: 8, borderRadius: 12 },
  headerLogo: { width: 100, height: 35 },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#555' },
  liveLabel: { color: '#fff', fontSize: 10, fontWeight: '800' },

  main: { flex: 1 },
  tabContent: { flex: 1, justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 24, paddingTop: 24, paddingBottom: Platform.OS === 'android' ? 135 : 110 },
  playerCenter: { justifyContent: 'center', alignItems: 'center' },
  
  neonCard: {
    width: width * 0.84,
    height: 230,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
    marginTop: 20,
  },
  cardLogoContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardLogoImage: {
    width: width * 0.52,
    height: 60,
  },
  onAirText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 4,
    marginTop: 10,
  },

  playControlContainer: { width: 150, height: 150, justifyContent: 'center', alignItems: 'center', zIndex: 10, marginTop: 15 },
  outerCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: '#A855F7',
    opacity: 0.6,
  },
  innerCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: 'rgba(168, 85, 247, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  playBtnCenter: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  liveIndicatorContainer: { alignItems: 'center', marginVertical: 10 },
  onAirBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EF4444', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 6 },
  onAirDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF', marginRight: 8 },
  onAirText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
  radioSaphirBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.12)', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.25)' },
  radioSaphirText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800', letterSpacing: 1 },

  trackInfo: { alignItems: 'center', marginTop: 15 },
  trackTitle: { color: '#fff', fontSize: 18, fontWeight: '900', textAlign: 'center', paddingHorizontal: 20 },
  trackArtist: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 6, textAlign: 'center', paddingHorizontal: 20 },

  vizContainer: { flexDirection: 'row', height: 40, gap: 4, marginBottom: 15, alignItems: 'flex-end', justifyContent: 'center' },
  vizBar: { width: 4, height: 35, backgroundColor: '#D946EF', borderRadius: 2 },

  glassCard: { marginHorizontal: 24, padding: 20, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 20 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-around' },
  cardItem: { alignItems: 'center' },
  cardValue: { color: '#fff', fontSize: 20, fontWeight: '800' },
  cardLabel: { color: '#555', fontSize: 10, fontWeight: '700', marginTop: 4 },
  cardDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.05)' },
  customBadge: { backgroundColor: 'rgba(255,255,255,0.03)', paddingVertical: 10, paddingHorizontal: 22, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', alignItems: 'center', marginTop: 20 },
  badgeLarge: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
  badgeSmall: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '700', marginTop: 4 },

  navbar: { 
    flexDirection: 'row', 
    height: 68, 
    backgroundColor: '#8A2BE2', // Violet pur
    borderRadius: 34,           // Forme de capsule/pilule parfaite
    position: 'absolute',       // Flotte par-dessus l'écran
    bottom: Platform.OS === 'android' ? 48 : 26, // Rehaussé sur Android pour dépasser la barre des boutons système (Retour, Accueil, Multitâche)
    left: 20,                   // Marge gauche
    right: 20,                  // Marge droite
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    paddingBottom: 0,
  },
  navbtn: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100%' 
  },
  navlabel: { 
    fontSize: 9, 
    marginTop: 3, 
    letterSpacing: 0.5 
  },

  scroll: { flex: 1, padding: 24 },
  title: { color: '#fff', fontSize: 28, fontWeight: '900', marginBottom: 20 },
  card: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 20 },
  text: { color: '#ccc', fontSize: 16, lineHeight: 24 },
  article: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 15, borderRadius: 15, marginTop: 10 },
  atitle: { color: '#fff', fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  pcard: { width: '47%', backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 20, alignItems: 'center' },
  pname: { color: '#fff', fontSize: 12, fontWeight: '700', marginTop: 10, textAlign: 'center' },
  pprice: { color: '#A855F7', fontWeight: '900', marginTop: 5 },
});
