import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFinanceData } from '../../hooks/useFinanceData';
import FundCard from '../../components/FundCard';
import { useLanguage } from '../../context/LanguageContext';

const AllFundsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { funds, expenses } = useFinanceData();

  const unpaidExpensesPeriod1 = expenses
    .filter(e => e.period === 1 && !e.paid)
    .reduce((sum, e) => sum + e.amount, 0);
    
  const unpaidExpensesPeriod2 = expenses
    .filter(e => e.period === 2 && !e.paid)
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('allFunds')}</h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {funds.map(fund => {
            let available = fund.amount;
            if (fund.period === 1) {
              available = fund.amount - unpaidExpensesPeriod1;
            } else if (fund.period === 2) {
              available = fund.amount - unpaidExpensesPeriod2;
            }

            return (
              <FundCard 
                key={fund.id}
                fund={fund} 
                available={available}
                assignedPeriod={fund.period}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllFundsPage;
