import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Animated,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useMemory } from '@/hooks/useMemoryStore';
import { AIAnalysisButton } from '@/components/AIAnalysisButton';
import { AIRecommendationCard } from '@/components/AIRecommendationCard';
import { AIInsightCard } from '@/components/AIInsightCard';
import { Colors } from '@/constants/colors';
import { Brain, Lightbulb, TrendingUp } from 'lucide-react-native';

export default function AIScreen() {
  const { 
    aiRecommendations,
    aiInsights,
    isAnalyzing,
    analysisProgress,
    generateAIAnalysis,
    applyAIRecommendation,
    isOptimizing,
    isLoading,
  } = useMemory();

  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
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
        <Text style={styles.loadingText}>Loading AI features...</Text>
      </View>
    );
  }

  const hasRecommendations = aiRecommendations.length > 0;
  const hasInsights = aiInsights.length > 0;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Brain size={24} color={Colors.primary} />
            </View>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <Text style={styles.headerSubtitle}>
              Smart analysis and personalized recommendations
            </Text>
          </View>

          {/* AI Analysis Button */}
          <AIAnalysisButton
            onPress={generateAIAnalysis}
            isAnalyzing={isAnalyzing}
            analysisProgress={analysisProgress}
            disabled={isOptimizing}
            testID="ai-analysis-button"
          />

          {/* AI Insights Section */}
          {hasInsights && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp size={20} color={Colors.accent} />
                <Text style={styles.sectionTitle}>Smart Insights</Text>
              </View>
              <FlatList
                data={aiInsights}
                renderItem={({ item }) => (
                  <AIInsightCard
                    insight={item}
                    testID={`ai-insight-${item.id}`}
                  />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.insightsContainer}
              />
            </View>
          )}

          {/* AI Recommendations Section */}
          {hasRecommendations && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Lightbulb size={20} color={Colors.accent} />
                <Text style={styles.sectionTitle}>AI Recommendations</Text>
                <Text style={styles.sectionCount}>
                  {aiRecommendations.length}
                </Text>
              </View>
              {aiRecommendations.map((recommendation) => (
                <AIRecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onApply={applyAIRecommendation}
                  isApplying={isOptimizing}
                  testID={`ai-recommendation-${recommendation.id}`}
                />
              ))}
            </View>
          )}

          {/* Empty State */}
          {!hasRecommendations && !hasInsights && !isAnalyzing && (
            <View style={styles.emptyState}>
              <Brain size={48} color={Colors.border} />
              <Text style={styles.emptyTitle}>No AI Analysis Yet</Text>
              <Text style={styles.emptyDescription}>
                Tap the AI Smart Analysis button above to get personalized 
                recommendations and insights about your device storage.
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  headerIcon: {
    backgroundColor: Colors.primary + '15',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  sectionCount: {
    backgroundColor: Colors.primary,
    color: Colors.background,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  insightsContainer: {
    paddingHorizontal: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    marginTop: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});