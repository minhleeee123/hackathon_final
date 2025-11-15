import React from 'react';
import { SystemAnalysisResult, AgentSuggestion } from '../types';

interface AgentSuggestionsProps {
  analysis: SystemAnalysisResult;
  onClose?: () => void;
}

const IMPACT_COLORS = {
  high: 'bg-green-100 text-green-800 border-green-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-gray-100 text-gray-800 border-gray-300',
};

const IMPACT_LABELS = {
  high: 'Tác động cao',
  medium: 'Tác động trung bình',
  low: 'Tác động thấp',
};

const AgentSuggestions: React.FC<AgentSuggestionsProps> = ({ analysis, onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Phân tích hệ thống & Đề xuất Agents</h2>
            <p className="text-blue-100">
              Dựa trên profile và nhu cầu của bạn, chúng tôi đề xuất các agents sau
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overall Assessment */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h3 className="font-semibold text-blue-900 mb-2">Đánh giá tổng quan</h3>
          <p className="text-blue-800">{analysis.overallAssessment}</p>
        </div>

        {/* Current Agents */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3">Agents hiện tại</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.currentAgents.map((agent, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm"
              >
                {agent}
              </span>
            ))}
          </div>
        </div>

        {/* Suggested Agents */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4 text-lg">
            Agents được đề xuất ({analysis.suggestedAgents.length})
          </h3>
          <div className="space-y-4">
            {analysis.suggestedAgents
              .sort((a, b) => a.priority - b.priority)
              .map((agent, index) => (
                <AgentCard key={index} agent={agent} />
              ))}
          </div>
        </div>

        {/* Workflow Recommendations */}
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
          <h3 className="font-semibold text-purple-900 mb-3">
            Đề xuất cải thiện workflow
          </h3>
          <ul className="space-y-2">
            {analysis.workflowRecommendations.map((rec, index) => (
              <li key={index} className="flex items-start text-purple-800">
                <span className="mr-2">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Reasoning */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Lý do phân tích</h3>
          <p className="text-gray-700 text-sm">{analysis.reasoning}</p>
        </div>
      </div>
    </div>
  );
};

// Agent Card Component
const AgentCard: React.FC<{ agent: AgentSuggestion }> = ({ agent }) => {
  const impactColor = IMPACT_COLORS[agent.estimatedImpact as keyof typeof IMPACT_COLORS];
  const impactLabel = IMPACT_LABELS[agent.estimatedImpact as keyof typeof IMPACT_LABELS];

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-lg font-semibold text-gray-900">{agent.name}</h4>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              #{agent.priority}
            </span>
          </div>
          <p className="text-sm text-gray-600">{agent.description}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${impactColor}`}>
          {impactLabel}
        </div>
      </div>

      {/* Purpose */}
      <div className="mb-3">
        <p className="text-sm">
          <span className="font-medium text-gray-700">Mục đích:</span>{' '}
          <span className="text-gray-600">{agent.purpose}</span>
        </p>
      </div>

      {/* Features & Use Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {/* Features */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2">Tính năng:</p>
          <ul className="space-y-1">
            {agent.features.map((feature, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start">
                <span className="mr-1">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Use Cases */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2">💼 Tình huống sử dụng:</p>
          <ul className="space-y-1">
            {agent.useCases.map((useCase, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start">
                <span className="mr-1">•</span>
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reasoning */}
      <div className="bg-gray-50 p-2 rounded text-xs">
        <p className="text-gray-600">
          <span className="font-medium">Lý do đề xuất:</span> {agent.reasoning}
        </p>
      </div>
    </div>
  );
};

export default AgentSuggestions;
