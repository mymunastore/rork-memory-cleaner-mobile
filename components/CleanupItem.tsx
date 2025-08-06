import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatFileSize } from '@/utils/fileSize';
import Colors from '@/constants/colors';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react-native';

interface CleanupItemProps {
  title: string;
  description: string;
  size: number;
  icon: string;
  color: string;
  selected?: boolean;
  onToggle?: () => void;
  testID?: string;
}

export const CleanupItem: React.FC<CleanupItemProps> = ({
  title,
  description,
  size,
  icon,
  color,
  selected = true,
  onToggle,
  testID,
}) => {
  // Dynamically import the icon based on the icon name
  const IconComponent = () => {
    // This is a simplified version - in a real app, you'd import all possible icons
    // and select the right one based on the icon name
    return <Trash2 size={24} color={color} />;
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onToggle}
      activeOpacity={0.7}
      testID={testID}
    >
      <View style={styles.iconContainer}>
        <IconComponent />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      
      <View style={styles.rightContainer}>
        <Text style={styles.size}>{formatFileSize(size)}</Text>
        {onToggle && (
          selected ? 
            <CheckCircle2 size={20} color={Colors.primary} /> : 
            <Circle size={20} color={Colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  size: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
});