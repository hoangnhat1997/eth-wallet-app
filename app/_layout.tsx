import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";

import "react-native-reanimated";

import { NetworkProvider } from "@/context/NetworkContext";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const [authState, setAuthState] = useState<"pending" | "success" | "fail">(
    "success"
  );
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // useEffect(() => {
  //   (async () => {
  //     const compatible = await LocalAuthentication.hasHardwareAsync();
  //     const enrolled = await LocalAuthentication.isEnrolledAsync();
  //     if (!compatible || !enrolled) {
  //       Alert.alert(
  //         "Authentication Required",
  //         "Biometric authentication is not set up on this device."
  //       );
  //       setAuthState("fail");
  //       return;
  //     }
  //     const result = await LocalAuthentication.authenticateAsync({
  //       promptMessage: "Authenticate to access your wallet",
  //       fallbackLabel: "Use Passcode",
  //       disableDeviceFallback: false,
  //     });
  //     if (result.success) {
  //       setAuthState("success");
  //     } else {
  //       setAuthState("fail");
  //     }
  //   })();
  // }, []);

  if (authState === "pending") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Authenticating...</Text>
      </View>
    );
  }

  if (authState === "fail") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 32,
        }}
      >
        <Text style={{ color: "red", marginBottom: 16, textAlign: "center" }}>
          Authentication failed or is not available. Please restart the app to
          try again.
        </Text>
        <Button title="Retry" onPress={() => setAuthState("pending")} />
      </View>
    );
  }

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NetworkProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </NetworkProvider>
    </ThemeProvider>
  );
}
