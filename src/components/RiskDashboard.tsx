import { useState, useMemo } from "react";
import { AlertTriangle, Lock, Eye, EyeOff, TrendingUp, TrendingDown, Filter, BarChart3, Activity, Plus, Vote, FileText, Search, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFluxCipherGuard } from "@/hooks/useContract";

interface RiskData {
  category: string;
  risk: "high" | "medium" | "low";
  exposure: number;
  encrypted: boolean;
  trend: "up" | "down" | "stable";
  lastUpdated: string;
  mitigation: number;
  impact: number;
}

const mockRiskData: RiskData[] = [
  { category: "Smart Contract", risk: "high", exposure: 85, encrypted: true, trend: "up", lastUpdated: "2 mins ago", mitigation: 65, impact: 95 },
  { category: "Liquidity Pool", risk: "medium", exposure: 42, encrypted: true, trend: "down", lastUpdated: "5 mins ago", mitigation: 78, impact: 60 },
  { category: "Oracle Dependency", risk: "high", exposure: 78, encrypted: true, trend: "stable", lastUpdated: "1 min ago", mitigation: 45, impact: 88 },
  { category: "Governance Token", risk: "low", exposure: 23, encrypted: true, trend: "down", lastUpdated: "8 mins ago", mitigation: 92, impact: 35 },
  { category: "Cross-Chain Bridge", risk: "high", exposure: 91, encrypted: true, trend: "up", lastUpdated: "3 mins ago", mitigation: 32, impact: 98 },
  { category: "Market Correlation", risk: "medium", exposure: 56, encrypted: true, trend: "stable", lastUpdated: "6 mins ago", mitigation: 71, impact: 65 },
];

interface RiskDashboardProps {
  isConnected: boolean;
}

