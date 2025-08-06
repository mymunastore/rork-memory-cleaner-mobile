import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Smartphone, 
  Search, 
  Filter, 
  Trash2, 
  Clock, 
  HardDrive,
  ChevronRight,
  X,
  CheckCircle
} from 'lucide-react-native';
import { formatFileSize } from '@/utils/fileSize';
import { Colors } from '@/constants/colors';
import AnimatedBackground from '@/components/AnimatedBackground';

interface AppInfo {
  id: string;
  name: string;
  packageName: string;
  size: number;
  cacheSize: number;
  lastUsed: Date;
  icon: string;
  isSystemApp: boolean;
  selected: boolean;
}

type FilterType = 'all' | 'large' | 'unused' | 'cache-heavy';
type SortType = 'name' | 'size' | 'lastUsed';

export default function AppManagerScreen() {
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [filteredApps, setFilteredApps] = useState<AppInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('size');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCount, setSelectedCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadApps();
  }, []);

  useEffect(() => {
    filterAndSortApps();
  }, [apps, searchQuery, activeFilter, sortBy]);

  useEffect(() => {
    const count = filteredApps.filter(app => app.selected).length;
    setSelectedCount(count);
  }, [filteredApps]);

  const loadApps = async () => {
    setIsLoading(true);
    
    // Mock app data
    const mockApps: AppInfo[] = [
      {
        id: '1',
        name: 'Instagram',
        packageName: 'com.instagram.android',
        size: 245 * 1024 * 1024,
        cacheSize: 89 * 1024 * 1024,
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        icon: '📷',
        isSystemApp: false,
        selected: false,
      },
      {
        id: '2',
        name: 'WhatsApp',
        packageName: 'com.whatsapp',
        size: 156 * 1024 * 1024,
        cacheSize: 234 * 1024 * 1024,
        lastUsed: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        icon: '💬',
        isSystemApp: false,
        selected: false,
      },
      {
        id: '3',
        name: 'Chrome',
        packageName: 'com.android.chrome',
        size: 189 * 1024 * 1024,
        cacheSize: 456 * 1024 * 1024,
        lastUsed: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        icon: '🌐',
        isSystemApp: false,
        selected: false,
      },
      {
        id: '4',
        name: 'YouTube',
        packageName: 'com.google.android.youtube',
        size: 298 * 1024 * 1024,
        cacheSize: 567 * 1024 * 1024,
        lastUsed: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        icon: '📺',
        isSystemApp: false,
        selected: false,
      },
      {
        id: '5',
        name: 'Spotify',
        packageName: 'com.spotify.music',
        size: 134 * 1024 * 1024,
        cacheSize: 23 * 1024 * 1024,
        lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        icon: '🎵',
        isSystemApp: false,
        selected: false,
      },
      {
        id: '6',
        name: 'Facebook',
        packageName: 'com.facebook.katana',
        size: 267 * 1024 * 1024,
        cacheSize: 123 * 1024 * 1024,
        lastUsed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        icon: '📘',
        isSystemApp: false,
        selected: false,
      },
    ];

    await new Promise(resolve => setTimeout(resolve, 1000));
    setApps(mockApps);
    setIsLoading(false);
  };

  const filterAndSortApps = () => {
    let filtered = [...apps];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.packageName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case 'large':
        filtered = filtered.filter(app => app.size > 100 * 1024 * 1024); // > 100MB
        break;
      case 'unused':
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(app => app.lastUsed < weekAgo);
        break;
      case 'cache-heavy':
        filtered = filtered.filter(app => app.cacheSize > 50 * 1024 * 1024); // > 50MB cache
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'lastUsed':
          return b.lastUsed.getTime() - a.lastUsed.getTime();
        default:
          return 0;
      }
    });

    setFilteredApps(filtered);
  };

  const toggleAppSelection = (appId: string) => {
    setFilteredApps(prev =>
      prev.map(app =>
        app.id === appId ? { ...app, selected: !app.selected } : app
      )
    );
    
    setApps(prev =>
      prev.map(app =>
        app.id === appId ? { ...app, selected: !app.selected } : app
      )
    );
  };

  const selectAll = () => {
    const allSelected = filteredApps.every(app => app.selected);
    const newSelection = !allSelected;
    
    setFilteredApps(prev =>
      prev.map(app => ({ ...app, selected: newSelection }))
    );
    
    setApps(prev =>
      prev.map(app => {
        const isInFiltered = filteredApps.some(filtered => filtered.id === app.id);
        return isInFiltered ? { ...app, selected: newSelection } : app;
      })
    );
  };

  const clearCache = async () => {
    const selectedApps = filteredApps.filter(app => app.selected);
    if (selectedApps.length === 0) {
      Alert.alert('No Apps Selected', 'Please select apps to clear cache.');
      return;
    }

    const totalCacheSize = selectedApps.reduce((sum, app) => sum + app.cacheSize, 0);
    
    Alert.alert(
      'Clear Cache',
      `Clear cache for ${selectedApps.length} apps? This will free up ${formatFileSize(totalCacheSize)}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: async () => {
            // Simulate cache clearing
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setApps(prev =>
              prev.map(app =>
                selectedApps.some(selected => selected.id === app.id)
                  ? { ...app, cacheSize: 0, selected: false }
                  : app
              )
            );
            
            Alert.alert('Success', `Cleared cache for ${selectedApps.length} apps.`);
          }
        }
      ]
    );
  };

  const uninstallApps = async () => {
    const selectedApps = filteredApps.filter(app => app.selected && !app.isSystemApp);
    if (selectedApps.length === 0) {
      Alert.alert('No Apps Selected', 'Please select non-system apps to uninstall.');
      return;
    }

    Alert.alert(
      'Uninstall Apps',
      `Uninstall ${selectedApps.length} apps? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Uninstall',
          style: 'destructive',
          onPress: async () => {
            // Simulate uninstallation
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const uninstalledIds = selectedApps.map(app => app.id);
            setApps(prev => prev.filter(app => !uninstalledIds.includes(app.id)));
            
            Alert.alert('Success', `Uninstalled ${selectedApps.length} apps.`);
          }
        }
      ]
    );
  };

  const getLastUsedText = (lastUsed: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - lastUsed.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}m ago`;
  };

  const renderApp = ({ item }: { item: AppInfo }) => (
    <TouchableOpacity
      style={[
        styles.appItem,
        item.selected && styles.appItemSelected
      ]}
      onPress={() => toggleAppSelection(item.id)}
      testID={`app-item-${item.id}`}
    >
      <View style={styles.appIcon}>
        <Text style={styles.appIconText}>{item.icon}</Text>
      </View>
      
      <View style={styles.appContent}>
        <Text style={styles.appName}>{item.name}</Text>
        <Text style={styles.appPackage}>{item.packageName}</Text>
        <View style={styles.appStats}>
          <Text style={styles.appSize}>{formatFileSize(item.size)}</Text>
          <Text style={styles.appDivider}>•</Text>
          <Text style={styles.appCache}>Cache: {formatFileSize(item.cacheSize)}</Text>
          <Text style={styles.appDivider}>•</Text>
          <Text style={styles.appLastUsed}>{getLastUsedText(item.lastUsed)}</Text>
        </View>
      </View>
      
      <View style={[
        styles.checkbox,
        item.selected && styles.checkboxSelected
      ]}>
        {item.selected && (
          <CheckCircle color={Colors.accent} size={20} />
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <AnimatedBackground>
        <View style={styles.loadingContainer}>
          <Smartphone color={Colors.primary} size={48} />
          <Text style={styles.loadingText}>Loading installed apps...</Text>
        </View>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>App Manager</Text>
          <Text style={styles.headerSubtitle}>
            {apps.length} apps installed • {selectedCount} selected
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search color={Colors.textSecondary} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search apps..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="app-search-input"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X color={Colors.textSecondary} size={20} />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
            testID="filter-button"
          >
            <Filter color={Colors.accent} size={20} />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { key: 'all', label: 'All Apps' },
                { key: 'large', label: 'Large Apps' },
                { key: 'unused', label: 'Unused' },
                { key: 'cache-heavy', label: 'Cache Heavy' },
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.filterChip,
                    activeFilter === filter.key && styles.filterChipActive
                  ]}
                  onPress={() => setActiveFilter(filter.key as FilterType)}
                  testID={`filter-${filter.key}`}
                >
                  <Text style={[
                    styles.filterChipText,
                    activeFilter === filter.key && styles.filterChipTextActive
                  ]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.sortContainer}>
              <Text style={styles.sortLabel}>Sort by:</Text>
              {[
                { key: 'size', label: 'Size' },
                { key: 'name', label: 'Name' },
                { key: 'lastUsed', label: 'Last Used' },
              ].map((sort) => (
                <TouchableOpacity
                  key={sort.key}
                  style={[
                    styles.sortOption,
                    sortBy === sort.key && styles.sortOptionActive
                  ]}
                  onPress={() => setSortBy(sort.key as SortType)}
                  testID={`sort-${sort.key}`}
                >
                  <Text style={[
                    styles.sortOptionText,
                    sortBy === sort.key && styles.sortOptionTextActive
                  ]}>
                    {sort.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* App List */}
        <FlatList
          data={filteredApps}
          renderItem={renderApp}
          keyExtractor={(item) => item.id}
          style={styles.appList}
          contentContainerStyle={styles.appListContent}
          showsVerticalScrollIndicator={false}
          testID="app-list"
        />

        {/* Action Buttons */}
        {selectedCount > 0 && (
          <View style={styles.actionBar}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={selectAll}
              testID="select-all-button"
            >
              <Text style={styles.actionButtonText}>
                {filteredApps.every(app => app.selected) ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.cacheButton]}
              onPress={clearCache}
              testID="clear-cache-button"
            >
              <LinearGradient
                colors={Colors.gradientSecondary}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <HardDrive color={Colors.text} size={16} />
                <Text style={styles.actionButtonText}>Clear Cache</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.uninstallButton]}
              onPress={uninstallApps}
              testID="uninstall-button"
            >
              <LinearGradient
                colors={[Colors.danger, '#FF6B6B']}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Trash2 color={Colors.text} size={16} />
                <Text style={styles.actionButtonText}>Uninstall</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.card,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.card,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.accent,
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  filterChipTextActive: {
    color: Colors.text,
    fontWeight: '600' as const,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  sortLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  sortOptionActive: {
    backgroundColor: Colors.primary,
  },
  sortOptionText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  sortOptionTextActive: {
    color: Colors.text,
    fontWeight: '600' as const,
  },
  appList: {
    flex: 1,
  },
  appListContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  appItemSelected: {
    borderColor: Colors.accent,
    backgroundColor: `${Colors.accent}10`,
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appIconText: {
    fontSize: 24,
  },
  appContent: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  appPackage: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  appStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appSize: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  appCache: {
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '500' as const,
  },
  appLastUsed: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  appDivider: {
    fontSize: 12,
    color: Colors.textMuted,
    marginHorizontal: 6,
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
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cacheButton: {},
  uninstallButton: {},
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
});