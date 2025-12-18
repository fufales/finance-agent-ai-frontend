import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2, RefreshCw, CreditCard } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { usePWA } from '../usePWA';
import { useFinanceData } from '../hooks/useFinanceData';

import { formatCurrency } from '../utils/format';

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
    <div className="absolute top-0 left-0 w-full z-[60] pointer-events-none" ref={containerRef}>
      <div className="max-w-md mx-auto px-4 pt-6 flex flex-col items-end gap-3">
      {/* Trigger Button - Matches Dashboard Style but independent */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto p-2 rounded-full shadow-xl transition-all duration-300 relative transform hover:scale-105 active:scale-95 ${
          isOpen || totalCount > 0
            ? 'bg-blue-600 text-white border-blue-500 ring-2 ring-blue-500/20' // Active/HasNotifs style
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm'
        }`}
      >
        <Bell className="w-5 h-5" />
        {totalCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white dark:border-gray-900 shadow-lg animate-pulse">
            {totalCount > 9 ? '9+' : totalCount}
          </span>
        )}
      </button>

      {/* Dropdown Container - Mimics Dashboard "Expandable Data Area" */}
      <div 
        className={`pointer-events-auto w-full bg-white dark:bg-gray-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 origin-top-right ease-out ${
            isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header - Matches Dashboard */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/40">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
                <Bell className="w-5 h-5 text-blue-500" />
                {t('notifications')}
            </h3>
            <div className="flex items-center gap-2">
                 {notifications.length > 0 && (
                    <button 
                        onClick={clearAll}
                        className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-all active:scale-95"
                        title={t('clearAll')}
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                 )}
                <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all active:scale-95"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Content Area - Matches Dashboard logic */}
        <div className="max-h-[75vh] overflow-y-auto overscroll-contain">
            {!hasContent ? (
                 <div className="p-12 text-center text-gray-400 dark:text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Bell className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="font-medium">{t('noNotifications')}</p>
                    <p className="text-xs opacity-60 mt-1">Everything looks clear!</p>
                 </div>
            ) : (
                <>
                    {/* 1. Software Update */}
                    {needRefresh && (
                        <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/10">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white dark:bg-gray-800 shadow-sm rounded-2xl">
                                    <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin-slow" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{t('updateAvailable')}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{t('newVersionAvailable')}</p>
                                    <button
                                        onClick={() => updateServiceWorker(true)}
                                        className="mt-3 w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        {t('updateNow')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Upcoming Payments */}
                    <div className="p-5 space-y-4">
                        {(upcomingPayments.length > 0) && (
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.1em]">
                                    {t('upcomingPayments')}
                                </p>
                                <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-[10px] font-bold">
                                    {upcomingPayments.length} {t('pending')}
                                </span>
                            </div>
                        )}
                        
                        {upcomingPayments.length > 0 && (
                            <div className="space-y-3">
                                {upcomingPayments.map(expense => (
                                    <div key={expense.id} className="flex items-center gap-4 p-3 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-700/50 rounded-2xl transition-all border border-gray-100/50 dark:border-gray-700/50 hover:shadow-sm hover:scale-[1.01] active:scale-[0.98]">
                                        <div className={`p-3 rounded-full bg-white dark:bg-gray-700 shadow-sm ring-1 ring-gray-100 dark:ring-gray-600`}>
                                            <CreditCard className="w-5 h-5 text-money-green" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{expense.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {t('dueDay')}: <span className="font-semibold text-gray-700 dark:text-gray-300">{expense.paymentDay}</span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white block">
                                                {formatCurrency(expense.amount)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 3. History */}
                        {notifications.length > 0 && (
                            <>
                                {(upcomingPayments.length > 0 || needRefresh) && <div className="h-px bg-gray-100 dark:bg-gray-700 my-6" />}
                                
                                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.1em] mb-3">
                                    {t('latestActivity')}
                                </p>

                                <div className="space-y-2">
                                    {notifications.map(notification => (
                                        <div 
                                            key={notification.id} 
                                            onClick={() => markAsRead(notification.id)}
                                            className={`flex gap-4 p-4 rounded-2xl transition-all cursor-pointer group active:scale-[0.98] ${
                                                !notification.read 
                                                    ? 'bg-blue-50/70 dark:bg-blue-900/10 ring-1 ring-blue-100 dark:ring-blue-900/30' 
                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                            }`}
                                        >
                                            <div className="mt-1.5 shrink-0">
                                                <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${!notification.read ? 'bg-blue-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm leading-relaxed ${!notification.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-1.5 font-medium flex items-center gap-2">
                                                    {new Date(notification.date).toLocaleDateString()} • {new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeNotification(notification.id);
                                                }}
                                                className="shrink-0 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                
                                <button
                                    onClick={markAllAsRead}
                                    className="w-full mt-6 py-3.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-2xl transition-all flex items-center justify-center gap-2 border border-blue-100 dark:border-blue-900/30 active:scale-[0.98]"
                                >
                                    <Check className="w-4 h-4" />
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
    </div>
  );
};

export default NotificationCenter;
