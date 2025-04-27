import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { colors } from "@/utils/constants";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 70,
            paddingBottom: 10,
          },
          android: {
            height: 65,
            paddingBottom: 8,
          },
        }),
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={26} name="home-filled" color={color} />
          ),
        }}
      />

      {/* Explore */}
      <Tabs.Screen
        name="all"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={26} name="travel-explore" color={color} />
          ),
        }}
      />

      {/* Events */}
      <Tabs.Screen
        name="touristEvents"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={26} name="event-available" color={color} />
          ),
        }}
      />

      {/* More */}
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={26} name="menu" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
