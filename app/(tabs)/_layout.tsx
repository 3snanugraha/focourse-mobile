import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
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
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Course',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="learning/[id]"
        options={{
          title: 'Learning',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          tabBarButton: (props: BottomTabBarButtonProps) => {
            const touchableProps: TouchableOpacityProps = {
              disabled: true,
              style: StyleSheet.compose(
                props.style as any,
                styles.disabledTab
              ),
              onPress: props.onPress,
              children: props.children
            };

            return <TouchableOpacity {...touchableProps} />;
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  disabledTab: {
    opacity: 1
  },
});