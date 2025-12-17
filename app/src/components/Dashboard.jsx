import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useFinanceData } from '../hooks/useFinanceData';
import SummaryCard from './SummaryCard';
import IncomeInput from './IncomeInput';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import FundCard from './FundCard';
import FundForm from './FundForm';
import ConfigurationPage from './ConfigurationPage';
import { LayoutDashboard, Wallet, PlusCircle, ArrowLeft, CreditCard, User, Settings, LogOut, LayoutGrid, Crown, Bell, RefreshCw } from 'lucide-react';
import { usePWA } from '../usePWA';
import ConfirmationModal from './ConfirmationModal';

const Dashboard = () => {
  const { t } = useLanguage();
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
    reorderExpenses,
  } = useFinanceData();

  const [currentView, setCurrentView] = useState('dashboard');
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingFund, setEditingFund] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [fundToDelete, setFundToDelete] = useState(null);
  const { needRefresh } = usePWA();

  const getUpcomingPayments = () => {
    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
    // Calculate target days (today + next 3 days)
    const targetDays = [];
    for (let i = 0; i < 3; i++) {
        let day = currentDay + i;
        if (day > daysInMonth) day -= daysInMonth;
        targetDays.push(day);
    }

    return expenses.filter(expense => {
      if (expense.paid || !expense.paymentDay) return false;
      return targetDays.includes(expense.paymentDay);
    });
  };

  const upcomingPayments = getUpcomingPayments();

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
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      if (showNotifications) {
                        setShowNotifications(false);
                      } else {
                        setShowNotifications(true);
                        setShowUserMenu(false);
                      }
                    }}
                    className={`p-2 rounded-full shadow-sm border transition-colors relative ${
                      showNotifications 
                        ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Bell className="w-6 h-6" />
                    {(upcomingPayments.length > 0 || needRefresh) && !showNotifications && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                    )}
                  </button>

                  <button 
                    onClick={() => {
                      if (showUserMenu) {
                        setShowUserMenu(false);
                      } else {
                        setShowUserMenu(true);
                        setShowNotifications(false);
                      }
                    }}
                    className={`p-2 rounded-full shadow-sm border transition-colors ${
                      showUserMenu
                        ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <User className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Expandable Data Area */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showNotifications || showUserMenu ? 'max-h-[800px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  
                  {/* Notifications Content */}
                  {showNotifications && (
                    <div className="w-full animate-fadeIn">
                      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Bell className="w-4 h-4" />
                          {t('notifications')}
                        </h3>
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {t('close')}
                        </button>
                      </div>
                      
                      <div className="max-h-[60vh] overflow-y-auto">
                        {/* Software Update Notification */}
                        {needRefresh && (
                          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/10">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{t('updateAvailable')}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('newVersionAvailable')}</p>
                                <button
                                  onClick={() => {
                                    setShowNotifications(false);
                                    saveScrollPosition();
                                    setCurrentView('configuration');
                                  }}
                                  className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                >
                                  {t('updateNow')}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Upcoming Payments */}
                        <div className="p-4">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                              {t('upcomingPayments')}
                            </p>
                            
                            {upcomingPayments.length === 0 ? (
                              <p className="text-sm text-gray-500 dark:text-gray-400 py-2 text-center italic">
                                {t('noUpcomingPayments')}
                              </p>
                          ) : (
                            <div className="space-y-3">
                              {upcomingPayments.map(expense => (
                                <div key={expense.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                                  <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700`}>
                                    <CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{expense.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {t('dueDay')}: {expense.paymentDay}
                                    </p>
                                  </div>
                                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    ${expense.amount.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Menu Content */}
                  {showUserMenu && (
                    <div className="w-full animate-fadeIn">
                       <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {t('account')}
                        </h3>
                        <button 
                          onClick={() => setShowUserMenu(false)}
                          className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {t('close')}
                        </button>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            saveScrollPosition();
                            setCurrentView('configuration');
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-3 text-left text-base text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl flex items-center gap-3 transition-colors"
                        >
                          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          </div>
                          <span className="font-medium">{t('configuration')}</span>
                        </button>
                          <button
                            onClick={() => setShowLogoutConfirmation(true)}
                            className="w-full px-4 py-3 text-left text-base text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl flex items-center gap-3 transition-colors mt-1"
                          >
                            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                              <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <span className="font-medium">{t('logOut')}</span>
                          </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>

            <SummaryCard totals={totals} />
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('currentFunds')}</h3>
                <button 
                  onClick={() => {
                    saveScrollPosition();
                    setCurrentView('add-fund');
                  }}
                  className="text-sm text-money-green font-medium hover:text-money-green-dark"
                >
                  + {t('addFund')}
                </button>
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

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3 pb-safe z-50">
        <div className="max-w-md mx-auto grid grid-cols-3 items-end justify-items-center">
          <button
            onClick={() => {
              sessionStorage.removeItem('dashboard_scroll_position');
              window.scrollTo(0, 0);
              setCurrentView('dashboard');
              setEditingExpense(null);
              setEditingFund(null);
            }}
            className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-money-green' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-xs font-medium">{t('dashboard')}</span>
          </button>
          
          <button
            onClick={() => {
              saveScrollPosition();
              setCurrentView('add-expense');
              setEditingExpense(null);
              setEditingFund(null);
            }}
            className="flex flex-col items-center gap-1 text-money-green relative"
          >
            <div className="absolute bottom-6 w-14 h-14 bg-money-green rounded-full flex items-center justify-center shadow-lg shadow-money-green/30 text-white transform transition-transform active:scale-95">
              <PlusCircle className="w-8 h-8" />
            </div>
            {/* Invisble placeholder to maintain height/width flow if needed, or just let absolute positioning handle the circle */}
            <div className="w-14 h-8" /> 
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('add')}</span>
          </button>

          <button
            onClick={() => {
              saveScrollPosition();
              setCurrentView('income');
              setEditingExpense(null);
              setEditingFund(null);
            }}
            className={`flex flex-col items-center gap-1 ${currentView === 'income' ? 'text-money-green' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <Wallet className="w-6 h-6" />
            <span className="text-xs font-medium">{t('income')}</span>
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
