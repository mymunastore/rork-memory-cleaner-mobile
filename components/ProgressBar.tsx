import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  testID?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  color = Colors.primary,
  backgroundColor = Colors.border,
  testID,
}) => {
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  
  const getGradientColors = (color: string) => {
    if (color === Colors.accent) return Colors.gradientAccent;
    if (color === Colors.warning) return Colors.gradientSecondary;
    if (color === Colors.primary) return Colors.gradientPrimary;
    if (color === Colors.danger) return Colors.gradientSecondary;
    return Colors.gradientPrimary;
  };

  return (
    <View 
      style={[styles.container, { height, backgroundColor }]}
      testID={testID}
    >
      <LinearGradient
        colors={getGradientColors(color)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.progress, 
          { 
            width: `${clampedProgress * 100}%`,
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: Colors.glo,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  progress: {
    height: '100%',
    borderRadius: 8,
    shadowColor: Colors.glo,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
});