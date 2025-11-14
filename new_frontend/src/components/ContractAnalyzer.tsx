import { useState, useEffect } from 'react';
import { FileText, AlertTriangle, CheckCircle, TrendingUp, Search, Download, Mail, CheckSquare, XCircle, Sparkles } from 'lucide-react';
import { Contract, RiskLevel } from '../types';
import { mockContracts } from '../mockContractData';
import { useTheme } from './ThemeProvider';

interface ContractAnalyzerProps {
  contractsAnalyzed?: boolean;
  isAnalyzing?: boolean;
  analysisProgress?: { current: number; total: number };
}

export default function ContractAnalyzer({ 
  contractsAnalyzed = false,
  isAnalyzing = false,
  analysisProgress = { current: 0, total: 0 }
}: ContractAnalyzerProps) {
  const { theme } = useTheme();
  
  // Only use contracts if analysis is complete
  const contracts = contractsAnalyzed ? mockContracts : [];
  
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all');

  // Set first contract when analysis completes
  useEffect(() => {
    if (contractsAnalyzed && contracts.length > 0 && !selectedContract) {
      setSelectedContract(contracts[0]);
    }
  }, [contractsAnalyzed, contracts, selectedContract]);

  // Statistics
  const totalContracts = contracts.length;
  const highRiskCount = contracts.filter(c => c.riskAnalysis.riskLevel === 'high').length;
  const mediumRiskCount = contracts.filter(c => c.riskAnalysis.riskLevel === 'medium').length;
  const signedCount = contracts.filter(c => c.contractDetails.status === 'signed').length;

  // Filter contracts
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.contractDetails.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.contractDetails.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'all' || contract.riskAnalysis.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const getRiskColor = (level: RiskLevel) => {
    switch(level) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
    }
  };

  const getRiskBgColor = (level: RiskLevel) => {
    switch(level) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'bg-green-100 dark:bg-green-900/30';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { label: string; className: string } } = {
      pending_review: { label: 'Pending Review', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
      under_negotiation: { label: 'Under Negotiation', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      approved: { label: 'Approved', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
      signed: { label: 'Signed', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
      rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
    };
    const config = statusConfig[status] || statusConfig.pending_review;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>{config.label}</span>;
  };

  const formatCurrency = (value: number, currency: string) => {
    if (value === 0) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
  };

  // Empty state - show when not yet analyzed
  if (!contractsAnalyzed && !isAnalyzing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen" style={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#f9fafb' }}>
        <FileText className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-6" />
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Contract Analyzer</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
          Chọn email chứa hợp đồng và click button "Contract Analyzer" để AI phân tích tự động
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Sparkles className="w-4 h-4" />
          <span>AI sẽ phân tích rủi ro, điều khoản quan trọng và đưa ra khuyến nghị</span>
        </div>
      </div>
    );
  }

  // Loading state - show during analysis
  if (isAnalyzing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen" style={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#f9fafb' }}>
        <div className="relative mb-8">
          <FileText className="w-24 h-24 text-purple-400 animate-pulse" />
          <Sparkles className="w-8 h-8 text-purple-600 absolute top-0 right-0 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Đang phân tích hợp đồng...</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          AI đang trích xuất điều khoản và phân tích rủi ro
        </p>
        
        {analysisProgress.total > 0 && (
          <div className="w-96">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Đã phân tích: {analysisProgress.current}/{analysisProgress.total} hợp đồng
              </span>
              <span className="text-sm font-bold text-purple-600">
                {Math.round((analysisProgress.current / analysisProgress.total) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(analysisProgress.current / analysisProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden" style={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#f9fafb' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Contract Analyzer</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search contracts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border text-sm"
                style={{ 
                  borderColor: 'var(--border)', 
                  backgroundColor: theme === 'dark' ? '#334155' : '#ffffff',
                  color: 'var(--foreground)'
                }}
              />
            </div>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value as RiskLevel | 'all')}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{ 
                borderColor: 'var(--border)', 
                backgroundColor: theme === 'dark' ? '#334155' : '#ffffff',
                color: 'var(--foreground)'
              }}
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: theme === 'dark' ? '#334155' : '#f0f9ff' }}>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Total Contracts</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{totalContracts}</div>
          </div>
          
          <div className="p-2 rounded-lg" style={{ backgroundColor: theme === 'dark' ? '#334155' : '#fef2f2' }}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">High Risk</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{highRiskCount}</div>
          </div>

          <div className="p-2 rounded-lg" style={{ backgroundColor: theme === 'dark' ? '#334155' : '#fefce8' }}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-yellow-600" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Medium Risk</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{mediumRiskCount}</div>
          </div>

          <div className="p-2 rounded-lg" style={{ backgroundColor: theme === 'dark' ? '#334155' : '#f0fdf4' }}>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Signed</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{signedCount}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Contract List */}
        <div className="w-2/5 border-r overflow-y-auto" style={{ borderColor: 'var(--border)', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}>
          <div className="p-4">
            <h2 className="text-sm font-semibold mb-3 text-gray-500 dark:text-gray-400">CONTRACTS ({filteredContracts.length})</h2>
            <div className="space-y-2">
              {filteredContracts.map((contract) => (
                <button
                  key={contract.id}
                  onClick={() => setSelectedContract(contract)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    selectedContract?.id === contract.id 
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500' 
                      : 'border hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                  style={{ 
                    borderColor: selectedContract?.id === contract.id ? undefined : 'var(--border)',
                    backgroundColor: selectedContract?.id === contract.id ? undefined : (theme === 'dark' ? '#334155' : '#ffffff')
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-2xl ${getRiskColor(contract.riskAnalysis.riskLevel)}`}>
                      {contract.riskAnalysis.riskLevel === 'high' ? '🔴' : contract.riskAnalysis.riskLevel === 'medium' ? '🟡' : '🟢'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 font-medium uppercase">
                      {contract.contractDetails.type}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
                    {contract.contractDetails.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{contract.contractDetails.client}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-purple-600">
                      {formatCurrency(contract.contractDetails.value, contract.contractDetails.currency)}
                    </span>
                    <span className={`font-medium ${getRiskColor(contract.riskAnalysis.riskLevel)}`}>
                      Risk: {contract.riskAnalysis.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Received: {new Date(contract.contractDetails.receivedDate).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Contract Detail */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedContract ? (
            <>
          {/* Overview Section */}
          <div className="mb-6 p-6 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Overview</h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                  {selectedContract.contractDetails.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">From: {selectedContract.contractDetails.client}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Received: {new Date(selectedContract.contractDetails.receivedDate).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Contract Type</span>
                  <p className="font-semibold uppercase" style={{ color: 'var(--foreground)' }}>{selectedContract.contractDetails.type}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Contract Value</span>
                  <p className="font-semibold text-purple-600">
                    {formatCurrency(selectedContract.contractDetails.value, selectedContract.contractDetails.currency)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{selectedContract.contractDetails.duration || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <div className="mt-1">{getStatusBadge(selectedContract.contractDetails.status)}</div>
                </div>
                {selectedContract.contractDetails.deadline && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Signature Deadline</span>
                    <p className="font-semibold text-red-600">
                      {new Date(selectedContract.contractDetails.deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Key Terms */}
              {selectedContract.contractDetails.keyTerms && selectedContract.contractDetails.keyTerms.length > 0 && (
                <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Key Terms</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {selectedContract.contractDetails.keyTerms.map((term, idx) => (
                      <li key={idx}>{term}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Attachments */}
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Attachments</h4>
                <div className="space-y-2">
                  {selectedContract.attachments.map((att) => (
                    <div key={att.id} className="flex items-center justify-between p-3 rounded bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{att.name}</span>
                        <span className="text-xs text-gray-500">({(att.size / 1024).toFixed(0)} KB)</span>
                      </div>
                      <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Risk Analysis Section */}
          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Risk Analysis</h2>
            </div>

            {/* Risk Score */}
            <div className={`p-4 rounded-lg mb-6 ${getRiskBgColor(selectedContract.riskAnalysis.riskLevel)}`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Overall Risk Score</span>
                <div className="flex items-center gap-3">
                  <span className={`text-3xl font-bold ${getRiskColor(selectedContract.riskAnalysis.riskLevel)}`}>
                    {selectedContract.riskAnalysis.overallScore}/10
                  </span>
                  <span className={`px-3 py-1 rounded-full font-bold uppercase ${getRiskColor(selectedContract.riskAnalysis.riskLevel)}`}>
                    {selectedContract.riskAnalysis.riskLevel} RISK
                  </span>
                </div>
              </div>
            </div>

            {/* Critical Risks */}
            {selectedContract.riskAnalysis.criticalRisks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <span className="text-red-600">🔴 CRITICAL RISKS</span>
                  <span className="text-sm font-normal text-gray-600">({selectedContract.riskAnalysis.criticalRisks.length})</span>
                </h3>
                <div className="space-y-4">
                  {selectedContract.riskAnalysis.criticalRisks.map((risk, idx) => (
                    <div key={idx} className="p-4 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        {risk.title}
                      </h4>
                      <p className="text-sm mb-3 text-gray-700 dark:text-gray-300">{risk.description}</p>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded">
                        <p className="text-sm font-semibold mb-1 flex items-center gap-1">
                          💡 Recommendation:
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{risk.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Moderate Risks */}
            {selectedContract.riskAnalysis.moderateRisks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <span className="text-yellow-600">🟡 MODERATE RISKS</span>
                  <span className="text-sm font-normal text-gray-600">({selectedContract.riskAnalysis.moderateRisks.length})</span>
                </h3>
                <ul className="space-y-2">
                  {selectedContract.riskAnalysis.moderateRisks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span style={{ color: 'var(--foreground)' }}>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Favorable Terms */}
            {selectedContract.riskAnalysis.favorableTerms.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <span className="text-green-600">✅ FAVORABLE TERMS</span>
                  <span className="text-sm font-normal text-gray-600">({selectedContract.riskAnalysis.favorableTerms.length})</span>
                </h3>
                <ul className="space-y-2">
                  {selectedContract.riskAnalysis.favorableTerms.map((term, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span style={{ color: 'var(--foreground)' }}>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Mail className="w-4 h-4" />
                Request Changes
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <CheckSquare className="w-4 h-4" />
                Approve Contract
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
          </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">Select a contract to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
