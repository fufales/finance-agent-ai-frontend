import React from 'react';
import { formatCurrency, formatPercentage } from '../utils/format';
import { Wallet, TrendingDown, PieChart } from 'lucide-react';

const SummaryCard = ({ totals }) => {
  const { totalIncome, totalExpenses, paidExpenses, projectedBalance, availableBalance, debtPercentage, totalFunds } = totals;
  const isDeficit = availableBalance < 0;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-3xl shadow-lg mb-6">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">Available Cash</p>
          <h1 className={`text-4xl font-bold ${isDeficit ? 'text-red-400' : 'text-white'}`}>
            {formatCurrency(availableBalance)}
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Funds: {formatCurrency(totalFunds)}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 border-t border-gray-700 pt-4">
          <div>
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
              <Wallet className="w-3 h-3" />
              Projected
            </div>
            <p className={`font-semibold ${projectedBalance < 0 ? 'text-red-400' : 'text-money-green-light'}`}>
              {formatCurrency(projectedBalance)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
              <TrendingDown className="w-3 h-3" />
              Paid
            </div>
            <p className="font-semibold text-white">{formatCurrency(paidExpenses)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
              <Wallet className="w-3 h-3" />
              Income
            </div>
            <p className="font-semibold text-white">{formatCurrency(totalIncome)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
              <PieChart className="w-3 h-3" />
              Debt %
            </div>
            <p className={`font-semibold ${debtPercentage > 30 ? 'text-yellow-400' : 'text-blue-300'}`}>
              {formatPercentage(debtPercentage)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
