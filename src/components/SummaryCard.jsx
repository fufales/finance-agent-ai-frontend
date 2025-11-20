import React from 'react';
import { formatCurrency, formatPercentage } from '../utils/format';
import { Wallet, TrendingDown, PieChart } from 'lucide-react';

const SummaryCard = ({ totals }) => {
  const { totalIncome, totalExpenses, balance, debtPercentage } = totals;
  const isDeficit = balance < 0;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-3xl shadow-lg mb-6">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">Remaining Balance</p>
          <h1 className={`text-4xl font-bold ${isDeficit ? 'text-red-400' : 'text-white'}`}>
            {formatCurrency(balance)}
          </h1>
        </div>
        
        <div className="grid grid-cols-3 gap-4 border-t border-gray-700 pt-4">
          <div>
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
              <Wallet className="w-3 h-3" />
              Income
            </div>
            <p className="font-semibold text-money-green-light">{formatCurrency(totalIncome)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
              <TrendingDown className="w-3 h-3" />
              Expenses
            </div>
            <p className="font-semibold text-white">{formatCurrency(totalExpenses)}</p>
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
