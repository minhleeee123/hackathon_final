import { Email, GmailLabel } from '../types';
import { Star, Archive, Trash2, MoreVertical, RefreshCw, Sparkles, ListTodo, DollarSign, Paperclip } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useTheme } from './ThemeProvider';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  selectedEmails: Set<string>;
  gmailLabels: GmailLabel[];
  onSelectEmail: (id: string) => void;
  onToggleStar: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onBulkDelete: () => void;
  onBulkMarkAsRead: (isRead: boolean) => void;
  onBulkClassify?: () => void;
  onBulkExtractTasks?: () => void;
  onBulkExtractPayments?: () => void;
  onMoveSpamToTrash?: () => void;
  isClassifying?: boolean;
  isExtractingTasks?: boolean;
  isExtractingPayments?: boolean;
  classificationProgress?: { current: number; total: number };
  taskExtractionProgress?: { current: number; total: number };
  paymentExtractionProgress?: { current: number; total: number };
}

export default function EmailList({
  emails,
  selectedEmailId,
  selectedEmails,
  gmailLabels,
  onSelectEmail,
  onToggleStar,
  onToggleSelect,
  onSelectAll,
  onBulkDelete,
  onBulkMarkAsRead,
  onBulkClassify,
  onBulkExtractTasks,
  onBulkExtractPayments,
  onMoveSpamToTrash,
  isClassifying = false,
  isExtractingTasks = false,
  isExtractingPayments = false,
  classificationProgress = { current: 0, total: 0 },
  taskExtractionProgress = { current: 0, total: 0 },
  paymentExtractionProgress = { current: 0, total: 0 },
}: EmailListProps) {
  const { theme } = useTheme();
  const hasSelection = selectedEmails.size > 0;

  // Helper to get label color class
  const getLabelColorClass = (label: GmailLabel): string => {
    if (!label.color?.backgroundColor) {
      return 'bg-gray-200 text-gray-700';
    }
    
    const bg = label.color.backgroundColor.toLowerCase();
    
    // Direct color mapping from Gmail palette
    const colorMap: { [key: string]: string } = {
      // Green shades
      '#42d692': 'bg-green-100 text-green-800',
      '#16a765': 'bg-green-700 text-white',
      '#43d692': 'bg-green-100 text-green-700',
      
      // Yellow shades
      '#fbd75b': 'bg-yellow-100 text-yellow-800',
      '#fad165': 'bg-yellow-100 text-yellow-800',
      
      // Red shades
      '#fb4c2f': 'bg-red-100 text-red-800',
      '#ac2b16': 'bg-red-800 text-white',
      
      // Pink shades
      '#e07798': 'bg-pink-100 text-pink-800',
      '#f691b3': 'bg-pink-100 text-pink-800',
      
      // Orange shades
      '#ffad47': 'bg-orange-100 text-orange-800',
      
      // Blue shades
      '#4a86e8': 'bg-blue-100 text-blue-800',
      
      // Purple shades
      '#a479e2': 'bg-purple-100 text-purple-800',
      '#b99aff': 'bg-purple-200 text-purple-900',
      
      // Gray shades (Uncertain)
      '#a0a0a0': 'bg-gray-200 text-gray-800',
    };

    // If exact match found, use it
    if (colorMap[bg]) {
      return colorMap[bg];
    }
    
    // Otherwise use inline styles with actual color
    return '';
  };

  // Helper to get inline styles for labels
  const getLabelStyle = (label: GmailLabel): React.CSSProperties => {
    if (!label.color?.backgroundColor) {
      return {};
    }
    
    const colorMap: { [key: string]: string } = {
      '#42d692': '', '#16a765': '', '#43d692': '',
      '#fbd75b': '', '#fad165': '',
      '#fb4c2f': '', '#ac2b16': '',
      '#e07798': '', '#f691b3': '',
      '#ffad47': '', '#4a86e8': '', '#a479e2': ''
    };
    
    const bg = label.color.backgroundColor.toLowerCase();
    
    // If in predefined palette, use Tailwind classes (return empty style)
    if (colorMap.hasOwnProperty(bg)) {
      return {};
    }
    
    // For custom colors, use inline styles
    return {
      backgroundColor: label.color.backgroundColor,
      color: label.color.textColor || '#ffffff'
    };
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden transition-colors" style={{ backgroundColor: theme === 'dark' ? 'var(--background)' : '#f5f3ff' }}>
      {/* Toolbar */}
      <div 
        className="h-12 flex items-center px-4 gap-2 flex-shrink-0 transition-colors" 
        style={{ borderBottom: '1px solid var(--border)', backgroundColor: theme === 'dark' ? '#0f172a' : '#f5f3ff' }}
      >
        <input
          type="checkbox"
          checked={hasSelection && selectedEmails.size === emails.length}
          onChange={onSelectAll}
          className="gmail-checkbox"
        />

        {hasSelection ? (
          <>
            {onBulkClassify && (
              <>
                <button
                  onClick={onBulkClassify}
                  disabled={isClassifying || isExtractingTasks}
                  className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 text-sm font-medium ${
                    isClassifying 
                      ? 'bg-blue-400 text-white cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  title="Phân loại tự động bằng AI"
                >
                  <Sparkles className={`w-4 h-4 ${isClassifying ? 'animate-spin' : ''}`} />
                  {isClassifying ? 'Đang phân loại...' : 'Phân loại tự động'}
                </button>
                
                {isClassifying && classificationProgress.total > 0 && (
                  <div className="flex items-center gap-2 ml-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(classificationProgress.current / classificationProgress.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {classificationProgress.current}/{classificationProgress.total}
                    </span>
                  </div>
                )}
              </>
            )}
            {onBulkExtractTasks && (
              <>
                <button
                  onClick={onBulkExtractTasks}
                  disabled={isExtractingTasks || isClassifying}
                  className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 text-sm font-medium ${
                    isExtractingTasks 
                      ? 'bg-green-400 text-white cursor-not-allowed' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                  title="Trích xuất task từ email bằng AI"
                >
                  <ListTodo className={`w-4 h-4 ${isExtractingTasks ? 'animate-spin' : ''}`} />
                  {isExtractingTasks ? 'Đang trích xuất...' : 'Trích xuất Task'}
                </button>
                
                {isExtractingTasks && taskExtractionProgress.total > 0 && (
                  <div className="flex items-center gap-2 ml-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(taskExtractionProgress.current / taskExtractionProgress.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {taskExtractionProgress.current}/{taskExtractionProgress.total}
                    </span>
                  </div>
                )}
              </>
            )}
            {onBulkExtractPayments && (
              <>
                <button
                  onClick={onBulkExtractPayments}
                  disabled={isExtractingPayments || isClassifying || isExtractingTasks}
                  className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 text-sm font-medium ${
                    isExtractingPayments 
                      ? 'bg-yellow-400 text-white cursor-not-allowed' 
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  }`}
                  title="Trích xuất thông tin thanh toán từ email tài chính"
                >
                  <DollarSign className={`w-4 h-4 ${isExtractingPayments ? 'animate-spin' : ''}`} />
                  {isExtractingPayments ? 'Đang trích xuất...' : 'Trích xuất Payment'}
                </button>
                
                {isExtractingPayments && paymentExtractionProgress.total > 0 && (
                  <div className="flex items-center gap-2 ml-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(paymentExtractionProgress.current / paymentExtractionProgress.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {paymentExtractionProgress.current}/{paymentExtractionProgress.total}
                    </span>
                  </div>
                )}
              </>
            )}
            {onMoveSpamToTrash && (
              <button
                onClick={onMoveSpamToTrash}
                className="px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                title="Chuyển tất cả email spam vào thùng rác"
              >
                <Trash2 className="w-4 h-4" />
                Spam → Thùng rác
              </button>
            )}
            <div className="w-px h-6 bg-gray-300 dark:bg-emerald-500 mx-1" />
            <button
              onClick={() => onBulkMarkAsRead(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title="Mark as read"
            >
              <Archive className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={onBulkDelete}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => onBulkMarkAsRead(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title="Mark as unread"
            >
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {selectedEmails.size} selected
            </span>
          </>
        ) : (
          <>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" title="Refresh">
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" title="More">
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </>
        )}

        <div className="flex-1" />

        <span className="text-sm text-gray-600 dark:text-gray-400">
          {emails.length} {emails.length === 1 ? 'email' : 'emails'}
        </span>
      </div>

      {/* Email list */}
      <div className="flex-1 overflow-y-auto">
        {emails.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">📭</div>
              <div className="text-lg">No emails found</div>
            </div>
          </div>
        ) : (
          emails.map((email) => (
            <div
              key={email.id}
              className={`
                email-item flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-emerald-500/30 cursor-pointer transition-all
                ${selectedEmailId === email.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                ${selectedEmails.has(email.id) ? 'selected' : ''}
                ${!email.isRead ? 'unread' : ''}
              `}
              onClick={() => onSelectEmail(email.id)}
            >
              <input
                type="checkbox"
                checked={selectedEmails.has(email.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleSelect(email.id);
                }}
                className="gmail-checkbox"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar(email.id);
                }}
                className="flex-shrink-0"
              >
                <Star
                  className={`w-5 h-5 ${
                    email.isStarred
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className={`text-sm dark:text-gray-200 ${!email.isRead ? 'font-bold' : ''}`}>
                    {email.from.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {formatDistanceToNow(email.date, { addSuffix: true, locale: vi })}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-sm ${!email.isRead ? 'font-semibold dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                    {email.subject || '(No subject)'}
                  </span>
                  {email.hasAttachments && (
                    <Paperclip className="w-3 h-3 text-gray-400" />
                  )}
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                  {email.snippet}
                </div>

                {email.labels.length > 0 && (() => {
                  // Only show user-created labels
                  const userLabels = email.labels
                    .map(labelId => gmailLabels.find(l => l.id === labelId))
                    .filter(label => label && label.type === 'user');
                  
                  if (userLabels.length === 0) return null;
                  
                  return (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {userLabels.slice(0, 3).map((label) => {
                        const colorClass = getLabelColorClass(label!);
                        const inlineStyle = getLabelStyle(label!);
                        return (
                          <span
                            key={label!.id}
                            className={`px-2 py-0.5 rounded text-xs ${colorClass || 'text-white'}`}
                            style={inlineStyle}
                          >
                            {label!.name}
                          </span>
                        );
                      })}
                      {userLabels.length > 3 && (
                        <span className="text-xs text-gray-500">+{userLabels.length - 3}</span>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
