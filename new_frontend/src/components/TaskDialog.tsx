import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Trash2, Save, Plus, X, Bot, User as UserIcon } from 'lucide-react';
import { Task, TaskStatus } from '../types';

interface TaskDialogProps {
  task?: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (task: Omit<Task, 'id' | 'createdAt' | 'source'>) => void;
  onUpdate?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export default function TaskDialog({ task, open, onOpenChange, onCreate, onUpdate, onDelete }: TaskDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    location: '',
    status: 'to-do' as TaskStatus
  });
  const [relatedPeople, setRelatedPeople] = useState<string[]>([]);
  const [newPerson, setNewPerson] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        deadline: task.deadline ? task.deadline.slice(0, 16) : '',
        location: task.location || '',
        status: task.status
      });
      setRelatedPeople(task.relatedPeople || []);
    } else {
      setFormData({
        title: '',
        description: '',
        deadline: '',
        location: '',
        status: 'to-do'
      });
      setRelatedPeople([]);
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const taskData = {
      ...formData,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
      relatedPeople: relatedPeople.length > 0 ? relatedPeople : undefined,
      emailId: task?.emailId
    };

    if (task && onUpdate) {
      onUpdate({
        ...task,
        ...taskData
      });
    } else if (onCreate) {
      onCreate(taskData);
    }
  };

  const handleAddPerson = () => {
    if (newPerson.trim() && !relatedPeople.includes(newPerson.trim())) {
      setRelatedPeople([...relatedPeople, newPerson.trim()]);
      setNewPerson('');
    }
  };

  const handleRemovePerson = (person: string) => {
    setRelatedPeople(relatedPeople.filter(p => p !== person));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {task ? 'Chỉnh sửa Task' : 'Tạo Task mới'}
            {task && (
              <Badge variant="outline" className={task.source === 'ai' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-green-50 text-green-700 border-green-200'}>
                {task.source === 'ai' ? (
                  <><Bot className="w-3 h-3 mr-1" /> AI tạo</>
                ) : (
                  <><UserIcon className="w-3 h-3 mr-1" /> Người dùng tạo</>
                )}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề task"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả chi tiết"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as TaskStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to-do">Cần làm</SelectItem>
                  <SelectItem value="in-process">Đang làm</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Địa điểm</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Nhập địa điểm (nếu có)"
            />
          </div>

          <div className="space-y-2">
            <Label>Người liên quan</Label>
            <div className="flex gap-2">
              <Input
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                placeholder="Nhập tên người liên quan"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPerson();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddPerson}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {relatedPeople.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {relatedPeople.map((person, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {person}
                    <button
                      type="button"
                      onClick={() => handleRemovePerson(person)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            {task && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (confirm('Bạn có chắc muốn xóa task này?')) {
                    onDelete(task.id);
                  }
                }}
                className="mr-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
              </Button>
            )}
            
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {task ? 'Lưu thay đổi' : 'Tạo task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
