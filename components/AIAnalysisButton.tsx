import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Brain, Sparkles } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { ProgressBar } from './ProgressBar';

interface AIAnalysisButtonProps {
  onPress: () => void;
  isAnalyzing: boolean;
  analysisProgress: number;
  disabled?: boolean;
  testID?: string;
}

export function AIAnalysisButton({ 
  onPress, 
  isAnalyzing, 
  analysisProgress, 
  disabled = false,
  testID 
}: AIAnalysisButtonProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          (isAnalyzing || disabled) && styles.buttonDisabled
        ]}
        onPress={onPress}
        disabled={isAnalyzing || disabled}
        testID={testID}
      >
        <View style={styles.iconContainer}>
          <Brain size={20} color={Colors.background} />
          <Sparkles size={12} color={Colors.accent} style={styles.sparkleIcon} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[
            styles.buttonText,
            (isAnalyzing || disabled) && styles.buttonTextDisabled
          ]}>
            {isAnalyzing ? 'AI Analyzing...' : 'AI Smart Analysis'}
          </Text>
          <Text style={[
            styles.buttonSubtext,
            (isAnalyzing || disabled) && styles.buttonTextDisabled
          ]}>
            Get personalized recommendations
          </Text>
        </View>
      </TouchableOpacity>
      
      {isAnalyzing && (
        <View style={styles.progressContainer}>
          <ProgressBar 
            progress={analysisProgress} 
            color={Colors.primary}
            height={3}
          />
          <Text style={styles.progressText}>
            Analyzing your device patterns...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  iconContainer: {
    position: 'relative',
    marginRight: 16,
  },
  sparkleIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 2,
  },
  textContainer: {
    flex: 1,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  buttonTextDisabled: {
    color: Colors.textSecondary,
  },
  buttonSubtext: {
    color: Colors.background + 'CC',
    fontSize: 13,
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressText: {
    fontSize: 12,
    color: Colors.accent,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
});