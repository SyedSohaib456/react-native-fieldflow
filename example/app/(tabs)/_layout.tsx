import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { ShowcaseColors as C } from '@/constants/showcase-theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: C.textPrimary,
        tabBarInactiveTintColor: C.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Showcase',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="kitchen-sink"
        options={{
          title: 'Kitchen Sink',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="layers-outline" size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stress-test"
        options={{
          title: 'Stress Test',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer-outline" size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="playground"
        options={{
          title: 'Playground',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="color-palette-outline" size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{ href: null }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: C.bgPrimary,
    borderTopColor: C.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: Platform.OS === 'ios' ? 84 : 60,
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
