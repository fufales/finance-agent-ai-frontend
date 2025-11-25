import React, { useState } from 'react';
import { Trash2, Edit2, ArrowUpDown } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { getCategoryIcon } from '../utils/categories';
import Dropdown from './Dropdown';

const ExpenseList = ({ expenses, onDelete, onEdit, onTogglePaid }) => {
  const [sortBy, setSortBy] = useState('default');

  const getSortedExpenses = () => {
    const sorted = [...expenses];
    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'amount':
        return sorted.sort((a, b) => b.amount - a.amount);
      default:
        return sorted.sort((a, b) => {
          if (a.period !== b.period) return a.period - b.period;
          return a.category.localeCompare(b.category);
        });
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No expenses yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Expenses</h3>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <div className="w-48">
            <Dropdown
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'default', label: 'Default (Period)' },
                { value: 'date', label: 'Date (Newest)' },
                { value: 'amount', label: 'Amount (Highest)' }
              ]}
            />
          </div>
        </div>
      </div>
      {getSortedExpenses().map((expense) => (
        <div 
          key={expense.id} 
          className={`p-4 rounded-xl shadow-sm border border-l-4 flex items-center justify-between group transition-colors 
            ${expense.paid ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100'}
            ${expense.period === 1 ? 'border-l-blue-400' : 'border-l-purple-400'}
          `}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => onTogglePaid(expense.id)}
              className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                expense.paid 
                  ? 'bg-money-green border-money-green text-white' 
                  : 'border-gray-300 text-transparent hover:border-money-green'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            <div className="w-10 h-10 shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
              {React.createElement(getCategoryIcon(expense.category), { size: 24 })}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`font-medium break-words ${expense.paid ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {expense.name}
              </p>
              <p className="text-xs text-gray-500">{expense.category} • Period {expense.period}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span className={`font-semibold mr-2 ${expense.paid ? 'text-gray-400' : 'text-gray-900'}`}>{formatCurrency(expense.amount)}</span>
            <button
              onClick={() => onEdit(expense)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(expense.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
