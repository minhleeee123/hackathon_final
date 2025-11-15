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

// GAS Token Contract Hash (NEO N3)
const GAS_TOKEN_HASH = '0xd2a4cff31913016155e38e474a2c06d08be276cf';

// Convert GAS amount to contract integer format (8 decimals)
function gasToContractAmount(gasAmount: number): string {
  // GAS has 8 decimals, so multiply by 10^8
  const amount = Math.floor(gasAmount * 100000000);
  return amount.toString();
}

// Send GAS payment via NeoLine wallet
export async function sendGasPayment(
  fromAddress: string,
  toAddress: string,
  gasAmount: number,
  memo?: string
): Promise<string> {
  if (!isNeoLineInstalled()) {
    throw new Error('NeoLine wallet not installed');
  }

  try {
    const neolineN3 = new (window as any).NEOLineN3.Init();
    
    // Convert GAS amount to contract format
    const contractAmount = gasToContractAmount(gasAmount);
    
    // Invoke GAS transfer
    const result = await neolineN3.invoke({
      scriptHash: GAS_TOKEN_HASH,
      operation: 'transfer',
      args: [
        {
          type: 'Address',
          value: fromAddress
        },
        {
          type: 'Address',
          value: toAddress
        },
        {
          type: 'Integer',
          value: contractAmount
        },
        {
          type: 'String',
          value: memo || ''
        }
      ],
      signers: [
        {
          account: fromAddress,
          scopes: 1 // CalledByEntry
        }
      ]
    });

    if (!result || !result.txid) {
      throw new Error('Transaction failed: No transaction ID returned');
    }

    return result.txid;
  } catch (error: any) {
    console.error('GAS payment error:', error);
    
    // Handle specific NeoLine errors
    if (error.type === 'CANCELED') {
      throw new Error('Người dùng đã hủy giao dịch');
    } else if (error.type === 'INSUFFICIENT_FUNDS') {
      throw new Error('Không đủ GAS trong ví để thực hiện giao dịch');
    } else if (error.message?.includes('balance')) {
      throw new Error('Số dư GAS không đủ');
    } else if (error.message?.includes('network')) {
      throw new Error('Lỗi kết nối mạng NEO');
    }
    
    throw new Error(error.message || 'Không thể thực hiện giao dịch GAS');
  }
}

// Send NEO payment via NeoLine wallet
export async function sendNeoPayment(
  fromAddress: string,
  toAddress: string,
  neoAmount: number,
  memo?: string
): Promise<string> {
  if (!isNeoLineInstalled()) {
    throw new Error('NeoLine wallet not installed');
  }

  const NEO_TOKEN_HASH = '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5';

  try {
    const neolineN3 = new (window as any).NEOLineN3.Init();
    
    // NEO is indivisible, must be whole number
    const wholeNeoAmount = Math.floor(neoAmount);
    
    const result = await neolineN3.invoke({
      scriptHash: NEO_TOKEN_HASH,
      operation: 'transfer',
      args: [
        {
          type: 'Address',
          value: fromAddress
        },
        {
          type: 'Address',
          value: toAddress
        },
        {
          type: 'Integer',
          value: wholeNeoAmount.toString()
        },
        {
          type: 'String',
          value: memo || ''
        }
      ],
      signers: [
        {
          account: fromAddress,
          scopes: 1
        }
      ]
    });

    if (!result || !result.txid) {
      throw new Error('Transaction failed: No transaction ID returned');
    }

    return result.txid;
  } catch (error: any) {
    console.error('NEO payment error:', error);
    
    if (error.type === 'CANCELED') {
      throw new Error('Người dùng đã hủy giao dịch');
    } else if (error.type === 'INSUFFICIENT_FUNDS') {
      throw new Error('Không đủ NEO trong ví để thực hiện giao dịch');
    }
    
    throw new Error(error.message || 'Không thể thực hiện giao dịch NEO');
  }
}
