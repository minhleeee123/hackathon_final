import { Search, Menu, Settings, RefreshCw } from 'lucide-react';

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
  return (
    <header className="h-16 border-b border-gray-200 flex items-center px-4 gap-4 flex-shrink-0">
      <button className="p-2 hover:bg-gray-100 rounded-full">
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      <div className="flex items-center gap-3">
        <span className="text-2xl">📧</span>
        <h1 className="text-xl font-normal text-gray-700">Gmail</h1>
        
        {onToggleDataSource && (
          <div className="flex items-center gap-2 ml-2 pl-3 border-l border-gray-300">
            <button
              onClick={onToggleDataSource}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                useRealData ? 'bg-green-600' : 'bg-gray-300'
              }`}
              title={useRealData ? 'Gmail API (Real Data)' : 'Mock Data'}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useRealData ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-xs text-gray-600 font-medium">
              {useRealData ? 'API' : 'Mock'}
            </span>
            {useRealData && onRefreshData && (
              <button
                onClick={onRefreshData}
                disabled={isLoading}
                className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50 transition-colors"
                title="Refresh Gmail data"
              >
                <RefreshCw className={`w-4 h-4 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
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
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Settings className="w-6 h-6 text-gray-600" />
        </button>
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium cursor-pointer hover:bg-blue-700">
          M
        </div>
      </div>
    </header>
  );
}
