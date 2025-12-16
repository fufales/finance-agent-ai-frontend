import React from 'react';
import { DollarSign } from 'lucide-react';

const IncomeInput = ({ income, onUpdate }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Bi-Weekly Income</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Pay Period 1</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="number"
              value={income.period1 || ''}
              onChange={(e) => onUpdate('period1', e.target.value)}
              placeholder="0"
              className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent transition-all dark:text-white"
              inputMode="numeric"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Pay Period 2</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="number"
              value={income.period2 || ''}
              onChange={(e) => onUpdate('period2', e.target.value)}
              placeholder="0"
              className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent transition-all dark:text-white"
              inputMode="numeric"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeInput;
