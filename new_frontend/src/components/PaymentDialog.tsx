import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PaymentItem, PaymentStatus } from '../types';

interface PaymentDialogProps {
  payment?: PaymentItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (payment: Omit<PaymentItem, 'id' | 'createdAt' | 'source'>) => void;
  onUpdate?: (payment: PaymentItem) => void;
  onDelete?: (paymentId: string) => void;
}

export default function PaymentDialog({
  payment,
  open,
  onOpenChange,
  onCreate,
  onUpdate,
  onDelete
}: PaymentDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'VND',
    dueDate: '',
    recipient: '',
    paymentMethod: '',
    description: '',
    status: 'unpaid' as PaymentStatus
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        title: payment.title,
        amount: payment.amount.toString(),
        currency: payment.currency,
        dueDate: payment.dueDate || '',
        recipient: payment.recipient || '',
        paymentMethod: payment.paymentMethod || '',
        description: payment.description,
        status: payment.status
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        currency: 'VND',
        dueDate: '',
        recipient: '',
        paymentMethod: '',
        description: '',
        status: 'unpaid'
      });
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
      paymentMethod: formData.paymentMethod || undefined,
      description: formData.description,
      status: formData.status,
      paidAt: formData.status === 'paid' ? new Date().toISOString() : undefined
    };

    if (payment && onUpdate) {
      onUpdate({ ...payment, ...paymentData });
    } else if (onCreate) {
      onCreate(paymentData);
    }
  };

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
