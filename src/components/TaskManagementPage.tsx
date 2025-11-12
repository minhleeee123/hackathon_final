import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Search, Filter, Sparkles } from 'lucide-react';
import { Task, TaskStatus, TaskSource } from '../lib/mockData';
import TaskDialog from './TaskDialog';
import TaskColumn from './TaskColumn';
import { toast } from 'sonner@2.0.3';

interface TaskManagementPageProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function TaskManagementPage({ tasks, setTasks }: TaskManagementPageProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<TaskSource | 'all'>('all');

  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case 'to-do':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'in-process':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getStatusLabel = (status: TaskStatus): string => {
    switch (status) {
      case 'to-do':
        return 'Cần làm';
      case 'in-process':
        return 'Đang làm';
      case 'completed':
        return 'Hoàn thành';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || task.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const groupedTasks = {
    'to-do': filteredTasks.filter(t => t.status === 'to-do'),
    'in-process': filteredTasks.filter(t => t.status === 'in-process'),
    'completed': filteredTasks.filter(t => t.status === 'completed')
  };

  const handleCreateTask = (newTask: Omit<Task, 'id' | 'createdAt' | 'source'>) => {
    const task: Task = {
      ...newTask,
      id: `t${Date.now()}`,
      source: 'user',
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => [task, ...prev]);
    setIsCreating(false);
    toast.success('Đã tạo task mới!');
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setSelectedTask(null);
    toast.success('Đã cập nhật task!');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setSelectedTask(null);
    toast.success('Đã xóa task!');
  };

  const handleTaskDrop = (task: Task, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => 
      t.id === task.id ? { ...t, status: newStatus } : t
    ));
    toast.success(`Đã chuyển task sang "${getStatusLabel(newStatus)}"`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Quản lý Task</h2>
            <p className="text-gray-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Kéo thả task giữa các cột để thay đổi trạng thái
            </p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Tạo task mới
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm task..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TaskStatus | 'all')}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="to-do">Cần làm</SelectItem>
                <SelectItem value="in-process">Đang làm</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={(value) => setSourceFilter(value as TaskSource | 'all')}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Nguồn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả nguồn</SelectItem>
                <SelectItem value="ai">AI tạo</SelectItem>
                <SelectItem value="user">Người dùng tạo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-gray-600 text-sm">Cần làm</div>
            <div className="text-gray-900 mt-1">{groupedTasks['to-do'].length} task</div>
          </Card>
          <Card className="p-4">
            <div className="text-gray-600 text-sm">Đang làm</div>
            <div className="text-gray-900 mt-1">{groupedTasks['in-process'].length} task</div>
          </Card>
          <Card className="p-4">
            <div className="text-gray-600 text-sm">Hoàn thành</div>
            <div className="text-gray-900 mt-1">{groupedTasks['completed'].length} task</div>
          </Card>
        </div>

        {/* Task Board with Drag and Drop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TaskColumn
            status="to-do"
            title={getStatusLabel('to-do')}
            tasks={groupedTasks['to-do']}
            badgeClassName={getStatusColor('to-do')}
            onTaskClick={setSelectedTask}
            onTaskDrop={handleTaskDrop}
          />
          <TaskColumn
            status="in-process"
            title={getStatusLabel('in-process')}
            tasks={groupedTasks['in-process']}
            badgeClassName={getStatusColor('in-process')}
            onTaskClick={setSelectedTask}
            onTaskDrop={handleTaskDrop}
          />
          <TaskColumn
            status="completed"
            title={getStatusLabel('completed')}
            tasks={groupedTasks['completed']}
            badgeClassName={getStatusColor('completed')}
            onTaskClick={setSelectedTask}
            onTaskDrop={handleTaskDrop}
          />
        </div>

        {/* Task Dialog */}
        {(selectedTask || isCreating) && (
          <TaskDialog
            task={selectedTask || undefined}
            open={!!(selectedTask || isCreating)}
            onOpenChange={(open) => {
              if (!open) {
                setSelectedTask(null);
                setIsCreating(false);
              }
            }}
            onCreate={handleCreateTask}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        )}
      </div>
    </DndProvider>
  );
}
