import { useState, useRef, useEffect } from 'react';
import { GmailLabel } from '../types';
import { Tag, Check, X } from 'lucide-react';

interface EmailLabelMenuProps {
  emailId: string;
  currentLabels: string[];
  gmailLabels: GmailLabel[];
  onAddLabel: (emailId: string, labelIds: string[]) => Promise<void>;
  onRemoveLabel: (emailId: string, labelIds: string[]) => Promise<void>;
}

export default function EmailLabelMenu({
  emailId,
  currentLabels,
  gmailLabels,
  onAddLabel,
  onRemoveLabel,
}: EmailLabelMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userLabels = gmailLabels.filter(label => label.type === 'user');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggleLabel = async (labelId: string) => {
    const hasLabel = currentLabels.includes(labelId);
    
    setIsUpdating(true);
    try {
      if (hasLabel) {
        await onRemoveLabel(emailId, [labelId]);
      } else {
        await onAddLabel(emailId, [labelId]);
      }
    } catch (error) {
      console.error('Failed to update label:', error);
      alert('Failed to update label');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        title="Manage labels"
      >
        <Tag className="w-5 h-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Label as:</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto p-2">
            {userLabels.length === 0 ? (
              <div className="text-center py-6 text-gray-400">
                <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Chưa có label nào</p>
                <p className="text-xs mt-1">Tạo label mới trong Sidebar</p>
              </div>
            ) : (
              userLabels.map((label) => {
                const isActive = currentLabels.includes(label.id);
                return (
                  <button
                    key={label.id}
                    onClick={() => handleToggleLabel(label.id)}
                    disabled={isUpdating}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : 'hover:bg-gray-100'
                    } disabled:opacity-50`}
                  >
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {isActive ? (
                        <Check className="w-4 h-4 text-blue-600" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                      )}
                    </div>
                    
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: label.color?.backgroundColor || '#999999' }}
                    />
                    
                    <span className={`text-sm flex-1 text-left ${
                      isActive ? 'font-medium text-gray-900' : 'text-gray-700'
                    }`}>
                      {label.name}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
