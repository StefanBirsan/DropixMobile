import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { Ionicons } from '@expo/vector-icons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
              display:'none'
          },
          default: {
              display: 'none',
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={30} name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <Ionicons size={30} name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Main',
          tabBarIcon: ({ color }) => <Ionicons size={30} name="person-outline" color={color} />,
        }}
      />
        <Tabs.Screen
            name="scanner"
            options={{
                title: 'Scan QR Code',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="qr-code-outline" size={size} color={color} />
                ),
            }}
        />
        <Tabs.Screen
            name="sender"
            options={{
                title: 'Sender',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="cube-outline" size={size} color={color} />
                ),
            }}
        />

    </Tabs>

  );
}
