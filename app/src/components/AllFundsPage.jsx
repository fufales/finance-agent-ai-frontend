import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';
import FundCard from './FundCard';

const AllFundsPage = () => {
  const navigate = useNavigate();
  const { funds, expenses } = useFinanceData();

  const unpaidExpensesPeriod1 = expenses
    .filter(e => e.period === 1 && !e.paid)
    .reduce((sum, e) => sum + e.amount, 0);
    
  const unpaidExpensesPeriod2 = expenses
    .filter(e => e.period === 2 && !e.paid)
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">All Funds</h2>
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
