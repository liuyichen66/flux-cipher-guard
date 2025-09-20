// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@fhevm/lib/Reencrypt.sol";
import "@fhevm/lib/Fhe.sol";

contract FluxCipherGuard {
    using Fhe for euint32;
    using Fhe for ebool;
    
    struct RiskAssessment {
        euint32 riskId;
        euint32 riskScore;
        euint32 confidenceLevel;
        ebool isHighRisk;
        ebool isVerified;
        string riskType;
        string description;
        address assessor;
        uint256 timestamp;
    }
    
    struct GovernanceProposal {
        euint32 proposalId;
        euint32 votesFor;
        euint32 votesAgainst;
        ebool isPassed;
        ebool isExecuted;
        string title;
        string description;
        address proposer;
        uint256 startTime;
        uint256 endTime;
    }
    
    struct Vote {
        euint32 voteId;
        ebool support;
        euint32 weight;
        address voter;
        uint256 timestamp;
    }
    
    struct EncryptedData {
        euint32 dataId;
        euint32 encryptionKey;
        ebool isAccessible;
        string dataHash;
        address owner;
        uint256 timestamp;
    }
    
    mapping(uint256 => RiskAssessment) public riskAssessments;
    mapping(uint256 => GovernanceProposal) public proposals;
    mapping(uint256 => Vote) public votes;
    mapping(uint256 => EncryptedData) public encryptedData;
    mapping(address => euint32) public memberReputation;
    mapping(address => euint32) public votingPower;
    mapping(address => ebool) public isMember;
    
    uint256 public riskCounter;
    uint256 public proposalCounter;
    uint256 public voteCounter;
    uint256 public dataCounter;
    
    address public owner;
    address public verifier;
    uint256 public memberThreshold;
    
    event RiskAssessed(uint256 indexed riskId, address indexed assessor, string riskType);
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event VoteCast(uint256 indexed voteId, uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId, bool passed);
    event DataEncrypted(uint256 indexed dataId, address indexed owner, string dataHash);
    event MemberAdded(address indexed member, uint32 reputation);
    event ReputationUpdated(address indexed member, uint32 reputation);
    
    constructor(address _verifier, uint256 _memberThreshold) {
        owner = msg.sender;
        verifier = _verifier;
        memberThreshold = _memberThreshold;
    }
    
    function addMember(address member, euint32 reputation) public {
        require(msg.sender == owner || msg.sender == verifier, "Only owner or verifier can add members");
        require(member != address(0), "Invalid member address");
        
        isMember[member] = Fhe.asEbool(true);
        memberReputation[member] = reputation;
        votingPower[member] = reputation; // Voting power based on reputation
        
        emit MemberAdded(member, Fhe.decrypt(reputation));
    }
    
    function createRiskAssessment(
        string memory _riskType,
        string memory _description,
        euint32 _riskScore,
        euint32 _confidenceLevel
    ) public returns (uint256) {
        require(Fhe.decrypt(isMember[msg.sender]), "Only members can create risk assessments");
        require(bytes(_riskType).length > 0, "Risk type cannot be empty");
        require(_riskScore <= 100, "Risk score must be between 0-100");
        
        uint256 riskId = riskCounter++;
        
        riskAssessments[riskId] = RiskAssessment({
            riskId: _riskScore, // Will be set properly
            riskScore: _riskScore,
            confidenceLevel: _confidenceLevel,
            isHighRisk: _riskScore > Fhe.asEuint32(70),
            isVerified: Fhe.asEbool(false),
            riskType: _riskType,
            description: _description,
            assessor: msg.sender,
            timestamp: block.timestamp
        });
        
        emit RiskAssessed(riskId, msg.sender, _riskType);
        return riskId;
    }
    
    function createProposal(
        string memory _title,
        string memory _description,
        uint256 _duration
    ) public returns (uint256) {
        require(Fhe.decrypt(isMember[msg.sender]), "Only members can create proposals");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_duration > 0, "Duration must be positive");
        
        uint256 proposalId = proposalCounter++;
        
        proposals[proposalId] = GovernanceProposal({
            proposalId: Fhe.asEuint32(proposalId),
            votesFor: Fhe.asEuint32(0),
            votesAgainst: Fhe.asEuint32(0),
            isPassed: Fhe.asEbool(false),
            isExecuted: Fhe.asEbool(false),
            title: _title,
            description: _description,
            proposer: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration
        });
        
        emit ProposalCreated(proposalId, msg.sender, _title);
        return proposalId;
    }
    
    function castVote(
        uint256 proposalId,
        ebool support,
        euint32 weight
    ) public returns (uint256) {
        require(Fhe.decrypt(isMember[msg.sender]), "Only members can vote");
        require(proposals[proposalId].proposer != address(0), "Proposal does not exist");
        require(block.timestamp <= proposals[proposalId].endTime, "Voting period has ended");
        require(block.timestamp >= proposals[proposalId].startTime, "Voting has not started");
        
        uint256 voteId = voteCounter++;
        
        votes[voteId] = Vote({
            voteId: weight, // Will be set properly
            support: support,
            weight: weight,
            voter: msg.sender,
            timestamp: block.timestamp
        });
        
        // Update proposal vote counts
        if (Fhe.decrypt(support)) {
            proposals[proposalId].votesFor = proposals[proposalId].votesFor + weight;
        } else {
            proposals[proposalId].votesAgainst = proposals[proposalId].votesAgainst + weight;
        }
        
        emit VoteCast(voteId, proposalId, msg.sender, Fhe.decrypt(support));
        return voteId;
    }
    
    function executeProposal(uint256 proposalId) public {
        require(Fhe.decrypt(isMember[msg.sender]), "Only members can execute proposals");
        require(proposals[proposalId].proposer != address(0), "Proposal does not exist");
        require(block.timestamp > proposals[proposalId].endTime, "Voting period has not ended");
        require(!Fhe.decrypt(proposals[proposalId].isExecuted), "Proposal already executed");
        
        // Determine if proposal passed (simple majority)
        euint32 totalVotes = proposals[proposalId].votesFor + proposals[proposalId].votesAgainst;
        ebool passed = proposals[proposalId].votesFor > proposals[proposalId].votesAgainst;
        
        proposals[proposalId].isPassed = passed;
        proposals[proposalId].isExecuted = Fhe.asEbool(true);
        
        emit ProposalExecuted(proposalId, Fhe.decrypt(passed));
    }
    
    function encryptData(
        string memory _dataHash,
        euint32 _encryptionKey
    ) public returns (uint256) {
        require(Fhe.decrypt(isMember[msg.sender]), "Only members can encrypt data");
        require(bytes(_dataHash).length > 0, "Data hash cannot be empty");
        
        uint256 dataId = dataCounter++;
        
        encryptedData[dataId] = EncryptedData({
            dataId: _encryptionKey, // Will be set properly
            encryptionKey: _encryptionKey,
            isAccessible: Fhe.asEbool(true),
            dataHash: _dataHash,
            owner: msg.sender,
            timestamp: block.timestamp
        });
        
        emit DataEncrypted(dataId, msg.sender, _dataHash);
        return dataId;
    }
    
    function verifyRiskAssessment(uint256 riskId, ebool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify risk assessments");
        require(riskAssessments[riskId].assessor != address(0), "Risk assessment does not exist");
        
        riskAssessments[riskId].isVerified = isVerified;
    }
    
    function updateReputation(address member, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(Fhe.decrypt(isMember[member]), "Member does not exist");
        
        memberReputation[member] = reputation;
        votingPower[member] = reputation;
        
        emit ReputationUpdated(member, Fhe.decrypt(reputation));
    }
    
    function getRiskAssessment(uint256 riskId) public view returns (
        uint32 riskScore,
        uint32 confidenceLevel,
        bool isHighRisk,
        bool isVerified,
        string memory riskType,
        string memory description,
        address assessor,
        uint256 timestamp
    ) {
        RiskAssessment storage risk = riskAssessments[riskId];
        return (
            Fhe.decrypt(risk.riskScore),
            Fhe.decrypt(risk.confidenceLevel),
            Fhe.decrypt(risk.isHighRisk),
            Fhe.decrypt(risk.isVerified),
            risk.riskType,
            risk.description,
            risk.assessor,
            risk.timestamp
        );
    }
    
    function getProposalInfo(uint256 proposalId) public view returns (
        uint32 votesFor,
        uint32 votesAgainst,
        bool isPassed,
        bool isExecuted,
        string memory title,
        string memory description,
        address proposer,
        uint256 startTime,
        uint256 endTime
    ) {
        GovernanceProposal storage proposal = proposals[proposalId];
        return (
            Fhe.decrypt(proposal.votesFor),
            Fhe.decrypt(proposal.votesAgainst),
            Fhe.decrypt(proposal.isPassed),
            Fhe.decrypt(proposal.isExecuted),
            proposal.title,
            proposal.description,
            proposal.proposer,
            proposal.startTime,
            proposal.endTime
        );
    }
    
    function getVoteInfo(uint256 voteId) public view returns (
        bool support,
        uint32 weight,
        address voter,
        uint256 timestamp
    ) {
        Vote storage vote = votes[voteId];
        return (
            Fhe.decrypt(vote.support),
            Fhe.decrypt(vote.weight),
            vote.voter,
            vote.timestamp
        );
    }
    
    function getEncryptedDataInfo(uint256 dataId) public view returns (
        uint32 encryptionKey,
        bool isAccessible,
        string memory dataHash,
        address owner,
        uint256 timestamp
    ) {
        EncryptedData storage data = encryptedData[dataId];
        return (
            Fhe.decrypt(data.encryptionKey),
            Fhe.decrypt(data.isAccessible),
            data.dataHash,
            data.owner,
            data.timestamp
        );
    }
    
    function getMemberReputation(address member) public view returns (uint32) {
        return Fhe.decrypt(memberReputation[member]);
    }
    
    function getVotingPower(address member) public view returns (uint32) {
        return Fhe.decrypt(votingPower[member]);
    }
    
    function isMemberActive(address member) public view returns (bool) {
        return Fhe.decrypt(isMember[member]);
    }
    
    function updateDataAccess(uint256 dataId, ebool isAccessible) public {
        require(encryptedData[dataId].owner == msg.sender, "Only data owner can update access");
        require(encryptedData[dataId].owner != address(0), "Data does not exist");
        
        encryptedData[dataId].isAccessible = isAccessible;
    }
    
    function revokeDataAccess(uint256 dataId) public {
        require(encryptedData[dataId].owner == msg.sender, "Only data owner can revoke access");
        require(encryptedData[dataId].owner != address(0), "Data does not exist");
        
        encryptedData[dataId].isAccessible = Fhe.asEbool(false);
    }
    
    function transferDataOwnership(uint256 dataId, address newOwner) public {
        require(encryptedData[dataId].owner == msg.sender, "Only data owner can transfer");
        require(newOwner != address(0), "Invalid new owner address");
        require(encryptedData[dataId].owner != address(0), "Data does not exist");
        
        encryptedData[dataId].owner = newOwner;
    }
}
