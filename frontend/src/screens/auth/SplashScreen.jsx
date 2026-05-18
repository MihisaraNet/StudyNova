import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const logoScale    = useRef(new Animated.Value(0.3)).current;
  const logoOpacity  = useRef(new Animated.Value(0)).current;
  const titleY       = useRef(new Animated.Value(30)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const dot1         = useRef(new Animated.Value(0.3)).current;
  const dot2         = useRef(new Animated.Value(0.3)).current;
  const dot3         = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Title slides up after logo
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(titleY,       { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start(() => {
        // Dot pulse loop
        const pulse = (dot, delay) =>
          Animated.loop(
            Animated.sequence([
              Animated.delay(delay),
              Animated.timing(dot, { toValue: 1,   duration: 350, useNativeDriver: true }),
              Animated.timing(dot, { toValue: 0.3, duration: 350, useNativeDriver: true }),
            ])
          );
        Animated.parallel([pulse(dot1, 0), pulse(dot2, 200), pulse(dot3, 400)]).start();
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Full-screen dark gradient */}
      <LinearGradient
        colors={['#0F0C29', '#302B63', '#24243E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* Decorative circles */}
      <View style={[styles.circle, styles.circleTop]} />
      <View style={[styles.circle, styles.circleBottom]} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoWrap,
          { transform: [{ scale: logoScale }], opacity: logoOpacity },
        ]}
      >
        <LinearGradient
          colors={['#6C63FF', '#FF6584']}
          style={styles.logoGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.logoEmoji}>📚</Text>
        </LinearGradient>
        {/* Glow ring */}
        <View style={styles.glowRing} />
      </Animated.View>

      {/* Title */}
      <Animated.View
        style={{
          opacity: titleOpacity,
          transform: [{ translateY: titleY }],
          alignItems: 'center',
        }}
      >
        <Text style={styles.appName}>Study</Text>
        <Text style={styles.appNameAccent}>Nova</Text>
        <Text style={styles.tagline}>Your academic success companion</Text>
      </Animated.View>

      {/* Loading dots */}
      <View style={styles.dotsRow}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View key={i} style={[styles.dot, { opacity: dot }]} />
        ))}
      </View>

      {/* Bottom label */}
      <Text style={styles.versionText}>v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(108,99,255,0.12)',
  },
  circleTop: {
    width: 320,
    height: 320,
    top: -80,
    right: -80,
  },
  circleBottom: {
    width: 240,
    height: 240,
    bottom: -60,
    left: -60,
    backgroundColor: 'rgba(255,101,132,0.08)',
  },
  logoWrap: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGradient: {
    width: 110,
    height: 110,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 16,
  },
  glowRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(108,99,255,0.35)',
  },
  logoEmoji: { fontSize: 52 },
  appName: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  appNameAccent: {
    fontSize: 38,
    fontWeight: '900',
    color: '#6C63FF',
    letterSpacing: -0.5,
    marginTop: -6,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 10,
    letterSpacing: 0.3,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 56,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6C63FF',
  },
  versionText: {
    position: 'absolute',
    bottom: 48,
    fontSize: 12,
    color: 'rgba(255,255,255,0.2)',
    fontWeight: '500',
  },
});
