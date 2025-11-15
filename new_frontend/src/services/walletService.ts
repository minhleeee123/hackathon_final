import { WalletState, WalletBalance, NeoNetwork } from '../types';

// NeoLine DAPI types
interface NeoLineAccount {
  address: string;
  label: string;
}

interface NeoLineBalance {
  [asset: string]: string;
}

interface NeoLineNetwork {
  chainId: number;
  networks: string[];
  defaultNetwork: string;
}

// Check if NeoLine is installed
export function isNeoLineInstalled(): boolean {
  return typeof window !== 'undefined' && !!(window as any).NEOLine;
}

// Connect to NeoLine wallet
export async function connectNeoLineWallet(): Promise<WalletState> {
  if (!isNeoLineInstalled()) {
    throw new Error('NeoLine wallet chưa được cài đặt. Vui lòng cài đặt extension NeoLine.');
  }

  try {
    const neolineN3 = new (window as any).NEOLineN3.Init();
    
    // Request account access
    const account: NeoLineAccount = await neolineN3.getAccount();
    
    if (!account || !account.address) {
      throw new Error('Không thể lấy địa chỉ ví. Vui lòng mở khóa NeoLine wallet.');
    }

    // Get network info
    const networkInfo: NeoLineNetwork = await neolineN3.getNetworks();
    const network: NeoNetwork = networkInfo.defaultNetwork.includes('TestNet') ? 'N3TestNet' : 'N3MainNet';

    // Get balance
    let balance: WalletBalance = { NEO: '0', GAS: '0' };
    try {
      const balanceResponse: NeoLineBalance = await neolineN3.getBalance({
        address: account.address,
        contracts: []
      });
      
      balance = {
        NEO: balanceResponse['NEO'] || '0',
        GAS: balanceResponse['GAS'] || '0'
      };
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      // Continue with zero balance if fetch fails
    }

    const walletState: WalletState = {
      isConnected: true,
      address: account.address,
      network,
      balance
    };

    // Save to localStorage
    localStorage.setItem('neoWalletState', JSON.stringify(walletState));

    return walletState;
  } catch (error: any) {
    console.error('NeoLine connection error:', error);
    throw new Error(error.message || 'Không thể kết nối với NeoLine wallet');
  }
}

// Disconnect wallet
export function disconnectWallet(): void {
  localStorage.removeItem('neoWalletState');
}

// Restore wallet state from localStorage
export function restoreWalletState(): WalletState | null {
  try {
    const saved = localStorage.getItem('neoWalletState');
    if (!saved) return null;
    
    const walletState: WalletState = JSON.parse(saved);
    
    // Validate the restored state
    if (walletState.isConnected && walletState.address) {
      return walletState;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to restore wallet state:', error);
    return null;
  }
}

// Refresh wallet balance
export async function refreshBalance(address: string): Promise<WalletBalance> {
  if (!isNeoLineInstalled()) {
    throw new Error('NeoLine wallet not installed');
  }

  try {
    const neolineN3 = new (window as any).NEOLineN3.Init();
    
    const balanceResponse: NeoLineBalance = await neolineN3.getBalance({
      address,
      contracts: []
    });
    
    return {
      NEO: balanceResponse['NEO'] || '0',
      GAS: balanceResponse['GAS'] || '0'
    };
  } catch (error) {
    console.error('Failed to refresh balance:', error);
    throw error;
  }
}

// Format address for display (short version)
export function formatAddress(address: string | null): string {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Get NEO Explorer URL for transaction
export function getExplorerUrl(txHash: string, network: NeoNetwork): string {
  const isTestnet = network.includes('TestNet');
  const baseUrl = isTestnet 
    ? 'https://testnet.neotube.io/transaction'
    : 'https://neotube.io/transaction';
  return `${baseUrl}/${txHash}`;
}

// Convert USD to GAS (mock conversion - in real app, fetch from exchange API)
export function convertUsdToGas(usdAmount: number, gasPrice: number = 45): number {
  return parseFloat((usdAmount / gasPrice).toFixed(4));
}

// Copy to clipboard helper
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Failed to copy:', err);
      throw new Error('Không thể copy vào clipboard');
    }
    document.body.removeChild(textArea);
  }
}
