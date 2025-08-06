import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Zap, 
  HardDrive, 
  Shield, 
  ChevronRight,
  CheckCircle
} from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/colors';
import AnimatedBackground from '@/components/AnimatedBackground';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: readonly [string, string, ...string[]];
}

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  const slides: OnboardingSlide[] = [
    {
      id: '1',
      title: 'Clean & Optimize',
      description: 'Remove junk files, clear cache, and free up valuable storage space on your device with our advanced cleaning algorithms.',
      icon: Zap,
      gradient: Colors.gradientPrimary,
    },
    {
      id: '2',
      title: 'Smart Storage Management',
      description: 'Intelligently manage your files, find duplicates, and organize your storage for maximum efficiency and performance.',
      icon: HardDrive,
      gradient: Colors.gradientAccent,
    },
    {
      id: '3',
      title: 'Privacy & Security',
      description: 'Your data stays on your device. We prioritize your privacy and never collect or share your personal information.',
      icon: Shield,
      gradient: Colors.gradientSecondary,
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
    
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.replace('/(tabs)');
    });
  };

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => (
    <View key={slide.id} style={[styles.slide, { width }]}>
      <View style={styles.slideContent}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={slide.gradient}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <slide.icon color={Colors.text} size={64} />
          </LinearGradient>
        </View>
        
        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideDescription}>{slide.description}</Text>
      </View>
    </View>
  );

  return (
    <AnimatedBackground>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>SmartClean</Text>
          <Text style={styles.appSubtitle}>Memory Cleaner & Space Optimizer</Text>
        </View>

        {/* Slides */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.slidesContainer}
        >
          {slides.map((slide, index) => renderSlide(slide, index))}
        </ScrollView>

        {/* Page Indicators */}
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlide === index && styles.indicatorActive
              ]}
            />
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {currentSlide < slides.length - 1 ? (
            <>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleGetStarted}
                testID="skip-button"
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                testID="next-button"
              >
                <LinearGradient
                  colors={Colors.gradientPrimary}
                  style={styles.nextButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.nextButtonText}>Next</Text>
                  <ChevronRight color={Colors.text} size={20} />
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={handleGetStarted}
              testID="get-started-button"
            >
              <LinearGradient
                colors={Colors.gradientAccent}
                style={styles.getStartedGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <CheckCircle color={Colors.text} size={20} />
                <Text style={styles.getStartedText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Permissions Notice */}
        <View style={styles.permissionsNotice}>
          <Text style={styles.permissionsText}>
            SmartClean will request storage permissions to analyze and clean your device.
          </Text>
        </View>
      </Animated.View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
    textShadowColor: Colors.glo,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  appSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  slidesContainer: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    marginBottom: 40,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  slideDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  indicatorActive: {
    backgroundColor: Colors.accent,
    width: 24,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  nextButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  getStartedButton: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
  },
  getStartedGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  permissionsNotice: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  permissionsText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});