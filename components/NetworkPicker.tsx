import React from "react";
import { Button, View } from "react-native";

export default function NetworkPicker({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (nw: string) => void;
}) {
  return (
    <View
      style={{ flexDirection: "row", justifyContent: "center", margin: 10 }}
    >
      <Button
        title="Ethereum"
        onPress={() => onChange("ethereum")}
        color={selected === "ethereum" ? "#2e7d32" : undefined}
      />
      <Button
        title="Solana"
        onPress={() => onChange("solana")}
        color={selected === "solana" ? "#512da8" : undefined}
      />
    </View>
  );
}
