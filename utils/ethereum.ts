import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");

export async function getEthBalance(address: string): Promise<string> {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

export async function sendEth(
  privateKey: string,
  to: string,
  amount: string
): Promise<string> {
  const wallet = new ethers.Wallet(privateKey, provider);
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amount),
  });
  await tx.wait();
  return tx.hash;
}
