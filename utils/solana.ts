import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";

// Use devnet for testing
export const SOLANA_RPC_URL = "https://api.devnet.solana.com";
const connection = new Connection(SOLANA_RPC_URL, "confirmed");

export function createSolanaWallet(): { publicKey: string; secretKey: string } {
  const keypair = Keypair.generate();
  return {
    publicKey: keypair.publicKey.toBase58(),
    secretKey: Buffer.from(keypair.secretKey).toString("base64"),
  };
}

export async function getSolanaBalance(address: string): Promise<string> {
  const pubkey = new PublicKey(address);
  const balance = await connection.getBalance(pubkey);
  return (balance / LAMPORTS_PER_SOL).toString();
}

export async function sendSolana(
  addressFrom: string,
  secretBase64: string,
  addressTo: string,
  amountSol: string
): Promise<string> {
  const secretKey = Buffer.from(secretBase64, "base64");
  const from = Keypair.fromSecretKey(secretKey);
  const to = new PublicKey(addressTo);
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: Math.floor(Number(amountSol) * LAMPORTS_PER_SOL),
    })
  );
  const signature = await sendAndConfirmTransaction(connection, tx, [from]);
  return signature;
}
