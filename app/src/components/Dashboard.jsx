import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinanceData } from '../hooks/useFinanceData';
import SummaryCard from './SummaryCard';
import IncomeInput from './IncomeInput';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import FundCard from './FundCard';
import FundForm from './FundForm';
import DataControls from './DataControls';
import ConfigurationPage from './ConfigurationPage';
import { LayoutDashboard, Wallet, PlusCircle, ArrowLeft, CreditCard, User, Settings, LogOut, LayoutGrid } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    income,
    expenses,
    funds,
    updateIncome,
    addExpense,
    deleteExpense,
    editExpense,
    togglePaid,
    addFund,
    deleteFund,
    editFund,
    totals,
    data,
    importData,
  } = useFinanceData();

  const [currentView, setCurrentView] = useState('dashboard');
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingFund, setEditingFund] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleStartEdit = (expense) => {
    setEditingExpense(expense);
    setCurrentView('add-expense');
  };

  const handleStartEditFund = (fund) => {
    setEditingFund(fund);
    setCurrentView('add-fund');
  };

  const handleLogout = () => {
    // In the future, clear auth tokens here
    navigate('/');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'configuration':
        return (
          <ConfigurationPage 
            onBack={() => setCurrentView('dashboard')}
            data={data}
            onImport={importData}
          />
        );
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
      case 'add-fund':
        return (
          <FundForm 
            onAdd={(fund) => {
              addFund(fund);
              setCurrentView('dashboard');
            }}
            onUpdate={(updatedFund) => {
              editFund(editingFund.id, updatedFund);
              setEditingFund(null);
              setCurrentView('dashboard');
            }}
            initialData={editingFund}
            isEditing={!!editingFund}
            onCancel={() => {
              setEditingFund(null);
              setCurrentView('dashboard');
            }}
          />
        );
      default:
        const unpaidExpensesPeriod1 = expenses
          .filter(e => e.period === 1 && !e.paid)
          .reduce((sum, e) => sum + e.amount, 0);
          
        const unpaidExpensesPeriod2 = expenses
          .filter(e => e.period === 2 && !e.paid)
          .reduce((sum, e) => sum + e.amount, 0);

        return (
          <>
            <header className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PFinances AI</h1>
                <p className="text-sm text-gray-500">Manage your budget</p>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-6 h-6" />
                </button>

                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                      <button
                        onClick={() => {
                          setCurrentView('configuration');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Configuration
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </header>

            <SummaryCard totals={totals} />
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-lg font-semibold text-gray-800">Current Funds</h3>
                <button 
                  onClick={() => setCurrentView('add-fund')}
                  className="text-sm text-money-green font-medium hover:text-money-green-dark"
                >
                  + Add Fund
                </button>
              </div>
              
              {funds.length === 0 ? (
                <div 
                  onClick={() => setCurrentView('add-fund')}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-money-green hover:text-money-green transition-colors"
                >
                  <CreditCard className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium">Add your first card or account</p>
                </div>
              ) : (
                <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x">
                  {funds.map(fund => {
                    let available = fund.amount;
                    if (fund.period === 1) {
                      available = fund.amount - unpaidExpensesPeriod1;
                    } else if (fund.period === 2) {
                      available = fund.amount - unpaidExpensesPeriod2;
                    }

                    return (
                      <div key={fund.id} className="snap-center">
                        <FundCard 
                          fund={fund} 
                          onDelete={deleteFund}
                          onEdit={handleStartEditFund}
                          available={available}
                          assignedPeriod={fund.period}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              
              {funds.length > 0 && (
                <button 
                  onClick={() => navigate('/all-funds')}
                  className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-gray-500 font-medium hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors border border-transparent hover:border-gray-200"
                >
                  <LayoutGrid className="w-4 h-4" />
                  View all cards
                </button>
              )}
            </div>

            <div className="mb-8">
              <ExpenseList 
                expenses={expenses} 
                onDelete={deleteExpense} 
                onEdit={handleStartEdit}
                onTogglePaid={togglePaid}
              />
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 pb-safe z-50">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentView('dashboard');
              setEditingExpense(null);
              setEditingFund(null);
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
              setEditingFund(null);
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
              setEditingFund(null);
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
