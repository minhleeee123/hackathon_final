import { Search, Menu, Settings, RefreshCw, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCompose: () => void;
  useRealData?: boolean;
  onToggleDataSource?: () => void;
  onRefreshData?: () => void;
  isLoading?: boolean;
}

export default function Header({ 
  searchQuery, 
  onSearchChange, 
  onCompose,
  useRealData = false,
  onToggleDataSource,
  onRefreshData,
  isLoading = false
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header 
      className="h-16 flex items-center px-4 gap-4 flex-shrink-0 transition-colors border-b" 
      style={{ 
        borderColor: 'var(--border)', 
        backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff'
      }}
    >
      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </button>

      <div className="flex items-center gap-3">
        <span className="text-2xl">📧</span>
        <h1 className="text-xl font-normal text-gray-700 dark:text-gray-200">Agent Mail</h1>
        
        {onToggleDataSource && (
          <div className="flex items-center gap-2 ml-2 pl-3 border-l border-gray-300 dark:border-emerald-500">
            <button
              onClick={onToggleDataSource}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                useRealData ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              title={useRealData ? 'Gmail API (Real Data)' : 'Mock Data'}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useRealData ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {useRealData ? 'API' : 'Mock'}
            </span>
            {useRealData && onRefreshData && (
              <button
                onClick={onRefreshData}
                disabled={isLoading}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full disabled:opacity-50 transition-colors"
                title="Refresh Gmail data"
              >
                <RefreshCw className={`w-4 h-4 text-gray-600 dark:text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search mail"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-gray-600" />
          )}
        </button>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium cursor-pointer hover:bg-blue-700">
          M
        </div>
      </div>
    </header>
  );
}
