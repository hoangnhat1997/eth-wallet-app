import { getEthBalance, sendEth } from "./ethereum";

// Example: send 0.001 ETH from one key to another
export async function testSendEth(privateKey: string, to: string) {
  console.log("Initial balance of sender:", await getEthBalance(to));
  const txHash = await sendEth(privateKey, to, "0.001");
  console.log("Sent! Tx hash:", txHash);
  // Wait for a bit, then check new balance
  setTimeout(async () => {
    console.log("New balance of receiver:", await getEthBalance(to));
  }, 15000);
}
