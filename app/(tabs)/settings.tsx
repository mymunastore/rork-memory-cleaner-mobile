import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Colors } from '@/constants/colors';
import { 
  Bell, 
  Clock, 
  Shield, 
  Trash2, 
  HelpCircle,
  ChevronRight,
  Info
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  testID?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  description,
  rightElement,
  onPress,
  testID,
}) => (
  <TouchableOpacity 
    style={styles.settingItem} 
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={onPress ? 0.7 : 1}
    testID={testID}
  >
    <View style={styles.settingIconContainer}>
      {icon}
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {description && <Text style={styles.settingDescription}>{description}</Text>}
    </View>
    {rightElement}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const [autoCleanup, setAutoCleanup] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [deepScan, setDeepScan] = useState(false);
  
  const handleToggleAutoCleanup = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setAutoCleanup(prev => !prev);
  };
  
  const handleToggleNotifications = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setNotifications(prev => !prev);
  };
  
  const handleToggleDeepScan = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setDeepScan(prev => !prev);
  };
  
  const handleClearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "This will reset all app data and preferences. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: () => {
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            // In a real app, we would clear AsyncStorage here
            Alert.alert("Data Cleared", "All app data has been reset.");
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Preferences</Text>
        </View>
        
        <View style={styles.card}>
          <SettingItem
            icon={<Clock size={22} color={Colors.primary} />}
            title="Automatic Cleanup"
            description="Clean junk files automatically"
            rightElement={
              <Switch
                value={autoCleanup}
                onValueChange={handleToggleAutoCleanup}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.card}
              />
            }
            testID="setting-auto-cleanup"
          />
          
          <View style={styles.divider} />
          
          <SettingItem
            icon={<Bell size={22} color={Colors.primary} />}
            title="Notifications"
            description="Get alerts about memory usage"
            rightElement={
              <Switch
                value={notifications}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.card}
              />
            }
            testID="setting-notifications"
          />
          
          <View style={styles.divider} />
          
          <SettingItem
            icon={<Shield size={22} color={Colors.primary} />}
            title="Deep Scan"
            description="Perform thorough system scans"
            rightElement={
              <Switch
                value={deepScan}
                onValueChange={handleToggleDeepScan}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.card}
              />
            }
            testID="setting-deep-scan"
          />
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Support</Text>
        </View>
        
        <View style={styles.card}>
          <SettingItem
            icon={<HelpCircle size={22} color={Colors.primary} />}
            title="Help & Support"
            rightElement={<ChevronRight size={20} color={Colors.textSecondary} />}
            onPress={() => {}}
            testID="setting-help"
          />
          
          <View style={styles.divider} />
          
          <SettingItem
            icon={<Info size={22} color={Colors.primary} />}
            title="About"
            rightElement={<ChevronRight size={20} color={Colors.textSecondary} />}
            onPress={() => {}}
            testID="setting-about"
          />
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Data</Text>
        </View>
        
        <View style={styles.card}>
          <SettingItem
            icon={<Trash2 size={22} color={Colors.danger} />}
            title="Clear All Data"
            description="Reset all app data and preferences"
            rightElement={<ChevronRight size={20} color={Colors.textSecondary} />}
            onPress={handleClearAllData}
            testID="setting-clear-data"
          />
        </View>
        
        <Text style={styles.versionText}>Memory Cleaner v1.0.0</Text>
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
  sectionHeader: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 68,
  },
  versionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
});