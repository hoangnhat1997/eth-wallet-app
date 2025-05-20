import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  label: string;
  balance: string;
}

const BalanceCard: React.FC<Props> = ({ label, balance }) => (
  <View style={styles.card}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.balance}>{balance}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 18,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginVertical: 8,
    width: 220,
    alignItems: "center",
  },
  label: { fontWeight: "bold", fontSize: 18 },
  balance: { fontSize: 20, color: "#3a3", marginTop: 4 },
});

export default BalanceCard;
