import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Circle, RefreshCw } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '@/constants/colors';

interface ScanButtonProps {
  onPress: () => void;
  isScanning: boolean;
  lastScanDate: string | null;
  testID?: string;
}

export const ScanButton: React.FC<ScanButtonProps> = ({
  onPress,
  isScanning,
  lastScanDate,
  testID,
}) => {
  const spinValue = useMemo(() => new Animated.Value(0), []);
  
  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
      Animated.timing(spinValue, { toValue: 0, duration: 0, useNativeDriver: true }).stop();
    }
  }, [isScanning, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const formattedDate = lastScanDate 
    ? new Date(lastScanDate).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Never';

  return (
    <View style={styles.container} testID={testID}>
      <TouchableOpacity 
        onPress={onPress} 
        disabled={isScanning}
        style={styles.buttonContainer}
      >
        <View style={styles.button}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <RefreshCw size={28} color="white" />
          </Animated.View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {isScanning ? 'Scanning...' : 'Scan Device'}
        </Text>
        <View style={styles.lastScanContainer}>
          <Circle size={6} fill={Colors.textSecondary} color={Colors.textSecondary} />
          <Text style={styles.lastScanText}>
            Last scan: {formattedDate}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonContainer: {
    marginRight: 16,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  lastScanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastScanText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
});