import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StripeProvider } from "@stripe/stripe-react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import FlashMessage from "react-native-flash-message";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <StripeProvider publishableKey="pk_test_51P9Ee8DsP1sexW6WUA1CBecIyfteiXVIWE52yZ4v9Fv6iH4tzbltrYWyneUGy60Q5cQ6GZiEVYjHC0CeAeyFAWK900N7s27xqD">
            
            <BottomSheetModalProvider>
            <FlashMessage position="bottom" /> 
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
                <Stack.Screen name="login.index" options={{ title: "Login" }} />
                <Stack.Screen name="register" options={{ title: "Register" }} />
                <Stack.Screen name="GuideProfileScreen" options={{ title: "/guide-profile" }} />
                <Stack.Screen name="EditProfileScreen" options={{ title: "/edit-profile" }} />
                <Stack.Screen name="PaymentMethodsScreen" options={{ title: "PaymentMethodsScreen" }} />
                <Stack.Screen name="AddCardScreen" options={{ title: "AddCardScreen" }} />
                <Stack.Screen name="NotificationsScreen" options={{ title: "NotificationsScreen" }} />

              </Stack>
            </BottomSheetModalProvider>

          </StripeProvider>
          <StatusBar style="auto" />
        </ThemeProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
