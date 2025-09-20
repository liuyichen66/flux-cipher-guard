import { useState } from "react";
import { Shield, Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import daoLogo from "@/assets/dao-logo.png";

interface DaoHeaderProps {
  onWalletConnect: (address: string) => void;
  isConnected: boolean;
  walletAddress?: string;
}

export const DaoHeader = ({ onWalletConnect, isConnected, walletAddress }: DaoHeaderProps) => {
  const [showBinary, setShowBinary] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="relative border-b border-border bg-card/50 backdrop-blur-md">
      {/* Binary Rain Background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-xs text-binary opacity-20 binary-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            {Array.from({ length: 10 }).map((_, j) => (
              <div key={j} className="mb-2">
                {Math.random() > 0.5 ? "1" : "0"}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="relative container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src={daoLogo} 
              alt="DAO Risk Logo" 
              className="h-12 w-12 glow-pulse"
            />
            <div className="absolute inset-0 bg-cyber-glow/20 rounded-full blur-xl"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyber-glow to-encrypted bg-clip-text text-transparent">
              DAO Risk Managed with Privacy
            </h1>
            <p className="text-sm text-muted-foreground">
              Confidential Risk Exposures • Governance-Approved Access
            </p>
          </div>
        </div>

        {/* Connection Status and Wallet */}
        <div className="flex items-center space-x-4">
          {/* Governance Status */}
          <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-muted/50 border border-border">
            <Shield className="h-4 w-4 text-cyber-glow" />
            <span className="text-sm">
              {isConnected ? "Authorized Member" : "Access Required"}
            </span>
            <div 
              className={`h-2 w-2 rounded-full ${
                isConnected 
                  ? "bg-cyber-glow animate-pulse" 
                  : "bg-muted-foreground"
              }`}
            />
          </div>

          {/* Wallet Connection */}
          {isConnected ? (
            <div className="flex items-center space-x-2">
              <div className="px-3 py-2 rounded-md bg-primary/10 border border-primary/30">
                <span className="text-sm text-primary font-mono">
                  {formatAddress(walletAddress || "")}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* Handle disconnect */}}
                className="cyber-button"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => onWalletConnect("0x1234567890abcdef")}
              className="cyber-button"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>

      {/* Encrypted Overlay when not connected */}
      {!isConnected && (
        <div className="absolute inset-0 encrypted-overlay">
          <div className="absolute inset-0 encrypted-shimmer"></div>
        </div>
      )}
    </header>
  );
};