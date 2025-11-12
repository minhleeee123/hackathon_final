import { 
  Inbox, 
  Star, 
  Send, 
  FileText, 
  AlertCircle, 
  Trash2, 
  MoreHorizontal,
  Edit
} from 'lucide-react';
import { EmailFolder, EmailLabel } from '../types';
import { folders, labels } from '../mockData';

interface SidebarProps {
  selectedFolder: EmailFolder;
  selectedLabel: EmailLabel | null;
  onSelectFolder: (folder: EmailFolder) => void;
  onSelectLabel: (label: EmailLabel | null) => void;
  unreadCount: number;
}

export default function Sidebar({ selectedFolder, selectedLabel, onSelectFolder, onSelectLabel, unreadCount }: SidebarProps) {
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Inbox,
      Star,
      Send,
      FileText,
      AlertCircle,
      Trash2,
      MoreHorizontal,
    };
    return iconMap[iconName] || Inbox;
  };

  return (
    <div className="w-64 border-r border-gray-200 flex flex-col bg-white flex-shrink-0">
      <div className="p-4">
        <button 
          onClick={() => {}}
          className="w-full flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-all"
        >
          <Edit className="w-5 h-5" />
          <span className="font-medium">Compose</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2">
        {folders.map((folder) => {
          const count = folder.id === 'inbox' ? unreadCount : undefined;
          const isSelected = selectedFolder === folder.id && !selectedLabel;
          const IconComponent = getIconComponent(folder.icon);
          
          return (
            <button
              key={folder.id}
              onClick={() => onSelectFolder(folder.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-2 rounded-r-full transition-all
                ${isSelected 
                  ? 'bg-red-100 text-gray-900 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <IconComponent className="w-5 h-5" />
              <span className="flex-1 text-left text-sm">{folder.name}</span>
              {count !== undefined && count > 0 && (
                <span className="text-sm font-bold">{count}</span>
              )}
            </button>
          );
        })}

        <div className="my-2 border-t border-gray-200" />

        <div className="px-4 py-2 text-xs font-medium text-gray-500">
          Labels
        </div>

        {labels.map((label) => (
          <button
            key={label.id}
            onClick={() => onSelectLabel(selectedLabel === label.id ? null : label.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-2 rounded-r-full transition-all
              ${selectedLabel === label.id
                ? 'bg-red-100 text-gray-900 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <div className={`w-3 h-3 rounded-full ${label.color.split(' ')[0]}`} />
            <span className="flex-1 text-left text-sm">{label.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
