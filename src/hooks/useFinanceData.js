import { useState, useEffect } from 'react';

const STORAGE_KEY = 'pfinances_data_v1';

const INITIAL_DATA = {
  income: {
    period1: 0,
    period2: 0,
  },
  expenses: [],
};

export const useFinanceData = () => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateIncome = (period, amount) => {
    setData(prev => ({
      ...prev,
      income: {
        ...prev.income,
        [period]: parseFloat(amount) || 0,
      },
    }));
  };

  const addExpense = (expense) => {
    const newExpense = { ...expense, id: crypto.randomUUID() };
    setData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense],
    }));
  };

  const deleteExpense = (id) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id),
    }));
  };

  const editExpense = (id, updatedExpense) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.map(e => e.id === id ? { ...e, ...updatedExpense } : e),
    }));
  };

  const totalIncome = data.income.period1 + data.income.period2;
  
  const totalExpenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);
  
  const balance = totalIncome - totalExpenses;
  
  const debtExpenses = data.expenses
    .filter(e => e.category === 'Debts' || e.category === 'Credit cards')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const debtPercentage = totalIncome > 0 ? (debtExpenses / totalIncome) * 100 : 0;

  return {
    income: data.income,
    expenses: data.expenses,
    updateIncome,
    addExpense,
    deleteExpense,
    editExpense,
    totals: {
      totalIncome,
      totalExpenses,
      balance,
      debtPercentage,
    },
  };
};
