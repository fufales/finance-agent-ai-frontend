import React, { useState } from 'react';
import { useFinanceData } from '../hooks/useFinanceData';
import SummaryCard from './SummaryCard';
import IncomeInput from './IncomeInput';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import { LayoutDashboard, Wallet, PlusCircle, ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  const {
    income,
    expenses,
    updateIncome,
    addExpense,
    deleteExpense,
    editExpense,
    totals,
  } = useFinanceData();

  const [currentView, setCurrentView] = useState('dashboard');
  const [editingExpense, setEditingExpense] = useState(null);

  const handleStartEdit = (expense) => {
    setEditingExpense(expense);
    setCurrentView('add-expense');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'income':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">Manage Income</h2>
            </div>
            <IncomeInput income={income} onUpdate={updateIncome} />
          </div>
        );
      case 'add-expense':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => {
                  setCurrentView('dashboard');
                  setEditingExpense(null);
                }}
                className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">
                {editingExpense ? 'Update Expense' : 'Add Expense'}
              </h2>
            </div>
            <ExpenseForm 
              onAdd={(expense) => {
                addExpense(expense);
                setCurrentView('dashboard');
              }}
              initialData={editingExpense}
              isEditing={!!editingExpense}
              onUpdate={(updatedExpense) => {
                editExpense(editingExpense.id, updatedExpense);
                setEditingExpense(null);
                setCurrentView('dashboard');
              }}
            />
          </div>
        );
      default:
        return (
          <>
            <header className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PFinances AI</h1>
                <p className="text-sm text-gray-500">Manage your budget</p>
              </div>
              <div className="w-10 h-10 bg-money-green/10 rounded-full flex items-center justify-center text-money-green font-bold">
                PF
              </div>
            </header>

            <SummaryCard totals={totals} />
            
            <div className="mb-20">
              <ExpenseList expenses={expenses} onDelete={deleteExpense} onEdit={handleStartEdit} />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 pt-6">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentView('dashboard');
              setEditingExpense(null);
            }}
            className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-money-green' : 'text-gray-400'}`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          
          <button
            onClick={() => {
              setCurrentView('add-expense');
              setEditingExpense(null);
            }}
            className="flex flex-col items-center gap-1 text-money-green -mt-8"
          >
            <div className="w-14 h-14 bg-money-green rounded-full flex items-center justify-center shadow-lg shadow-money-green/30 text-white transform transition-transform active:scale-95">
              <PlusCircle className="w-8 h-8" />
            </div>
            <span className="text-xs font-medium text-gray-600">Add</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('income');
              setEditingExpense(null);
            }}
            className={`flex flex-col items-center gap-1 ${currentView === 'income' ? 'text-money-green' : 'text-gray-400'}`}
          >
            <Wallet className="w-6 h-6" />
            <span className="text-xs font-medium">Income</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
