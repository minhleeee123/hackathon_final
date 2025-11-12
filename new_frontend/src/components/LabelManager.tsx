import { useState } from 'react';
import { GmailLabel } from '../types';
import { X, Plus, Tag, Trash2 } from 'lucide-react';

interface LabelManagerProps {
  isOpen: boolean;
  onClose: () => void;
  gmailLabels: GmailLabel[];
  onCreateLabel: (name: string, color?: string) => Promise<void>;
  onDeleteLabel: (labelId: string) => Promise<void>;
}

const GMAIL_COLORS = [
  { name: 'Red', value: '#fb4c2f' },
  { name: 'Orange', value: '#ffad47' },
  { name: 'Yellow', value: '#fad165' },
  { name: 'Green', value: '#16a766' },
  { name: 'Teal', value: '#43d692' },
  { name: 'Blue', value: '#4a86e8' },
  { name: 'Purple', value: '#a479e2' },
  { name: 'Pink', value: '#f691b3' },
  { name: 'Gray', value: '#999999' },
];

export default function LabelManager({
  isOpen,
  onClose,
  gmailLabels,
  onCreateLabel,
  onDeleteLabel,
}: LabelManagerProps) {
  const [labelName, setLabelName] = useState('');
  const [selectedColor, setSelectedColor] = useState(GMAIL_COLORS[0].value);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingLabelId, setDeletingLabelId] = useState<string | null>(null);

  const userLabels = gmailLabels.filter(label => label.type === 'user');

  // Debug log
  console.log('LabelManager render - Total labels:', gmailLabels.length, 'User labels:', userLabels.length);

  const handleCreateLabel = async () => {
    if (!labelName.trim()) return;
    
    setIsCreating(true);
    try {
      await onCreateLabel(labelName.trim(), selectedColor);
      setLabelName('');
      setSelectedColor(GMAIL_COLORS[0].value);
      // Success feedback
      console.log('Label created successfully');
    } catch (error) {
      console.error('Failed to create label:', error);
      alert('Không thể tạo label. Vui lòng thử lại.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteLabel = async (labelId: string, labelName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa label "${labelName}"?`)) return;
    
    setDeletingLabelId(labelId);
    try {
      await onDeleteLabel(labelId);
    } catch (error) {
      console.error('Failed to delete label:', error);
      alert('Failed to delete label');
    } finally {
      setDeletingLabelId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Quản lý Labels</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Create Label Form */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Tạo label mới</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              placeholder="Tên label..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateLabel()}
            />
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Màu:</span>
              <div className="flex gap-2 flex-wrap">
                {GMAIL_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color.value
                        ? 'border-gray-900 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleCreateLabel}
              disabled={isCreating || !labelName.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
              {isCreating ? 'Đang tạo...' : 'Tạo label'}
            </button>
          </div>
        </div>

        {/* Labels List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Labels hiện có ({userLabels.length})
          </h3>
          
          {userLabels.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Tag className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Chưa có label nào</p>
            </div>
          ) : (
            <div className="space-y-2">
              {userLabels.map((label) => (
                <div
                  key={label.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: label.color?.backgroundColor || '#999999' }}
                    />
                    <span className="text-sm font-medium text-gray-900">{label.name}</span>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteLabel(label.id, label.name)}
                    disabled={deletingLabelId === label.id}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    title="Xóa label"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
