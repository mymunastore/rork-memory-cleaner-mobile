import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatFileSize } from '@/utils/fileSize';
import { Colors } from '@/constants/colors';
import { File, Image, Music, Video, Archive } from 'lucide-react-native';

interface FileItemProps {
  name: string;
  type: string;
  size: number;
  path: string;
  date: string;
  icon: string;
  onPress?: () => void;
  testID?: string;
}

export const FileItem: React.FC<FileItemProps> = ({
  name,
  type,
  size,
  path,
  date,
  icon,
  onPress,
  testID,
}) => {
  // Get the appropriate icon based on the file type
  const IconComponent = () => {
    switch (icon) {
      case 'image':
        return <Image size={24} color={Colors.primary} />;
      case 'video':
        return <Video size={24} color="#FF9500" />;
      case 'music':
        return <Music size={24} color="#FF2D55" />;
      case 'archive':
        return <Archive size={24} color="#5856D6" />;
      default:
        return <File size={24} color="#4CD964" />;
    }
  };

  // Format the date
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID}
    >
      <View style={styles.iconContainer}>
        <IconComponent />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="middle">
          {name}
        </Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.type}>{type}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>
      
      <Text style={styles.size}>{formatFileSize(size)}</Text>
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
    marginVertical: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  dot: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginHorizontal: 4,
  },
  date: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  size: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 8,
  },
});