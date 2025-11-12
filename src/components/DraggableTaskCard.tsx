import { useDrag } from 'react-dnd';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, MapPin, Users, Bot, User as UserIcon } from 'lucide-react';
import { Task } from '../lib/mockData';

interface DraggableTaskCardProps {
  task: Task;
  onClick: () => void;
}

const ItemType = 'TASK';

export default function DraggableTaskCard({ task, onClick }: DraggableTaskCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card
        className="p-4 cursor-move hover:shadow-md transition-shadow"
        onClick={onClick}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="flex-1">{task.title}</h4>
            <Badge 
              variant="outline" 
              className={task.source === 'ai' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-green-50 text-green-700 border-green-200'}
            >
              {task.source === 'ai' ? (
                <><Bot className="w-3 h-3 mr-1" /> AI</>
              ) : (
                <><UserIcon className="w-3 h-3 mr-1" /> User</>
              )}
            </Badge>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>

          {task.deadline && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Clock className="w-3 h-3" />
              <span>{new Date(task.deadline).toLocaleString('vi-VN')}</span>
            </div>
          )}

          {task.location && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin className="w-3 h-3" />
              <span>{task.location}</span>
            </div>
          )}

          {task.relatedPeople && task.relatedPeople.length > 0 && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Users className="w-3 h-3" />
              <span>{task.relatedPeople.join(', ')}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export { ItemType };
