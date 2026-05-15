import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Easing, Dimensions, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// ─────────────────────────────────────────────────────
//  Animated floating blob (Synced with App.tsx)
// ─────────────────────────────────────────────────────
function FloatingBlob({
  size,
  color,
  initialX,
  initialY,
  driftX,
  driftY,
  duration,
  delay = 0,
  opacity = 0.45,
}: {
  size: number;
  color: string;
  initialX: number;
  initialY: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay?: number;
  opacity?: number;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(opacity)).current;

  useEffect(() => {
    // Float X
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: driftX,
          duration: duration,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -driftX * 0.6,
          duration: duration * 0.9,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: duration * 0.8,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Float Y
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: driftY,
          duration: duration * 1.2,
          delay: delay + 300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -driftY * 0.7,
          duration: duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: duration * 0.9,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Breathe scale
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.25,
          duration: duration * 0.8,
          delay: delay + 100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.82,
          duration: duration * 0.7,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: duration * 0.6,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Breathe opacity
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: opacity * 1.6,
          duration: duration * 0.75,
          delay: delay + 200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: opacity * 0.4,
          duration: duration * 0.65,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: opacity,
          duration: duration * 0.5,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: initialY,
        left: initialX,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: opacityAnim,
        transform: [{ translateX }, { translateY }, { scale }],
      }}
    />
  );
}

function EqBar({ index }: { index: number }) {
  const anim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const dur = 280 + (index * 37) % 320;
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: dur, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.15, duration: dur + 80, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const barHeights = [16, 26, 36, 22, 40, 30, 44, 24, 38, 20, 34, 28, 42, 18, 32];
  const h = barHeights[index % barHeights.length];
  return <Animated.View style={{ width: 5, height: h, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.75)', marginHorizontal: 2, transform: [{ scaleY: anim }] }} />;
}

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const eqOpacity = useRef(new Animated.Value(0)).current;
  const sloganOpacity = useRef(new Animated.Value(0)).current;
  const infoOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }),
      ]),
      Animated.timing(eqOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(sloganOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(infoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.delay(3000),
      Animated.timing(screenOpacity, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start(() => onDone());
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: screenOpacity, zIndex: 999 }]}>
      {/* ══════════ ANIMATED BACKGROUND (ORIGINAL) ══════════ */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#06040F' }]} />
      
      <FloatingBlob size={340} color="#7C3AED" initialX={-80}  initialY={-60}       driftX={50}  driftY={60}  duration={5800} delay={0}    opacity={0.30} />
      <FloatingBlob size={280} color="#EC4899" initialX={width - 160} initialY={height * 0.55} driftX={-40} driftY={-70} duration={6200} delay={400}  opacity={0.22} />
      <FloatingBlob size={200} color="#6366F1" initialX={width * 0.3} initialY={height * 0.4} driftX={35}  driftY={-45} duration={4900} delay={800}  opacity={0.20} />
      <FloatingBlob size={160} color="#A855F7" initialX={width * 0.6} initialY={height * 0.15} driftX={-55} driftY={50}  duration={7000} delay={200}  opacity={0.18} />

      {/* ══════════ CONTENT ══════════ */}
      <View style={styles.center}>
        {/* Logo Officiel - No filters, no glow, pure white S visible */}
        <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }], alignItems: 'center', width: '100%', justifyContent: 'center' }}>
          <View style={styles.logoWhiteBg}>
            <Image
              source={require('./assets/Logo-Saphir_officiel.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* EQ Bars */}
        <Animated.View style={[styles.eqRow, { opacity: eqOpacity }]}>
          {Array.from({ length: 15 }).map((_, i) => (
            <EqBar key={i} index={i} />
          ))}
        </Animated.View>

        {/* Slogan */}
        <Animated.Text style={[styles.slogan, { opacity: sloganOpacity }]}>
          Radio Saphir, encore plus proche de vous.
        </Animated.Text>

        {/* Info divider */}
        <Animated.View style={[styles.line, { opacity: infoOpacity }]} />

        {/* Contact info */}
        <Animated.View style={{ opacity: infoOpacity, alignItems: 'center' }}>
          <Text style={styles.phone}>☎  27 31 60 08 62 · 07 07 93 19 06</Text>
          <Text style={styles.website}>www.radiosaphir.com</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  logoWhiteBg: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoImage: { width: width - 80, height: 120 },
  eqRow: { flexDirection: 'row', alignItems: 'flex-end', height: 50, marginTop: 30, marginBottom: 10 },
  slogan: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center', marginTop: 15, letterSpacing: 0.3 },
  line: { width: '60%', height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 20 },
  phone: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500', marginBottom: 6 },
  website: { color: '#5B8EF5', fontSize: 14, fontWeight: '700' },
});
