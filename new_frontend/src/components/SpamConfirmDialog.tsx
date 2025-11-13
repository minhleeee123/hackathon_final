import { AlertCircle } from 'lucide-react';

interface SpamConfirmDialogProps {
  isOpen: boolean;
  spamCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SpamConfirmDialog({
  isOpen,
  spamCount,
  onConfirm,
  onCancel
}: SpamConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Xác nhận chuyển vào thùng rác</h2>
          </div>

          <p className="text-gray-700 mb-2">
            Đã phát hiện <strong>{spamCount} email</strong> được phân loại là <strong>Spam hoặc Quảng cáo</strong>.
          </p>

          <p className="text-gray-600 text-sm">
            Bạn có muốn chuyển các email này vào thùng rác không?
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Không, giữ lại
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Chuyển vào thùng rác
          </button>
        </div>
      </div>
    </div>
  );
}
