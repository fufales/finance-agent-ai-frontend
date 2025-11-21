import React, { useState, useEffect } from 'react';
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
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState(FUND_TYPES[0]);
  const [color, setColor] = useState(COLORS[0].id);
  const [period, setPeriod] = useState('none');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAmount(initialData.amount.toString());
      setType(initialData.type);
      setColor(initialData.color || COLORS[0].id);
      setPeriod(initialData.period ? initialData.period.toString() : 'none');
    } else {
      setName('');
      setAmount('');
      setType(FUND_TYPES[0]);
      setColor(COLORS[0].id);
      setPeriod('none');
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
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">
          {isEditing ? 'Update Fund' : 'Add Fund'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fund Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Main Debit Card"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Balance</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent appearance-none"
            >
              {FUND_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Period</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPeriod('none')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === 'none' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                None
              </button>
              <button
                type="button"
                onClick={() => setPeriod('1')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === '1' ? 'bg-money-green text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Period 1
              </button>
              <button
                type="button"
                onClick={() => setPeriod('2')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === '2' ? 'bg-money-green text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Period 2
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Color</label>
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
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors mt-4"
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isEditing ? 'Update Fund' : 'Add Fund'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FundForm;
