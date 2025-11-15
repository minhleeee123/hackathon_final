import { useState, useRef, useEffect } from 'react';
import { Email, GmailLabel } from '../types';
import { X, Star, Archive, Trash2, Reply, Forward, MoreVertical, Download, Sparkles, Loader2, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import EmailLabelMenu from './EmailLabelMenu';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { generateReply, REPLY_STYLES, ReplyStyle } from '../services/unifiedAIService';

interface EmailDetailProps {
  email: Email;
  gmailLabels: GmailLabel[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onToggleStar: (id: string) => void;
  onMarkAsRead: (id: string, isRead: boolean) => void;
  onAddLabel: (emailId: string, labelIds: string[]) => Promise<void>;
  onRemoveLabel: (emailId: string, labelIds: string[]) => Promise<void>;
  onSendReply: (to: string[], cc: string[] | undefined, subject: string, body: string) => Promise<void>;
}

export default function EmailDetail({
  email,
  gmailLabels,
  onClose,
  onDelete,
  onArchive,
  onToggleStar,
  onMarkAsRead,
  onAddLabel,
  onRemoveLabel,
  onSendReply,
}: EmailDetailProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyMode, setReplyMode] = useState<'reply' | 'replyAll' | 'forward'>('reply');
  const [replyBody, setReplyBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [selectedReplyStyle, setSelectedReplyStyle] = useState<ReplyStyle>('professional');
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const replyFormRef = useRef<HTMLDivElement>(null);

  const handleStartReply = (mode: 'reply' | 'replyAll' | 'forward') => {
    setReplyMode(mode);
    setIsReplying(true);
    setReplyBody('');
  };

  // Auto-scroll to reply form when it opens
  useEffect(() => {
    if (isReplying && replyFormRef.current) {
      setTimeout(() => {
        replyFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [isReplying]);

  const handleGenerateAIReply = async () => {
    setIsGeneratingReply(true);
    try {
      const result = await generateReply({
        email,
        style: selectedReplyStyle,
        customPrompt: customPrompt.trim() || undefined
      });
      
      setReplyBody(result.body);
    } catch (error) {
      console.error('Failed to generate reply:', error);
      alert('Không thể tạo phản hồi tự động');
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyBody.trim()) return;

    setIsSending(true);
    try {
      const to = replyMode === 'reply' ? [email.from.email] : email.to;
      const cc = replyMode === 'replyAll' ? email.cc : undefined;
      
      // Always use "Re: " prefix for replies (not "Fwd:")
      const subject = email.subject.startsWith('Re: ') ? email.subject : `Re: ${email.subject}`;
      
      // Add quoted original message (Gmail style - simple blockquote)
      const quotedMessage = `<br><br><blockquote style="margin: 0 0 0 0.8ex; border-left: 1px solid #ccc; padding-left: 1ex;">
${email.body}
</blockquote>`;
      
      const fullBody = replyBody + quotedMessage;
      
      await onSendReply(to, cc, subject, fullBody);
      
      setIsReplying(false);
      setReplyBody('');
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
    ]
  };

  // Helper to get label color class
  const getLabelColorClass = (label: GmailLabel): string => {
    if (!label.color?.backgroundColor) {
      return 'bg-gray-200 text-gray-700';
    }
    
    const colorMap: { [key: string]: string } = {
      '#fb4c2f': 'bg-red-100 text-red-800',
      '#ffad47': 'bg-orange-100 text-orange-800',
      '#fad165': 'bg-yellow-100 text-yellow-800',
      '#16a766': 'bg-green-100 text-green-800',
      '#43d692': 'bg-green-100 text-green-700',
      '#4a86e8': 'bg-blue-100 text-blue-800',
      '#a479e2': 'bg-purple-100 text-purple-800',
      '#f691b3': 'bg-pink-100 text-pink-800',
    };

    return colorMap[label.color.backgroundColor.toLowerCase()] || 'bg-gray-200 text-gray-700';
  };
  
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

        <EmailLabelMenu
          emailId={email.id}
          currentLabels={email.labels}
          gmailLabels={gmailLabels}
          onAddLabel={onAddLabel}
          onRemoveLabel={onRemoveLabel}
        />

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

          {email.labels.length > 0 && (() => {
            // Only show user-created labels
            const userLabels = email.labels
              .map(labelId => gmailLabels.find(l => l.id === labelId))
              .filter(label => label && label.type === 'user');
            
            if (userLabels.length === 0) return null;
            
            return (
              <div className="flex gap-2 mb-4 flex-wrap">
                {userLabels.map((label) => (
                  <span
                    key={label!.id}
                    className={`px-2 py-1 rounded text-sm ${getLabelColorClass(label!)}`}
                  >
                    {label!.name}
                  </span>
                ))}
              </div>
            );
          })()}
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
                    <Paperclip className="w-5 h-5 text-blue-600" />
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
          <button 
            onClick={() => handleStartReply('reply')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Reply className="w-4 h-4" />
            Reply
          </button>
          <button 
            onClick={() => handleStartReply('forward')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Forward className="w-4 h-4" />
            Forward
          </button>
        </div>

        {/* Inline Reply Form */}
        {isReplying && (
          <div ref={replyFormRef} className="mt-4 border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="mb-3 text-sm text-gray-700">
              <div><strong>To:</strong> {replyMode === 'reply' ? email.from.email : email.to.join(', ')}</div>
              {replyMode === 'replyAll' && email.cc && email.cc.length > 0 && (
                <div><strong>Cc:</strong> {email.cc.join(', ')}</div>
              )}
            </div>

            {/* AI Reply Generator */}
            <div className="mb-3 bg-white border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">AI Reply Generator</span>
                </div>
                <button
                  onClick={handleGenerateAIReply}
                  disabled={isGeneratingReply}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm flex items-center gap-1.5"
                >
                  {isGeneratingReply ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" />
                      Tạo phản hồi
                    </>
                  )}
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-2 mb-3">
                {(Object.keys(REPLY_STYLES) as ReplyStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedReplyStyle(style)}
                    className={`px-3 py-2 rounded-lg text-xs transition-all ${
                      selectedReplyStyle === style
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-900'
                        : 'bg-gray-100 border-2 border-transparent text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-lg mb-1">{REPLY_STYLES[style].icon}</div>
                    <div className="font-semibold">{REPLY_STYLES[style].name}</div>
                    <div className="text-gray-500 mt-1" style={{ fontSize: '10px' }}>
                      {REPLY_STYLES[style].description}
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Prompt Section */}
              <div className="border-t pt-2">
                <button
                  onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  {showCustomPrompt ? '▼' : '▶'} Nhập prompt tùy chỉnh
                </button>
                {showCustomPrompt && (
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Nhập hướng dẫn bổ sung cho AI (ví dụ: Thêm thông tin về lịch họp, đề cập đến deadline cụ thể...)"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                )}
              </div>
            </div>
            
            <ReactQuill 
              value={replyBody} 
              onChange={setReplyBody}
              modules={modules}
              placeholder="Type your reply..."
              className="bg-white rounded mb-3"
              style={{ minHeight: '150px' }}
            />
            
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSendReply}
                disabled={isSending || !replyBody.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSending ? 'Sending...' : 'Send'}
              </button>
              <button
                onClick={() => setIsReplying(false)}
                disabled={isSending}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
