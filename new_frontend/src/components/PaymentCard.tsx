import { useDrag } from 'react-dnd';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, DollarSign, Building2, CreditCard, Mail, Bot, User } from 'lucide-react';
import { PaymentItem } from '../types';

interface PaymentCardProps {
  payment: PaymentItem;
  email?: any;
  onClick: () => void;
}

export default function PaymentCard({ payment, email, onClick }: PaymentCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PAYMENT',
    item: payment,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    }
    return `${currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate || payment.status === 'paid') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card
        className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4"
        style={{
          borderLeftColor: payment.status === 'paid' ? '#10b981' : isOverdue(payment.dueDate) ? '#ef4444' : '#3b82f6'
        }}
        onClick={onClick}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              {payment.title}
            </h3>
            <Badge variant={payment.source === 'ai' ? 'default' : 'secondary'} className="shrink-0 flex items-center gap-1">
              {payment.source === 'ai' ? (
                <>
                  <Bot className="w-3 h-3" />
                  <span>AI</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3" />
                  <span>User</span>
                </>
              )}
            </Badge>
          </div>

          {/* Amount */}
          <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <DollarSign className="w-5 h-5 text-green-600" />
            {formatCurrency(payment.amount, payment.currency)}
          </div>

          {/* Due Date */}
          {payment.dueDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className={`w-4 h-4 ${isOverdue(payment.dueDate) ? 'text-red-600' : 'text-blue-600'}`} />
              <span className={isOverdue(payment.dueDate) ? 'text-red-600 font-medium' : 'text-gray-600'}>
                {isOverdue(payment.dueDate) ? 'Quá hạn: ' : 'Hạn: '}
                {formatDate(payment.dueDate)}
              </span>
            </div>
          )}

          {/* Recipient */}
          {payment.recipient && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="w-4 h-4" />
              <span className="truncate">{payment.recipient}</span>
            </div>
          )}

          {/* Payment Method */}
          {payment.paymentMethod && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span>{payment.paymentMethod}</span>
            </div>
          )}

          {/* Description */}
          {payment.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {payment.description}
            </p>
          )}

          {/* Related Email */}
          {email && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Mail className="w-3 h-3" />
                <span className="truncate">Từ: {email.from?.name || email.from?.email}</span>
              </div>
              <div className="text-xs text-gray-400 truncate mt-1">
                {email.subject}
              </div>
            </div>
          )}

          {/* Paid Date */}
          {payment.status === 'paid' && payment.paidAt && (
            <div className="text-xs text-green-600 font-medium">
              ✓ Đã thanh toán: {formatDate(payment.paidAt)}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
