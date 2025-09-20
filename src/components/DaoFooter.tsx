import { AlertTriangle, Shield, Lock } from "lucide-react";

export const DaoFooter = () => {
  return (
    <footer className="relative border-t border-border bg-card/30 backdrop-blur-md mt-auto">
      {/* Animated Hazard Triangles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 12}%`,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <AlertTriangle 
              className="h-6 w-6 text-hazard opacity-40 hazard-glow"
              style={{
                animationDelay: `${i * 0.5}s`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Left Section - Security Notice */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-cyber-glow" />
              <span className="text-sm font-medium">
                End-to-End Encrypted Risk Intelligence
              </span>
            </div>
            <div className="w-px h-6 bg-border"></div>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-encrypted" />
              <span className="text-xs text-muted-foreground">
                Zero-Knowledge Privacy
              </span>
            </div>
          </div>

          {/* Center Section - Cryptographic Pattern */}
          <div className="flex items-center space-x-1 text-xs font-mono text-binary opacity-60">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                {Math.random() > 0.5 ? "1" : "0"}
              </span>
            ))}
          </div>

          {/* Right Section - Status */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-cyber-glow rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">Network Secure</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Last Updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Bottom Border with Crypto Pattern */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex justify-center">
            <div className="text-xs text-muted-foreground font-mono">
              DAO Risk Intelligence • Confidential by Design • Governed by Community
            </div>
          </div>
        </div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-glow/30 to-transparent"></div>
    </footer>
  );
};