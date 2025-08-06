import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { 
  TrendingUp,
  TrendingDown,
  Minus,
  HardDrive,
  Zap,
  Shield,
  Activity,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { AIInsight } from '@/hooks/useMemoryStore';

interface AIInsightCardProps {
  insight: AIInsight;
  testID?: string;
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'increasing': return TrendingUp;
    case 'decreasing': return TrendingDown;
    case 'stable': return Minus;
    default: return Activity;
  }
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'increasing': return '#FF3B30';
    case 'decreasing': return '#4CD964';
    case 'stable': return Colors.accent;
    default: return Colors.text;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'usage': return Activity;
    case 'storage': return HardDrive;
    case 'performance': return Zap;
    case 'security': return Shield;
    default: return Activity;
  }
};

export function AIInsightCard({ insight, testID }: AIInsightCardProps) {
  const TrendIcon = getTrendIcon(insight.trend);
  const CategoryIcon = getCategoryIcon(insight.category);
  const trendColor = getTrendColor(insight.trend);

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <CategoryIcon size={18} color={Colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{insight.title}</Text>
          <Text style={styles.category}>{insight.category.toUpperCase()}</Text>
        </View>
        <View style={styles.trendContainer}>
          <TrendIcon size={16} color={trendColor} />
          <Text style={[styles.trendText, { color: trendColor }]}>
            {insight.trend}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{insight.description}</Text>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>
          {insight.value} {insight.unit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    marginVertical: 4,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconContainer: {
    backgroundColor: Colors.primary + '15',
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  category: {
    fontSize: 10,
    color: Colors.accent,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  valueContainer: {
    backgroundColor: Colors.background,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
});