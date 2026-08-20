import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const IncomeInput = ({ income, onUpdate }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{t('biWeeklyIncome')}</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('payPeriod1')}</label>
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">₡</span>
             <input
              type="number"
              value={income?.period1 || ''}
              onChange={(e) => onUpdate('period1', e.target.value)}
              placeholder="0"
              className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-lg font-medium"
              inputMode="numeric"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('payPeriod2')}</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">₡</span>
            <input
              type="number"
              value={income?.period2 || ''}
              onChange={(e) => onUpdate('period2', e.target.value)}
              placeholder="0"
              className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-lg font-medium"
              inputMode="numeric"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeInput;
