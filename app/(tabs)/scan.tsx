import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Zap, 
  Trash2, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react-native';
import { useMemory } from '@/hooks/useMemoryStore';
import { formatFileSize } from '@/utils/fileSize';
import { Colors } from '@/constants/colors';
import AnimatedBackground from '@/components/AnimatedBackground';

interface ScanResult {
  id: string;
  type: 'cache' | 'temp' | 'logs' | 'apk' | 'residual' | 'empty';
  name: string;
  size: number;
  count: number;
  icon: React.ComponentType<any>;
  color: string;
  selected: boolean;
}

export default function SmartScanScreen() {
  const { memoryStats } = useMemory();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [totalCleanable, setTotalCleanable] = useState(0);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanProgress, setCleanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  
  const [pulseAnim] = useState(new Animated.Value(1));
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isScanning]);

  const startScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanResults([]);
    setScanComplete(false);
    
    const mockResults: ScanResult[] = [
      {
        id: '1',
        type: 'cache',
        name: 'App Cache Files',
        size: 245 * 1024 * 1024,
        count: 1247,
        icon: Archive,
        color: Colors.warning,
        selected: true,
      },
      {
        id: '2',
        type: 'temp',
        name: 'Temporary Files',
        size: 89 * 1024 * 1024,
        count: 523,
        icon: FileText,
        color: Colors.danger,
        selected: true,
      },
      {
        id: '3',
        type: 'logs',
        name: 'System Logs',
        size: 34 * 1024 * 1024,
        count: 156,
        icon: FileText,
        color: Colors.textSecondary,
        selected: true,
      },
      {
        id: '4',
        type: 'apk',
        name: 'APK Files',
        size: 156 * 1024 * 1024,
        count: 12,
        icon: Archive,
        color: Colors.accent,
        selected: false,
      },
      {
        id: '5',
        type: 'residual',
        name: 'Residual Files',
        size: 67 * 1024 * 1024,
        count: 89,
        icon: Trash2,
        color: Colors.primary,
        selected: true,
      },
    ];

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setScanProgress(i);
      
      if (i === 50) {
        setScanResults(mockResults.slice(0, 3));
      } else if (i === 80) {
        setScanResults(mockResults);
      }
    }
    
    const total = mockResults
      .filter(result => result.selected)
      .reduce((sum, result) => sum + result.size, 0);
    
    setTotalCleanable(total);
    setIsScanning(false);
    setScanComplete(true);
  };

  const toggleSelection = (id: string) => {
    setScanResults(prev => {
      const updated = prev.map(result => 
        result.id === id ? { ...result, selected: !result.selected } : result
      );
      
      const total = updated
        .filter(result => result.selected)
        .reduce((sum, result) => sum + result.size, 0);
      
      setTotalCleanable(total);
      return updated;
    });
  };

  const startCleanup = async () => {
    if (totalCleanable === 0) {
      Alert.alert('No Items Selected', 'Please select items to clean.');
      return;
    }

    setIsCleaning(true);
    setCleanProgress(0);
    
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setCleanProgress(i);
    }
    
    setIsCleaning(false);
    Alert.alert(
      'Cleanup Complete!',
      `Successfully freed ${formatFileSize(totalCleanable)} of storage space.`,
      [{ text: 'OK', onPress: () => {
        setScanResults([]);
        setScanComplete(false);
        setTotalCleanable(0);
      }}]
    );
  };

  return (
    <AnimatedBackground>
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Scan Circle */}
          <View style={styles.scanSection}>
            <Animated.View 
              style={[
                styles.scanCircle,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <LinearGradient
                colors={Colors.gradientPrimary}
                style={styles.scanGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isScanning ? (
                  <Loader color={Colors.text} size={48} />
                ) : scanComplete ? (
                  <CheckCircle color={Colors.text} size={48} />
                ) : (
                  <Zap color={Colors.text} size={48} />
                )}
              </LinearGradient>
            </Animated.View>
            
            <Text style={styles.scanTitle}>
              {isScanning ? 'Scanning Device...' : 
               scanComplete ? 'Scan Complete' : 'Smart Scan'}
            </Text>
            
            <Text style={styles.scanSubtitle}>
              {isScanning ? `${scanProgress}% Complete` :
               scanComplete ? `Found ${formatFileSize(totalCleanable)} to clean` :
               'Detect junk files and optimize storage'}
            </Text>
            
            {isScanning && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <Animated.View 
                    style={[
                      styles.progressFill,
                      { width: `${scanProgress}%` }
                    ]}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Scan Results */}
          {scanResults.length > 0 && (
            <View style={styles.resultsSection}>
              <Text style={styles.sectionTitle}>Scan Results</Text>
              
              {scanResults.map((result) => (
                <TouchableOpacity
                  key={result.id}
                  style={[
                    styles.resultItem,
                    result.selected && styles.resultItemSelected
                  ]}
                  onPress={() => toggleSelection(result.id)}
                  testID={`scan-result-${result.id}`}
                >
                  <View style={styles.resultIcon}>
                    <result.icon color={result.color} size={24} />
                  </View>
                  
                  <View style={styles.resultContent}>
                    <Text style={styles.resultName}>{result.name}</Text>
                    <Text style={styles.resultDetails}>
                      {formatFileSize(result.size)} • {result.count} items
                    </Text>
                  </View>
                  
                  <View style={[
                    styles.checkbox,
                    result.selected && styles.checkboxSelected
                  ]}>
                    {result.selected && (
                      <CheckCircle color={Colors.accent} size={20} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            {!scanComplete ? (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  isScanning && styles.actionButtonDisabled
                ]}
                onPress={startScan}
                disabled={isScanning}
                testID="start-scan-button"
              >
                <LinearGradient
                  colors={isScanning ? [Colors.textMuted, Colors.textMuted] : Colors.gradientPrimary}
                  style={styles.actionButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.actionButtonText}>
                    {isScanning ? 'Scanning...' : 'Start Smart Scan'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <>
                <View style={styles.cleanupSummary}>
                  <Text style={styles.cleanupTitle}>
                    Ready to Clean: {formatFileSize(totalCleanable)}
                  </Text>
                  <Text style={styles.cleanupSubtitle}>
                    {scanResults.filter(r => r.selected).length} items selected
                  </Text>
                </View>
                
                {isCleaning && (
                  <View style={styles.progressContainer}>
                    <Text style={styles.cleaningText}>Cleaning... {cleanProgress}%</Text>
                    <View style={styles.progressBar}>
                      <Animated.View 
                        style={[
                          styles.progressFill,
                          { width: `${cleanProgress}%` }
                        ]}
                      />
                    </View>
                  </View>
                )}
                
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    (isCleaning || totalCleanable === 0) && styles.actionButtonDisabled
                  ]}
                  onPress={startCleanup}
                  disabled={isCleaning || totalCleanable === 0}
                  testID="clean-now-button"
                >
                  <LinearGradient
                    colors={isCleaning || totalCleanable === 0 ? 
                      [Colors.textMuted, Colors.textMuted] : 
                      Colors.gradientAccent
                    }
                    style={styles.actionButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.actionButtonText}>
                      {isCleaning ? 'Cleaning...' : 'Clean Now'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </View>
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
    paddingTop: 20,
    paddingBottom: 32,
  },
  scanSection: {
    alignItems: 'center',
    paddingVertical: 40,
    marginHorizontal: 16,
  },
  scanCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  scanGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  scanSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  resultsSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  resultItemSelected: {
    borderColor: Colors.accent,
    backgroundColor: `${Colors.accent}10`,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  resultDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: Colors.accent,
    backgroundColor: 'transparent',
  },
  actionSection: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  cleanupSummary: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  cleanupTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.accent,
    marginBottom: 4,
  },
  cleanupSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  cleaningText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
});