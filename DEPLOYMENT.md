# 🚀 Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Environment Variables**: Prepare the required environment variables

## Step-by-Step Deployment

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project" on the dashboard
3. Import your GitHub repository

### Step 2: Configure Project Settings

1. **Framework Preset**: Select "Vite"
2. **Root Directory**: Leave as default (`.`)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### Step 3: Environment Variables

Add the following environment variables in the Vercel dashboard:

```env
# Network Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=your_rpc_endpoint

# Wallet Connect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Contract Address (update after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

**How to add environment variables:**
1. In your Vercel project dashboard, go to "Settings"
2. Click on "Environment Variables"
3. Add each variable with its value
4. Make sure to set them for "Production", "Preview", and "Development"

### Step 4: Deploy

1. Click "Deploy" button
2. Wait for the build process to complete
3. Your application will be available at the provided Vercel URL

### Step 5: Custom Domain (Optional)

1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Configure DNS settings as instructed by Vercel

## Post-Deployment Configuration

### 1. Update Contract Address

Once your smart contract is deployed, update the `NEXT_PUBLIC_CONTRACT_ADDRESS` environment variable in Vercel with the actual deployed contract address.

### 2. Verify Wallet Connection

Test the wallet connection functionality:
- Connect with MetaMask
- Switch to Sepolia testnet
- Verify the connection works properly

### 3. Test Contract Interactions

- Create a risk assessment
- Submit a governance proposal
- Test voting functionality

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are properly installed
   - Verify TypeScript compilation
   - Check for any missing environment variables

2. **Wallet Connection Issues**
   - Ensure WalletConnect Project ID is correct
   - Verify RPC URL is accessible
   - Check network configuration

3. **Contract Interaction Errors**
   - Verify contract address is correct
   - Ensure contract is deployed on Sepolia
   - Check ABI compatibility

### Environment Variables Checklist

- [ ] `NEXT_PUBLIC_CHAIN_ID` set to `11155111`
- [ ] `NEXT_PUBLIC_RPC_URL` configured correctly
- [ ] `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` set
- [ ] `NEXT_PUBLIC_INFURA_API_KEY` configured
- [ ] `NEXT_PUBLIC_CONTRACT_ADDRESS` updated with deployed contract

## Monitoring and Maintenance

### 1. Performance Monitoring

- Use Vercel Analytics to monitor performance
- Check build logs for any issues
- Monitor error rates and user interactions

### 2. Updates

- Push changes to the main branch for automatic deployment
- Test changes in preview deployments first
- Monitor for any breaking changes in dependencies

### 3. Security

- Regularly update dependencies
- Monitor for security vulnerabilities
- Keep environment variables secure
- Use HTTPS for all connections

## Support

If you encounter issues during deployment:

1. Check Vercel build logs
2. Verify environment variables
3. Test locally first
4. Contact support if needed

---

**Deployment completed successfully!** 🚀

Your Flux Cipher Guard application is now live and ready for users to connect their wallets and interact with the FHE-encrypted risk management platform.
