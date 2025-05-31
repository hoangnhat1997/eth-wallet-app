import { ethers } from "ethers";
import * as SecureStore from "expo-secure-store";

import "react-native-get-random-values";

export type WalletData = {
  address: string;
  privateKey: string;
  mnemonic: string;
};

export async function createWallet(): Promise<WalletData> {
  const wallet = ethers.Wallet.createRandom();
  await SecureStore.setItemAsync("user_address", wallet.address);

  await SecureStore.setItemAsync("user_private_key", wallet.privateKey);
  await SecureStore.setItemAsync(
    "user_mnemonic",
    wallet.mnemonic?.phrase || ""
  );
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase || "",
  };
}

export function importWallet(mnemonic: string): WalletData {
  const wallet = ethers.HDNodeWallet.fromMnemonic(
    ethers.Mnemonic.fromPhrase(mnemonic.trim())
  );
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase || "",
  };
}
