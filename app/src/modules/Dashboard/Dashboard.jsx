import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFinanceData } from '../../hooks/useFinanceData';
import SummaryCard from './SummaryCard';
import IncomeInput from './IncomeInput';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import GoalsList from '../GoalsPage/GoalsList';
import GoalForm from '../GoalsPage/GoalForm';
import FundCard from '../../components/FundCard';
import FundForm from './FundForm';
import ConfigurationPage from '../ConfigurationPage/ConfigurationPage';
import { LayoutDashboard, Wallet, PlusCircle, ArrowLeft, CreditCard, User, Settings, LogOut, LayoutGrid, Crown, Target } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
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
    reorderExpenses,
    goals,
    addGoal,
    deleteGoal,
    editGoal,
    dashboardConfig,
    updateDashboardConfig,
  } = useFinanceData();

  const [currentView, setCurrentView] = useState('dashboard');
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingFund, setEditingFund] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [fundToDelete, setFundToDelete] = useState(null);
  const [goalReturnView, setGoalReturnView] = useState('goals');

  const [showAddMenu, setShowAddMenu] = useState(false);



  // Scroll persistence logic
  useEffect(() => {
    const SCROLL_KEY = 'dashboard_scroll_position';
    
    if (currentView === 'dashboard') {
      const savedScroll = sessionStorage.getItem(SCROLL_KEY);
      if (savedScroll) {
        // Use a small timeout to ensure the DOM is fully rendered
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScroll));
        }, 0);
      }
    }
  }, [currentView]);

  // Handle hash navigation for configuration
  useEffect(() => {
    if (location.hash === '#app-version' && currentView !== 'configuration') {
      setTimeout(() => {
        setCurrentView('configuration');
      }, 0);
    }
  }, [location, currentView]);

  const saveScrollPosition = () => {
    if (currentView === 'dashboard') {
      sessionStorage.setItem('dashboard_scroll_position', window.scrollY);
    }
  };

  const handleStartEdit = (expense) => {
    saveScrollPosition();
    setEditingExpense(expense);
    setCurrentView('add-expense');
  };

  const handleStartEditFund = (fund) => {
    saveScrollPosition();
    setEditingFund(fund);
    setCurrentView('add-fund');
  };

  const handleLogout = () => {
    // In the future, clear auth tokens here
    navigate('/');
  };

  const handleConfirmDeleteFund = () => {
    if (fundToDelete) {
      deleteFund(fundToDelete);
      setFundToDelete(null);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'configuration':
        return (
          <ConfigurationPage 
            onBack={() => setCurrentView('dashboard')}
            data={data}
            onImport={importData}
            dashboardConfig={dashboardConfig}
            updateDashboardConfig={updateDashboardConfig}
          />
        );
      case 'income':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('manageIncome')}</h2>
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
                className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingExpense ? t('updateExpense') : t('addExpense')}
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
      case 'goals':
        return (
          <GoalsList 
            goals={goals}
            onAdd={() => {
                saveScrollPosition();
                setEditingGoal(null);
                setGoalReturnView('goals');
                setCurrentView('add-goal');
            }}
            onEdit={(goal) => {
                saveScrollPosition();
                setEditingGoal(goal);
                setGoalReturnView('goals');
                setCurrentView('add-goal');
            }}
            onDelete={deleteGoal}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'add-goal':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => {
                  setCurrentView(goalReturnView);
                  setEditingGoal(null);
                }}
                className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingGoal ? t('editGoal') : t('addGoal')}
              </h2>
            </div>
            <GoalForm 
              onAdd={(goal) => {
                addGoal(goal);
                setCurrentView('goals');
              }}
              onUpdate={(updatedGoal) => {
                editGoal(editingGoal.id, updatedGoal);
                setEditingGoal(null);
                setCurrentView('goals');
              }}
              initialData={editingGoal}
              isEditing={!!editingGoal}
              onCancel={() => {
                setEditingGoal(null);
                setCurrentView(goalReturnView);
              }}
            />
          </div>
        );
      default: {
        const unpaidExpensesPeriod1 = expenses
          .filter(e => e.period === 1 && !e.paid)
          .reduce((sum, e) => sum + e.amount, 0);
          
        const unpaidExpensesPeriod2 = expenses
          .filter(e => e.period === 2 && !e.paid)
          .reduce((sum, e) => sum + e.amount, 0);

        return (
          <>
            <header className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-200 to-yellow-400 rounded-full shadow-sm border border-yellow-200">
                    <Crown className="w-4 h-4 text-yellow-800" fill="currentColor" />
                    <span className="text-xs font-bold text-yellow-900 tracking-wide">{t('proUser')}</span>
                  </div>
                </div>
              </div>
            </header>

            <SummaryCard totals={totals} config={dashboardConfig} />
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('currentFunds')}</h3>
              </div>
              
              {funds.length === 0 ? (
                <div 
                  onClick={() => {
                    saveScrollPosition();
                    setCurrentView('add-fund');
                  }}
                  className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 cursor-pointer hover:border-money-green hover:text-money-green transition-colors"
                >
                  <CreditCard className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium">{t('addFirstFund')}</p>
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
                          onDelete={setFundToDelete}
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
                  onClick={() => {
                    saveScrollPosition();
                    navigate('/all-funds');
                  }}
                  className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                >
                  <LayoutGrid className="w-4 h-4" />
                  {t('viewAllCards')}
                </button>
              )}
            </div>

            <div className="mb-8">
              <ExpenseList 
                expenses={expenses} 
                onDelete={deleteExpense} 
                onEdit={handleStartEdit}
                onTogglePaid={togglePaid}
                onReorder={reorderExpenses}
              />
            </div>
          </>
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="max-w-md mx-auto px-4 pt-6">
        {renderContent()}
      </div>

      {/* Add Menu Action Sheet */}
      {showAddMenu && (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
                onClick={() => setShowAddMenu(false)}
            />
            {/* Menu */}
            <div className="fixed bottom-[85px] left-4 right-4 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden transform transition-all duration-200 ease-out origin-bottom animate-slideUp">
                <div className="p-2 space-y-1">
                    <button
                        onClick={() => {
                            saveScrollPosition();
                            setCurrentView('add-expense');
                            setShowAddMenu(false);
                            setEditingExpense(null);
                        }}
                        className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors group"
                    >
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full group-hover:scale-110 transition-transform">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <span className="text-lg font-medium text-gray-900 dark:text-white">{t('addExpense')}</span>
                    </button>
                    <button
                        onClick={() => {
                            saveScrollPosition();
                            setCurrentView('add-fund');
                            setShowAddMenu(false);
                            setEditingFund(null);
                        }}
                        className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors group"
                    >
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full group-hover:scale-110 transition-transform">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <span className="text-lg font-medium text-gray-900 dark:text-white">{t('addFund')}</span>
                    </button>
                    <button
                        onClick={() => {
                            saveScrollPosition();
                            setCurrentView('add-goal');
                            setShowAddMenu(false);
                            setEditingGoal(null);
                            setGoalReturnView('dashboard');
                        }}
                        className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors group"
                    >
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full group-hover:scale-110 transition-transform">
                            <Target className="w-6 h-6" />
                        </div>
                        <span className="text-lg font-medium text-gray-900 dark:text-white">{t('addGoal')}</span>
                    </button>
                </div>
            </div>
        </>
      )}

      {/* Account Menu Action Sheet */}
      {showUserMenu && (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
                onClick={() => setShowUserMenu(false)}
            />
            {/* Menu */}
            <div className="fixed bottom-[85px] left-4 right-4 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden transform transition-all duration-200 ease-out origin-bottom animate-slideUp">
                <div className="p-2 space-y-1">
                    <button
                        onClick={() => {
                            saveScrollPosition();
                            setCurrentView('configuration');
                            setShowUserMenu(false);
                        }}
                        className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors group"
                    >
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full group-hover:scale-110 transition-transform">
                            <Settings className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </div>
                        <span className="text-lg font-medium text-gray-900 dark:text-white">{t('configuration')}</span>
                    </button>
                    <button
                        onClick={() => {
                            setShowLogoutConfirmation(true);
                            setShowUserMenu(false);
                        }}
                        className="w-full p-4 flex items-center gap-4 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors group"
                    >
                        <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full group-hover:scale-110 transition-transform">
                            <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <span className="text-lg font-medium text-red-600 dark:text-red-400">{t('logOut')}</span>
                    </button>
                </div>
            </div>
        </>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 py-3 pb-safe z-50">
        <div className="max-w-md mx-auto grid grid-cols-5 items-end justify-items-center">
          <button
            onClick={() => {
              sessionStorage.removeItem('dashboard_scroll_position');
              window.scrollTo(0, 0);
              setCurrentView('dashboard');
              setEditingExpense(null);
              setEditingFund(null);
              setShowAddMenu(false);
              setShowUserMenu(false);
            }}
            className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-money-green' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-medium">{t('dashboard')}</span>
          </button>
          
          <button
            onClick={() => {
              saveScrollPosition();
              setCurrentView('income');
              setEditingExpense(null);
              setEditingFund(null);
              setShowAddMenu(false);
              setShowUserMenu(false);
            }}
            className={`flex flex-col items-center gap-1 ${currentView === 'income' ? 'text-money-green' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <Wallet className="w-6 h-6" />
            <span className="text-[10px] font-medium">{t('income')}</span>
          </button>

          <button
            onClick={() => {
               if (showAddMenu) {
                   setShowAddMenu(false);
               } else {
                   setShowAddMenu(true);
                   setEditingExpense(null);
                   setEditingFund(null);
                   // Close other menus
                   setShowUserMenu(false);
               }
            }}
            className={`flex flex-col items-center gap-1 relative ${showAddMenu ? 'text-money-green' : 'text-money-green'}`}
          >
            <div className={`absolute bottom-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 ${showAddMenu ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 rotate-45' : 'bg-money-green text-white hover:scale-105 active:scale-95 shadow-money-green/30'}`}>
              <PlusCircle className="w-8 h-8" />
            </div>
            {/* Invisble placeholder to maintain height/width flow */}
            <div className="w-14 h-8" /> 
            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">{t('add')}</span>
          </button>

          <button
            onClick={() => {
              saveScrollPosition();
              setCurrentView('goals');
              setEditingExpense(null);
              setEditingFund(null);
              setShowAddMenu(false);
              setShowUserMenu(false);
            }}
            className={`flex flex-col items-center gap-1 ${currentView === 'goals' || currentView === 'add-goal' ? 'text-money-green' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <Target className="w-6 h-6" />
            <span className="text-[10px] font-medium">{t('goals')}</span>
          </button>

          <button
            onClick={() => {
               if (showUserMenu) {
                   setShowUserMenu(false);
               } else {
                   setShowUserMenu(true);
                   setEditingExpense(null);
                   setEditingFund(null);
                   // Close other menus
                   setShowAddMenu(false);
               }
            }}
            className={`flex flex-col items-center gap-1 ${showUserMenu ? 'text-money-green' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">{t('account')}</span>
          </button>
        </div>
      </div>


      <ConfirmationModal
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
        onConfirm={handleLogout}
        title={t('confirmLogoutTitle')}
        message={t('confirmLogoutMessage')}
        confirmText={t('accept')}
        cancelText={t('decline')}
        type="danger"
      />
      <ConfirmationModal
        isOpen={!!fundToDelete}
        onClose={() => setFundToDelete(null)}
        onConfirm={handleConfirmDeleteFund}
        title={t('confirmDeleteFundTitle')}
        message={t('confirmDeleteFundMessage')}
        confirmText={t('accept')}
        cancelText={t('decline')}
        type="danger"
      />
    </div>
  );
};

export default Dashboard;
