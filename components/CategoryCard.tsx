import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatFileSize } from '@/utils/fileSize';
import { Colors } from '@/constants/colors';
import { 
  Image, 
  AppWindow, 
  FileText, 
  Settings,
  ChevronRight,
  Video,
  Music,
  Archive,
  Copy
} from 'lucide-react-native';

interface CategoryCardProps {
  name: string;
  icon: string;
  color: string;
  size: number;
  count: number;
  onPress?: () => void;
  testID?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  icon,
  color,
  size,
  count,
  onPress,
  testID,
}) => {
  // Get the appropriate icon based on the category
  const IconComponent = () => {
    switch (icon) {
      case 'image':
        return <Image size={24} color="white" />;
      case 'video':
        return <Video size={24} color="white" />;
      case 'music':
        return <Music size={24} color="white" />;
      case 'archive':
        return <Archive size={24} color="white" />;
      case 'copy':
        return <Copy size={24} color="white" />;
      case 'app-store':
        return <AppWindow size={24} color="white" />;
      case 'file-text':
        return <FileText size={24} color="white" />;
      case 'settings':
        return <Settings size={24} color="white" />;
      default:
        return <FileText size={24} color="white" />;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <IconComponent />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>
          {formatFileSize(size)} • {count} {count === 1 ? 'item' : 'items'}
        </Text>
      </View>
      
      <ChevronRight size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  details: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});