import React, { useState } from 'react';
import { X } from 'lucide-react';
import UserProfileForm from './UserProfileForm';
import AgentSuggestions from './AgentSuggestions';
import { UserProfile, SystemAnalysisResult } from '../types';
import * as unifiedAIService from '../services/unifiedAIService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SystemAnalysisResult | null>(null);

  if (!isOpen) return null;

  const handleProfileSubmit = async (profile: UserProfile) => {
    setLoading(true);
    setError(null);

    try {
      const result = await unifiedAIService.analyzeProfile(profile);
      setAnalysisResult(result as unknown as SystemAnalysisResult);
    } catch (err) {
      console.error('Profile analysis error:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi phân tích profile');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Phân tích & Đề xuất AI Agents
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Nhập thông tin của bạn để hệ thống phân tích và đề xuất các AI agents phù hợp
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Đang phân tích profile của bạn...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  AI đang xử lý và đề xuất các agents phù hợp
                </p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <span className="text-2xl mr-3">×</span>
                <div>
                  <p className="font-semibold text-red-800 dark:text-red-300">Lỗi phân tích</p>
                  <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                </div>
              </div>
              <button
                onClick={handleBackToForm}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Thử lại
              </button>
            </div>
          )}

          {!loading && !analysisResult && (
            <UserProfileForm onSubmit={handleProfileSubmit} />
          )}

          {!loading && analysisResult && (
            <div>
              <AgentSuggestions analysis={analysisResult} />
              <div className="mt-6 text-center">
                <button
                  onClick={handleBackToForm}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
                >
                  « Phân tích lại
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
