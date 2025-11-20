import React from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { getCategoryIcon } from '../utils/categories';

const ExpenseList = ({ expenses, onDelete, onEdit }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No expenses yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 px-1">Recent Expenses</h3>
      {expenses.slice().reverse().map((expense) => (
        <div key={expense.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-10 rounded-full ${expense.period === 1 ? 'bg-blue-400' : 'bg-purple-400'}`} title={`Period ${expense.period}`}></div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
              {React.createElement(getCategoryIcon(expense.category), { size: 20 })}
            </div>
            <div>
              <p className="font-medium text-gray-900">{expense.name}</p>
              <p className="text-xs text-gray-500">{expense.category} • Period {expense.period}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 mr-2">{formatCurrency(expense.amount)}</span>
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
