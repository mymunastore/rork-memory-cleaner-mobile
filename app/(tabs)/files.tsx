import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useMemory } from '@/hooks/useMemoryStore';
import { CategoryCard } from '@/components/CategoryCard';
import { FileItem } from '@/components/FileItem';
import { Colors } from '@/constants/colors';
import { ArrowDownAZ, ArrowDown01, Clock } from 'lucide-react-native';

type SortOption = 'size' | 'name' | 'date';

export default function FilesScreen() {
  const { fileCategories, largeFiles, isLoading } = useMemory();
  const [sortBy, setSortBy] = useState<SortOption>('size');
  
  const sortedFiles = [...largeFiles].sort((a, b) => {
    if (sortBy === 'size') {
      return b.size - a.size;
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        
        {fileCategories.map((category) => (
          <CategoryCard
            key={category.id}
            name={category.name}
            icon={category.icon}
            color={category.color}
            size={category.size}
            count={category.count}
            testID={`category-${category.id}`}
          />
        ))}
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Large Files</Text>
          <View style={styles.sortContainer}>
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'size' && styles.sortButtonActive]} 
              onPress={() => setSortBy('size')}
            >
              <ArrowDown01 size={16} color={sortBy === 'size' ? Colors.primary : Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'name' && styles.sortButtonActive]} 
              onPress={() => setSortBy('name')}
            >
              <ArrowDownAZ size={16} color={sortBy === 'name' ? Colors.primary : Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'date' && styles.sortButtonActive]} 
              onPress={() => setSortBy('date')}
            >
              <Clock size={16} color={sortBy === 'date' ? Colors.primary : Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {sortedFiles.map((file) => (
          <FileItem
            key={file.id}
            name={file.name}
            type={file.type}
            size={file.size}
            date={file.date}
            icon={file.icon}
            testID={`file-${file.id}`}
          />
        ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  sortContainer: {
    flexDirection: 'row',
  },
  sortButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sortButtonActive: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
});