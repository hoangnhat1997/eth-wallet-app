import { ethers } from "ethers";
import * as SecureStore from "expo-secure-store";

import "react-native-get-random-values";
import { createSolanaWallet } from "./solana";

export type WalletData = {
  address: string;
  privateKey: string;
  mnemonic: string;
};

export async function createWalletEthereum(): Promise<WalletData> {
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

export async function createWalletSolana(): Promise<WalletData> {
  const wallet = createSolanaWallet();
  await SecureStore.setItemAsync("user_address", wallet.publicKey);
  await SecureStore.setItemAsync("user_private_key", wallet.secretKey);
  await SecureStore.setItemAsync("user_mnemonic", "");
  return {
    address: wallet.publicKey,
    privateKey: wallet.secretKey,
    mnemonic: "",
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
