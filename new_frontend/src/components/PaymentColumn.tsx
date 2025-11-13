import { useDrop } from 'react-dnd';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { PaymentItem, PaymentStatus } from '../types';
import PaymentCard from './PaymentCard';

interface PaymentColumnProps {
  status: PaymentStatus;
  title: string;
  payments: PaymentItem[];
  emails?: any[];
  badgeClassName: string;
  onPaymentClick: (payment: PaymentItem) => void;
  onPaymentDrop: (payment: PaymentItem, newStatus: PaymentStatus) => void;
}

export default function PaymentColumn({
  status,
  title,
  payments,
  emails = [],
  badgeClassName,
  onPaymentClick,
  onPaymentDrop
}: PaymentColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'PAYMENT',
    drop: (item: PaymentItem) => {
      if (item.status !== status) {
        onPaymentDrop(item, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Group payments by email
  const groupedPayments: Record<string, PaymentItem[]> = {};
  const standalonePayments: PaymentItem[] = [];

  payments.forEach(payment => {
    if (payment.emailId) {
      if (!groupedPayments[payment.emailId]) {
        groupedPayments[payment.emailId] = [];
      }
      groupedPayments[payment.emailId].push(payment);
    } else {
      standalonePayments.push(payment);
    }
  });

  const getEmailById = (emailId: string) => {
    return emails.find(e => e.id === emailId);
  };

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const formatTotalAmount = () => {
    // Assume all payments use the same currency, use the first one
    const currency = payments[0]?.currency || 'VND';
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(totalAmount);
    }
    return `${currency} ${totalAmount.toLocaleString()}`;
  };

  return (
    <div ref={drop} className="flex flex-col">
      <Card className={`p-4 ${isOver ? 'ring-2 ring-blue-400' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <Badge className={badgeClassName}>
              {payments.length}
            </Badge>
          </div>
          {payments.length > 0 && (
            <div className="text-sm font-semibold text-gray-700">
              {formatTotalAmount()}
            </div>
          )}
        </div>

        <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
          {/* Standalone payments (no email) */}
          {standalonePayments.map(payment => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              onClick={() => onPaymentClick(payment)}
            />
          ))}

          {/* Grouped payments by email */}
          {Object.entries(groupedPayments).map(([emailId, emailPayments]) => {
            const email = getEmailById(emailId);
            
            return (
              <div key={emailId}>
                {emailPayments.map(payment => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    email={email}
                    onClick={() => onPaymentClick(payment)}
                  />
                ))}
              </div>
            );
          })}

          {payments.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">Không có khoản thanh toán nào</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
