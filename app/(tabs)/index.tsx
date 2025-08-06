import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  ActivityIndicator,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useMemory } from '@/hooks/useMemoryStore';
import { MemoryCard } from '@/components/MemoryCard';
import { ScanButton } from '@/components/ScanButton';
import { CleanupItem } from '@/components/CleanupItem';
import { ActionButton } from '@/components/ActionButton';
import { ProgressBar } from '@/components/ProgressBar';
import { AIAnalysisButton } from '@/components/AIAnalysisButton';
import AnimatedBackground from '@/components/AnimatedBackground';
import { formatFileSize } from '@/utils/fileSize';
import { Colors } from '@/constants/colors';

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
    generateAIAnalysis,
    isAnalyzing,
    analysisProgress,
    aiRecommendations,
    isLoading,
  } = useMemory();

  const [fadeAnim] = useState(new Animated.Value(0));
  
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
          <MemoryCard 
            totalMemory={memoryStats.totalMemory}
            usedMemory={memoryStats.usedMemory}
            availableMemory={memoryStats.availableMemory}
            testID="memory-card"
          />
          
          <ScanButton 
            onPress={startScan}
            isScanning={isScanning}
            lastScanDate={lastScanDate}
            testID="scan-button"
          />
          
          <AIAnalysisButton
            onPress={generateAIAnalysis}
            isAnalyzing={isAnalyzing}
            analysisProgress={analysisProgress}
            disabled={isScanning || isOptimizing}
            testID="dashboard-ai-button"
          />
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cleanup Recommendations</Text>
            <Text style={styles.sectionSubtitle}>
              {formatFileSize(cleanupSize)} can be freed
              {aiRecommendations.length > 0 && (
                <Text style={styles.aiIndicator}> • {aiRecommendations.length} AI suggestions</Text>
              )}
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
  aiIndicator: {
    color: Colors.glow,
    fontWeight: '700' as const,
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