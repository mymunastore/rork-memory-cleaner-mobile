import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  HardDrive, 
  Folder, 
  FileText, 
  Image, 
  Video, 
  Music,
  Archive,
  Trash2,
  Search,
  Filter,
  Copy,
  X,
  CheckCircle,
  Eye,
  Download
} from 'lucide-react-native';
import { useMemory } from '@/hooks/useMemoryStore';
import { FileItem } from '@/components/FileItem';
import { CategoryCard } from '@/components/CategoryCard';
import { formatFileSize } from '@/utils/fileSize';
import { Colors } from '@/constants/colors';
import AnimatedBackground from '@/components/AnimatedBackground';

interface FileCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  size: number;
  count: number;
  color: string;
}

interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  lastModified: Date;
  category: string;
  selected?: boolean;
  isDuplicate?: boolean;
  duplicateGroup?: string;
}

interface DuplicateGroup {
  id: string;
  files: FileData[];
  totalSize: number;
  canSave: number;
}

const getFileIcon = (type: string): string => {
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  if (type.startsWith('audio/')) return 'music';
  if (type.includes('zip') || type.includes('archive')) return 'archive';
  return 'document';
};

export default function FilesScreen() {
  const { memoryStats } = useMemory();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [files, setFiles] = useState<FileData[]>([]);
  const [categories, setCategories] = useState<FileCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date'>('size');

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (showDuplicates) {
      findDuplicates();
    }
  }, [files, showDuplicates]);

  const loadFiles = async () => {
    setIsLoading(true);
    
    // Mock file data with duplicates
    const mockFiles: FileData[] = [
      {
        id: '1',
        name: 'IMG_20231201_143022.jpg',
        size: 2.4 * 1024 * 1024,
        type: 'image/jpeg',
        path: '/storage/emulated/0/DCIM/Camera/',
        lastModified: new Date('2023-12-01'),
        category: 'images',
        selected: false,
      },
      {
        id: '2',
        name: 'IMG_20231201_143022 (1).jpg',
        size: 2.4 * 1024 * 1024,
        type: 'image/jpeg',
        path: '/storage/emulated/0/Downloads/',
        lastModified: new Date('2023-12-01'),
        category: 'images',
        selected: false,
        isDuplicate: true,
        duplicateGroup: 'group1',
      },
      {
        id: '3',
        name: 'video_20231130.mp4',
        size: 45.6 * 1024 * 1024,
        type: 'video/mp4',
        path: '/storage/emulated/0/DCIM/Camera/',
        lastModified: new Date('2023-11-30'),
        category: 'videos',
        selected: false,
      },
      {
        id: '4',
        name: 'song.mp3',
        size: 4.2 * 1024 * 1024,
        type: 'audio/mp3',
        path: '/storage/emulated/0/Music/',
        lastModified: new Date('2023-11-25'),
        category: 'music',
        selected: false,
      },
      {
        id: '5',
        name: 'song (copy).mp3',
        size: 4.2 * 1024 * 1024,
        type: 'audio/mp3',
        path: '/storage/emulated/0/Downloads/',
        lastModified: new Date('2023-11-25'),
        category: 'music',
        selected: false,
        isDuplicate: true,
        duplicateGroup: 'group2',
      },
      {
        id: '6',
        name: 'document.pdf',
        size: 1.8 * 1024 * 1024,
        type: 'application/pdf',
        path: '/storage/emulated/0/Documents/',
        lastModified: new Date('2023-11-20'),
        category: 'documents',
        selected: false,
      },
      {
        id: '7',
        name: 'archive.zip',
        size: 12.3 * 1024 * 1024,
        type: 'application/zip',
        path: '/storage/emulated/0/Downloads/',
        lastModified: new Date('2023-11-15'),
        category: 'archives',
        selected: false,
      },
    ];

    const mockCategories: FileCategory[] = [
      {
        id: 'images',
        name: 'Images',
        icon: Image,
        size: mockFiles.filter(f => f.category === 'images').reduce((sum, f) => sum + f.size, 0),
        count: mockFiles.filter(f => f.category === 'images').length,
        color: Colors.accent,
      },
      {
        id: 'videos',
        name: 'Videos',
        icon: Video,
        size: mockFiles.filter(f => f.category === 'videos').reduce((sum, f) => sum + f.size, 0),
        count: mockFiles.filter(f => f.category === 'videos').length,
        color: Colors.primary,
      },
      {
        id: 'music',
        name: 'Music',
        icon: Music,
        size: mockFiles.filter(f => f.category === 'music').reduce((sum, f) => sum + f.size, 0),
        count: mockFiles.filter(f => f.category === 'music').length,
        color: Colors.warning,
      },
      {
        id: 'documents',
        name: 'Documents',
        icon: FileText,
        size: mockFiles.filter(f => f.category === 'documents').reduce((sum, f) => sum + f.size, 0),
        count: mockFiles.filter(f => f.category === 'documents').length,
        color: Colors.textSecondary,
      },
      {
        id: 'archives',
        name: 'Archives',
        icon: Archive,
        size: mockFiles.filter(f => f.category === 'archives').reduce((sum, f) => sum + f.size, 0),
        count: mockFiles.filter(f => f.category === 'archives').length,
        color: Colors.danger,
      },
      {
        id: 'duplicates',
        name: 'Duplicates',
        icon: Copy,
        size: mockFiles.filter(f => f.isDuplicate).reduce((sum, f) => sum + f.size, 0),
        count: mockFiles.filter(f => f.isDuplicate).length,
        color: Colors.secondary,
      },
    ];

    await new Promise(resolve => setTimeout(resolve, 1000));
    setFiles(mockFiles);
    setCategories(mockCategories);
    setIsLoading(false);
  };

  const findDuplicates = () => {
    const groups: DuplicateGroup[] = [];
    const duplicateMap = new Map<string, FileData[]>();
    
    files.forEach(file => {
      if (file.isDuplicate && file.duplicateGroup) {
        if (!duplicateMap.has(file.duplicateGroup)) {
          duplicateMap.set(file.duplicateGroup, []);
        }
        duplicateMap.get(file.duplicateGroup)!.push(file);
      }
    });
    
    duplicateMap.forEach((groupFiles, groupId) => {
      if (groupFiles.length > 1) {
        const totalSize = groupFiles.reduce((sum, file) => sum + file.size, 0);
        const canSave = totalSize - Math.min(...groupFiles.map(f => f.size));
        
        groups.push({
          id: groupId,
          files: groupFiles,
          totalSize,
          canSave,
        });
      }
    });
    
    setDuplicateGroups(groups);
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
    
    setFiles(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { ...file, selected: !file.selected }
          : file
      )
    );
  };

  const selectAllInCategory = () => {
    const filteredFiles = getFilteredFiles();
    const allSelected = filteredFiles.every(file => selectedFiles.includes(file.id));
    
    if (allSelected) {
      setSelectedFiles([]);
      setFiles(prev => prev.map(file => ({ ...file, selected: false })));
    } else {
      const newSelected = filteredFiles.map(file => file.id);
      setSelectedFiles(newSelected);
      setFiles(prev => 
        prev.map(file => ({
          ...file,
          selected: filteredFiles.some(f => f.id === file.id)
        }))
      );
    }
  };

  const deleteSelectedFiles = () => {
    if (selectedFiles.length === 0) {
      Alert.alert('No Files Selected', 'Please select files to delete.');
      return;
    }
    
    const totalSize = files
      .filter(file => selectedFiles.includes(file.id))
      .reduce((sum, file) => sum + file.size, 0);
    
    Alert.alert(
      'Delete Files',
      `Delete ${selectedFiles.length} files? This will free up ${formatFileSize(totalSize)}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
            setSelectedFiles([]);
            Alert.alert('Success', `Deleted ${selectedFiles.length} files.`);
          }
        }
      ]
    );
  };

  const getFilteredFiles = () => {
    let filtered = files;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'duplicates') {
        filtered = filtered.filter(file => file.isDuplicate);
      } else {
        filtered = filtered.filter(file => file.category === selectedCategory);
      }
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'date':
          return b.lastModified.getTime() - a.lastModified.getTime();
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const filteredFiles = getFilteredFiles();

  if (isLoading) {
    return (
      <AnimatedBackground>
        <View style={styles.loadingContainer}>
          <HardDrive color={Colors.primary} size={48} />
          <Text style={styles.loadingText}>Loading files...</Text>
        </View>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Storage Overview */}
          <View style={styles.storageOverview}>
            <LinearGradient
              colors={Colors.gradientPrimary}
              style={styles.storageGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <HardDrive color={Colors.text} size={32} />
              <View style={styles.storageInfo}>
                <Text style={styles.storageTitle}>Storage Usage</Text>
                <Text style={styles.storageSubtitle}>
                  {formatFileSize(memoryStats.usedMemory)} of {formatFileSize(memoryStats.totalMemory)} used
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Search and Controls */}
          <View style={styles.controlsSection}>
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Search color={Colors.textSecondary} size={20} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search files..."
                  placeholderTextColor={Colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  testID="file-search-input"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <X color={Colors.textSecondary} size={20} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            {selectedFiles.length > 0 && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={selectAllInCategory}
                  testID="select-all-files-button"
                >
                  <Text style={styles.actionButtonText}>Select All</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={deleteSelectedFiles}
                  testID="delete-files-button"
                >
                  <Trash2 color={Colors.text} size={16} />
                  <Text style={styles.actionButtonText}>Delete ({selectedFiles.length})</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>File Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  selectedCategory === 'all' && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory('all')}
                testID="category-all"
              >
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === 'all' && styles.categoryChipTextActive
                ]}>All Files</Text>
              </TouchableOpacity>
              
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category.id && styles.categoryChipActive
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                  testID={`category-${category.id}`}
                >
                  <category.icon color={category.color} size={16} />
                  <Text style={[
                    styles.categoryChipText,
                    selectedCategory === category.id && styles.categoryChipTextActive
                  ]}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Duplicate Groups */}
          {selectedCategory === 'duplicates' && duplicateGroups.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Duplicate Groups</Text>
              {duplicateGroups.map((group) => (
                <View key={group.id} style={styles.duplicateGroup}>
                  <View style={styles.duplicateHeader}>
                    <Copy color={Colors.secondary} size={20} />
                    <Text style={styles.duplicateTitle}>
                      {group.files.length} duplicates • Can save {formatFileSize(group.canSave)}
                    </Text>
                  </View>
                  {group.files.map((file) => (
                    <TouchableOpacity
                      key={file.id}
                      style={[
                        styles.duplicateFile,
                        file.selected && styles.duplicateFileSelected
                      ]}
                      onPress={() => toggleFileSelection(file.id)}
                      testID={`duplicate-file-${file.id}`}
                    >
                      <View style={styles.duplicateFileContent}>
                        <Text style={styles.duplicateFileName}>{file.name}</Text>
                        <Text style={styles.duplicateFilePath}>{file.path}</Text>
                        <Text style={styles.duplicateFileSize}>{formatFileSize(file.size)}</Text>
                      </View>
                      <View style={[
                        styles.checkbox,
                        file.selected && styles.checkboxSelected
                      ]}>
                        {file.selected && (
                          <CheckCircle color={Colors.accent} size={20} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Category Cards */}
          {selectedCategory === 'all' && (
            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  title={category.name}
                  size={category.size}
                  count={category.count}
                  icon={category.icon}
                  color={category.color}
                  onPress={() => setSelectedCategory(category.id)}
                  testID={`category-card-${category.id}`}
                />
              ))}
            </View>
          )}

          {/* Files List */}
          {selectedCategory !== 'duplicates' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {selectedCategory === 'all' ? 'All Files' : 
                   categories.find(c => c.id === selectedCategory)?.name || 'Files'}
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {filteredFiles.length} files
                </Text>
              </View>
              
              <FlatList
                data={filteredFiles}
                keyExtractor={(item) => item.id}
                renderItem={({ item: file }) => (
                  <TouchableOpacity
                    style={[
                      styles.fileItemContainer,
                      file.selected && styles.fileItemSelected
                    ]}
                    onPress={() => toggleFileSelection(file.id)}
                    testID={`file-item-${file.id}`}
                  >
                    <FileItem
                      name={file.name}
                      size={file.size}
                      type={file.type}
                      date={file.lastModified.toISOString()}
                      icon={getFileIcon(file.type)}
                    />
                    {file.isDuplicate && (
                      <View style={styles.duplicateBadge}>
                        <Copy color={Colors.secondary} size={12} />
                      </View>
                    )}
                    <View style={[
                      styles.checkbox,
                      file.selected && styles.checkboxSelected
                    ]}>
                      {file.selected && (
                        <CheckCircle color={Colors.accent} size={20} />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                scrollEnabled={false}
              />
            </View>
          )}
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
  storageOverview: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  storageGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  storageInfo: {
    flex: 1,
  },
  storageTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  storageSubtitle: {
    fontSize: 14,
    color: Colors.text,
    opacity: 0.8,
  },
  controlsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchBar: {
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
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  deleteButton: {
    backgroundColor: Colors.danger,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.card,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: Colors.accent,
  },
  categoryChipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  categoryChipTextActive: {
    color: Colors.text,
    fontWeight: '600' as const,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  duplicateGroup: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  duplicateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  duplicateTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  duplicateFile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  duplicateFileSelected: {
    borderColor: Colors.accent,
    backgroundColor: `${Colors.accent}10`,
  },
  duplicateFileContent: {
    flex: 1,
  },
  duplicateFileName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  duplicateFilePath: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  duplicateFileSize: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  fileItemContainer: {
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 12,
    marginBottom: 8,
  },
  fileItemSelected: {
    borderColor: Colors.accent,
    backgroundColor: `${Colors.accent}10`,
  },
  duplicateBadge: {
    position: 'absolute',
    top: 8,
    right: 40,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 4,
  },
  checkbox: {
    position: 'absolute',
    top: 16,
    right: 16,
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
});