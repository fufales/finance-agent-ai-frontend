import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Plus, Save } from 'lucide-react';
import Dropdown from './Dropdown';
import { CATEGORIES, getCategoryIcon } from '../utils/categories';

const ExpenseForm = ({ onAdd, initialData, isEditing, onUpdate }) => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [period, setPeriod] = useState('1');
  const [paymentDay, setPaymentDay] = useState('');

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAmount(initialData.amount.toString());
      setName(initialData.name);
      setCategory(initialData.category);
      setPeriod(initialData.period.toString());
      setPaymentDay(initialData.paymentDay || '');
    } else {
      setAmount('');
      setName('');
      setCategory(CATEGORIES[0]);
      setPeriod('1');
      setPaymentDay('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !name) return;

    const expenseData = {
      amount: parseFloat(amount),
      name,
      category,
      period: parseInt(period),
      date: new Date().toISOString(),
      paymentDay: paymentDay ? parseInt(paymentDay) : null,
    };

    if (isEditing) {
      onUpdate(expenseData);
    } else {
      onAdd(expenseData);
      setAmount('');
      setName('');
      setCategory(CATEGORIES[0]);
      setPaymentDay('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{isEditing ? t('updateExpense') : t('addExpense')}</h2>
      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('expenseName')}
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t('amount')}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            inputMode="numeric"
          />
          <Dropdown
            value={category}
            onChange={setCategory}
            options={CATEGORIES}
            getIcon={getCategoryIcon}
          />
        </div>
        
        {/* Payment Day Selector - Day Only */}
        <div className="relative">
          <label className="text-xs text-gray-500 dark:text-gray-400 ml-1 mb-1 block">{t('paymentDayOptional')}</label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="31"
              value={paymentDay}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!e.target.value || (val >= 1 && val <= 31)) {
                  setPaymentDay(e.target.value);
                }
              }}
              placeholder={t('dayOfMonthPlaceholder')}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">{t('assignToPeriod')}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPeriod('1')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === '1' ? 'bg-money-green text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
              >
                {t('period')} 1
              </button>
              <button
                type="button"
                onClick={() => setPeriod('2')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === '2' ? 'bg-money-green text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
              >
                {t('period')} 2
              </button>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-950 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors"
        >
          {isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isEditing ? t('updateExpense') : t('addExpense')}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
