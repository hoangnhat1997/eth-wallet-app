import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { WalletData } from "../../utils/wallet";

export default function ReceiveScreen() {
  const [wallet, setWallet] = useState<WalletData>({
    address: "",
    privateKey: "",
    mnemonic: "",
  });
  useEffect(() => {
    const getPrivateKey = async () => {
      const privateKey = await SecureStore.getItemAsync("user_private_key");
      const address = await SecureStore.getItemAsync("user_address");
      const mnemonic = await SecureStore.getItemAsync("user_mnemonic");
      setWallet({
        address: address || "",
        privateKey: privateKey || "",
        mnemonic: mnemonic || "",
      });
    };
    getPrivateKey();
  }, []);

  if (!wallet?.address)
    return (
      <SafeAreaView style={styles.container}>
        <Text>Invalid wallet</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Receive ETH or Tokens</Text>
      <Text style={styles.label}>Your Address:</Text>
      <Text selectable style={styles.address}>
        {wallet.address}
      </Text>
      <QRCode value={wallet.address} size={200} />
      <Text style={styles.info}>
        Scan or copy your address to receive funds.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  label: { marginBottom: 6, fontWeight: "bold" },
  address: {
    fontSize: 13,
    marginBottom: 16,
    color: "#444",
    textAlign: "center",
  },
  info: { marginTop: 18, color: "#888", fontSize: 15, textAlign: "center" },
});
