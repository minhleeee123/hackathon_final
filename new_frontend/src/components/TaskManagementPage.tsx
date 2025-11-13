import { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { Plus, Search, Sparkles, Calendar, MapPin, Users, CheckCircle, Circle, Clock } from 'lucide-react';

interface TaskManagementPageProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt' | 'source'>) => void;
}

export default function TaskManagementPage({ 
  tasks, 
  onUpdateTask, 
  onDeleteTask,
  onCreateTask 
}: TaskManagementPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  const getStatusLabel = (status: TaskStatus): string => {
    switch (status) {
      case 'to-do': return 'Cần làm';
      case 'in-process': return 'Đang làm';
      case 'completed': return 'Hoàn thành';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'to-do': return <Circle className="w-5 h-5 text-gray-400" />;
      case 'in-process': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const groupedTasks = {
    'to-do': filteredTasks.filter(t => t.status === 'to-do'),
    'in-process': filteredTasks.filter(t => t.status === 'in-process'),
    'completed': filteredTasks.filter(t => t.status === 'completed')
  };

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    onUpdateTask({ ...task, status: newStatus });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Quản lý Task</h1>
            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Tasks được trích xuất tự động từ email bởi AI
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm task..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="to-do">Cần làm</option>
            <option value="in-process">Đang làm</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="text-sm text-gray-600">Cần làm</div>
            <div className="text-2xl font-semibold text-gray-900 mt-1">{groupedTasks['to-do'].length}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-sm text-blue-600">Đang làm</div>
            <div className="text-2xl font-semibold text-blue-900 mt-1">{groupedTasks['in-process'].length}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="text-sm text-green-600">Hoàn thành</div>
            <div className="text-2xl font-semibold text-green-900 mt-1">{groupedTasks['completed'].length}</div>
          </div>
        </div>
      </div>

      {/* Task Board */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {(['to-do', 'in-process', 'completed'] as TaskStatus[]).map(status => (
            <div key={status} className="bg-white rounded-lg border border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  {getStatusIcon(status)}
                  {getStatusLabel(status)}
                  <span className="ml-auto bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-sm">
                    {groupedTasks[status].length}
                  </span>
                </h3>
              </div>
              
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {groupedTasks[status].length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <Circle className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Không có task</p>
                  </div>
                ) : (
                  groupedTasks[status].map(task => (
                    <div
                      key={task.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 flex-1">{task.title}</h4>
                        {task.source === 'ai' && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                      
                      {/* Task metadata */}
                      <div className="space-y-1.5 text-xs text-gray-500 mb-3">
                        {task.deadline && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(task.deadline).toLocaleString('vi-VN')}</span>
                          </div>
                        )}
                        {task.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{task.location}</span>
                          </div>
                        )}
                        {task.relatedPeople && task.relatedPeople.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            <span>{task.relatedPeople.join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {/* Status change buttons */}
                      <div className="flex gap-2">
                        {status !== 'to-do' && (
                          <button
                            onClick={() => handleStatusChange(task, status === 'completed' ? 'in-process' : 'to-do')}
                            className="flex-1 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                          >
                            ← {status === 'completed' ? 'Đang làm' : 'Cần làm'}
                          </button>
                        )}
                        {status !== 'completed' && (
                          <button
                            onClick={() => handleStatusChange(task, status === 'to-do' ? 'in-process' : 'completed')}
                            className="flex-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                          >
                            {status === 'to-do' ? 'Bắt đầu' : 'Hoàn thành'} →
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
