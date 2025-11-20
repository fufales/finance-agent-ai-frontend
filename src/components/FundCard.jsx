import React from 'react';
import { CreditCard, Wallet, Trash2, Edit2 } from 'lucide-react';
import { formatCurrency } from '../utils/format';

const FundCard = ({ fund, onDelete, onEdit }) => {
  const isCredit = fund.type === 'Credit Card';
  
  const getBgColor = () => {
    if (fund.color) return fund.color;
    switch (fund.type) {
      case 'Credit Card': return 'bg-gradient-to-br from-purple-600 to-purple-800';
      case 'Debit Card': return 'bg-gradient-to-br from-blue-600 to-blue-800';
      case 'Cash': return 'bg-gradient-to-br from-green-600 to-green-800';
      default: return 'bg-gradient-to-br from-gray-700 to-gray-900';
    }
  };

  return (
    <div className={`relative p-5 rounded-2xl text-white shadow-lg min-w-[280px] ${getBgColor()} group`}>
      <div className="flex justify-between items-start mb-8">
        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
          {isCredit ? <CreditCard className="w-6 h-6" /> : <Wallet className="w-6 h-6" />}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(fund)}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(fund.id)}
            className="p-1.5 bg-white/20 hover:bg-red-500/50 rounded-lg backdrop-blur-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div>
        <p className="text-white/70 text-sm font-medium mb-1">{fund.type}</p>
        <h3 className="text-xl font-bold mb-1">{fund.name}</h3>
        <p className="text-2xl font-bold tracking-tight">{formatCurrency(fund.amount)}</p>
      </div>
      
      <div className="absolute bottom-4 right-4 opacity-10">
        <CreditCard className="w-24 h-24" />
      </div>
    </div>
  );
};

export default FundCard;
