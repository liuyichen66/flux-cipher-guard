import { useState } from "react";
import { Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect } from 'wagmi';

interface WalletConnectionProps {
  onConnect: (address: string) => void;
}

export const WalletConnection = ({ onConnect }: WalletConnectionProps) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();

  // Auto-connect when wallet is connected
  if (isConnected && address) {
    onConnect(address);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="risk-card border-primary/30">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Flux Cipher Guard Access</CardTitle>
            <p className="text-muted-foreground">
              Connect your wallet to access the FHE-encrypted risk management dashboard and participate in governance.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Connection Steps */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="h-2 w-2 bg-cyber-glow rounded-full"></div>
                <span className="text-sm">Verify wallet ownership</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="h-2 w-2 bg-cyber-glow rounded-full"></div>
                <span className="text-sm">Access FHE-encrypted data</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="h-2 w-2 bg-cyber-glow rounded-full"></div>
                <span className="text-sm">Participate in governance</span>
              </div>
            </div>

            {/* Connect Button */}
            <div className="w-full">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== 'loading';
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === 'authenticated');

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        'style': {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <Button
                              onClick={openConnectModal}
                              className="w-full cyber-button h-12"
                            >
                              <div className="flex items-center space-x-2">
                                <Wallet className="h-4 w-4" />
                                <span>Connect Wallet</span>
                              </div>
                            </Button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <Button
                              onClick={openChainModal}
                              className="w-full cyber-button h-12"
                            >
                              <div className="flex items-center space-x-2">
                                <AlertCircle className="h-4 w-4" />
                                <span>Wrong network</span>
                              </div>
                            </Button>
                          );
                        }

                        return (
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={openAccountModal}
                              className="w-full cyber-button h-12"
                            >
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4" />
                                <span>Connected: {account.displayName}</span>
                              </div>
                            </Button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>

            {/* Security Notice */}
            <div className="text-center text-xs text-muted-foreground">
              <p>Your wallet connection is secured with end-to-end encryption.</p>
              <p className="mt-1">We never store your private keys or personal data.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};