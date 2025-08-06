import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { 
  Brain,
  TrendingUp,
  Zap,
  HardDrive,
  Smartphone,
  ChevronRight,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { formatFileSize } from '@/utils/fileSize';
import { AIRecommendation } from '@/hooks/useMemoryStore';

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
  onApply: (id: string) => void;
  isApplying?: boolean;
  testID?: string;
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return '#FF3B30';
    case 'medium': return '#FF9500';
    case 'low': return '#4CD964';
    default: return Colors.text;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'smart_cleanup': return HardDrive;
    case 'usage_pattern': return TrendingUp;
    case 'storage_optimization': return Zap;
    case 'performance_boost': return Smartphone;
    default: return Brain;
  }
};

export function AIRecommendationCard({ 
  recommendation, 
  onApply, 
  isApplying = false,
  testID 
}: AIRecommendationCardProps) {
  const IconComponent = getTypeIcon(recommendation.type);
  const impactColor = getImpactColor(recommendation.impact);
  const confidencePercentage = Math.round(recommendation.confidence * 100);

  return (
    <View style={[styles.container, { borderLeftColor: recommendation.color }]} testID={testID}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <IconComponent 
            size={20} 
            color={recommendation.color} 
            style={styles.icon}
          />
          <Brain size={12} color={Colors.accent} style={styles.aiIcon} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{recommendation.title}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.impactBadge, { backgroundColor: impactColor + '20' }]}>
              <Text style={[styles.impactText, { color: impactColor }]}>
                {recommendation.impact.toUpperCase()} IMPACT
              </Text>
            </View>
            <Text style={styles.confidence}>{confidencePercentage}% confident</Text>
          </View>
        </View>
      </View>

      <Text style={styles.description}>{recommendation.description}</Text>

      <View style={styles.savingsContainer}>
        <Text style={styles.savingsLabel}>Potential savings:</Text>
        <Text style={styles.savingsValue}>
          {formatFileSize(recommendation.potentialSavings)}
        </Text>
      </View>

      {recommendation.actions.length > 0 && (
        <View style={styles.actionsContainer}>
          <Text style={styles.actionsLabel}>Actions:</Text>
          {recommendation.actions.map((action, index) => (
            <Text key={index} style={styles.actionItem}>• {action}</Text>
          ))}
        </View>
      )}

      <TouchableOpacity 
        style={[styles.applyButton, isApplying && styles.applyButtonDisabled]}
        onPress={() => onApply(recommendation.id)}
        disabled={isApplying}
        testID={`${testID}-apply`}
      >
        <Text style={[styles.applyButtonText, isApplying && styles.applyButtonTextDisabled]}>
          {isApplying ? 'Applying...' : 'Apply Recommendation'}
        </Text>
        {!isApplying && (
          <ChevronRight size={16} color={Colors.background} style={styles.applyIcon} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  icon: {
    opacity: 0.8,
  },
  aiIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 2,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  impactText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  confidence: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  savingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  savingsLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  savingsValue: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '700',
  },
  actionsContainer: {
    marginBottom: 16,
  },
  actionsLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  actionItem: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  applyButtonDisabled: {
    backgroundColor: Colors.border,
  },
  applyButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
  applyButtonTextDisabled: {
    color: Colors.textSecondary,
  },
  applyIcon: {
    marginLeft: 4,
  },
});