import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#f97316",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="all"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="search" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="explore"
        options={{
          title: "Favories ",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="favorite" color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="touristEvents"
        options={{
          title: "calendar",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={20} name="calendar-today" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}