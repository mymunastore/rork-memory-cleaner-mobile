import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  ActivityIndicator,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Zap, 
  Smartphone, 
  Battery, 
  HardDrive, 
  Trash2, 
  Shield,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react-native';
import { router } from 'expo-router';

import { useMemory } from '@/hooks/useMemoryStore';
import { MemoryCard } from '@/components/MemoryCard';
import { ScanButton } from '@/components/ScanButton';
import { CleanupItem } from '@/components/CleanupItem';
import { ActionButton } from '@/components/ActionButton';
import { ProgressBar } from '@/components/ProgressBar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { formatFileSize } from '@/utils/fileSize';
import { Colors } from '@/constants/colors';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  route: string;
  gradient: readonly [string, string, ...string[]];
}

export default function DashboardScreen() {
  const { 
    memoryStats, 
    cleanupItems, 
    isScanning, 
    lastScanDate, 
    startScan,
    cleanupSize,
    isOptimizing,
    optimizationProgress,
    optimizeMemory,
    isLoading,
  } = useMemory();

  const [fadeAnim] = useState(new Animated.Value(0));
  const [performanceScore] = useState(87);
  
  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Smart Scan',
      description: 'Deep clean junk files',
      icon: Zap,
      color: Colors.primary,
      route: '/scan',
      gradient: [Colors.gradientPrimary[0], Colors.gradientPrimary[1]] as const,
    },
    {
      id: '2',
      title: 'App Manager',
      description: 'Manage installed apps',
      icon: Smartphone,
      color: Colors.accent,
      route: '/apps',
      gradient: [Colors.gradientAccent[0], Colors.gradientAccent[1]] as const,
    },
    {
      id: '3',
      title: 'Battery Saver',
      description: 'Optimize battery life',
      icon: Battery,
      color: Colors.warning,
      route: '/battery',
      gradient: [Colors.gradientSecondary[0], Colors.gradientSecondary[1]] as const,
    },
    {
      id: '4',
      title: 'File Explorer',
      description: 'Browse and clean files',
      icon: HardDrive,
      color: Colors.textSecondary,
      route: '/files',
      gradient: [Colors.textSecondary, Colors.border] as const,
    },
  ];
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading memory data...</Text>
      </View>
    );
  }

  return (
    <AnimatedBackground>
      <View style={styles.container}>
        <StatusBar style="light" />
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Welcome Header */}
          <View style={styles.welcomeHeader}>
            <Text style={styles.welcomeTitle}>SmartClean</Text>
            <Text style={styles.welcomeSubtitle}>Memory Cleaner & Space Optimizer</Text>
          </View>

          {/* Performance Score */}
          <View style={styles.performanceCard}>
            <LinearGradient
              colors={[Colors.gradientPrimary[0], Colors.gradientPrimary[1]]}
              style={styles.performanceGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.performanceContent}>
                <View style={styles.performanceScore}>
                  <Text style={styles.performanceScoreText}>{performanceScore}</Text>
                  <Text style={styles.performanceScoreLabel}>Performance Score</Text>
                </View>
                <View style={styles.performanceStats}>
                  <View style={styles.performanceStat}>
                    <TrendingUp color={Colors.text} size={16} />
                    <Text style={styles.performanceStatText}>+12% faster</Text>
                  </View>
                  <View style={styles.performanceStat}>
                    <CheckCircle color={Colors.text} size={16} />
                    <Text style={styles.performanceStatText}>Optimized</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
          
          <MemoryCard 
            totalMemory={memoryStats.totalMemory}
            usedMemory={memoryStats.usedMemory}
            availableMemory={memoryStats.availableMemory}
            testID="memory-card"
          />

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickActionCard}
                  onPress={() => router.push(action.route as any)}
                  testID={`quick-action-${action.id}`}
                >
                  <LinearGradient
                    colors={action.gradient}
                    style={styles.quickActionGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <action.icon color={Colors.text} size={24} />
                  </LinearGradient>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionDescription}>{action.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <ScanButton 
            onPress={startScan}
            isScanning={isScanning}
            lastScanDate={lastScanDate}
            testID="scan-button"
          />
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cleanup Recommendations</Text>
            <Text style={styles.sectionSubtitle}>
              {formatFileSize(cleanupSize)} can be freed
            </Text>
          </View>
          
          {cleanupItems.map((item) => (
            <CleanupItem
              key={item.id}
              title={item.title}
              description={item.description}
              size={item.size}
              icon={item.icon}
              color={item.color}
              testID={`cleanup-item-${item.id}`}
            />
          ))}
          
          {isOptimizing && (
            <View style={styles.optimizingContainer}>
              <Text style={styles.optimizingText}>Optimizing memory...</Text>
              <ProgressBar 
                progress={optimizationProgress} 
                color={Colors.accent}
                testID="optimization-progress"
              />
            </View>
          )}
          
          <ActionButton 
            title="Optimize Now" 
            onPress={optimizeMemory}
            isLoading={isOptimizing}
            disabled={isScanning || cleanupSize === 0}
            style={styles.optimizeButton}
            testID="optimize-button"
          />
          </Animated.View>
        </ScrollView>
      </View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    textShadowColor: Colors.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600' as const,
  },
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
    textShadowColor: Colors.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  performanceCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  performanceGradient: {
    padding: 20,
  },
  performanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  performanceScore: {
    alignItems: 'center',
  },
  performanceScoreText: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  performanceScoreLabel: {
    fontSize: 14,
    color: Colors.text,
    opacity: 0.8,
  },
  performanceStats: {
    gap: 8,
  },
  performanceStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  performanceStatText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  quickActionGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  optimizingContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  optimizingText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  optimizeButton: {
    marginHorizontal: 16,
    marginTop: 16,
  },
});