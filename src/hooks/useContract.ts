import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useQuery } from '@tanstack/react-query';

// Contract ABI - This would be generated from the compiled contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_verifier", "type": "address"},
      {"internalType": "uint256", "name": "_memberThreshold", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "dataId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "owner", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "dataHash", "type": "string"}
    ],
    "name": "DataEncrypted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "member", "type": "address"},
      {"indexed": false, "internalType": "uint32", "name": "reputation", "type": "uint32"}
    ],
    "name": "MemberAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "proposalId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "proposer", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "title", "type": "string"}
    ],
    "name": "ProposalCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "proposalId", "type": "uint256"},
      {"indexed": false, "internalType": "bool", "name": "passed", "type": "bool"}
    ],
    "name": "ProposalExecuted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "riskId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "assessor", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "riskType", "type": "string"}
    ],
    "name": "RiskAssessed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "member", "type": "address"},
      {"indexed": false, "internalType": "uint32", "name": "reputation", "type": "uint32"}
    ],
    "name": "ReputationUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "voteId", "type": "uint256"},
      {"indexed": true, "internalType": "uint256", "name": "proposalId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "voter", "type": "address"},
      {"indexed": false, "internalType": "bool", "name": "support", "type": "bool"}
    ],
    "name": "VoteCast",
    "type": "event"
  }
] as const;

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export const useFluxCipherGuard = () => {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Read contract data
  const { data: isMember } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isMemberActive',
    args: address ? [address] : undefined,
  });

  const { data: reputation } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getMemberReputation',
    args: address ? [address] : undefined,
  });

  const { data: votingPower } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getVotingPower',
    args: address ? [address] : undefined,
  });

  // Contract interaction functions
  const createRiskAssessment = async (
    riskType: string,
    description: string,
    riskScore: number,
    confidenceLevel: number
  ) => {
    if (!address) throw new Error('Wallet not connected');
    
    return writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'createRiskAssessment',
      args: [riskType, description, riskScore, confidenceLevel],
    });
  };

  const createProposal = async (
    title: string,
    description: string,
    duration: number
  ) => {
    if (!address) throw new Error('Wallet not connected');
    
    return writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'createProposal',
      args: [title, description, duration],
    });
  };

  const castVote = async (
    proposalId: number,
    support: boolean,
    weight: number
  ) => {
    if (!address) throw new Error('Wallet not connected');
    
    return writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'castVote',
      args: [proposalId, support, weight],
    });
  };

  const executeProposal = async (proposalId: number) => {
    if (!address) throw new Error('Wallet not connected');
    
    return writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'executeProposal',
      args: [proposalId],
    });
  };

  const encryptData = async (
    dataHash: string,
    encryptionKey: number
  ) => {
    if (!address) throw new Error('Wallet not connected');
    
    return writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'encryptData',
      args: [dataHash, encryptionKey],
    });
  };

  return {
    // Contract state
    isMember: isMember as boolean,
    reputation: reputation as number,
    votingPower: votingPower as number,
    
    // Transaction state
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
    
    // Contract functions
    createRiskAssessment,
    createProposal,
    castVote,
    executeProposal,
    encryptData,
  };
};
