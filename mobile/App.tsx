import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Play, Pause, Radio, Mic2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackInfo, setTrackInfo] = useState({
    title: 'Saphir FM Live',
    artist: 'Écoutez. Informez-vous. Vivez.'
  });

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // Logique TrackPlayer à ajouter
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0D1B4C', '#111827']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBadge}>
               <Text style={styles.logoText}>S</Text>
            </View>
            <Text style={styles.brandName}>saphir <Text style={styles.brandAccent}>fm</Text></Text>
          </View>
          <TouchableOpacity style={styles.menuButton}>
             <Mic2 color="#6A7CFF" size={24} />
          </TouchableOpacity>
        </View>

        {/* Player Main Area */}
        <View style={styles.playerSection}>
          <View style={styles.visualizerContainer}>
             <View style={styles.outerCircle}>
                <View style={styles.innerCircle}>
                   <Radio color="#6A7CFF" size={80} strokeWidth={1} />
                </View>
                {/* Decorative dots for visualization effect */}
                {[...Array(12)].map((_, i) => (
                  <View 
                    key={i} 
                    style={[
                      styles.dot, 
                      { 
                        transform: [
                          { rotate: `${i * 30}deg` },
                          { translateY: -140 }
                        ],
                        opacity: isPlaying ? 1 : 0.3
                      }
                    ]} 
                  />
                ))}
             </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.liveBadge}>
               <View style={styles.pulseDot} />
               <Text style={styles.liveText}>EN DIRECT</Text>
            </View>
            <Text style={styles.trackTitle}>{trackInfo.title}</Text>
            <Text style={styles.trackArtist}>{trackInfo.artist}</Text>
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={togglePlayback}
            >
              <LinearGradient
                colors={['#6A7CFF', '#1E3A8A']}
                style={styles.playGradient}
              >
                {isPlaying ? (
                  <Pause color="white" size={40} fill="white" />
                ) : (
                  <Play color="white" size={40} fill="white" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
           <Text style={styles.frequency}>106.8 FM</Text>
           <Text style={styles.tagline}>LA RADIO QUI VOUS RESSEMBLE</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    backgroundColor: '#6A7CFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  brandName: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: '#6A7CFF',
  },
  menuButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualizerContainer: {
    marginBottom: 50,
  },
  outerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: 'rgba(106, 124, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(106, 124, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(106, 124, 255, 0.1)',
  },
  dot: {
    position: 'absolute',
    width: 4,
    height: 12,
    backgroundColor: '#6A7CFF',
    borderRadius: 2,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6A7CFF',
  },
  liveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  trackTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  trackArtist: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  controlsContainer: {
    marginTop: 20,
  },
  playButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    shadowColor: '#6A7CFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  playGradient: {
    flex: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  frequency: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 40,
    fontWeight: '900',
    marginBottom: 4,
  },
  tagline: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  }
});
