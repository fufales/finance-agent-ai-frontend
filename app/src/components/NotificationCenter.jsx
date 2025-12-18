import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2, RefreshCw, CreditCard } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { usePWA } from '../usePWA';
import { useFinanceData } from '../hooks/useFinanceData';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, removeNotification, clearAll, markAllAsRead } = useNotification();
  const { t } = useLanguage();
  const { needRefresh, updateServiceWorker } = usePWA();
  const { expenses } = useFinanceData();
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getUpcomingPayments = () => {
    if (!expenses) return [];
    
    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
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
  const hasContent = notifications.length > 0 || needRefresh || upcomingPayments.length > 0;
  
  // Total count for badge
  const totalCount = unreadCount + (needRefresh ? 1 : 0) + upcomingPayments.length;

  return (
    <div className="absolute top-0 left-0 w-full p-4 z-50 flex flex-col items-end pointer-events-none" ref={containerRef}>
      {/* Trigger Button - Matches Dashboard Style but independent */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto p-3 rounded-full shadow-lg transition-all duration-200 relative transform hover:scale-105 active:scale-95 ${
          isOpen || totalCount > 0
            ? 'bg-blue-600 text-white border-blue-500' // Active/HasNotifs style
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
        }`}
      >
        <Bell className="w-6 h-6" />
        {totalCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white dark:border-gray-900 shadow-sm">
            {totalCount > 9 ? '9+' : totalCount}
          </span>
        )}
      </button>

      {/* Dropdown Container - Mimics Dashboard "Expandable Data Area" */}
      <div 
        className={`pointer-events-auto mt-3 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 origin-top-right ${
            isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header - Matches Dashboard */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4" />
                {t('notifications')}
            </h3>
            <div className="flex items-center gap-3">
                 {notifications.length > 0 && (
                    <button 
                        onClick={clearAll}
                        className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
                        title={t('clearAll')}
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                 )}
                <button 
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                    {t('close')}
                </button>
            </div>
        </div>

        {/* Content Area - Matches Dashboard logic */}
        <div className="max-h-[70vh] overflow-y-auto">
            {!hasContent ? (
                 <div className="p-8 text-center text-gray-400 dark:text-gray-500">
                    <Bell className="w-8 h-8 mb-2 mx-auto opacity-20" />
                    <p className="text-sm">{t('noNotifications')}</p>
                 </div>
            ) : (
                <>
                    {/* 1. Software Update */}
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
                                        onClick={() => updateServiceWorker(true)}
                                        className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                    >
                                        {t('updateNow')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Upcoming Payments */}
                    <div className="p-4">
                        {(upcomingPayments.length > 0) && (
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                {t('upcomingPayments')}
                            </p>
                        )}
                        
                        {upcomingPayments.length > 0 && (
                            <div className="space-y-3 mb-4">
                                {upcomingPayments.map(expense => (
                                    <div key={expense.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
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

                        {/* 3. History */}
                        {notifications.length > 0 && (
                            <>
                                {upcomingPayments.length > 0 && <div className="h-px bg-gray-100 dark:bg-gray-700 my-4" />}
                                <div className="space-y-1">
                                    {notifications.map(notification => (
                                        <div 
                                            key={notification.id} 
                                            onClick={() => markAsRead(notification.id)}
                                            className={`flex gap-3 p-3 rounded-xl transition-colors cursor-pointer group ${
                                                !notification.read 
                                                    ? 'bg-blue-50 dark:bg-blue-900/10' 
                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                            }`}
                                        >
                                            <div className="mt-1">
                                                <div className={`w-2 h-2 rounded-full ${!notification.read ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-1">
                                                    {new Date(notification.date).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeNotification(notification.id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={markAllAsRead}
                                    className="w-full mt-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center justify-center gap-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                >
                                    <Check className="w-3 h-3" />
                                    {t('markAllAsRead')}
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
