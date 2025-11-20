import React, { useState, useEffect } from 'react';
import { Plus, Save } from 'lucide-react';
import Dropdown from './Dropdown';
import { CATEGORIES, getCategoryIcon } from '../utils/categories';

const ExpenseForm = ({ onAdd, initialData, isEditing, onUpdate }) => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [period, setPeriod] = useState('1');

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setName(initialData.name);
      setCategory(initialData.category);
      setPeriod(initialData.period.toString());
    } else {
      setAmount('');
      setName('');
      setCategory(CATEGORIES[0]);
      setPeriod('1');
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
    };

    if (isEditing) {
      onUpdate(expenseData);
    } else {
      onAdd(expenseData);
      setAmount('');
      setName('');
      setCategory(CATEGORIES[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">{isEditing ? 'Update Expense' : 'Add Expense'}</h2>
      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Expense Name"
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent"
          />
          <Dropdown
            value={category}
            onChange={setCategory}
            options={CATEGORIES}
            getIcon={getCategoryIcon}
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Assign to Period:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPeriod('1')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === '1' ? 'bg-money-green text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              Period 1
            </button>
            <button
              type="button"
              onClick={() => setPeriod('2')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === '2' ? 'bg-money-green text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              Period 2
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
        >
          {isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isEditing ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
