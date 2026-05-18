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
import { Audio } from 'expo-av';
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
      position: 'absolute', top: initialY, left: initialX, width: size, height: size, borderRadius: size / 2,
      backgroundColor: color, opacity, transform: [{ translateX }, { translateY }, { scale }]
    }} />
  );
}

function RippleHalo({ delay, isPlaying }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(anim, { toValue: 1, duration: 2500, delay, easing: Easing.out(Easing.quad), useNativeDriver: true })
      ).start();
    } else { anim.setValue(0); }
  }, [isPlaying]);
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] });
  const opacity = anim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0.5, 0.2, 0] });
  return <Animated.View style={[styles.halo, { transform: [{ scale }], opacity }]} />;
}

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

function MarqueeText() {
  const screenWidth = Dimensions.get('window').width;
  const textWidth = 350;
  const scrollAnim = useRef(new Animated.Value(screenWidth)).current;
  
  useEffect(() => {
    const animate = () => {
      scrollAnim.setValue(screenWidth);
      Animated.timing(scrollAnim, {
        toValue: -textWidth,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) animate();
      });
    };
    animate();
  }, []);

  return (
    <View style={{ width: screenWidth, height: 25, overflow: 'hidden', marginTop: 10 }}>
      <Animated.Text
        numberOfLines={1}
        style={{
          color: 'rgba(255,255,255,0.85)',
          fontSize: 14,
          fontWeight: '700',
          letterSpacing: 1,
          position: 'absolute',
          transform: [{ translateX: scrollAnim }],
        }}
      >
        ✦  Radio Saphir  —  Bouaké  —  106.8 Fm  ✦
      </Animated.Text>
    </View>
  );
}

function Accueil({ isPlaying, isBuffering, togglePlayback, pulseAnim, spin, glowOpacity, currentTitle, currentArtist }) {
  return (
    <View style={styles.tabContent}>
      <MarqueeText />

      <View style={styles.playerCenter}>
        {/* Background Rings */}
        <View style={styles.staticRing} />
        <Animated.View style={[styles.orbitRing, { transform: [{ rotate: spin }] }]}>
          {[...Array(8)].map((_, i) => (
            <View key={i} style={[styles.orbitDot, { transform: [{ rotate: `${i * 45}deg` }, { translateY: -110 }], opacity: isPlaying ? 1 : 0.2 }]} />
          ))}
        </Animated.View>

        {/* Play Button + Halos (ON TOP) */}
        <View style={styles.playControlContainer}>
          <RippleHalo delay={0} isPlaying={isPlaying} />
          <RippleHalo delay={800} isPlaying={isPlaying} />
          <RippleHalo delay={1600} isPlaying={isPlaying} />

          <Animated.View style={[styles.playBtnWrap, { transform: [{ scale: pulseAnim }] }]}>
            <Animated.View style={[styles.playGlow, { opacity: glowOpacity }]} />
            <TouchableOpacity onPress={togglePlayback} activeOpacity={0.85} style={styles.playBtnTouchable}>
              <LinearGradient
                colors={isPlaying ? ['#A855F7', '#6366F1', '#4F46E5'] : ['#1E1B4B', '#312E81']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.playBtn}
              >
                {isBuffering ? <ActivityIndicator color="#fff" size="large" /> : isPlaying ? (
                  <View style={styles.pauseIconWrap}><View style={styles.pauseBar} /><View style={styles.pauseBar} /></View>
                ) : <View style={styles.playTriangle} />}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{currentTitle}</Text>
          <Text style={styles.trackArtist}>{currentArtist}</Text>
        </View>
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

  const sound = useRef(null);
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
    
    // Configure background audio
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(err => console.error("Error setting audio mode:", err));

    return () => { if (sound.current) sound.current.unloadAsync(); };
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
        setCurrentTitle(station.now_playing.song.title || 'Saphir FM');
        setCurrentArtist(station.now_playing.song.artist || 'La Radio Qui Vous Ressemble');
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
        if (sound.current) {
          try {
            await sound.current.pauseAsync();
          } catch (err) {
            console.log("Ignore pause error:", err.message);
          }
        }
        setIsPlaying(false);
      } else {
        setIsBuffering(true);
        
        if (sound.current) {
          try {
            await sound.current.unloadAsync();
          } catch (err) {
            console.log("Ignore unload error:", err.message);
          }
        }
        
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: streamUrl },
          { shouldPlay: false }
        );
        sound.current = newSound;
        await sound.current.playAsync();
        
        setIsBuffering(false);
        setIsPlaying(true);
      }
    } catch (e) {
      console.error("Playback error with URL:", streamUrl, e);
      setIsBuffering(false);
      
      // If the official stream fails (likely offline), try the test stream to show the app works
      const TEST_STREAM = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      if (streamUrl !== TEST_STREAM) {
        alert("La radio est actuellement HORS LIGNE. Lancement d'un flux de test pour vérifier la connexion.");
        setStreamUrl(TEST_STREAM);
        try {
          const { sound: testSound } = await Audio.Sound.createAsync({ uri: TEST_STREAM }, { shouldPlay: true });
          sound.current = testSound;
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
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#06040F' }]} />
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
  tabContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  playerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  playControlContainer: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  halo: { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 1, borderColor: '#A855F7' },
  playBtnWrap: { width: 120, height: 120, borderRadius: 60, overflow: 'visible', justifyContent: 'center', alignItems: 'center' },
  playGlow: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: '#A855F7', opacity: 0.3 },
  playBtnTouchable: { width: 120, height: 120, borderRadius: 60 },
  playBtn: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  playTriangle: { width: 0, height: 0, borderTopWidth: 15, borderBottomWidth: 15, borderLeftWidth: 25, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: '#fff', marginLeft: 5 },
  pauseIconWrap: { flexDirection: 'row', gap: 8 },
  pauseBar: { width: 6, height: 25, backgroundColor: '#fff', borderRadius: 3 },

  orbitRing: { position: 'absolute', width: 220, height: 220, borderRadius: 110, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  orbitDot: { position: 'absolute', width: 6, height: 6, borderRadius: 3, backgroundColor: '#A855F7' },
  staticRing: { position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(168,85,247,0.1)', borderStyle: 'dashed', zIndex: 0 },

  trackInfo: { alignItems: 'center', marginTop: 40 },
  trackTitle: { color: '#fff', fontSize: 22, fontWeight: '900' },
  trackArtist: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 6 },

  vizContainer: { flexDirection: 'row', height: 40, gap: 3, marginBottom: 20, alignItems: 'flex-end', justifyContent: 'center' },
  vizBar: { width: 3, height: 30, backgroundColor: '#A855F7', borderRadius: 2 },

  glassCard: { marginHorizontal: 24, padding: 20, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 20 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-around' },
  cardItem: { alignItems: 'center' },
  cardValue: { color: '#fff', fontSize: 20, fontWeight: '800' },
  cardLabel: { color: '#555', fontSize: 10, fontWeight: '700', marginTop: 4 },
  cardDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.05)' },

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