export const RiskDashboard = ({ isConnected }: RiskDashboardProps) => {
  const [decryptedItems, setDecryptedItems] = useState<Set<string>>(new Set());
  const [filterRisk, setFilterRisk] = useState<"all" | "high" | "medium" | "low">("all");
  const [sortBy, setSortBy] = useState<"exposure" | "impact" | "mitigation">("exposure");
  const [showRiskForm, setShowRiskForm] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Contract integration
  const {
    isMember,
    reputation,
    votingPower,
    createRiskAssessment,
    createProposal,
    isPending,
    isConfirmed
  } = useFluxCipherGuard();
  
  // Form states
  const [riskForm, setRiskForm] = useState({
    riskType: '',
    description: '',
    riskScore: 0,
    confidenceLevel: 0
  });
  
  const [proposalForm, setProposalForm] = useState({
    title: '',
    description: '',
    duration: 7 // days
  });

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let filtered = mockRiskData;
    
    // Filter by risk level
    if (filterRisk !== "all") {
      filtered = filtered.filter(item => item.risk === filterRisk);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "exposure": return b.exposure - a.exposure;
        case "impact": return b.impact - a.impact;
        case "mitigation": return a.mitigation - b.mitigation;
        default: return 0;
      }
    });
  }, [filterRisk, sortBy, searchTerm]);

  const toggleDecryption = (category: string) => {
    if (!isConnected) return;
    
    const newDecrypted = new Set(decryptedItems);
    if (newDecrypted.has(category)) {
      newDecrypted.delete(category);
    } else {
      newDecrypted.add(category);
    }
    setDecryptedItems(newDecrypted);
  };

  const handleRiskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMember) return;
    
    try {
      await createRiskAssessment(
        riskForm.riskType,
        riskForm.description,
        riskForm.riskScore,
        riskForm.confidenceLevel
      );
      setShowRiskForm(false);
      setRiskForm({ riskType: '', description: '', riskScore: 0, confidenceLevel: 0 });
    } catch (error) {
      console.error('Failed to create risk assessment:', error);
    }
  };

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMember) return;
    
    try {
      await createProposal(
        proposalForm.title,
        proposalForm.description,
        proposalForm.duration * 24 * 60 * 60 // convert days to seconds
      );
      setShowProposalForm(false);
      setProposalForm({ title: '', description: '', duration: 7 });
    } catch (error) {
      console.error('Failed to create proposal:', error);
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return <TrendingUp className="h-3 w-3 text-risk-high" />;
      case "down": return <TrendingDown className="h-3 w-3 text-risk-low" />;
      case "stable": return <Activity className="h-3 w-3 text-risk-medium" />;
    }
  };

  const getRiskColor = (risk: "high" | "medium" | "low") => {
    switch (risk) {
      case "high": return "text-risk-high";
      case "medium": return "text-risk-medium";
      case "low": return "text-risk-low";
    }
  };

  const getRiskBg = (risk: "high" | "medium" | "low") => {
    switch (risk) {
      case "high": return "bg-risk-high/20";
      case "medium": return "bg-risk-medium/20";
      case "low": return "bg-risk-low/20";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Flux Cipher Guard</h2>
            <p className="text-muted-foreground">
              FHE-encrypted risk management with governance integration
            </p>
            {isMember && (
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="outline" className="text-xs">
                  Reputation: {reputation}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Voting Power: {votingPower}
                </Badge>
              </div>
            )}
          </div>
          {isMember && (
            <div className="flex items-center space-x-2">
              <Dialog open={showRiskForm} onOpenChange={setShowRiskForm}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Risk
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Risk Assessment</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleRiskSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="riskType">Risk Type</Label>
                      <Input
                        id="riskType"
                        value={riskForm.riskType}
                        onChange={(e) => setRiskForm({...riskForm, riskType: e.target.value})}
                        placeholder="e.g., Smart Contract Vulnerability"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={riskForm.description}
                        onChange={(e) => setRiskForm({...riskForm, description: e.target.value})}
                        placeholder="Detailed risk description..."
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="riskScore">Risk Score (0-100)</Label>
                        <Input
                          id="riskScore"
                          type="number"
                          min="0"
                          max="100"
                          value={riskForm.riskScore}
                          onChange={(e) => setRiskForm({...riskForm, riskScore: parseInt(e.target.value)})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="confidenceLevel">Confidence Level (0-100)</Label>
                        <Input
                          id="confidenceLevel"
                          type="number"
                          min="0"
                          max="100"
                          value={riskForm.confidenceLevel}
                          onChange={(e) => setRiskForm({...riskForm, confidenceLevel: parseInt(e.target.value)})}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? 'Creating...' : 'Create Assessment'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              
              <Dialog open={showProposalForm} onOpenChange={setShowProposalForm}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Vote className="h-4 w-4 mr-2" />
                    New Proposal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Governance Proposal</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProposalSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Proposal Title</Label>
                      <Input
                        id="title"
                        value={proposalForm.title}
                        onChange={(e) => setProposalForm({...proposalForm, title: e.target.value})}
                        placeholder="e.g., Update Risk Threshold Parameters"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={proposalForm.description}
                        onChange={(e) => setProposalForm({...proposalForm, description: e.target.value})}
                        placeholder="Detailed proposal description..."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (days)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={proposalForm.duration}
                        onChange={(e) => setProposalForm({...proposalForm, duration: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? 'Creating...' : 'Create Proposal'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="risk-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Risk Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-risk-high" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-high">
              {isConnected ? "78.5%" : "█████"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isConnected ? "+12% from last month" : "Encrypted"}
            </p>
          </CardContent>
        </Card>

        <Card className="risk-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Exposures</CardTitle>
            <AlertTriangle className="h-4 w-4 text-risk-medium" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-medium">
              {isConnected ? "6" : "█"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isConnected ? "2 require immediate attention" : "Encrypted"}
            </p>
          </CardContent>
        </Card>

        <Card className="risk-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mitigation Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-risk-low" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-low">
              {isConnected ? "34%" : "████"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isConnected ? "Improving governance response" : "Encrypted"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Heatmap */}
      <Card className="risk-card mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-risk-high" />
              <span>Risk Exposure Heatmap</span>
              {!isConnected && <Lock className="h-4 w-4 text-encrypted" />}
            </div>
            {isConnected && (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search risk categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48 pl-10"
                  />
                </div>
                <Select value={filterRisk} onValueChange={(value: any) => setFilterRisk(value)}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Categories</SelectItem>
                    <SelectItem value="high">High Risk Only</SelectItem>
                    <SelectItem value="medium">Medium Risk Only</SelectItem>
                    <SelectItem value="low">Low Risk Only</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-36">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exposure">Sort by Exposure</SelectItem>
                    <SelectItem value="impact">Sort by Impact</SelectItem>
                    <SelectItem value="mitigation">Sort by Mitigation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {isConnected 
              ? "Real-time risk analysis with FHE-encrypted data processing. Click the eye icon to decrypt specific risk categories."
              : "Connect your wallet to access encrypted risk exposure data and participate in governance decisions."
            }
          </div>
          {isConnected && (
            <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-2">
                <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-blue-900 dark:text-blue-100">Risk Heatmap Guide</div>
                  <div className="text-blue-700 dark:text-blue-300 mt-1">
                    <p>• <strong>Eye Icon:</strong> Click to decrypt/encrypt individual risk categories</p>
                    <p>• <strong>Filters:</strong> Use dropdown menus to filter by risk level and sort by metrics</p>
                    <p>• <strong>Progress Bars:</strong> Visual indicators for exposure, impact, and mitigation levels</p>
                    <p>• <strong>Trend Icons:</strong> Show whether risk levels are increasing, decreasing, or stable</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {/* Risk Statistics Summary */}
          {isConnected && (
            <div className="mb-6 p-4 rounded-lg bg-muted/30 border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-risk-high">
                    {filteredData.filter(item => item.risk === 'high').length}
                  </div>
                  <div className="text-sm text-muted-foreground">High Risk Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-risk-medium">
                    {filteredData.filter(item => item.risk === 'medium').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Medium Risk Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-risk-low">
                    {filteredData.filter(item => item.risk === 'low').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Low Risk Categories</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {searchTerm ? (
                    <>Showing {filteredData.length} results for "{searchTerm}" • </>
                  ) : (
                    <>Showing {filteredData.length} risk categories • </>
                  )}
                  {decryptedItems.size} decrypted • 
                  {filteredData.length - decryptedItems.size} encrypted
                </div>
                <div className="flex items-center space-x-2">
                  {searchTerm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchTerm("")}
                      className="text-xs"
                    >
                      Clear Search
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const allCategories = filteredData.map(item => item.category);
                      setDecryptedItems(new Set(allCategories));
                    }}
                    className="text-xs"
                  >
                    Decrypt All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDecryptedItems(new Set())}
                    className="text-xs"
                  >
                    Encrypt All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const decryptedData = filteredData.filter(item => decryptedItems.has(item.category));
                      const csvContent = [
                        'Risk Category,Exposure Level,Impact Level,Mitigation Status,Risk Level,Last Updated',
                        ...decryptedData.map(item => 
                          `${item.category},${item.exposure}%,${item.impact}%,${item.mitigation}%,${item.risk.toUpperCase()},${item.lastUpdated}`
                        )
                      ].join('\n');
                      
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'risk-exposure-heatmap.csv';
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                    className="text-xs"
                  >
                    Export CSV
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium">No Risk Categories Found</h3>
                <p className="text-sm">
                  {searchTerm ? (
                    <>No risk categories match your search for "{searchTerm}"</>
                  ) : (
                    <>No risk categories available for the selected filters</>
                  )}
                </p>
              </div>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm("")}
                  className="mt-4"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map((item) => {
              const isDecrypted = decryptedItems.has(item.category);
              const canView = isConnected && isDecrypted;

              return (
                <div key={item.category} className="relative">
                  <div className="risk-heatmap p-4">
                    {/* Risk Category Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-sm">
                          {canView || !isConnected ? item.category : "████████████"}
                        </h4>
                        {canView && getTrendIcon(item.trend)}
                      </div>
                      {isConnected && (
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {canView ? item.lastUpdated : "██ █████"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDecryption(item.category)}
                            className="h-6 w-6 p-0"
                            title={isDecrypted ? "Encrypt this risk category" : "Decrypt this risk category"}
                          >
                            {isDecrypted ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Risk Level */}
                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBg(
                          item.risk
                        )} ${getRiskColor(item.risk)}`}
                      >
                        {canView || !isConnected ? item.risk.toUpperCase() : "████"}
                      </div>
                    </div>

                    {/* Risk Metrics */}
                    <div className="space-y-3">
                      {/* Exposure */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium">Exposure Level</span>
                          <span className={getRiskColor(item.risk)}>
                            {canView || !isConnected ? `${item.exposure}%` : "██%"}
                          </span>
                        </div>
                        <Progress 
                          value={canView || !isConnected ? item.exposure : 50} 
                          className="h-2"
                        />
                        {canView && (
                          <div className="text-xs text-muted-foreground">
                            {item.exposure > 70 ? "Critical exposure level" : 
                             item.exposure > 40 ? "Moderate exposure level" : 
                             "Low exposure level"}
                          </div>
                        )}
                      </div>

                      {/* Impact & Mitigation when decrypted */}
                      {canView && (
                        <>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium">Potential Impact</span>
                              <span className="text-risk-high">{item.impact}%</span>
                            </div>
                            <Progress value={item.impact} className="h-1.5" />
                            <div className="text-xs text-muted-foreground">
                              {item.impact > 80 ? "High impact potential" : 
                               item.impact > 50 ? "Medium impact potential" : 
                               "Low impact potential"}
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium">Mitigation Status</span>
                              <span className="text-risk-low">{item.mitigation}%</span>
                            </div>
                            <Progress value={item.mitigation} className="h-1.5" />
                            <div className="text-xs text-muted-foreground">
                              {item.mitigation > 80 ? "Well mitigated" : 
                               item.mitigation > 50 ? "Partially mitigated" : 
                               "Requires attention"}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Encrypted Overlay */}
                    {!canView && (
                      <div className="encrypted-overlay">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock className="h-6 w-6 text-encrypted" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Security Pattern when encrypted */}
                  {!canView && (
                    <div className="absolute inset-0 encrypted-shimmer rounded-lg"></div>
                  )}
                </div>
              );
            })}
            </div>
          )}

          {/* Connection Required Notice */}
          {!isConnected && (
            <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-encrypted/30">
              <div className="flex items-center space-x-2 text-encrypted">
                <Lock className="h-5 w-5" />
                <span className="font-medium">Governance Authorization Required</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Connect your wallet and verify DAO membership to access encrypted risk exposure data and participate in governance decisions.
              </p>
              <div className="mt-3 text-xs text-muted-foreground">
                <p>• FHE-encrypted risk assessments require member verification</p>
                <p>• Governance participation requires active membership status</p>
                <p>• All sensitive data is protected with fully homomorphic encryption</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};