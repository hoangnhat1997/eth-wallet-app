import React, { createContext, ReactNode, useContext, useState } from "react";

type NetworkType = "ethereum" | "solana";

interface NetworkContextProps {
  network: NetworkType;
  setNetwork: (nw: NetworkType) => void;
}

const NetworkContext = createContext<NetworkContextProps | undefined>(
  undefined
);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<NetworkType>("ethereum");
  return (
    <NetworkContext.Provider value={{ network, setNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
  return ctx;
}
