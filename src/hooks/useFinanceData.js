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
    return saved ? JSON.parse(saved) : { ...INITIAL_DATA, funds: [] };
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
    const newExpense = { ...expense, id: crypto.randomUUID(), paid: false };
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

  const togglePaid = (id) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.map(e => e.id === id ? { ...e, paid: !e.paid } : e),
    }));
  };

  const addFund = (fund) => {
    const newFund = { ...fund, id: crypto.randomUUID() };
    setData(prev => ({
      ...prev,
      funds: [...(prev.funds || []), newFund],
    }));
  };

  const deleteFund = (id) => {
    setData(prev => ({
      ...prev,
      funds: (prev.funds || []).filter(f => f.id !== id),
    }));
  };

  const editFund = (id, updatedFund) => {
    setData(prev => ({
      ...prev,
      funds: (prev.funds || []).map(f => f.id === id ? { ...f, ...updatedFund } : f),
    }));
  };

  const totalIncome = data.income.period1 + data.income.period2;
  const totalFunds = (data.funds || []).reduce((sum, item) => sum + item.amount, 0);
  
  const totalExpenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);
  const paidExpenses = data.expenses.reduce((sum, item) => item.paid ? sum + item.amount : sum, 0);
  const unpaidExpenses = totalExpenses - paidExpenses;
  
  const projectedBalance = totalIncome - totalExpenses;
  const availableBalance = totalFunds - unpaidExpenses;
  
  const debtExpenses = data.expenses
    .filter(e => e.category === 'Debts' || e.category === 'Credit cards')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const debtPercentage = totalIncome > 0 ? (debtExpenses / totalIncome) * 100 : 0;

  const importData = (newData) => {
    setData(newData);
  };

  return {
    data, // Expose full data for export
    income: data.income,
    expenses: data.expenses,
    funds: data.funds || [],
    updateIncome,
    addExpense,
    deleteExpense,
    editExpense,
    togglePaid,
    addFund,
    deleteFund,
    editFund,
    importData,
    totals: {
      totalIncome,
      totalFunds,
      totalExpenses,
      paidExpenses,
      projectedBalance,
      availableBalance,
      debtPercentage,
    },
  };
};
