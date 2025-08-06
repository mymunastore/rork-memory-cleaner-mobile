import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import { 
  mockMemoryStats, 
  mockFileCategories, 
  mockCleanupItems, 
  generateRandomFiles,
  MemoryStats,
  FileCategory,
  CleanupItem
} from '@/utils/mockData';

export interface File {
  id: string;
  name: string;
  type: string;
  icon: string;
  size: number;
  date: string;
}

export interface AIRecommendation {
  id: string;
  type: 'smart_cleanup' | 'usage_pattern' | 'storage_optimization' | 'performance_boost';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  potentialSavings: number;
  confidence: number;
  actions: string[];
  icon: string;
  color: string;
}

export interface AIInsight {
  id: string;
  category: 'usage' | 'storage' | 'performance' | 'security';
  title: string;
  description: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  value: number;
  unit: string;
  icon: string;
}

interface MemoryState {
  memoryStats: MemoryStats;
  fileCategories: FileCategory[];
  cleanupItems: CleanupItem[];
  largeFiles: File[];
  isScanning: boolean;
  lastScanDate: string | null;
  cleanupSize: number;
  isOptimizing: boolean;
  optimizationProgress: number;
  aiRecommendations: AIRecommendation[];
  aiInsights: AIInsight[];
  isAnalyzing: boolean;
  analysisProgress: number;
}

