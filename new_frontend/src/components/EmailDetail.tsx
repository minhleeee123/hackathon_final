import { Email } from '../types';
import { X, Star, Archive, Trash2, Reply, Forward, MoreVertical, Download } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { labels } from '../mockData';

interface EmailDetailProps {
  email: Email;
  onClose: () => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onToggleStar: (id: string) => void;
  onMarkAsRead: (id: string, isRead: boolean) => void;
}

export default function EmailDetail({
  email,
  onClose,
  onDelete,
  onArchive,
  onToggleStar,
  onMarkAsRead,
}: EmailDetailProps) {
  return (
    <div className="w-2/5 border-l border-gray-200 flex flex-col bg-white">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 flex items-center px-4 gap-2 flex-shrink-0">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <button
          onClick={() => onArchive(email.id)}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Archive"
        >
          <Archive className="w-5 h-5 text-gray-600" />
        </button>

        <button
          onClick={() => onDelete(email.id)}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Delete"
        >
          <Trash2 className="w-5 h-5 text-gray-600" />
        </button>

        <button
          onClick={() => onMarkAsRead(email.id, !email.isRead)}
          className="p-2 hover:bg-gray-100 rounded-full"
          title={email.isRead ? 'Mark as unread' : 'Mark as read'}
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex-1" />

        <button
          onClick={() => onToggleStar(email.id)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Star
            className={`w-5 h-5 ${
              email.isStarred
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-normal text-gray-900 mb-4">
            {email.subject || '(No subject)'}
          </h2>

          {email.labels.length > 0 && (
            <div className="flex gap-2 mb-4">
              {email.labels.map((labelId) => {
                const label = labels.find(l => l.id === labelId);
                if (!label) return null;
                return (
                  <span
                    key={labelId}
                    className={`badge ${label.color}`}
                  >
                    {label.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="font-medium text-gray-900">{email.from.name}</div>
                  <div className="text-sm text-gray-600">{email.from.email}</div>
                </div>
                <div className="text-sm text-gray-500">
                  {format(email.date, 'PPp', { locale: vi })}
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-600">
                <div>to {email.to.join(', ')}</div>
                {email.cc && email.cc.length > 0 && (
                  <div>cc {email.cc.join(', ')}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div
          className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: email.body }}
        />

        {/* Attachments */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {email.attachments.length} Attachment{email.attachments.length > 1 ? 's' : ''}
            </h3>
            <div className="space-y-2">
              {email.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📎</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{attachment.name}</div>
                    <div className="text-xs text-gray-500">
                      {(attachment.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reply buttons */}
        <div className="mt-8 flex gap-2">
          <button className="gmail-btn gmail-btn-primary">
            <Reply className="w-4 h-4 mr-2 inline" />
            Reply
          </button>
          <button className="gmail-btn gmail-btn-secondary">
            <Forward className="w-4 h-4 mr-2 inline" />
            Forward
          </button>
        </div>
      </div>
    </div>
  );
}
