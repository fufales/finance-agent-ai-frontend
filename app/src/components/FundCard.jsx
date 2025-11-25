import React from 'react';
import { CreditCard, Wallet, Trash2, Edit2, EyeOff } from 'lucide-react';
import { formatCurrency } from '../utils/format';

const FundCard = ({ fund, onDelete, onEdit, available, assignedPeriod }) => {
  const isCredit = fund.type === 'Credit Card';
  
  const getBgColor = () => {
    switch (fund.color) {
      case 'blue': return 'bg-gradient-to-br from-blue-600 to-blue-800 text-white';
      case 'red': return 'bg-gradient-to-br from-red-600 to-red-800 text-white';
      case 'gray': return 'bg-gradient-to-br from-gray-700 to-gray-900 text-white';
      case 'white': return 'bg-white text-gray-900 border border-gray-200';
      default: return 'bg-gradient-to-br from-gray-700 to-gray-900 text-white';
    }
  };

  const isLight = fund.color === 'white';

  return (
    <div className={`relative p-5 rounded-2xl shadow-lg min-w-[280px] ${getBgColor()} group`}>
      <div className="flex justify-between items-start mb-8">
        <div className={`p-2 rounded-lg backdrop-blur-sm ${isLight ? 'bg-gray-100 text-gray-900' : 'bg-white/10 text-white'}`}>
          {isCredit ? <CreditCard className="w-6 h-6" /> : <Wallet className="w-6 h-6" />}
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button 
              onClick={() => onEdit(fund)}
              className={`p-1.5 rounded-lg backdrop-blur-sm transition-colors ${isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' : 'bg-white/20 hover:bg-white/30 text-white'}`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(fund.id)}
              className={`p-1.5 rounded-lg backdrop-blur-sm transition-colors ${isLight ? 'bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-500' : 'bg-white/20 hover:bg-red-500/50 text-white'}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className={`text-sm font-medium ${isLight ? 'text-gray-500' : 'text-white/70'}`}>{fund.type}</p>
          {assignedPeriod && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/20 text-white'}`}>
              Period {assignedPeriod}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl font-bold">{fund.name}</h3>
          {fund.affectsBalance === false && (
            <div className={`p-1 rounded-full ${isLight ? 'bg-gray-100 text-gray-500' : 'bg-white/20 text-white/70'}`} title="Visual Only (Does not affect total balance)">
              <EyeOff className="w-4 h-4" />
            </div>
          )}
        </div>
        <p className="text-2xl font-bold tracking-tight">
          {assignedPeriod ? formatCurrency(available) : formatCurrency(fund.amount)}
        </p>
        {assignedPeriod && (
          <p className={`text-xs mt-1 ${isLight ? 'text-gray-400' : 'text-white/50'}`}>
            Limit: {formatCurrency(fund.amount)}
          </p>
        )}
      </div>
      
      <div className={`absolute bottom-4 right-4 ${isLight ? 'opacity-5 text-gray-900' : 'opacity-10 text-white'}`}>
        <CreditCard className="w-24 h-24" />
      </div>
    </div>
  );
};

export default FundCard;
