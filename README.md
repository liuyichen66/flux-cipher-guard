# Flux Cipher Guard

A cutting-edge risk management platform that leverages Fully Homomorphic Encryption (FHE) to provide secure, privacy-preserving analytics for decentralized organizations. Built with React, TypeScript, and integrated with Web3 wallet connectivity.

## Features

- **FHE-Encrypted Risk Assessment**: Create and manage risk assessments with fully homomorphic encryption
- **Governance Integration**: Participate in DAO governance with encrypted voting and proposal systems
- **Wallet Connectivity**: Seamless integration with RainbowKit and multiple wallet providers
- **Real-time Analytics**: Live risk monitoring with encrypted data overlays
- **Privacy-First Design**: All sensitive data is encrypted using FHE technology

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Web3 Integration**: RainbowKit, Wagmi, Viem
- **Blockchain**: Ethereum Sepolia Testnet
- **Encryption**: FHE (Fully Homomorphic Encryption)
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/liuyichen66/flux-cipher-guard.git

# Navigate to the project directory
cd flux-cipher-guard

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Configuration

The application uses the following environment variables:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

## Smart Contract

The platform includes a Solidity smart contract (`FluxCipherGuard.sol`) that implements:

- FHE-encrypted risk assessments
- Governance proposals and voting
- Member reputation system
- Encrypted data storage
- Access control mechanisms

### Contract Functions

- `createRiskAssessment()`: Create encrypted risk assessments
- `createProposal()`: Submit governance proposals
- `castVote()`: Vote on proposals with encrypted weights
- `encryptData()`: Store encrypted data on-chain
- `updateReputation()`: Manage member reputation scores

## Usage

1. **Connect Wallet**: Use the wallet connection interface to link your Web3 wallet
2. **Access Dashboard**: View encrypted risk data and analytics
3. **Create Assessments**: Submit new risk assessments with FHE encryption
4. **Participate in Governance**: Create proposals and vote on DAO decisions
5. **Manage Data**: Encrypt and store sensitive information securely

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── WalletConnection.tsx
│   └── RiskDashboard.tsx
├── hooks/              # Custom React hooks
│   └── useContract.ts  # Web3 contract interactions
├── lib/                # Utility functions
│   └── wallet.ts       # Wallet configuration
├── pages/              # Page components
└── contracts/        # Smart contracts
    └── FluxCipherGuard.sol
```

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to your preferred hosting service
# The dist/ folder contains the production build
```

## Security

- All sensitive data is encrypted using FHE
- Wallet connections are secured with end-to-end encryption
- Smart contract interactions are gas-optimized
- Access control is enforced at the contract level

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for the decentralized future**
