import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type TokenBalanceData = {
  name: string;
  address: string;
  balance: string;
};

interface Props {
  tokens: TokenBalanceData[];
}

const TokenList: React.FC<Props> = ({ tokens }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Tokens:</Text>
    {tokens.map((token) => (
      <View key={token.address} style={styles.row}>
        <Text style={styles.name}>{token.name}</Text>
        <Text style={styles.balance}>{token.balance}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { width: 220, marginVertical: 6 },
  title: { fontWeight: "bold", marginBottom: 6 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  name: { fontSize: 15 },
  balance: { fontSize: 15, color: "#555" },
});

export default TokenList;
