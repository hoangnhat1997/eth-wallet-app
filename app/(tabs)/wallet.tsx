import { useNetwork } from "@/context/NetworkContext";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import BalanceCard from "../../components/BalanceCard";
import TokenList, { TokenBalanceData } from "../../components/TokenList";
import { getEthBalance } from "../../utils/ethereum";
import { getTokenBalance } from "../../utils/token";
import { WalletData } from "../../utils/wallet";

const ERC20_TOKENS = [
  { name: "USDT", address: "0x509Ee0d083DdF8AC028f2a56731412edd63223B9" },
];

export default function WalletScreen() {
  // const params = useLocalSearchParams<{ wallet: string }>();
  const router = useRouter();
  const { network } = useNetwork();

  const [wallet, setWallet] = useState<WalletData>({
    address: "",
    privateKey: "",
    mnemonic: "",
  });


  const [ethBalance, setEthBalance] = useState<string>("0");
  const [tokenBalances, setTokenBalances] = useState<TokenBalanceData[]>([]);

  useEffect(() => {
    const getPrivateKey = async () => {
      const privateKey = await SecureStore.getItemAsync("user_private_key");
      const address = await SecureStore.getItemAsync("user_address");
      const mnemonic = await SecureStore.getItemAsync("user_mnemonic");
      console.log("privateKey", privateKey);
      console.log("address", address);
      console.log("mnemonic", mnemonic);
      setWallet({
        address: address || "",
        privateKey: privateKey || "",
        mnemonic: mnemonic || "",
      });
    };
    getPrivateKey();
  }, []);

  useEffect(() => {
    if (!wallet?.address) return;
    (async () => {
      try {
        const eth = await getEthBalance(wallet.address);
        setEthBalance(eth);

        const tokens = await Promise.all(
          ERC20_TOKENS.map(async (token) => {
            try {
              const bal = await getTokenBalance(wallet.address, token.address);
              return { ...token, balance: bal };
            } catch {
              return { ...token, balance: "0" };
            }
          })
        );
        setTokenBalances(tokens);
      } catch (e) {
        throw e;
      }
    })();
  }, [wallet?.address]);

  if (!wallet?.address)
    return (
      <SafeAreaView style={styles.container}>
        <Text>Invalid wallet</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.containerContent}>
        <Text style={styles.addressLabel}>Your {network === "ethereum" ? "ETH" : "SOL"} Address:</Text>
        <Text selectable style={styles.address}>
          {wallet.address}
        </Text>
        <BalanceCard label={network === "ethereum" ? "ETH" : "SOL"} balance={ethBalance} />
        <TokenList tokens={tokenBalances} />
        <View style={styles.row}>
          <Button
            title="Send"
            onPress={() =>
              router.push({
                pathname: "/send",
                params: { wallet: JSON.stringify(wallet) },
              })
            }
          />
          <View style={{ width: 12 }} />
          <Button
            title="Receive"
            onPress={() =>
              router.push({
                pathname: "/receive",
                params: { wallet: JSON.stringify(wallet) },
              })
            }
          />
        </View>
        <Text style={styles.mnemonicLabel}>Mnemonic (Save this!):</Text>
        <Text selectable style={styles.mnemonic}>
          {wallet.mnemonic}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerContent: { padding: 18, alignItems: "center" },
  addressLabel: { marginTop: 8, fontWeight: "bold" },
  address: {
    marginBottom: 10,
    fontSize: 13,
    textAlign: "center",
    color: "#444",
  },
  row: { flexDirection: "row", marginVertical: 18 },
  mnemonicLabel: { marginTop: 16, fontWeight: "bold" },
  mnemonic: {
    color: "#c84",
    fontSize: 13,
    marginBottom: 16,
    textAlign: "center",
  },
});