export const [MemoryProvider, useMemory] = createContextHook(() => {
  const [state, setState] = useState<MemoryState>({
    memoryStats: mockMemoryStats,
    fileCategories: mockFileCategories,
    cleanupItems: mockCleanupItems,
    largeFiles: generateRandomFiles(20),
    isScanning: false,
    lastScanDate: null,
    cleanupSize: 0,
    isOptimizing: false,
    optimizationProgress: 0,
    aiRecommendations: [],
    aiInsights: [],
    isAnalyzing: false,
    analysisProgress: 0,
  });

  // Load saved state from AsyncStorage
  const loadStateQuery = useQuery({
    queryKey: ['memoryState'],
    queryFn: async () => {
      const storedState = await AsyncStorage.getItem('memoryState');
      return storedState ? JSON.parse(storedState) : null;
    }
  });

  // Save state to AsyncStorage
  const saveStateMutation = useMutation({
    mutationFn: async (newState: Partial<MemoryState>) => {
      const updatedState = { ...state, ...newState };
      await AsyncStorage.setItem('memoryState', JSON.stringify(updatedState));
      return updatedState;
    }
  });

  // Initialize state from storage
  useEffect(() => {
    if (loadStateQuery.data) {
      setState(prevState => ({
        ...prevState,
        ...loadStateQuery.data,
      }));
    }
  }, [loadStateQuery.data]);

  // Calculate total cleanup size
  useEffect(() => {
    const total = state.cleanupItems.reduce((sum, item) => sum + item.size, 0);
    setState(prevState => ({
      ...prevState,
      cleanupSize: total,
    }));
  }, [state.cleanupItems]);

  const startScan = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setState(prevState => ({
      ...prevState,
      isScanning: true,
    }));

    // Simulate scanning process
    await new Promise(resolve => setTimeout(resolve, 2500));

    const newState = {
      isScanning: false,
      lastScanDate: new Date().toISOString(),
      largeFiles: generateRandomFiles(20),
      // Slightly modify stats to simulate finding new files
      memoryStats: {
        ...state.memoryStats,
        usedMemory: state.memoryStats.usedMemory + (Math.random() * 1024 * 1024 * 100),
        availableMemory: state.memoryStats.availableMemory - (Math.random() * 1024 * 1024 * 100),
      },
    };

    setState(prevState => ({
      ...prevState,
      ...newState,
    }));

    saveStateMutation.mutate(newState);
  };

  const optimizeMemory = async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setState(prevState => ({
      ...prevState,
      isOptimizing: true,
      optimizationProgress: 0,
    }));

    // Simulate optimization process with progress updates
    for (let i = 1; i <= 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setState(prevState => ({
        ...prevState,
        optimizationProgress: i / 10,
      }));
    }

    // Calculate new memory stats after optimization
    const freedSpace = state.cleanupSize;
    const newState = {
      isOptimizing: false,
      optimizationProgress: 0,
      memoryStats: {
        ...state.memoryStats,
        usedMemory: state.memoryStats.usedMemory - freedSpace,
        availableMemory: state.memoryStats.availableMemory + freedSpace,
      },
      // Generate new cleanup items with smaller sizes
      cleanupItems: state.cleanupItems.map(item => ({
        ...item,
        size: item.size * 0.1, // Reduce size by 90%
      })),
    };

    setState(prevState => ({
      ...prevState,
      ...newState,
    }));

    saveStateMutation.mutate(newState);
  };

  const generateAIAnalysis = async () => {
    setState(prevState => ({
      ...prevState,
      isAnalyzing: true,
      analysisProgress: 0,
    }));

    try {
      // Simulate AI analysis progress
      for (let i = 1; i <= 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 400));
        setState(prevState => ({
          ...prevState,
          analysisProgress: i / 5,
        }));
      }

      // Prepare data for AI analysis
      const analysisData = {
        memoryStats: state.memoryStats,
        fileCategories: state.fileCategories,
        cleanupItems: state.cleanupItems,
        largeFiles: state.largeFiles.slice(0, 10), // Send top 10 largest files
        deviceInfo: {
          platform: Platform.OS,
          totalMemory: state.memoryStats.totalMemory,
          usagePercentage: (state.memoryStats.usedMemory / state.memoryStats.totalMemory) * 100,
        }
      };

      const messages = [
        {
          role: 'system' as const,
          content: `You are an AI memory optimization expert. Analyze the device storage data and provide intelligent recommendations and insights. Return a JSON response with two arrays: 'recommendations' and 'insights'. Each recommendation should have: id, type, title, description, impact, potentialSavings (in bytes), confidence (0-1), actions (array), icon (lucide icon name), color (hex). Each insight should have: id, category, title, description, trend, value, unit, icon (lucide icon name). Focus on actionable, specific advice.`
        },
        {
          role: 'user' as const,
          content: `Analyze this device storage data and provide smart recommendations:\n\n${JSON.stringify(analysisData, null, 2)}`
        }
      ];

      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error('AI analysis failed');
      }

      const result = await response.json();
      const aiData = JSON.parse(result.completion);

      const newState = {
        isAnalyzing: false,
        analysisProgress: 0,
        aiRecommendations: aiData.recommendations || [],
        aiInsights: aiData.insights || [],
      };

      setState(prevState => ({
        ...prevState,
        ...newState,
      }));

      saveStateMutation.mutate(newState);

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      setState(prevState => ({
        ...prevState,
        isAnalyzing: false,
        analysisProgress: 0,
      }));

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const applyAIRecommendation = async (recommendationId: string) => {
    const recommendation = state.aiRecommendations.find(r => r.id === recommendationId);
    if (!recommendation) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Simulate applying the recommendation
    setState(prevState => ({
      ...prevState,
      isOptimizing: true,
      optimizationProgress: 0,
    }));

    for (let i = 1; i <= 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setState(prevState => ({
        ...prevState,
        optimizationProgress: i / 10,
      }));
    }

    // Apply the optimization based on recommendation
    const newMemoryStats = {
      ...state.memoryStats,
      usedMemory: Math.max(
        state.memoryStats.usedMemory - recommendation.potentialSavings,
        state.memoryStats.totalMemory * 0.1 // Don't go below 10% usage
      ),
      availableMemory: Math.min(
        state.memoryStats.availableMemory + recommendation.potentialSavings,
        state.memoryStats.totalMemory * 0.9 // Don't exceed 90% available
      ),
    };

    const newState = {
      isOptimizing: false,
      optimizationProgress: 0,
      memoryStats: newMemoryStats,
      // Remove the applied recommendation
      aiRecommendations: state.aiRecommendations.filter(r => r.id !== recommendationId),
    };

    setState(prevState => ({
      ...prevState,
      ...newState,
    }));

    saveStateMutation.mutate(newState);

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return {
    ...state,
    startScan,
    optimizeMemory,
    generateAIAnalysis,
    applyAIRecommendation,
    isLoading: loadStateQuery.isLoading,
  };
});