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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import TrackPlayer, { Capability } from 'react-native-track-player';
import { supabase } from './lib/supabase';

const { width, height } = Dimensions.get('window');

// ─────────────────────────────────────────────────────
//  Components
// ─────────────────────────────────────────────────────

function FloatingBlob({ size, color, initialX, initialY, driftX, driftY, duration, delay = 0, opacity = 0.3 }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(translateX, { toValue: driftX, duration, delay, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(translateX, { toValue: -driftX, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(translateY, { toValue: driftY, duration: duration * 1.2, delay: delay + 500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -driftY, duration: duration * 1.2, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: duration * 1.2, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(scale, { toValue: 1.15, duration: duration * 0.8, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.85, duration: duration * 0.8, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ])).start();
  }, []);

  return (
    <Animated.View style={{
      position: 'absolute', top: initialY, left: initialX, width: size, height: size,
      borderWidth: 1, borderColor: color, opacity, transform: [{ translateX }, { translateY }, { scale }]
    }} />
  );
}

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

function Accueil({ isPlaying, isBuffering, togglePlayback, pulseAnim, spin, glowOpacity, currentTitle, currentArtist }) {
  return (
    <View style={styles.tabContent}>
      {/* Central Glass Neon Card */}
      <View style={styles.neonCard}>
        {/* Logo inside */}
        <View style={styles.cardLogoContainer}>
          <Image
            source={require('./assets/Logo-Saphir_officiel.png')}
            style={styles.cardLogoImage}
            resizeMode="contain"
          />
        </View>

        {/* Visualizer Pink Fuchsia */}
        <View style={styles.vizContainer}>
          {[0, 100, 200, 50, 150, 250, 80, 180, 120, 220, 90, 190, 60, 160, 240].map((delay, i) => (
            <VisualizerBar key={i} delay={delay} isPlaying={isPlaying} />
          ))}
        </View>

        {/* EN DIRECT text */}
        <Text style={styles.onAirText}>— EN DIRECT —</Text>
      </View>

      {/* Mic play button in center */}
      <View style={styles.playControlContainer}>
        <Animated.View style={[styles.playBtnWrap, { transform: [{ scale: pulseAnim }] }]}>
          {/* Ambient Glows */}
          <Animated.View style={[styles.playGlow2, { opacity: glowOpacity }]} />
          <Animated.View style={[styles.playGlow, { opacity: glowOpacity }]} />
          
          <TouchableOpacity onPress={togglePlayback} activeOpacity={0.85} style={styles.playBtnTouchable}>
            <LinearGradient
              colors={['#8A2BE2', '#4F46E5']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.playBtn}
            >
              {isBuffering ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : (
                <Ionicons name={isPlaying ? "mic" : "mic-outline"} size={44} color="#fff" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
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
  const [aboutText, setAboutText] = useState("Saphir FM 106.8 est votre station de radio de référence basée au cœur de Bouaké, en Côte d'Ivoire. Moderne, dynamique et proche de son audience, Saphir FM vous accompagne au quotidien avec une programmation riche et variée.");
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
        setStreamUrl(data.value);
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
        const title = station.now_playing.song.title || 'Saphir FM';
        const artist = station.now_playing.song.artist || 'La Radio Qui Vous Ressemble';
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
            Capability.Stop,
          ],
          compactCapabilities: [
            Capability.Play,
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
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#1A1528' }]} />
      <FloatingBlob size={400} color="#7C3AED" initialX={-150} initialY={-100} driftX={60} driftY={60} duration={8000} opacity={0.15} />
      <FloatingBlob size={300} color="#EC4899" initialX={width - 200} initialY={height * 0.4} driftX={-40} driftY={-80} duration={9000} opacity={0.1} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <View style={styles.headerLogoWhiteBg}>
            <Image source={require('./assets/Logo-Saphir_officiel.png')} style={styles.headerLogo} resizeMode="contain" />
          </View>
        </View>

        <Animated.View style={[styles.main, { opacity: mountAnim }]}>
          {activeTab === 'accueil' && <Accueil {...{ isPlaying, isBuffering, togglePlayback, pulseAnim, spin, glowOpacity, currentTitle, currentArtist }} />}
          {activeTab === 'histoire' && (
            <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 100 }}>
              <Text style={styles.title}>Notre Histoire</Text>
              <View style={styles.card}><Text style={styles.text}>{aboutText}</Text></View>
              {articles.map(a => <View key={a.id} style={styles.article}><Text style={styles.atitle}>{a.title}</Text></View>)}
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
        </View>
      </SafeAreaView>
    </View>
  );
}

function NavBtn({ icon, label, active, onPress }) {
  return (
    <TouchableOpacity style={styles.navbtn} onPress={onPress}>
      <Ionicons name={active ? icon : `${icon}-outline`} size={24} color={active ? '#A855F7' : '#555'} />
      <Text style={[styles.navlabel, { color: active ? '#A855F7' : '#555' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 55, paddingHorizontal: 24 },
  headerLogoWhiteBg: { backgroundColor: '#fff', padding: 8, borderRadius: 12 },
  headerLogo: { width: 100, height: 35 },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#555' },
  liveLabel: { color: '#fff', fontSize: 10, fontWeight: '800' },

  main: { flex: 1 },
  tabContent: { flex: 1, justifyContent: 'space-around', alignItems: 'center', padding: 24 },
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

  playControlContainer: { width: 140, height: 140, justifyContent: 'center', alignItems: 'center', zIndex: 10, marginTop: 15 },
  playBtnWrap: { width: 90, height: 90, borderRadius: 45, overflow: 'visible', justifyContent: 'center', alignItems: 'center' },
  playGlow: { position: 'absolute', width: 130, height: 130, borderRadius: 65, backgroundColor: '#A855F7', opacity: 0.25 },
  playGlow2: { position: 'absolute', width: 110, height: 110, borderRadius: 55, backgroundColor: '#D946EF', opacity: 0.35 },
  playBtnTouchable: { width: 90, height: 90, borderRadius: 45 },
  playBtn: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', shadowColor: '#8A2BE2', shadowOpacity: 0.8, shadowRadius: 15, elevation: 10 },

  trackInfo: { alignItems: 'center', marginTop: 25 },
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
  customBadge: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', alignItems: 'center', marginTop: 20, width: 150 },
  badgeLarge: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  badgeSmall: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '700', marginTop: 4 },

  navbar: { flexDirection: 'row', height: 80, backgroundColor: '#0A0A15', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingBottom: 20 },
  navbtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navlabel: { fontSize: 10, fontWeight: '700', marginTop: 4 },

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
