import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

const BIOMETRIC_KEY = "biometric_enabled";

export default function SettingsScreen() {
  const [biometricAvailable, setBiometricAvailable] = useState<boolean>(false);
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(compatible && enrolled);
      const enabled = await SecureStore.getItemAsync(BIOMETRIC_KEY);
      setBiometricEnabled(enabled === "1");
    })();
  }, []);

  const handleToggle = async (value: boolean) => {
    if (value) {
      // Ask for user consent and (optionally) authenticate
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Enable Biometric Authentication",
        fallbackLabel: "Use Passcode",
      });
      if (!result.success) {
        Alert.alert("Biometric authentication failed or was cancelled.");
        return;
      }
      await SecureStore.setItemAsync(BIOMETRIC_KEY, "1");
      setBiometricEnabled(true);
      Alert.alert("Biometric login enabled!");
    } else {
      await SecureStore.setItemAsync(BIOMETRIC_KEY, "0");
      setBiometricEnabled(false);
      Alert.alert("Biometric login disabled.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerContent}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Enable Biometric Login</Text>
          <Switch
            value={biometricEnabled}
            onValueChange={handleToggle}
            disabled={!biometricAvailable}
          />
        </View>
        {!biometricAvailable && (
          <Text style={styles.warning}>
            Biometric authentication is not available or not set up on this
            device.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  containerContent: {
    padding: 18,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 32 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: { fontSize: 16 },
  warning: { color: "#c00", marginTop: 24 },
});
