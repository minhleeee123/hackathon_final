import { 
  Inbox, 
  Star, 
  Send, 
  FileText, 
  AlertCircle, 
  Trash2, 
  MoreHorizontal,
  Edit,
  Tag,
  Settings
} from 'lucide-react';
import { EmailFolder, GmailLabel } from '../types';
import { folders } from '../mockData';

interface SidebarProps {
  selectedFolder: EmailFolder;
  selectedLabel: string | null;
  gmailLabels: GmailLabel[];
  onSelectFolder: (folder: EmailFolder) => void;
  onSelectLabel: (label: string | null) => void;
  onManageLabels: () => void;
  onCompose: () => void;
  unreadCount: number;
}

export default function Sidebar({ selectedFolder, selectedLabel, gmailLabels, onSelectFolder, onSelectLabel, onManageLabels, onCompose, unreadCount }: SidebarProps) {
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

  // Filter only user-created labels (not system labels)
  const userLabels = gmailLabels.filter(label => label.type === 'user');

  // Map Gmail colors to Tailwind classes
  const getColorClass = (label: GmailLabel): string => {
    if (!label.color?.backgroundColor) {
      return 'bg-gray-400';
    }
    
    const colorMap: { [key: string]: string } = {
      '#000000': 'bg-gray-800',
      '#434343': 'bg-gray-700',
      '#666666': 'bg-gray-600',
      '#999999': 'bg-gray-500',
      '#cccccc': 'bg-gray-400',
      '#efefef': 'bg-gray-300',
      '#f3f3f3': 'bg-gray-200',
      '#ffffff': 'bg-white border border-gray-300',
      '#fb4c2f': 'bg-red-500',
      '#ffad47': 'bg-orange-500',
      '#fad165': 'bg-yellow-500',
      '#16a766': 'bg-green-600',
      '#43d692': 'bg-green-500',
      '#4a86e8': 'bg-blue-500',
      '#a479e2': 'bg-purple-500',
      '#f691b3': 'bg-pink-500',
      '#f6c5be': 'bg-pink-300',
      '#ffe6c7': 'bg-orange-200',
      '#fef1d1': 'bg-yellow-200',
      '#b9e4d0': 'bg-green-200',
      '#c6f3de': 'bg-green-300',
      '#c9daf8': 'bg-blue-200',
      '#e4d7f5': 'bg-purple-200',
      '#fcdee8': 'bg-pink-200',
      '#efa093': 'bg-red-400',
      '#ffd6a2': 'bg-orange-300',
      '#fce8b3': 'bg-yellow-300',
      '#89d3b2': 'bg-green-400',
      '#a0eac9': 'bg-teal-300',
      '#a4c2f4': 'bg-blue-300',
      '#d0bcf1': 'bg-purple-300',
      '#fbc8d9': 'bg-pink-300',
      '#e66550': 'bg-red-600',
      '#ffbc6b': 'bg-orange-400',
      '#fcda83': 'bg-yellow-400',
      '#44b984': 'bg-green-500',
      '#68dfa9': 'bg-teal-400',
      '#6d9eeb': 'bg-blue-400',
      '#b694e8': 'bg-purple-400',
      '#f7a7c0': 'bg-pink-400',
      '#cc3a21': 'bg-red-700',
      '#eaa041': 'bg-orange-600',
      '#f2c960': 'bg-yellow-600',
      '#149e60': 'bg-green-700',
      '#3dc789': 'bg-teal-500',
      '#3c78d8': 'bg-blue-600',
      '#8e63ce': 'bg-purple-600',
      '#e07798': 'bg-pink-600',
      '#ac2b16': 'bg-red-800',
      '#cf8933': 'bg-orange-700',
      '#d5ae49': 'bg-yellow-700',
      '#0b804b': 'bg-green-800',
      '#2a9c68': 'bg-teal-600',
      '#285bac': 'bg-blue-700',
      '#653e9b': 'bg-purple-700',
      '#b65775': 'bg-pink-700',
      '#822111': 'bg-red-900',
      '#a46a21': 'bg-orange-800',
      '#aa8831': 'bg-yellow-800',
      '#076239': 'bg-green-900',
      '#1a764d': 'bg-teal-700',
      '#1c4587': 'bg-blue-800',
      '#41236d': 'bg-purple-800',
      '#83334c': 'bg-pink-800',
    };

    return colorMap[label.color.backgroundColor.toLowerCase()] || 'bg-blue-500';
  };

  return (
    <div className="w-64 border-r border-gray-200 flex flex-col bg-white flex-shrink-0">
      <div className="p-4">
        <button 
          onClick={onCompose}
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

        <div className="px-4 py-2 flex items-center justify-between">
          <div className="text-xs font-medium text-gray-500 flex items-center gap-2">
            <Tag className="w-3 h-3" />
            Labels
          </div>
          <button
            onClick={onManageLabels}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Quản lý labels"
          >
            <Settings className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>

        {userLabels.length === 0 ? (
          <div className="px-4 py-2 text-xs text-gray-400 italic">
            Chưa có label tự tạo
          </div>
        ) : (
          userLabels.map((label) => (
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
              <div className={`w-3 h-3 rounded-full ${getColorClass(label)}`} />
              <span className="flex-1 text-left text-sm">{label.name}</span>
            </button>
          ))
        )}
      </nav>
    </div>
  );
}
