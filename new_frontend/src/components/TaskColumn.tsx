import { useDrop } from 'react-dnd';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Task, TaskStatus } from '../types';
import TaskGroupCard, { ItemType } from './TaskGroupCard';

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  emails?: any[]; // Email data for showing email info
  badgeClassName: string;
  onTaskClick: (task: Task) => void;
  onTaskDrop: (task: Task, newStatus: TaskStatus) => void;
}

export default function TaskColumn({ 
  status, 
  title, 
  tasks, 
  emails = [],
  badgeClassName, 
  onTaskClick,
  onTaskDrop 
}: TaskColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item: { task: Task }) => {
      if (item.task.status !== status) {
        onTaskDrop(item.task, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Group tasks by emailId
  const groupedTasks: { [key: string]: Task[] } = {};
  const standaloneTasks: Task[] = [];

  tasks.forEach(task => {
    if (task.emailId) {
      if (!groupedTasks[task.emailId]) {
        groupedTasks[task.emailId] = [];
      }
      groupedTasks[task.emailId].push(task);
    } else {
      standaloneTasks.push(task);
    }
  });

  // Get email info for a task
  const getEmailInfo = (emailId: string) => {
    const email = emails.find(e => e.id === emailId);
    if (!email) return undefined;
    
    return {
      from: email.from.name || email.from.email,
      subject: email.subject,
      date: email.date
    };
  };

  return (
    <div 
      ref={drop}
      className={`space-y-3 min-h-[400px] p-4 rounded-lg transition-colors ${
        isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2">
          <Badge className={badgeClassName}>
            {title}
          </Badge>
          <span className="text-gray-600">({tasks.length})</span>
        </h3>
      </div>

      <div className="space-y-3">
        {/* Grouped tasks from emails */}
        {Object.entries(groupedTasks).map(([emailId, emailTasks]) => (
          <TaskGroupCard
            key={emailId}
            tasks={emailTasks}
            emailInfo={getEmailInfo(emailId)}
            onClick={onTaskClick}
          />
        ))}

        {/* Standalone tasks (user-created) */}
        {standaloneTasks.map((task) => (
          <TaskGroupCard
            key={task.id}
            tasks={[task]}
            onClick={onTaskClick}
          />
        ))}

        {tasks.length === 0 && (
          <Card className="p-6 text-center text-gray-400 border-dashed">
            {isOver ? 'Thả task vào đây' : 'Không có task nào'}
          </Card>
        )}
      </div>
    </div>
  );
}
