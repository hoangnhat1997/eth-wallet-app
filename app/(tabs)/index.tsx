import "react-native-get-random-values";

import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { createWallet, importWallet } from "../../utils/wallet";

export default function HomeScreen() {
  const [mnemonic, setMnemonic] = useState("");
  const router = useRouter();

  const handleCreate = () => {
    const wallet = createWallet();
    if (!wallet) {
      Alert.alert("Error", "Failed to create wallet");
      return;
    }
    router.push({
      pathname: "/wallet",
      params: { wallet: JSON.stringify(wallet) },
    });
  };

  const handleImport = () => {
    try {
      const wallet = importWallet(mnemonic);
      router.push({
        pathname: "/wallet",
        params: { wallet: JSON.stringify(wallet) },
      });
    } catch (e) {
      Alert.alert("Invalid mnemonic", "Please check your mnemonic phrase.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to ETH Wallet</Text>
        <Button title="Create New Wallet" onPress={handleCreate} />
        <Text style={styles.or}>OR</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter mnemonic to import"
          value={mnemonic}
          onChangeText={setMnemonic}
          multiline
        />
        <Button title="Import Wallet" onPress={handleImport} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    alignSelf: "center",
  },
  or: { alignSelf: "center", marginVertical: 16, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
});
