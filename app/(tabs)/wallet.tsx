import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
  const params = useLocalSearchParams<{ wallet: string }>();
  const router = useRouter();
  const wallet: WalletData = JSON.parse(params.wallet ?? "{}");
  const [ethBalance, setEthBalance] = useState<string>("0");
  const [tokenBalances, setTokenBalances] = useState<TokenBalanceData[]>([]);

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
        Alert.alert("Error", "Failed to load balances.");
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
        <Text style={styles.addressLabel}>Your ETH Address:</Text>
        <Text selectable style={styles.address}>
          {wallet.address}
        </Text>
        <BalanceCard label="ETH" balance={ethBalance} />
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
