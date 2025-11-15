import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PaymentItem, PaymentStatus, WalletState } from '../types';
import { Wallet, Copy, ExternalLink, Check, Zap, Loader2 } from 'lucide-react';
import { convertUsdToGas, copyToClipboard, getExplorerUrl, sendGasPayment, sendNeoPayment } from '../services/walletService';

interface PaymentDialogProps {
  payment?: PaymentItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (payment: Omit<PaymentItem, 'id' | 'createdAt' | 'source'>) => void;
  onUpdate?: (payment: PaymentItem) => void;
  onDelete?: (paymentId: string) => void;
  walletState?: WalletState;
  onConnectWallet?: () => void;
}

export default function PaymentDialog({
  payment,
  open,
  onOpenChange,
  onCreate,
  onUpdate,
  onDelete,
  walletState,
  onConnectWallet
}: PaymentDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'VND',
    dueDate: '',
    recipient: '',
    recipientAddress: '',
    paymentMethod: '',
    description: '',
    status: 'unpaid' as PaymentStatus,
    transactionHash: ''
  });

  const [showCryptoPayment, setShowCryptoPayment] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (payment) {
      setFormData({
        title: payment.title,
        amount: payment.amount.toString(),
        currency: payment.currency,
        dueDate: payment.dueDate || '',
        recipient: payment.recipient || '',
        recipientAddress: payment.recipientAddress || '',
        paymentMethod: payment.paymentMethod || '',
        description: payment.description,
        status: payment.status,
        transactionHash: payment.transactionHash || ''
      });
      // Auto show crypto payment if has recipient address or transaction
      if (payment.recipientAddress || payment.transactionHash) {
        setShowCryptoPayment(true);
      }
    } else {
      setFormData({
        title: '',
        amount: '',
        currency: 'VND',
        dueDate: '',
        recipient: '',
        recipientAddress: '',
        paymentMethod: '',
        description: '',
        status: 'unpaid',
        transactionHash: ''
      });
      setShowCryptoPayment(false);
    }
  }, [payment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const paymentData = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      dueDate: formData.dueDate || undefined,
      recipient: formData.recipient || undefined,
      recipientAddress: formData.recipientAddress || undefined,
      paymentMethod: formData.paymentMethod || undefined,
      description: formData.description,
      status: formData.status,
      transactionHash: formData.transactionHash || undefined,
      paidAt: formData.status === 'paid' ? new Date().toISOString() : undefined
    };

    if (payment && onUpdate) {
      onUpdate({ ...payment, ...paymentData });
    } else if (onCreate) {
      onCreate(paymentData);
    }
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await copyToClipboard(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      alert('Không thể copy vào clipboard');
    }
  };

  const handleMarkAsPaidWithTx = () => {
    if (!formData.transactionHash.trim()) {
      alert('Vui lòng nhập Transaction Hash');
      return;
    }
    setFormData({ ...formData, status: 'paid' });
  };

  // Handle automatic payment via NeoLine
  const handlePayNow = async () => {
    if (!walletState?.isConnected || !walletState.address) {
      alert('Vui lòng kết nối ví NEO trước');
      return;
    }

    if (!formData.recipientAddress) {
      alert('Vui lòng nhập địa chỉ ví người nhận');
      return;
    }

    if (!gasAmount || gasAmount <= 0) {
      alert('Số tiền thanh toán không hợp lệ');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // Send GAS payment via NeoLine
      const txHash = await sendGasPayment(
        walletState.address,
        formData.recipientAddress,
        gasAmount,
        `Payment: ${formData.title}` // Memo
      );

      // Auto-fill transaction hash and mark as paid
      setFormData({
        ...formData,
        transactionHash: txHash,
        status: 'paid'
      });

      alert(`✓ Thanh toán thành công!\n\nTransaction Hash:\n${txHash}\n\nVui lòng lưu lại thông tin này.`);
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentError(error.message);
      alert(`Lỗi thanh toán: ${error.message}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Calculate GAS amount based on currency
  const gasAmount = (() => {
    const amount = parseFloat(formData.amount) || 0;
    if (amount <= 0) return null;
    
    switch (formData.currency) {
      case 'USD':
        return convertUsdToGas(amount);
      case 'VND':
        return convertUsdToGas(amount / 24000); // VND to USD conversion
      case 'EUR':
        return convertUsdToGas(amount * 1.1); // EUR to USD
      case 'JPY':
        return convertUsdToGas(amount / 150); // JPY to USD
      default:
        // Assume USD for unknown currencies
        return convertUsdToGas(amount);
    }
  })();

  // Debug log
  console.log('PaymentDialog Debug:', {
    amount: formData.amount,
    currency: formData.currency,
    gasAmount,
    recipientAddress: formData.recipientAddress,
    transactionHash: formData.transactionHash,
    walletConnected: walletState?.isConnected
  });

  const handleDelete = () => {
    if (payment && onDelete) {
      if (confirm('Bạn có chắc chắn muốn xóa khoản thanh toán này?')) {
        onDelete(payment.id);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {payment ? 'Chi tiết khoản thanh toán' : 'Tạo khoản thanh toán mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Tên khoản phí *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="VD: Tiền điện tháng 11"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Số tiền *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="100000"
                required
              />
            </div>

            <div>
              <Label htmlFor="currency">Đơn vị tiền tệ *</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VND">VND (₫)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">Hạn thanh toán</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="status">Trạng thái *</Label>
              <Select value={formData.status} onValueChange={(value: PaymentStatus) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                  <SelectItem value="paid">Đã thanh toán</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="recipient">Người nhận / Đơn vị thu</Label>
            <Input
              id="recipient"
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              placeholder="VD: Công ty Điện lực Hà Nội"
            />
          </div>

          {/* NEO Crypto Payment Section */}
          {walletState?.isConnected && formData.status === 'unpaid' && (
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-green-600" />
                  <Label className="text-base font-semibold">Thanh toán bằng NEO/GAS</Label>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCryptoPayment(!showCryptoPayment)}
                >
                  {showCryptoPayment ? 'Ẩn' : 'Hiển thị'}
                </Button>
              </div>

              {showCryptoPayment && (
                <div className="space-y-3 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-lg border border-green-200 dark:border-gray-700">
                  {/* Recipient NEO Address */}
                  <div>
                    <Label htmlFor="recipientAddress" className="text-sm font-medium">
                      Địa chỉ ví NEO người nhận
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="recipientAddress"
                        value={formData.recipientAddress}
                        onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
                        placeholder="NXXzKhVCdT7qJgNDh2tCWHHkPwcwKCKZsb"
                        className="font-mono text-sm"
                      />
                      {formData.recipientAddress && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(formData.recipientAddress, 'address')}
                        >
                          {copiedField === 'address' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Payment Amount in GAS */}
                  {gasAmount && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Số tiền cần thanh toán:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-600">{gasAmount} GAS</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(gasAmount.toString(), 'amount')}
                          >
                            {copiedField === 'amount' ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ≈ ${formData.amount} USD (tỷ giá: $45/GAS)
                      </p>
                    </div>
                  )}

                  {/* Auto Payment Button - FEATURED - Show ALWAYS when has gasAmount */}
                  {gasAmount && !formData.transactionHash && (
                    <div className="space-y-2">
                      <Button
                        type="button"
                        onClick={handlePayNow}
                        disabled={isProcessingPayment || !formData.recipientAddress}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-6 text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessingPayment ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Đang xử lý thanh toán...
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5 mr-2" />
                            Thanh toán ngay {gasAmount} GAS
                          </>
                        )}
                      </Button>
                      
                      {!formData.recipientAddress && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-2">
                          <p className="text-xs text-yellow-700 dark:text-yellow-400">
                            ⚠️ Vui lòng nhập địa chỉ ví người nhận ở trên để thanh toán
                          </p>
                        </div>
                      )}
                      
                      {paymentError && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2">
                          <p className="text-xs text-red-700 dark:text-red-400">{paymentError}</p>
                        </div>
                      )}
                      
                      {formData.recipientAddress && (
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                          NeoLine wallet sẽ mở để xác nhận giao dịch
                        </p>
                      )}
                    </div>
                  )}

                  {/* Divider */}
                  {gasAmount && !formData.transactionHash && (
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 px-2 text-gray-500 dark:text-gray-400">
                          hoặc thanh toán thủ công
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Instructions */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                      {formData.recipientAddress && gasAmount ? 'Thanh toán thủ công:' : 'Hướng dẫn thanh toán:'}
                    </p>
                    <ol className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
                      <li>Copy địa chỉ ví người nhận và số tiền GAS</li>
                      <li>Mở NeoLine wallet và thực hiện chuyển khoản</li>
                      <li>Sau khi giao dịch thành công, copy Transaction Hash</li>
                      <li>Paste Transaction Hash vào ô bên dưới và nhấn "Đánh dấu đã thanh toán"</li>
                    </ol>
                  </div>

                  {/* Transaction Hash Input */}
                  <div>
                    <Label htmlFor="transactionHash" className="text-sm font-medium">
                      Transaction Hash (sau khi thanh toán)
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="transactionHash"
                        value={formData.transactionHash}
                        onChange={(e) => setFormData({ ...formData, transactionHash: e.target.value })}
                        placeholder="0x..."
                        className="font-mono text-xs"
                      />
                      {formData.transactionHash && walletState.network && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(getExplorerUrl(formData.transactionHash, walletState.network!), '_blank')}
                          title="Xem trên NEO Explorer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Mark as Paid Button */}
                  {formData.transactionHash && (
                    <Button
                      type="button"
                      onClick={handleMarkAsPaidWithTx}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Đánh dấu đã thanh toán
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Show connect wallet button if not connected */}
          {!walletState?.isConnected && formData.status === 'unpaid' && (
            <div className="border-t pt-4 mt-4">
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                <Wallet className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Kết nối ví NEO để thanh toán bằng cryptocurrency
                </p>
                <Button
                  type="button"
                  onClick={onConnectWallet}
                  variant="outline"
                  className="gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  Kết nối ví NEO
                </Button>
              </div>
            </div>
          )}

          {/* Transaction confirmed display */}
          {formData.status === 'paid' && formData.transactionHash && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Đã thanh toán bằng NEO blockchain
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1 font-mono break-all">
                    TxHash: {formData.transactionHash}
                  </p>
                  {walletState?.network && (
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="text-green-600 hover:text-green-700 p-0 h-auto mt-1"
                      onClick={() => window.open(getExplorerUrl(formData.transactionHash, walletState.network!), '_blank')}
                    >
                      Xem trên NEO Explorer →
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
            <Input
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              placeholder="VD: Chuyển khoản, Tiền mặt, Ví điện tử"
            />
          </div>

          <div>
            <Label htmlFor="description">Mô tả chi tiết</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả chi tiết về khoản thanh toán..."
              rows={4}
            />
          </div>

          {payment?.source === 'ai' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                🤖 Khoản thanh toán này được tạo tự động bởi AI từ email
              </p>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <div>
              {payment && onDelete && (
                <Button type="button" variant="destructive" onClick={handleDelete}>
                  Xóa
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit">
                {payment ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
