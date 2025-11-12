import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Mail, Clock, User, ChevronRight, PlayCircle, Loader2 } from 'lucide-react';
import { Email, EmailTag } from '../lib/mockData';
import EmailDetailDialog from './EmailDetailDialog';
import { toast } from 'sonner@2.0.3';

interface EmailInboxPageProps {
  emails: Email[];
  setEmails: React.Dispatch<React.SetStateAction<Email[]>>;
}

export default function EmailInboxPage({ emails, setEmails }: EmailInboxPageProps) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const getTagColor = (tag: EmailTag): string => {
    switch (tag) {
      case 'Công việc':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Gia đình':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'Bạn bè':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Spam':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Quảng cáo':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const simulateProcessing = async (emailId: string) => {
    setProcessingIds(prev => new Set(prev).add(emailId));
    
    // Simulate Agent 1 processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setEmails(prev => prev.map(email => {
      if (email.id === emailId) {
        const mockAgent1Response = {
          agent: 'Agent 1' as const,
          timestamp: new Date().toISOString(),
          output: {
            tag: '[Công việc]',
            has_task: true,
            next_step: 'extract_and_reply',
            reasoning: 'Email được phân loại dựa trên nội dung và người gửi'
          }
        };
        
        return {
          ...email,
          status: 'processing' as const,
          agentResponses: [mockAgent1Response]
        };
      }
      return email;
    }));

    // Simulate Agent 2 processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setEmails(prev => prev.map(email => {
      if (email.id === emailId) {
        const mockAgent2Response = {
          agent: 'Agent 2' as const,
          timestamp: new Date().toISOString(),
          output: {
            tasks: [
              {
                name: 'Task được trích xuất từ email',
                deadline: new Date(Date.now() + 86400000).toISOString(),
                location: 'Chưa xác định',
                related_people: [email.sender]
              }
            ]
          }
        };
        
        return {
          ...email,
          agentResponses: [...(email.agentResponses || []), mockAgent2Response],
          hasTask: true
        };
      }
      return email;
    }));

    // Simulate Agent 3 processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setEmails(prev => prev.map(email => {
      if (email.id === emailId) {
        const mockAgent3Response = {
          agent: 'Agent 3' as const,
          timestamp: new Date().toISOString(),
          output: {
            reply: 'Xin chào,\n\nCảm ơn bạn đã gửi email. Tôi đã nhận được thông tin và sẽ xử lý yêu cầu của bạn trong thời gian sớm nhất.\n\nTrân trọng.'
          }
        };
        
        return {
          ...email,
          status: 'processed' as const,
          tag: 'Công việc' as EmailTag,
          agentResponses: [...(email.agentResponses || []), mockAgent3Response],
          suggestedReply: mockAgent3Response.output.reply
        };
      }
      return email;
    }));

    setProcessingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(emailId);
      return newSet;
    });

    toast.success('Đã xử lý email thành công!');
  };

  const handleProcessAll = async () => {
    const unprocessedEmails = emails.filter(e => e.status === 'unprocessed');
    toast.info(`Đang xử lý ${unprocessedEmails.length} email...`);
    
    for (const email of unprocessedEmails) {
      await simulateProcessing(email.id);
    }
  };

  const unprocessedCount = emails.filter(e => e.status === 'unprocessed').length;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Hộp thư đến</h2>
          <p className="text-gray-600">
            {unprocessedCount > 0 ? (
              <span>{unprocessedCount} email chưa xử lý</span>
            ) : (
              <span>Tất cả email đã được xử lý</span>
            )}
          </p>
        </div>
        
        {unprocessedCount > 0 && (
          <Button onClick={handleProcessAll} className="gap-2">
            <PlayCircle className="w-4 h-4" />
            Xử lý toàn bộ
          </Button>
        )}
      </div>

      {/* Email List */}
      <div className="space-y-3">
        {emails.map((email) => (
          <Card 
            key={email.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedEmail(email)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{email.sender}</span>
                    <span className="text-gray-400 text-sm truncate">({email.senderEmail})</span>
                  </div>
                  
                  {email.tag && (
                    <Badge variant="outline" className={getTagColor(email.tag)}>
                      {email.tag}
                    </Badge>
                  )}
                  
                  {email.status === 'unprocessed' && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Chưa xử lý
                    </Badge>
                  )}
                  
                  {email.status === 'processing' && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      Đang xử lý
                    </Badge>
                  )}
                </div>
                
                <h3 className="mb-1">
                  <Mail className="w-4 h-4 inline mr-2 text-gray-400" />
                  {email.subject}
                </h3>
                
                <p className="text-gray-600 line-clamp-2 text-sm">{email.body}</p>
                
                <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(email.date).toLocaleString('vi-VN')}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {email.status === 'unprocessed' && !processingIds.has(email.id) && (
                  <Button 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      simulateProcessing(email.id);
                    }}
                  >
                    Xử lý
                  </Button>
                )}
                
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Email Detail Dialog */}
      {selectedEmail && (
        <EmailDetailDialog
          email={selectedEmail}
          open={!!selectedEmail}
          onOpenChange={(open) => !open && setSelectedEmail(null)}
          onUpdate={(updatedEmail) => {
            setEmails(prev => prev.map(e => e.id === updatedEmail.id ? updatedEmail : e));
            setSelectedEmail(updatedEmail);
            toast.success('Đã cập nhật email!');
          }}
        />
      )}
    </div>
  );
}
