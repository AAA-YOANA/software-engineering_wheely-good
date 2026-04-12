import React, { useRef } from 'react';
import { CreditCard, Check } from 'lucide-react';

interface PaymentCard {
  id: string;
  type: 'visa' | 'mastercard' | 'alipay' | 'wechat';
  last4: string;
  isDefault: boolean;
  expiryDate?: string;
  holderName?: string;
}

interface ScooterAddButtonProps {
  onClick: () => void;
}

function ScooterAddButton({ onClick }: ScooterAddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-72 h-44 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:from-blue-50 hover:to-blue-100 transition-all group"
    >
      <div className="h-full flex flex-col items-center justify-center gap-3">
        {/* Scooter shaped + icon */}
        <svg width="64" height="64" viewBox="0 0 64 64" className="text-gray-400 group-hover:text-blue-500 transition-colors">
          {/* Scooter body - vertical part forming the "+" */}
          <rect x="29" y="10" width="6" height="44" rx="3" fill="currentColor" />
          <rect x="10" y="29" width="44" height="6" rx="3" fill="currentColor" />
          
          {/* Front wheel */}
          <circle cx="18" cy="50" r="6" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="18" cy="50" r="2" fill="currentColor" />
          
          {/* Back wheel */}
          <circle cx="46" cy="50" r="6" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="46" cy="50" r="2" fill="currentColor" />
          
          {/* Handlebar detail */}
          <circle cx="32" cy="14" r="3" fill="currentColor" />
        </svg>
        <span className="text-gray-600 group-hover:text-blue-600 font-medium transition-colors">
          添加支付方式
        </span>
      </div>
    </button>
  );
}

interface PaymentCardItemProps {
  card: PaymentCard;
  onSetDefault: (id: string) => void;
}

function PaymentCardItem({ card, onSetDefault }: PaymentCardItemProps) {
  const getCardGradient = (type: string) => {
    switch (type) {
      case 'visa':
        return 'from-blue-600 to-blue-800';
      case 'mastercard':
        return 'from-red-600 to-orange-600';
      case 'alipay':
        return 'from-cyan-500 to-blue-600';
      case 'wechat':
        return 'from-green-500 to-green-700';
      default:
        return 'from-gray-700 to-gray-900';
    }
  };

  const getCardName = (type: string) => {
    switch (type) {
      case 'visa':
        return 'Visa';
      case 'mastercard':
        return 'Mastercard';
      case 'alipay':
        return '支付宝';
      case 'wechat':
        return '微信支付';
      default:
        return '';
    }
  };

  return (
    <div
      className={`flex-shrink-0 w-72 h-44 bg-gradient-to-br ${getCardGradient(card.type)} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
      onClick={() => !card.isDefault && onSetDefault(card.id)}
    >
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
      </div>

      <div className="relative h-full flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <CreditCard className="w-8 h-8" />
          {card.isDefault && (
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Check className="w-3 h-3" />
              默认
            </div>
          )}
        </div>

        <div>
          <div className="text-xl tracking-wider mb-2 font-mono">
            •••• •••• •••• {card.last4}
          </div>
          <div className="flex items-end justify-between">
            <div>
              {card.holderName && (
                <div className="text-xs opacity-80 mb-1">持卡人</div>
              )}
              <div className="text-sm font-medium">{card.holderName || getCardName(card.type)}</div>
            </div>
            {card.expiryDate && (
              <div className="text-right">
                <div className="text-xs opacity-80">有效期</div>
                <div className="text-sm font-medium">{card.expiryDate}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PaymentCards() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cards, setCards] = React.useState<PaymentCard[]>([
    {
      id: '1',
      type: 'visa',
      last4: '4532',
      isDefault: true,
      expiryDate: '12/26',
      holderName: '张伟'
    },
    {
      id: '2',
      type: 'alipay',
      last4: '8888',
      isDefault: false
    },
    {
      id: '3',
      type: 'wechat',
      last4: '6666',
      isDefault: false
    }
  ]);

  const handleSetDefault = (id: string) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === id
    })));
  };

  const handleAddCard = () => {
    alert('打开添加支付方式对话框');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">支付方式</h2>
        <span className="text-sm text-gray-500">{cards.length} 个支付方式</span>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {cards.map(card => (
          <PaymentCardItem key={card.id} card={card} onSetDefault={handleSetDefault} />
        ))}
        <ScooterAddButton onClick={handleAddCard} />
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
