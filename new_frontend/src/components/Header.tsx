import { Search, Menu, Settings } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCompose: () => void;
}

export default function Header({ searchQuery, onSearchChange, onCompose }: HeaderProps) {
  return (
    <header className="h-16 border-b border-gray-200 flex items-center px-4 gap-4 flex-shrink-0">
      <button className="p-2 hover:bg-gray-100 rounded-full">
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      <div className="flex items-center gap-2">
        <span className="text-2xl">📧</span>
        <h1 className="text-xl font-normal text-gray-700">Gmail</h1>
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
