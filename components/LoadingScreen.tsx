import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { Zap, Cpu, Shield } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const particleAnims = useRef(
    Array.from({ length: 20 }, () => ({
      translateX: new Animated.Value((Math.random() - 0.5) * width * 0.8),
      translateY: new Animated.Value((Math.random() - 0.5) * height * 0.8),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
    }))
  ).current;

  const startAnimation = useCallback(() => {
      // Initial fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Logo scale and glow
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.timing(logoRotateAnim, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: true,
          })
        ),
      ]).start();

      // Particle animations
      particleAnims.forEach((particle, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 200),
            Animated.parallel([
              Animated.timing(particle.opacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(particle.scale, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(particle.opacity, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(particle.scale, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      });

      // Progress bar animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start(() => {
        // Fade out and complete
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            onLoadingComplete();
          });
        }, 500);
      });
  }, [fadeAnim, scaleAnim, glowAnim, logoRotateAnim, particleAnims, progressAnim, onLoadingComplete]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  const logoRotate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundSecondary, Colors.background] as const}
        style={styles.gradient}
      >
        {/* Animated Particles */}
        {particleAnims.map((particle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                opacity: particle.opacity,
                transform: [
                  { translateX: particle.translateX },
                  { translateY: particle.translateY },
                  { scale: particle.scale }
                ],
              },
            ]}
          />
        ))}

        {/* Main Content */}
        <View style={styles.content}>
          {/* Logo Section */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: scaleAnim }, { rotate: logoRotate }],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.logoGlow,
                {
                  opacity: glowOpacity,
                },
              ]}
            >
              <LinearGradient
                colors={[Colors.gradientPrimary[0], Colors.gradientPrimary[1]]}
                style={styles.logoBackground}
              >
                <Zap size={60} color={Colors.text} strokeWidth={2} />
              </LinearGradient>
            </Animated.View>
          </Animated.View>

          {/* Brand Text */}
          <View style={styles.brandContainer}>
            <Text style={styles.brandTitle}>MEMORY GLO</Text>
            <Text style={styles.brandSubtitle}>Premium Memory Optimization</Text>
          </View>

          {/* Feature Icons */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Cpu size={24} color={Colors.accent} />
              <Text style={styles.featureText}>AI Powered</Text>
            </View>
            <View style={styles.featureItem}>
              <Shield size={24} color={Colors.accent} />
              <Text style={styles.featureText}>Secure</Text>
            </View>
            <View style={styles.featureItem}>
              <Zap size={24} color={Colors.accent} />
              <Text style={styles.featureText}>Fast</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressWidth,
                  },
                ]}
              >
                <LinearGradient
                  colors={[Colors.gradientPrimary[0], Colors.gradientPrimary[1]]}
                  style={styles.progressGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
            </View>
            <Text style={styles.loadingText}>Initializing Premium Experience...</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  gradient: {
    flex: 1,
  },
  particle: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.glow,
    shadowColor: Colors.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoGlow: {
    shadowColor: Colors.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 20,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.glow,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: Colors.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  brandSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    letterSpacing: 1,
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 80,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600' as const,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
  },
  progressGradient: {
    flex: 1,
    shadowColor: Colors.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },
});