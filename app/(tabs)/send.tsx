import { useLocalSearchParams } from "expo-router";
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
import { sendEth } from "../../utils/ethereum";
import { sendToken } from "../../utils/token";
import { WalletData } from "../../utils/wallet";

const ERC20_TOKENS = [
  { name: "ETH", address: null },
  { name: "USDT", address: "0x509Ee0d083DdF8AC028f2a56731412edd63223B9" },
];

export default function SendScreen() {
  const params = useLocalSearchParams<{ wallet: string }>();
  const wallet: WalletData = JSON.parse(params.wallet ?? "{}");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!to || !amount) {
      Alert.alert("Missing fields", "Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      let txHash: string;
      if (selectedToken === "ETH") {
        txHash = await sendEth(wallet.privateKey, to, amount);
      } else {
        const token = ERC20_TOKENS.find((t) => t.name === selectedToken);
        if (!token?.address) throw new Error("Token address not found");
        txHash = await sendToken(wallet.privateKey, token.address, to, amount);
      }
      Alert.alert("Success", `Transaction sent!\nHash: ${txHash}`);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Transaction failed");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Recipient Address</Text>
      <TextInput
        style={styles.input}
        value={to}
        onChangeText={setTo}
        placeholder="0x..."
        autoCapitalize="none"
      />
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="Amount"
        keyboardType="decimal-pad"
      />
      <Text style={styles.label}>Token</Text>
      <View style={styles.pickerContainer}>
        {ERC20_TOKENS.map((token) => (
          <Button
            key={token.name}
            title={token.name}
            color={selectedToken === token.name ? "#2196f3" : "#bbb"}
            onPress={() => setSelectedToken(token.name)}
          />
        ))}
      </View>
      <Button
        title={loading ? "Sending..." : "Send"}
        onPress={handleSend}
        disabled={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginHorizontal: 16,
    flex: 1,
    justifyContent: "center",
  },
  label: { marginTop: 16, marginBottom: 4, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "space-between",
  },
});
