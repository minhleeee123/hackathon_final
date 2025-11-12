import { useDrop } from 'react-dnd';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Task, TaskStatus } from '../lib/mockData';
import DraggableTaskCard, { ItemType } from './DraggableTaskCard';

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  badgeClassName: string;
  onTaskClick: (task: Task) => void;
  onTaskDrop: (task: Task, newStatus: TaskStatus) => void;
}

export default function TaskColumn({ 
  status, 
  title, 
  tasks, 
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
        {tasks.map((task) => (
          <DraggableTaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
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
