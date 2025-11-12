import { Email } from '../types';
import { Star, Archive, Trash2, MoreVertical, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { labels } from '../mockData';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  selectedEmails: Set<string>;
  onSelectEmail: (id: string) => void;
  onToggleStar: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onBulkDelete: () => void;
  onBulkMarkAsRead: (isRead: boolean) => void;
}

export default function EmailList({
  emails,
  selectedEmailId,
  selectedEmails,
  onSelectEmail,
  onToggleStar,
  onToggleSelect,
  onSelectAll,
  onBulkDelete,
  onBulkMarkAsRead,
}: EmailListProps) {
  const hasSelection = selectedEmails.size > 0;

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="h-12 border-b border-gray-200 flex items-center px-4 gap-2 flex-shrink-0">
        <input
          type="checkbox"
          checked={hasSelection && selectedEmails.size === emails.length}
          onChange={onSelectAll}
          className="gmail-checkbox"
        />

        {hasSelection ? (
          <>
            <button
              onClick={() => onBulkMarkAsRead(true)}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Mark as read"
            >
              <Archive className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onBulkDelete}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Delete"
            >
              <Trash2 className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => onBulkMarkAsRead(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Mark as unread"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600 ml-2">
              {selectedEmails.size} selected
            </span>
          </>
        ) : (
          <>
            <button className="p-2 hover:bg-gray-100 rounded-full" title="Refresh">
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full" title="More">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}

        <div className="flex-1" />

        <span className="text-sm text-gray-600">
          {emails.length} {emails.length === 1 ? 'email' : 'emails'}
        </span>
      </div>

      {/* Email list */}
      <div className="flex-1 overflow-y-auto">
        {emails.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
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
                email-item flex items-center gap-3 px-4 py-3 border-b border-gray-100 cursor-pointer transition-all
                ${selectedEmailId === email.id ? 'bg-blue-50' : ''}
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
                  <span className={`text-sm ${!email.isRead ? 'font-bold' : ''}`}>
                    {email.from.name}
                  </span>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatDistanceToNow(email.date, { addSuffix: true, locale: vi })}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-sm ${!email.isRead ? 'font-semibold' : 'text-gray-700'}`}>
                    {email.subject || '(No subject)'}
                  </span>
                  {email.hasAttachments && (
                    <span className="text-xs">📎</span>
                  )}
                </div>

                <div className="text-sm text-gray-600 truncate mt-1">
                  {email.snippet}
                </div>

                {email.labels.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {email.labels.map((labelId) => {
                      const label = labels.find(l => l.id === labelId);
                      if (!label) return null;
                      return (
                        <span
                          key={labelId}
                          className={`badge ${label.color} text-xs`}
                        >
                          {label.name}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
