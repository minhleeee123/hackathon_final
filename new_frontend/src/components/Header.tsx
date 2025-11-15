import { Search, Menu, Settings, RefreshCw, Moon, Sun, User, Building2, Mail, ChevronDown, Wallet } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { AccountMode, WalletState } from '../types';
import { useState, useRef, useEffect } from 'react';
import { formatAddress } from '../services/walletService';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCompose: () => void;
  useRealData?: boolean;
  onToggleDataSource?: () => void;
  onRefreshData?: () => void;
  isLoading?: boolean;
  accountMode?: AccountMode;
  onToggleAccountMode?: () => void;
  onOpenSettings?: () => void;
  walletState?: WalletState;
  onConnectWallet?: () => void;
  onDisconnectWallet?: () => void;
}

export default function Header({ 
  searchQuery, 
  onSearchChange, 
  onCompose,
  useRealData = false,
  onToggleDataSource,
  onRefreshData,
  isLoading = false,
  accountMode = 'personal',
  onToggleAccountMode,
  onOpenSettings,
  walletState,
  onConnectWallet,
  onDisconnectWallet
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <header 
      className="h-16 flex items-center px-4 gap-4 flex-shrink-0 transition-colors border-b" 
      style={{ 
        borderColor: 'var(--border)', 
        backgroundColor: theme === 'dark' ? '#0f172a' : '#f5f3ff'
      }}
    >
      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </button>

      <div className="flex items-center gap-3">
        <Mail className="w-6 h-6 text-blue-600 dark:text-emerald-400" />
        <h1 className="text-xl font-normal text-gray-700 dark:text-gray-200">Agent Mail</h1>
        
        {onToggleDataSource && (
          <div className="flex items-center gap-2 ml-2 pl-3 border-l border-gray-300 dark:border-gray-800">
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
        {onToggleAccountMode && (
          <button
            onClick={onToggleAccountMode}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
              accountMode === 'business'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title={accountMode === 'personal' ? 'Switch to Business Mode' : 'Switch to Personal Mode'}
          >
            {accountMode === 'business' ? (
              <>
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">Business</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Personal</span>
              </>
            )}
          </button>
        )}
        
        {/* Settings Dropdown */}
        <div className="relative" ref={settingsRef}>
          <button 
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            title="Settings"
          >
            <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>

          {showSettingsMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cài đặt</p>
              </div>
              
              <button
                onClick={() => {
                  setShowSettingsMenu(false);
                  if (onOpenSettings) onOpenSettings();
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
              >
                <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Thông tin người dùng</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phân tích & đề xuất AI agents</p>
                </div>
              </button>

              {/* NEO Wallet Connection */}
              {walletState?.isConnected ? (
                <button
                  onClick={() => {
                    setShowSettingsMenu(false);
                    if (onDisconnectWallet) onDisconnectWallet();
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                >
                  <Wallet className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Ví NEO đã kết nối</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{formatAddress(walletState.address)}</p>
                  </div>
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">Ngắt kết nối</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowSettingsMenu(false);
                    if (onConnectWallet) onConnectWallet();
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                >
                  <Wallet className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Kết nối ví NEO</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">NeoLine wallet required</p>
                  </div>
                </button>
              )}

              <button
                onClick={() => {
                  setShowSettingsMenu(false);
                  toggleTheme();
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-yellow-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Chế độ sáng</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Chuyển sang giao diện sáng</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Chế độ tối</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Chuyển sang giao diện tối</p>
                    </div>
                  </>
                )}
              </button>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                <div className="px-4 py-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Version 1.0.0</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium cursor-pointer hover:bg-blue-700">
          M
        </div>
      </div>
    </header>
  );
}
