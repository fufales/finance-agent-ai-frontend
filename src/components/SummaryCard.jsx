import React from 'react';
import { formatCurrency, formatPercentage } from '../utils/format';
import { Wallet, TrendingDown, PieChart } from 'lucide-react';

const SummaryCard = ({ totals }) => {
  const { totalIncome, totalExpenses, paidExpenses, projectedBalance, availableBalance, debtPercentage, totalFunds, debtExpenses } = totals;
  const isDeficit = projectedBalance < 0;

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-3xl shadow-lg mb-6">
      <div className="absolute top-6 right-6 text-xs text-gray-400 font-medium">Month Summary</div>
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">Projected Balance</p>
          <h1 className={`text-4xl font-bold ${isDeficit ? 'text-red-400' : 'text-white'}`}>
            {formatCurrency(projectedBalance)}
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Funds: {formatCurrency(totalFunds)}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 border-t border-gray-700 pt-4">
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
          <div>
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
              <TrendingDown className="w-3 h-3" />
              Debt Amount
            </div>
            <p className="font-semibold text-white">{formatCurrency(debtExpenses)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
