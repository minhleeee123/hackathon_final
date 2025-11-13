import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Search, Filter, DollarSign, TrendingUp } from 'lucide-react';
import { PaymentItem, PaymentStatus, PaymentSource } from '../types';
import PaymentDialog from './PaymentDialog';
import PaymentColumn from './PaymentColumn';
import { toast } from 'sonner';

interface FinanceManagementPageProps {
  payments: PaymentItem[];
  emails?: any[];
  onUpdatePayment: (payment: PaymentItem) => void;
  onDeletePayment: (paymentId: string) => void;
  onCreatePayment: (payment: Omit<PaymentItem, 'id' | 'createdAt' | 'source'>) => void;
}

export default function FinanceManagementPage({
  payments,
  emails = [],
  onUpdatePayment,
  onDeletePayment,
  onCreatePayment
}: FinanceManagementPageProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<PaymentSource | 'all'>('all');

  const getStatusColor = (status: PaymentStatus): string => {
    switch (status) {
      case 'unpaid':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'paid':
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getStatusLabel = (status: PaymentStatus): string => {
    switch (status) {
      case 'unpaid':
        return 'Chưa thanh toán';
      case 'paid':
        return 'Đã thanh toán';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (payment.recipient && payment.recipient.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || payment.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const groupedPayments = {
    'unpaid': filteredPayments.filter(p => p.status === 'unpaid'),
    'paid': filteredPayments.filter(p => p.status === 'paid')
  };

  const handleCreatePayment = (newPayment: Omit<PaymentItem, 'id' | 'createdAt' | 'source'>) => {
    onCreatePayment(newPayment);
    setIsCreating(false);
    toast.success('Đã tạo khoản thanh toán mới!');
  };

  const handleUpdatePayment = (updatedPayment: PaymentItem) => {
    onUpdatePayment(updatedPayment);
    setSelectedPayment(null);
    toast.success('Đã cập nhật khoản thanh toán!');
  };

  const handleDeletePayment = (paymentId: string) => {
    onDeletePayment(paymentId);
    setSelectedPayment(null);
    toast.success('Đã xóa khoản thanh toán!');
  };

  const handlePaymentDrop = (payment: PaymentItem, newStatus: PaymentStatus) => {
    const updatedPayment = {
      ...payment,
      status: newStatus,
      paidAt: newStatus === 'paid' ? new Date().toISOString() : undefined
    };
    onUpdatePayment(updatedPayment);
    toast.success(`Đã chuyển sang "${getStatusLabel(newStatus)}"`);
  };

  // Calculate statistics
  const totalUnpaid = groupedPayments.unpaid.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = groupedPayments.paid.reduce((sum, p) => sum + p.amount, 0);
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Quản lý Tài chính</h2>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-red-600" />
                  <span className="text-gray-600">Chưa thanh toán:</span>
                  <span className="font-semibold text-red-600">{formatAmount(totalUnpaid)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">Đã thanh toán:</span>
                  <span className="font-semibold text-green-600">{formatAmount(totalPaid)}</span>
                </div>
              </div>
            </div>
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Tạo khoản thanh toán
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm khoản thanh toán..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value as PaymentStatus | 'all')}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                  <SelectItem value="paid">Đã thanh toán</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={(value: string) => setSourceFilter(value as PaymentSource | 'all')}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Nguồn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả nguồn</SelectItem>
                  <SelectItem value="ai">AI tạo</SelectItem>
                  <SelectItem value="user">Người dùng tạo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Payment Board with Drag and Drop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PaymentColumn
              status="unpaid"
              title={getStatusLabel('unpaid')}
              payments={groupedPayments.unpaid}
              emails={emails}
              badgeClassName={getStatusColor('unpaid')}
              onPaymentClick={setSelectedPayment}
              onPaymentDrop={handlePaymentDrop}
            />
            <PaymentColumn
              status="paid"
              title={getStatusLabel('paid')}
              payments={groupedPayments.paid}
              emails={emails}
              badgeClassName={getStatusColor('paid')}
              onPaymentClick={setSelectedPayment}
              onPaymentDrop={handlePaymentDrop}
            />
          </div>

          {/* Payment Dialog */}
          {(selectedPayment || isCreating) && (
            <PaymentDialog
              payment={selectedPayment || undefined}
              open={!!(selectedPayment || isCreating)}
              onOpenChange={(open) => {
                if (!open) {
                  setSelectedPayment(null);
                  setIsCreating(false);
                }
              }}
              onCreate={handleCreatePayment}
              onUpdate={handleUpdatePayment}
              onDelete={handleDeletePayment}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
}
