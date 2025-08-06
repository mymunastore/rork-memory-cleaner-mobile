import { getRandomFileSize } from './fileSize';

export interface MemoryStats {
  totalMemory: number;
  usedMemory: number;
  availableMemory: number;
}

export interface FileCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  size: number;
  count: number;
}

export interface CleanupItem {
  id: string;
  title: string;
  description: string;
  size: number;
  icon: string;
  color: string;
}

// Mock memory stats in bytes
export const mockMemoryStats: MemoryStats = {
  totalMemory: 64 * 1024 * 1024 * 1024, // 64 GB
  usedMemory: 38 * 1024 * 1024 * 1024, // 38 GB
  availableMemory: 26 * 1024 * 1024 * 1024, // 26 GB
};

export const mockFileCategories: FileCategory[] = [
  {
    id: '1',
    name: 'Photos & Videos',
    icon: 'image',
    color: '#FF9500',
    size: 18 * 1024 * 1024 * 1024, // 18 GB
    count: 2345,
  },
  {
    id: '2',
    name: 'Apps',
    icon: 'app-store',
    color: '#5856D6',
    size: 12 * 1024 * 1024 * 1024, // 12 GB
    count: 48,
  },
  {
    id: '3',
    name: 'Documents',
    icon: 'file-text',
    color: '#4CD964',
    size: 5 * 1024 * 1024 * 1024, // 5 GB
    count: 156,
  },
  {
    id: '4',
    name: 'System',
    icon: 'settings',
    color: '#8E8E93',
    size: 3 * 1024 * 1024 * 1024, // 3 GB
    count: 1,
  },
];

export const mockCleanupItems: CleanupItem[] = [
  {
    id: '1',
    title: 'Temporary Files',
    description: 'Cache and temporary files that can be safely removed',
    size: 1.2 * 1024 * 1024 * 1024, // 1.2 GB
    icon: 'trash-2',
    color: '#FF3B30',
  },
  {
    id: '2',
    title: 'Duplicate Photos',
    description: '124 duplicate photos found',
    size: 850 * 1024 * 1024, // 850 MB
    icon: 'copy',
    color: '#FF9500',
  },
  {
    id: '3',
    title: 'Unused Apps',
    description: '8 apps not used in the last 30 days',
    size: 3.4 * 1024 * 1024 * 1024, // 3.4 GB
    icon: 'package-x',
    color: '#5856D6',
  },
  {
    id: '4',
    title: 'Downloads',
    description: 'Old downloaded files',
    size: 645 * 1024 * 1024, // 645 MB
    icon: 'download',
    color: '#4CD964',
  },
];

export const generateRandomFiles = (count: number) => {
  const fileTypes = [
    { ext: 'jpg', type: 'Photo', icon: 'image' },
    { ext: 'mp4', type: 'Video', icon: 'video' },
    { ext: 'pdf', type: 'Document', icon: 'file-text' },
    { ext: 'mp3', type: 'Audio', icon: 'music' },
    { ext: 'zip', type: 'Archive', icon: 'archive' },
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    
    return {
      id: `file-${i}`,
      name: `File_${i + 1}.${fileType.ext}`,
      type: fileType.type,
      icon: fileType.icon,
      size: getRandomFileSize(1024 * 1024, 500 * 1024 * 1024), // 1MB to 500MB
      date: date.toISOString(),
    };
  }).sort((a, b) => b.size - a.size); // Sort by size, largest first
};