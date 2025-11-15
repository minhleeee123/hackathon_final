import React, { useState } from 'react';
import UserProfileForm from './UserProfileForm';
import AgentSuggestions from './AgentSuggestions';
import { SystemAnalysisResult } from '../types';
import * as unifiedAIService from '../services/unifiedAIService';

const SystemAnalyzer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SystemAnalysisResult | null>(null);

  const handleProfileSubmit = async (profile: unifiedAIService.UserProfile) => {
    setLoading(true);
    setError(null);

    try {
      const result = await unifiedAIService.analyzeProfile(profile);
      // Convert backend result to frontend type
      setAnalysisResult(result as unknown as SystemAnalysisResult);
    } catch (err) {
      console.error('Profile analysis error:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi phân tích profile');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🤖 AI Agent System Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Nhập thông tin của bạn để nhận đề xuất các AI agents phù hợp
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-lg font-semibold text-gray-700">
                Đang phân tích profile của bạn...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                LLM đang xử lý và đề xuất các agents phù hợp
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">❌</span>
              <div>
                <p className="font-semibold text-red-800">Lỗi phân tích</p>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Profile Form or Results */}
        {!loading && !analysisResult && (
          <UserProfileForm onSubmit={handleProfileSubmit} />
        )}

        {!loading && analysisResult && (
          <div>
            <AgentSuggestions analysis={analysisResult} />
            <div className="mt-6 text-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
              >
                ← Phân tích lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemAnalyzer;
