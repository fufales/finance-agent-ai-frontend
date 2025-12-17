import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Save, Plus, ArrowLeft } from 'lucide-react';
import Dropdown from './Dropdown';

const FUND_TYPES = ['Debit Card', 'Credit Card', 'Cash', 'Savings', 'Investment'];

const COLORS = [
  { id: 'blue', label: 'Blue', class: 'bg-blue-600' },
  { id: 'red', label: 'Red', class: 'bg-red-600' },
  { id: 'gray', label: 'Gray', class: 'bg-gray-700' },
  { id: 'white', label: 'White', class: 'bg-white border border-gray-200' },
];

const FundForm = ({ onAdd, onUpdate, initialData, isEditing, onCancel }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState(FUND_TYPES[0]);
  const [color, setColor] = useState(COLORS[0].id);
  const [period, setPeriod] = useState('none');
  const [affectsBalance, setAffectsBalance] = useState(true);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(initialData.name);
      setAmount(initialData.amount.toString());
      setType(initialData.type);
      setColor(initialData.color || COLORS[0].id);
      setPeriod(initialData.period ? initialData.period.toString() : 'none');
      setAffectsBalance(initialData.affectsBalance !== false);
    } else {
      setName('');
      setAmount('');
      setType(FUND_TYPES[0]);
      setColor(COLORS[0].id);
      setPeriod('none');
      setAffectsBalance(true);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;

    const fundData = {
      name,
      amount: parseFloat(amount),
      type,
      color,
      period: period === 'none' ? null : parseInt(period),
      affectsBalance,
    };

    if (isEditing) {
      onUpdate(fundData);
    } else {
      onAdd(fundData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onCancel}
          className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEditing ? t('updateFund') : t('addFund')}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('fundName')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('fundNamePlaceholder')}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('currentBalance')}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent dark:text-white"
              inputMode="numeric"
            />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('affectsBalance')}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('affectsBalanceLabel')}</span>
            </div>
            <button
              type="button"
              onClick={() => setAffectsBalance(!affectsBalance)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-money-green focus:ring-offset-2 ${
                affectsBalance ? 'bg-money-green' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  affectsBalance ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('type')}</label>
            <Dropdown
              value={type}
              onChange={setType}
              options={FUND_TYPES}
              placeholder={t('selectType')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('assignPeriod')}</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPeriod('none')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === 'none' ? 'bg-gray-900 dark:bg-gray-950 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
              >
                {t('none')}
              </button>
              <button
                type="button"
                onClick={() => setPeriod('1')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === '1' ? 'bg-money-green text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
              >
                {t('period')} 1
              </button>
              <button
                type="button"
                onClick={() => setPeriod('2')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === '2' ? 'bg-money-green text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
              >
                {t('period')} 2
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('cardColor')}</label>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-10 h-10 rounded-full ${c.class} transition-transform ${color === c.id ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-950 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors mt-4"
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isEditing ? t('updateFund') : t('addFund')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FundForm;
