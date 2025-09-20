import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env.NEXT_PUBLIC_CHAIN_ID': JSON.stringify('11155111'),
    'process.env.NEXT_PUBLIC_RPC_URL': JSON.stringify('https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990'),
    'process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID': JSON.stringify('2ec9743d0d0cd7fb94dee1a7e6d33475'),
    'process.env.NEXT_PUBLIC_INFURA_API_KEY': JSON.stringify('b18fb7e6ca7045ac83c41157ab93f990'),
    'process.env.NEXT_PUBLIC_CONTRACT_ADDRESS': JSON.stringify('0x0000000000000000000000000000000000000000'),
  },
}));
