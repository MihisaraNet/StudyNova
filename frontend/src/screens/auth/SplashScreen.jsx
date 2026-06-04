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

      {/* Full-screen dark space gradient */}
      <LinearGradient
        colors={COLORS.gradientDark}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* Decorative blobs */}
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
          colors={COLORS.gradientPrimary}
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.appName}>Study</Text>
          <Text style={styles.appNameAccent}>Nova</Text>
        </View>
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
    backgroundColor: 'rgba(108,99,255,0.08)',
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
    backgroundColor: 'rgba(255,101,132,0.06)',
  },
  logoWrap: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 16,
  },
  glowRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 38,
    borderWidth: 1.5,
    borderColor: 'rgba(108,99,255,0.3)',
  },
  logoEmoji: { fontSize: 44 },
  appName: {
    fontSize: 34,
    fontWeight: '950',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  appNameAccent: {
    fontSize: 34,
    fontWeight: '950',
    color: COLORS.primaryLight,
    letterSpacing: -0.5,
    marginLeft: 2,
  },
  tagline: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 8,
    letterSpacing: 0.3,
    fontWeight: '600',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 48,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryLight,
  },
  versionText: {
    position: 'absolute',
    bottom: 48,
    fontSize: 11,
    color: 'rgba(255,255,255,0.18)',
    fontWeight: '700',
    letterSpacing: 1,
  },
});
