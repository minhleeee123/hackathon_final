import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { Email } from '../types';
import { classifyEmailsBulk, getClassificationSummary, BulkClassificationResult } from '../services/aiService';

interface ClassificationDialogProps {
  isOpen: boolean;
  selectedEmails: Email[];
  onClose: () => void;
  onComplete: (results: BulkClassificationResult[]) => void;
}

export default function ClassificationDialog({
  isOpen,
  selectedEmails,
  onClose,
  onComplete
}: ClassificationDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, emailId: '' });
  const [results, setResults] = useState<BulkClassificationResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isOpen && selectedEmails.length > 0 && !isProcessing && results.length === 0) {
      startClassification();
    }
  }, [isOpen, selectedEmails]);

  const startClassification = async () => {
    setIsProcessing(true);
    setIsComplete(false);

    try {
      const classificationResults = await classifyEmailsBulk(
        selectedEmails,
        (current, total, emailId) => {
          setProgress({ current, total, emailId });
        }
      );

      setResults(classificationResults);
      setIsComplete(true);
      
      // Auto-apply labels immediately after classification completes
      setTimeout(() => {
        onComplete(classificationResults);
        handleClose();
      }, 1500); // Show results for 1.5 seconds before auto-closing
    } catch (error) {
      console.error('Classification error:', error);
      alert('Có lỗi xảy ra khi phân loại email');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setProgress({ current: 0, total: 0, emailId: '' });
    setResults([]);
    setIsComplete(false);
    onClose();
  };

  if (!isOpen) return null;

  const summary = results.length > 0 ? getClassificationSummary(results) : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Phân loại tự động</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isProcessing && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-700">Đang phân loại email...</span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Đang xử lý: {progress.current} / {progress.total}</span>
                  <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              </div>

              <p className="text-sm text-gray-500 text-center">
                Vui lòng đợi, quá trình này có thể mất vài phút...
              </p>
            </div>
          )}

          {isComplete && summary && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3 text-green-600">
                <CheckCircle className="w-8 h-8" />
                <span className="text-lg font-semibold">Hoàn thành! Đang áp dụng nhãn...</span>
              </div>

              {/* Summary Stats */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Kết quả phân loại:</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded border">
                    <div className="text-2xl font-bold text-blue-600">{summary.successful}</div>
                    <div className="text-sm text-gray-600">Thành công</div>
                  </div>
                  
                  {summary.failed > 0 && (
                    <div className="bg-white p-3 rounded border">
                      <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
                      <div className="text-sm text-gray-600">Thất bại</div>
                    </div>
                  )}
                  
                  <div className="bg-white p-3 rounded border">
                    <div className="text-2xl font-bold text-purple-600">{summary.withTasks}</div>
                    <div className="text-sm text-gray-600">Có task</div>
                  </div>
                  
                  {summary.spamDetected > 0 && (
                    <div className="bg-white p-3 rounded border">
                      <div className="text-2xl font-bold text-orange-600">{summary.spamDetected}</div>
                      <div className="text-sm text-gray-600">Spam phát hiện</div>
                    </div>
                  )}
                </div>

                {/* By Category */}
                {Object.keys(summary.byCategory).length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Phân loại:</h4>
                    <div className="space-y-1">
                      {Object.entries(summary.byCategory).map(([category, count]) => (
                        <div key={category} className="flex justify-between text-sm">
                          <span className="text-gray-600">{category}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
