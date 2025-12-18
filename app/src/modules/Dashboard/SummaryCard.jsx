import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatPercentage } from '../../utils/format';
import { Wallet, TrendingDown, PieChart, AlertTriangle } from 'lucide-react';

const SummaryCard = ({ totals }) => {
  const { t } = useLanguage();
  const { totalIncome, paidExpenses, projectedBalance, debtPercentage, totalFunds, debtExpenses } = totals;
  const isDeficit = projectedBalance < 0;

  const getDebtStatus = (percentage) => {
    if (percentage > 50) return { color: 'text-red-600 dark:text-red-400', showIcon: true };
    if (percentage > 45) return { color: 'text-red-500 dark:text-red-400', showIcon: false };
    if (percentage > 40) return { color: 'text-orange-600 dark:text-orange-400', showIcon: false };
    if (percentage > 30) return { color: 'text-orange-400', showIcon: false };
    return { color: 'text-emerald-400', showIcon: false };
  };

  const { color: debtColor, showIcon: showDebtAlert } = getDebtStatus(debtPercentage);

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 text-white p-6 rounded-3xl shadow-lg mb-6">
      <div className="absolute top-6 right-6 text-xs text-gray-400 dark:text-gray-300 font-medium">{t('monthSummary')}</div>
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-gray-400 dark:text-gray-300 text-sm font-medium mb-1">{t('projectedBalance')}</p>
          <h1 className={`text-4xl font-bold ${isDeficit ? 'text-red-400' : 'text-white'}`}>
            {formatCurrency(projectedBalance)}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            {t('funds')}: {formatCurrency(totalFunds)}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 border-t border-gray-700 dark:border-gray-600 pt-4">
          <div>
            <div className="flex items-center gap-1 text-gray-400 dark:text-gray-300 text-xs mb-1">
              <TrendingDown className="w-3 h-3" />
              {t('paid')}
            </div>
            <p className="font-semibold text-white">{formatCurrency(paidExpenses)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-gray-400 dark:text-gray-300 text-xs mb-1">
              <Wallet className="w-3 h-3" />
              {t('income')}
            </div>
            <p className="font-semibold text-white">{formatCurrency(totalIncome)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-gray-400 dark:text-gray-300 text-xs mb-1">
              <PieChart className="w-3 h-3" />
              {t('debtPercentage')}
            </div>
            <div className={`flex items-center gap-1 font-semibold ${debtColor}`}>
              {formatPercentage(debtPercentage)}
              {showDebtAlert && <AlertTriangle className="w-4 h-4" />}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-gray-400 dark:text-gray-300 text-xs mb-1">
              <TrendingDown className="w-3 h-3" />
              {t('debtAmount')}
            </div>
            <p className={`font-semibold ${debtColor}`}>{formatCurrency(debtExpenses)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
