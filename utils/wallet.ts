import { ethers } from "ethers";
import "react-native-get-random-values";

export type WalletData = {
  address: string;
  privateKey: string;
  mnemonic: string;
};

export function createWallet(): WalletData {
  const wallet = ethers.Wallet.createRandom();
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
