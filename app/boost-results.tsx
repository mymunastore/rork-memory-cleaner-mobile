import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  CheckCircle, 
  TrendingUp, 
  Zap, 
  HardDrive, 
  Share2,
  Home,
  Sparkles
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import AnimatedBackground from '@/components/AnimatedBackground';

interface BoostResult {
  label: string;
  before: string;
  after: string;
  improvement: string;
  icon: React.ComponentType<any>;
  color: string;
}

export default function BoostResultsScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [sparkleAnim] = useState(new Animated.Value(0));

  const results: BoostResult[] = [
    {
      label: 'Storage Freed',
      before: '2.1 GB',
      after: '4.8 GB',
      improvement: '+2.7 GB',
      icon: HardDrive,
      color: Colors.accent,
    },
    {
      label: 'Performance Score',
      before: '67',
      after: '94',
      improvement: '+27 points',
      icon: TrendingUp,
      color: Colors.primary,
    },
    {
      label: 'Boot Time',
      before: '45s',
      after: '28s',
      improvement: '-17s faster',
      icon: Zap,
      color: Colors.warning,
    },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🚀 Just optimized my phone with SmartClean!\n\n✨ Freed up 2.7 GB of storage\n📈 Performance improved by 27 points\n⚡ Boot time reduced by 17 seconds\n\nTry SmartClean for free!`,
        title: 'SmartClean Optimization Results',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBackHome = () => {
    router.replace('/(tabs)');
  };

  return (
    <AnimatedBackground>
      <Animated.View 
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <View style={styles.header}>
          <View style={styles.successIcon}>
            <LinearGradient
              colors={Colors.gradientAccent}
              style={styles.successGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <CheckCircle color={Colors.text} size={48} />
            </LinearGradient>
            
            <Animated.View 
              style={[
                styles.sparkle,
                styles.sparkle1,
                {
                  opacity: sparkleAnim,
                  transform: [
                    {
                      rotate: sparkleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                }
              ]}
            >
              <Sparkles color={Colors.accent} size={16} />
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.sparkle,
                styles.sparkle2,
                {
                  opacity: sparkleAnim,
                  transform: [
                    {
                      rotate: sparkleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['360deg', '0deg'],
                      }),
                    },
                  ],
                }
              ]}
            >
              <Sparkles color={Colors.primary} size={12} />
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.sparkle,
                styles.sparkle3,
                {
                  opacity: sparkleAnim,
                  transform: [
                    {
                      rotate: sparkleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg'],
                      }),
                    },
                  ],
                }
              ]}
            >
              <Sparkles color={Colors.warning} size={14} />
            </Animated.View>
          </View>
          
          <Text style={styles.successTitle}>Optimization Complete!</Text>
          <Text style={styles.successSubtitle}>
            Your device is now running faster and smoother
          </Text>
        </View>

        <View style={styles.resultsContainer}>
          {results.map((result, index) => (
            <Animated.View
              key={result.label}
              style={[
                styles.resultCard,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50 * (index + 1), 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={[styles.resultIcon, { backgroundColor: `${result.color}20` }]}>
                <result.icon color={result.color} size={24} />
              </View>
              
              <View style={styles.resultContent}>
                <Text style={styles.resultLabel}>{result.label}</Text>
                <View style={styles.resultValues}>
                  <Text style={styles.resultBefore}>{result.before}</Text>
                  <Text style={styles.resultArrow}>→</Text>
                  <Text style={styles.resultAfter}>{result.after}</Text>
                </View>
                <Text style={[styles.resultImprovement, { color: result.color }]}>
                  {result.improvement}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <LinearGradient
            colors={Colors.gradientPrimary}
            style={styles.summaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.summaryTitle}>Overall Improvement</Text>
            <Text style={styles.summaryScore}>+42%</Text>
            <Text style={styles.summaryDescription}>
              Your device performance has significantly improved
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            testID="share-results-button"
          >
            <LinearGradient
              colors={Colors.gradientSecondary}
              style={styles.shareGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Share2 color={Colors.text} size={20} />
              <Text style={styles.shareButtonText}>Share Results</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleBackHome}
            testID="back-home-button"
          >
            <LinearGradient
              colors={Colors.gradientAccent}
              style={styles.homeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Home color={Colors.text} size={20} />
              <Text style={styles.homeButtonText}>Back to Dashboard</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.tipContainer}>
          <Text style={styles.tipText}>
            💡 Tip: Run SmartClean weekly to maintain optimal performance
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successIcon: {
    position: 'relative',
    marginBottom: 20,
  },
  successGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: -10,
    right: -10,
  },
  sparkle2: {
    bottom: -5,
    left: -15,
  },
  sparkle3: {
    top: 10,
    left: -20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  resultsContainer: {
    marginBottom: 30,
    gap: 16,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resultContent: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  resultValues: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  resultBefore: {
    fontSize: 14,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  resultArrow: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  resultAfter: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  resultImprovement: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  summaryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
  },
  summaryGradient: {
    padding: 24,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  summaryScore: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  summaryDescription: {
    fontSize: 14,
    color: Colors.text,
    opacity: 0.9,
    textAlign: 'center',
  },
  actionContainer: {
    gap: 12,
    marginBottom: 20,
  },
  shareButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  shareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  homeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  homeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  tipContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});