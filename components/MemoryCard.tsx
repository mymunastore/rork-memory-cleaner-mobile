import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressBar } from './ProgressBar';
import PremiumCard from './PremiumCard';
import { formatFileSize } from '@/utils/fileSize';
import { Colors } from '@/constants/colors';

interface MemoryCardProps {
  totalMemory: number;
  usedMemory: number;
  availableMemory: number;
  testID?: string;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  totalMemory,
  usedMemory,
  availableMemory,
  testID,
}) => {
  const usagePercentage = usedMemory / totalMemory;
  
  let statusColor = Colors.accent;
  let statusText = 'Good';
  
  if (usagePercentage > 0.85) {
    statusColor = Colors.danger;
    statusText = 'Critical';
  } else if (usagePercentage > 0.7) {
    statusColor = Colors.warning;
    statusText = 'Warning';
  }
  
  return (
    <PremiumCard 
      testID={testID}
      glowColor={statusColor === Colors.accent ? Colors.glowAccent : 
                statusColor === Colors.warning ? Colors.secondary : 
                Colors.glow}
    >
      <View style={styles.header}>
        <Text style={styles.title}>MEMORY STATUS</Text>
        <LinearGradient
          colors={statusColor === Colors.accent ? Colors.gradientAccent : 
                 statusColor === Colors.warning ? Colors.gradientSecondary : 
                 [statusColor, statusColor] as const}
          style={styles.statusBadge}
        >
          <Text style={styles.statusText}>{statusText}</Text>
        </LinearGradient>
      </View>
      
      <ProgressBar 
        progress={usagePercentage}
        color={statusColor}
        height={12}
      />
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatFileSize(usedMemory)}</Text>
          <Text style={styles.statLabel}>Used</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatFileSize(availableMemory)}</Text>
          <Text style={styles.statLabel}>Free</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatFileSize(totalMemory)}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>
    </PremiumCard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: 1,
    textShadowColor: Colors.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: Colors.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    textShadowColor: Colors.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
});