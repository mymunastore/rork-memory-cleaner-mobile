import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Battery, 
  BatteryLow, 
  Zap, 
  Moon, 
  Sun, 
  Wifi, 
  Bluetooth, 
  MapPin,
  Volume2,
  Smartphone,
  Clock,
  Shield
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import AnimatedBackground from '@/components/AnimatedBackground';

interface BatteryInfo {
  level: number;
  isCharging: boolean;
  timeRemaining: string;
  healthScore: number;
  temperature: number;
}

interface PowerSetting {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
  impact: 'low' | 'medium' | 'high';
}

interface PowerMode {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  active: boolean;
  savings: string;
}

export default function BatteryScreen() {
  const [batteryInfo, setBatteryInfo] = useState<BatteryInfo>({
    level: 67,
    isCharging: false,
    timeRemaining: '8h 23m',
    healthScore: 89,
    temperature: 32,
  });

  const [powerSettings, setPowerSettings] = useState<PowerSetting[]>([
    {
      id: '1',
      name: 'Auto-sync',
      description: 'Automatically sync app data',
      icon: Wifi,
      enabled: true,
      impact: 'medium',
    },
    {
      id: '2',
      name: 'Location Services',
      description: 'GPS and location tracking',
      icon: MapPin,
      enabled: true,
      impact: 'high',
    },
    {
      id: '3',
      name: 'Bluetooth',
      description: 'Bluetooth connectivity',
      icon: Bluetooth,
      enabled: false,
      impact: 'low',
    },
    {
      id: '4',
      name: 'Background App Refresh',
      description: 'Apps refresh content in background',
      icon: Smartphone,
      enabled: true,
      impact: 'high',
    },
    {
      id: '5',
      name: 'Push Notifications',
      description: 'Receive push notifications',
      icon: Volume2,
      enabled: true,
      impact: 'medium',
    },
  ]);

  const [powerModes, setPowerModes] = useState<PowerMode[]>([
    {
      id: 'normal',
      name: 'Normal Mode',
      description: 'Balanced performance and battery life',
      icon: Sun,
      color: Colors.accent,
      active: true,
      savings: '0%',
    },
    {
      id: 'power-saver',
      name: 'Power Saver',
      description: 'Extend battery life by limiting performance',
      icon: Battery,
      color: Colors.warning,
      active: false,
      savings: '25%',
    },
    {
      id: 'ultra-saver',
      name: 'Ultra Power Saver',
      description: 'Maximum battery life with minimal features',
      icon: BatteryLow,
      color: Colors.danger,
      active: false,
      savings: '50%',
    },
  ]);

  const [backgroundApps] = useState([
    { name: 'Instagram', usage: 'High', color: Colors.danger },
    { name: 'WhatsApp', usage: 'Medium', color: Colors.warning },
    { name: 'Chrome', usage: 'High', color: Colors.danger },
    { name: 'Spotify', usage: 'Low', color: Colors.accent },
  ]);

  const togglePowerSetting = (settingId: string) => {
    setPowerSettings(prev =>
      prev.map(setting =>
        setting.id === settingId
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const selectPowerMode = (modeId: string) => {
    setPowerModes(prev =>
      prev.map(mode => ({
        ...mode,
        active: mode.id === modeId,
      }))
    );

    const selectedMode = powerModes.find(mode => mode.id === modeId);
    if (selectedMode) {
      Alert.alert(
        'Power Mode Changed',
        `Switched to ${selectedMode.name}. Battery savings: ${selectedMode.savings}`
      );
    }
  };

  const killBackgroundApps = () => {
    Alert.alert(
      'Kill Background Apps',
      'This will close all background apps to save battery. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Kill Apps',
          onPress: () => {
            Alert.alert('Success', 'Background apps have been closed.');
          }
        }
      ]
    );
  };

  const getBatteryIcon = () => {
    if (batteryInfo.level <= 20) return BatteryLow;
    return Battery;
  };

  const getBatteryColor = () => {
    if (batteryInfo.level <= 20) return Colors.danger;
    if (batteryInfo.level <= 50) return Colors.warning;
    return Colors.accent;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return Colors.danger;
      case 'medium': return Colors.warning;
      case 'low': return Colors.accent;
      default: return Colors.textSecondary;
    }
  };

  const BatteryIcon = getBatteryIcon();

  return (
    <AnimatedBackground>
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Battery Status */}
          <View style={styles.batterySection}>
            <View style={styles.batteryHeader}>
              <BatteryIcon color={getBatteryColor()} size={32} />
              <Text style={styles.batteryLevel}>{batteryInfo.level}%</Text>
              {batteryInfo.isCharging && (
                <Zap color={Colors.accent} size={24} />
              )}
            </View>
            
            <Text style={styles.batteryStatus}>
              {batteryInfo.isCharging ? 'Charging' : 'Not Charging'}
            </Text>
            
            <View style={styles.batteryDetails}>
              <View style={styles.batteryDetailItem}>
                <Clock color={Colors.textSecondary} size={16} />
                <Text style={styles.batteryDetailText}>
                  {batteryInfo.timeRemaining} remaining
                </Text>
              </View>
              
              <View style={styles.batteryDetailItem}>
                <Shield color={Colors.textSecondary} size={16} />
                <Text style={styles.batteryDetailText}>
                  Health: {batteryInfo.healthScore}%
                </Text>
              </View>
            </View>

            {/* Battery Progress Bar */}
            <View style={styles.batteryProgress}>
              <View style={styles.batteryProgressBar}>
                <LinearGradient
                  colors={[getBatteryColor(), `${getBatteryColor()}80`]}
                  style={[
                    styles.batteryProgressFill,
                    { width: `${batteryInfo.level}%` }
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </View>
          </View>

          {/* Power Modes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Power Modes</Text>
            
            {powerModes.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.powerModeItem,
                  mode.active && styles.powerModeItemActive
                ]}
                onPress={() => selectPowerMode(mode.id)}
                testID={`power-mode-${mode.id}`}
              >
                <View style={[styles.powerModeIcon, { backgroundColor: `${mode.color}20` }]}>
                  <mode.icon color={mode.color} size={24} />
                </View>
                
                <View style={styles.powerModeContent}>
                  <Text style={styles.powerModeName}>{mode.name}</Text>
                  <Text style={styles.powerModeDescription}>{mode.description}</Text>
                </View>
                
                <View style={styles.powerModeSavings}>
                  <Text style={[styles.powerModeSavingsText, { color: mode.color }]}>
                    {mode.savings}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Power Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Power Settings</Text>
            
            {powerSettings.map((setting) => (
              <View key={setting.id} style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <setting.icon color={Colors.textSecondary} size={20} />
                </View>
                
                <View style={styles.settingContent}>
                  <Text style={styles.settingName}>{setting.name}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                  <Text style={[
                    styles.settingImpact,
                    { color: getImpactColor(setting.impact) }
                  ]}>
                    {setting.impact.toUpperCase()} IMPACT
                  </Text>
                </View>
                
                <Switch
                  value={setting.enabled}
                  onValueChange={() => togglePowerSetting(setting.id)}
                  trackColor={{ false: Colors.border, true: `${Colors.accent}40` }}
                  thumbColor={setting.enabled ? Colors.accent : Colors.textMuted}
                  testID={`setting-switch-${setting.id}`}
                />
              </View>
            ))}
          </View>

          {/* Background Apps */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Background Apps</Text>
              <TouchableOpacity
                style={styles.killAppsButton}
                onPress={killBackgroundApps}
                testID="kill-apps-button"
              >
                <Text style={styles.killAppsButtonText}>Kill All</Text>
              </TouchableOpacity>
            </View>
            
            {backgroundApps.map((app, index) => (
              <View key={index} style={styles.backgroundAppItem}>
                <View style={styles.backgroundAppIcon}>
                  <Smartphone color={Colors.textSecondary} size={20} />
                </View>
                
                <View style={styles.backgroundAppContent}>
                  <Text style={styles.backgroundAppName}>{app.name}</Text>
                  <Text style={[
                    styles.backgroundAppUsage,
                    { color: app.color }
                  ]}>
                    {app.usage} battery usage
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.quickActionButton}
                testID="optimize-battery-button"
              >
                <LinearGradient
                  colors={Colors.gradientPrimary}
                  style={styles.quickActionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Zap color={Colors.text} size={20} />
                  <Text style={styles.quickActionText}>Optimize Battery</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.quickActionButton}
                testID="schedule-power-mode-button"
              >
                <LinearGradient
                  colors={Colors.gradientSecondary}
                  style={styles.quickActionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Moon color={Colors.text} size={20} />
                  <Text style={styles.quickActionText}>Schedule Power Mode</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
    paddingTop: 16,
    paddingBottom: 32,
  },
  batterySection: {
    marginHorizontal: 16,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  batteryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  batteryLevel: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  batteryStatus: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  batteryDetails: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 20,
  },
  batteryDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  batteryDetailText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  batteryProgress: {
    width: '100%',
  },
  batteryProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  batteryProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  powerModeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  powerModeItemActive: {
    borderColor: Colors.accent,
    backgroundColor: `${Colors.accent}10`,
  },
  powerModeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  powerModeContent: {
    flex: 1,
  },
  powerModeName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  powerModeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  powerModeSavings: {
    alignItems: 'center',
  },
  powerModeSavingsText: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  settingImpact: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  killAppsButton: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  killAppsButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  backgroundAppItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  backgroundAppIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backgroundAppContent: {
    flex: 1,
  },
  backgroundAppName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  backgroundAppUsage: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  quickActions: {
    gap: 12,
  },
  quickActionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
});