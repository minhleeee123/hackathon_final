import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { User, Mail, Clock, CheckCircle2, Edit2, Save, X } from 'lucide-react';
import { Email, EmailTag } from '../lib/mockData';

interface EmailDetailDialogProps {
  email: Email;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (email: Email) => void;
}

export default function EmailDetailDialog({ email, open, onOpenChange, onUpdate }: EmailDetailDialogProps) {
  const [isEditingReply, setIsEditingReply] = useState(false);
  const [editedReply, setEditedReply] = useState(email.suggestedReply || '');

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

  const handleSaveReply = () => {
    onUpdate({
      ...email,
      suggestedReply: editedReply
    });
    setIsEditingReply(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết Email</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Email Info */}
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{email.sender}</span>
                  <span className="text-gray-400 text-sm">({email.senderEmail})</span>
                </div>
                {email.tag && (
                  <Badge variant="outline" className={getTagColor(email.tag)}>
                    {email.tag}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{email.subject}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Clock className="w-4 h-4" />
                <span>{new Date(email.date).toLocaleString('vi-VN')}</span>
              </div>

              <Separator />
              
              <div className="whitespace-pre-wrap text-gray-700">
                {email.body}
              </div>
            </div>
          </Card>

          {/* Agent Processing Steps */}
          {email.status === 'processed' && email.agentResponses && email.agentResponses.length > 0 && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Quy trình xử lý AI
              </h3>

              {email.agentResponses.map((response, index) => (
                <Card key={index} className="p-4 border-l-4 border-l-blue-500">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600">{response.agent}: Điều phối & Phân loại</span>
                      <span className="text-gray-500 text-sm">
                        {new Date(response.timestamp).toLocaleTimeString('vi-VN')}
                      </span>
                    </div>

                    {response.agent === 'Agent 1' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Tag:</span>
                          <Badge variant="outline" className={getTagColor(response.output.tag.replace('[', '').replace(']', '') as EmailTag)}>
                            {response.output.tag}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Có task:</span>
                          <Badge variant={response.output.has_task ? 'default' : 'secondary'}>
                            {response.output.has_task ? 'Có' : 'Không'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Bước tiếp theo:</span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {response.output.next_step}
                          </code>
                        </div>
                        {response.output.reasoning && (
                          <div className="text-gray-600 text-sm italic">
                            💡 {response.output.reasoning}
                          </div>
                        )}
                      </div>
                    )}

                    {response.agent === 'Agent 2' && (
                      <div className="space-y-2">
                        <span className="text-blue-600">Agent 2: Trích xuất Task</span>
                        {response.output.tasks && response.output.tasks.map((task: any, taskIndex: number) => (
                          <div key={taskIndex} className="bg-gray-50 p-3 rounded space-y-1">
                            <div><strong>Tên task:</strong> {task.name}</div>
                            {task.deadline && (
                              <div><strong>Deadline:</strong> {new Date(task.deadline).toLocaleString('vi-VN')}</div>
                            )}
                            {task.location && (
                              <div><strong>Địa điểm:</strong> {task.location}</div>
                            )}
                            {task.related_people && task.related_people.length > 0 && (
                              <div><strong>Người liên quan:</strong> {task.related_people.join(', ')}</div>
                            )}
                            {task.items && task.items.length > 0 && (
                              <div><strong>Nội dung:</strong> {task.items.join(', ')}</div>
                            )}
                            {task.notes && (
                              <div><strong>Ghi chú:</strong> {task.notes}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {response.agent === 'Agent 3' && (
                      <div className="space-y-2">
                        <span className="text-blue-600">Agent 3: Tổng hợp & Phản hồi</span>
                        <div className="bg-gray-50 p-3 rounded whitespace-pre-wrap">
                          {response.output.reply}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Suggested Reply */}
          {email.suggestedReply && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3>📝 Email trả lời được đề xuất</h3>
                {!isEditingReply ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditedReply(email.suggestedReply || '');
                      setIsEditingReply(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditingReply(false)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Hủy
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleSaveReply}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Lưu
                    </Button>
                  </div>
                )}
              </div>

              {isEditingReply ? (
                <Textarea
                  value={editedReply}
                  onChange={(e) => setEditedReply(e.target.value)}
                  rows={8}
                  className="w-full"
                />
              ) : (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="whitespace-pre-wrap">{email.suggestedReply}</div>
                </Card>
              )}
            </div>
          )}

          {email.status === 'unprocessed' && (
            <Card className="p-4 bg-yellow-50 border-yellow-200 text-center">
              <p className="text-gray-700">Email này chưa được xử lý bởi AI. Nhấn nút "Xử lý" để bắt đầu.</p>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
