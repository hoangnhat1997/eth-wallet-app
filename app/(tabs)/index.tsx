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

import NetworkPicker from "@/components/NetworkPicker";
import { useNetwork } from "@/context/NetworkContext";
import { createWalletEthereum, createWalletSolana, importWallet } from "../../utils/wallet";

export default function HomeScreen() {
  const [mnemonic, setMnemonic] = useState("");
  const { network, setNetwork } = useNetwork();

  const router = useRouter();

  // const handleCreate = async () => {
  //   const wallet = await createWallet();

  //   if (!wallet) {
  //     Alert.alert("Error", "Failed to create wallet");
  //     return;
  //   }

  //   await SecureStore.setItemAsync("user_address", wallet.address);
  //   await SecureStore.setItemAsync("user_private_key", wallet.privateKey);
  //   await SecureStore.setItemAsync(
  //       "user_mnemonic",
  //       wallet.mnemonic || ""
  //   );


    
  //   router.push({
  //     pathname: "/wallet",
  //     params: { wallet: JSON.stringify(wallet) },
  //   });
  // };

    const handleCreateWallet = async  () => {
      if (network === "ethereum") {
        const wallet = await createWalletEthereum();
        router.push({
          pathname: "/wallet",
          params: { wallet: JSON.stringify(wallet) },
        });
      } else {
        const wallet = await createWalletSolana();
        router.push({
          pathname: "/wallet",
          params: { wallet: JSON.stringify(wallet) },
        });
      }
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
        <NetworkPicker selected={network} onChange={(nw) => setNetwork(nw as "ethereum" | "solana")} />

        <Text style={styles.title}>Welcome to {network === "ethereum" ? "ETH" : "SOL"} Wallet</Text>
        {/* <Button title="Create New Wallet" onPress={handleCreate} /> */}
        <Button
          title={`Create New ${
            network === "ethereum" ? "Ethereum" : "Solana"
          } Wallet`}
          onPress={handleCreateWallet}
        />

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
