import { useState } from "react";
import { DaoHeader } from "@/components/DaoHeader";
import { RiskDashboard } from "@/components/RiskDashboard";
import { DaoFooter } from "@/components/DaoFooter";
import { WalletConnection } from "@/components/WalletConnection";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    setIsConnected(true);
  };

  const handleWalletDisconnect = () => {
    setIsConnected(false);
    setWalletAddress("");
  };

  if (!isConnected) {
    return <WalletConnection onConnect={handleWalletConnect} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DaoHeader 
        onWalletConnect={handleWalletConnect}
        isConnected={isConnected}
        walletAddress={walletAddress}
      />
      <main className="flex-1">
        <RiskDashboard isConnected={isConnected} />
      </main>
      <DaoFooter />
    </div>
  );
};

export default Index;
