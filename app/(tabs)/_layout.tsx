import { Tabs } from "expo-router";
import { Home, HardDrive, Settings, Brain } from "lucide-react-native";
import React from "react";
import { MemoryProvider } from "@/hooks/useMemoryStore";
import { Colors } from "@/constants/colors";


export default function TabLayout() {
  return (
    <MemoryProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.glow,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            paddingTop: 8,
            paddingBottom: 8,
            height: 80,
          },
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: '700' as const,
            color: Colors.text,
            fontSize: 18,
          },
          headerShadowVisible: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="ai"
          options={{
            title: "AI Assistant",
            tabBarIcon: ({ color }) => <Brain color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="files"
          options={{
            title: "Files",
            tabBarIcon: ({ color }) => <HardDrive color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => <Settings color={color} size={24} />,
          }}
        />
      </Tabs>
    </MemoryProvider>
  );
}