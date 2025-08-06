import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

export default function AnimatedBackground({ children }: AnimatedBackgroundProps) {
  const floatingAnims = useRef(
    Array.from({ length: 8 }, () => ({
      translateX: new Animated.Value(Math.random() * width - width / 2),
      translateY: new Animated.Value(Math.random() * height - height / 2),
      opacity: new Animated.Value(0.1),
      scale: new Animated.Value(0.5),
    }))
  ).current;

  useEffect(() => {
    floatingAnims.forEach((anim, index) => {
      const animateFloat = () => {
        Animated.loop(
          Animated.sequence([
            Animated.parallel([
              Animated.timing(anim.translateX, {
                toValue: Math.random() * width - width / 2,
                duration: 8000 + index * 1000,
                useNativeDriver: true,
              }),
              Animated.timing(anim.translateY, {
                toValue: Math.random() * height - height / 2,
                duration: 8000 + index * 1000,
                useNativeDriver: true,
              }),
              Animated.timing(anim.opacity, {
                toValue: 0.3,
                duration: 4000,
                useNativeDriver: true,
              }),
              Animated.timing(anim.scale, {
                toValue: 1,
                duration: 4000,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(anim.opacity, {
                toValue: 0.1,
                duration: 4000,
                useNativeDriver: true,
              }),
              Animated.timing(anim.scale, {
                toValue: 0.5,
                duration: 4000,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      };

      setTimeout(animateFloat, index * 1000);
    });
  }, [floatingAnims]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundSecondary, Colors.background] as const}
        style={styles.gradient}
      >
        {/* Floating Glow Elements */}
        {floatingAnims.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.floatingElement,
              {
                opacity: anim.opacity,
                transform: [
                  { translateX: anim.translateX },
                  { translateY: anim.translateY },
                  { scale: anim.scale }
                ],
              },
            ]}
          >
            <LinearGradient
              colors={[Colors.glow, 'transparent'] as const}
              style={styles.glowCircle}
            />
          </Animated.View>
        ))}
        
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  floatingElement: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 100,
    height: 100,
  },
  glowCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
});