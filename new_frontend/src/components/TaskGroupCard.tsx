import { useDrag } from 'react-dnd';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, MapPin, Users, Bot, User as UserIcon, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { Task } from '../types';
import { useState } from 'react';

interface TaskGroupCardProps {
  tasks: Task[];
  emailInfo?: {
    from: string;
    subject: string;
    date: Date;
  };
  onClick: (task: Task) => void;
}

const ItemType = 'TASK';

export default function TaskGroupCard({ tasks, emailInfo, onClick }: TaskGroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Use first task for drag
  const firstTask = tasks[0];
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { task: firstTask },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const isSingleTask = tasks.length === 1;

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        {/* Email Header - only show if tasks are from email */}
        {emailInfo && (
          <div 
            className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 border-b border-purple-100 cursor-pointer"
            onClick={() => !isSingleTask && setIsExpanded(!isExpanded)}
          >
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-sm text-purple-900 truncate">{emailInfo.from}</div>
                  {!isSingleTask && (
                    <button className="text-purple-600 hover:text-purple-800 flex items-center gap-1">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {tasks.length} tasks
                      </Badge>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                </div>
                <div className="text-xs text-purple-700 truncate mt-0.5">{emailInfo.subject}</div>
                <div className="text-xs text-purple-600 mt-0.5">
                  {new Date(emailInfo.date).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks */}
        <div className={`${!isSingleTask && !isExpanded ? 'hidden' : ''}`}>
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${index > 0 ? 'border-t border-gray-100' : ''}`}
              onClick={() => onClick(task)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="flex-1 font-medium text-gray-900">
                    {!isSingleTask && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mr-2">
                        {index + 1}
                      </span>
                    )}
                    {task.title}
                  </h4>
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

                <div className="flex flex-wrap gap-3">
                  {task.deadline && (
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(task.deadline).toLocaleString('vi-VN')}</span>
                    </div>
                  )}

                  {task.location && (
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <MapPin className="w-3 h-3" />
                      <span>{task.location}</span>
                    </div>
                  )}

                  {task.relatedPeople && task.relatedPeople.length > 0 && (
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Users className="w-3 h-3" />
                      <span>{task.relatedPeople.join(', ')}</span>
                    </div>
                  )}
                </div>

                {task.items && task.items.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs font-medium text-gray-700 mb-1">Checklist:</div>
                    <ul className="text-xs text-gray-600 space-y-0.5">
                      {task.items.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-gray-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                      {task.items.length > 3 && (
                        <li className="text-gray-400">+{task.items.length - 3} more...</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Collapsed preview for multiple tasks */}
        {!isSingleTask && !isExpanded && (
          <div className="p-3 bg-gray-50 text-center text-sm text-gray-500">
            Click để xem {tasks.length} tasks
          </div>
        )}
      </Card>
    </div>
  );
}

export { ItemType };
