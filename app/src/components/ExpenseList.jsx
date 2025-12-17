import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Trash2, Edit2, GripVertical, Check, ListFilter } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatCurrency } from '../utils/format';
import { getCategoryIcon } from '../utils/categories';
import Dropdown from './Dropdown';
import ConfirmationModal from './ConfirmationModal';

const ExpenseItem = ({ expense, onDelete, onEdit, onTogglePaid, isEditMode, isOverlay = false, dragHandleProps = {} }) => {
  const { t } = useLanguage();
  let progress = 0;
  let daysLeft = null;
  let isOverdue = false;
  let isPaymentPeriod = false;
  let dueDate = null;
  
  if (expense.paymentDay) {
    const now = new Date();
    // Default to this month
    let targetDate = new Date(now.getFullYear(), now.getMonth(), expense.paymentDay);
    
    const cleanNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Initial check with current month
    let cleanDue = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    let diffTime = cleanDue - cleanNow;
    const initialDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (!expense.paid) {
      if (initialDaysLeft === -1 || initialDaysLeft === -2) {
        isPaymentPeriod = true;
        dueDate = targetDate;
        daysLeft = initialDaysLeft;
      } else if (initialDaysLeft <= -3) {
        // Move to next month
        targetDate = new Date(now.getFullYear(), now.getMonth() + 1, expense.paymentDay);
        dueDate = targetDate;
        
        // Recalculate for next month
        cleanDue = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        diffTime = cleanDue - cleanNow;
        daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } else {
        // Not overdue enough, or is future
        dueDate = targetDate;
        daysLeft = initialDaysLeft;
        isOverdue = daysLeft < 0;
      }
    } else {
      // Paid
      dueDate = targetDate;
      daysLeft = initialDaysLeft;
      isOverdue = daysLeft < 0;
    }

    // Progress Calculation
    const startOfPeriod = new Date(dueDate.getFullYear(), dueDate.getMonth() - 1, expense.paymentDay);
    const totalDuration = cleanDue - startOfPeriod;
    const elapsed = cleanNow - startOfPeriod;
    
    if (totalDuration > 0) {
      progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    } else {
      progress = 100;
    }
  }

  return (
    <div 
      className={`p-4 rounded-xl shadow-sm border border-l-4 group transition-colors flex flex-col gap-3 touch-manipulation bg-white dark:bg-gray-800
        ${expense.paid ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}
        ${expense.period === 1 ? 'border-l-blue-400' : 'border-l-purple-400'}
        ${isOverlay ? 'shadow-xl ring-2 ring-money-green ring-opacity-50 opacity-95 scale-105 cursor-grabbing z-50' : ''}
      `}
    >
      <div className="flex items-start justify-between w-full">
        {isEditMode && (
          <div 
            {...dragHandleProps}
            className="mr-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1 touch-none self-center"
          >
            <GripVertical size={20} />
          </div>
        )}
        
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={() => !isEditMode && onTogglePaid(expense.id)}
            disabled={isEditMode}
            className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors mt-1 ${
              expense.paid 
                ? 'bg-money-green border-money-green text-white' 
                : 'border-gray-300 dark:border-gray-600 text-transparent hover:border-money-green'
            } ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Check size={14} strokeWidth={3} />
          </button>
          <div className="w-10 h-10 shrink-0 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
            {React.createElement(getCategoryIcon(expense.category), { size: 24 })}
          </div>
          <div className="min-w-0 flex-1 flex flex-col gap-0.5">
            <p className={`font-medium break-words leading-tight ${expense.paid ? 'text-gray-500 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
              {expense.name}
            </p>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t(`cat_${expense.category}`)} • {t('period')} {expense.period}
              </span>
              {!isEditMode && (
                <span className={`font-bold ${expense.paid ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                  {formatCurrency(expense.amount)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2 self-start mt-0.5">
          {!isEditMode && (
            <>
              <button
                onClick={() => onEdit(expense)}
                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(expense.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
      
      
      {!isEditMode && expense.paymentDay && !expense.paid && (
        <div className={`w-full ${isEditMode ? 'pl-[5.5rem]' : 'pl-[3.25rem]'}`}>
          <div className="flex justify-between items-center mb-1">
            <span className={`text-xs font-medium ${isPaymentPeriod ? 'text-orange-500' : isOverdue ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
               {isPaymentPeriod ? t('paymentPeriod') : isOverdue ? t('overdue') : t('due')}: {dueDate ? dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Day ${expense.paymentDay}`}
            </span>
            <span className="text-xs text-gray-400">
               {isOverdue 
                 ? `${Math.abs(daysLeft)} ${t('daysLate')}` 
                 : daysLeft === 0 
                   ? t('dueToday') 
                   : `${daysLeft} ${t('daysLeft')}`
               }
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isPaymentPeriod ? 'bg-orange-400' : isOverdue ? 'bg-red-400' : 'bg-money-green'}`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

const SortableExpenseItem = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.expense.id, disabled: !props.isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1, // Fade out the original item while dragging
    position: 'relative',
    // touchAction: 'none', // Removed to allow scrolling
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ExpenseItem 
        {...props} 
        dragHandleProps={{ ...attributes, ...listeners }} 
      />
    </div>
  );
};

const ExpenseList = ({ expenses, onDelete, onEdit, onTogglePaid, onReorder }) => {
  const { t } = useLanguage();
  const [sortBy, setSortBy] = useState(() => {
    return localStorage.getItem('expense_sort_option') || 'default';
  });
  const [hidePaid, setHidePaid] = useState(() => {
    return localStorage.getItem('expense_hide_paid') === 'true';
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const [activeId, setActiveId] = useState(null);
  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    type: null, // 'delete' | 'pay'
    id: null
  });

  const requestDelete = (id) => {
    setConfirmationState({ isOpen: true, type: 'delete', id });
  };

  const requestTogglePaid = (id) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      setConfirmationState({ 
        isOpen: true, 
        type: expense.paid ? 'unpay' : 'pay', 
        id 
      });
    }
  };

  const handleConfirmAction = () => {
    if (confirmationState.type === 'delete') {
      onDelete(confirmationState.id);
    } else if (confirmationState.type === 'pay' || confirmationState.type === 'unpay') {
      onTogglePaid(confirmationState.id);
    }
    setConfirmationState({ isOpen: false, type: null, id: null });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    if (value !== 'priority') {
      setIsEditMode(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('expense_sort_option', sortBy);
  }, [sortBy]);

  useEffect(() => {
    localStorage.setItem('expense_hide_paid', hidePaid);
  }, [hidePaid]);

  const sensors = useSensors(
    useSensor(PointerSensor, { 
      activationConstraint: { 
        distance: 5 // Activate drag after 5px movement
      } 
    })
  );

  const getDaysLeft = (expense) => {
    if (!expense.paymentDay) return Infinity;
    const now = new Date();
    const dueDate = new Date(now.getFullYear(), now.getMonth(), expense.paymentDay);
    const cleanDue = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    const cleanNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = cleanDue - cleanNow;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getSortedExpenses = () => {
    let sorted = [...expenses];
    
    if (hidePaid) {
      sorted = sorted.filter(e => !e.paid);
    }

    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'amount':
        return sorted.sort((a, b) => b.amount - a.amount);
      case 'priority':
        // For priority, we rely on the order in the props, which should be the saved order
        // Filtering maintains the relative order of the remaining items
        return sorted; 
      case 'payment_date':
        return sorted.sort((a, b) => getDaysLeft(a) - getDaysLeft(b));
      default:
        return sorted.sort((a, b) => {
          if (a.period !== b.period) return a.period - b.period;
          return a.category.localeCompare(b.category);
        });
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = expenses.findIndex((e) => e.id === active.id);
      const newIndex = expenses.findIndex((e) => e.id === over.id);
      onReorder(arrayMove(expenses, oldIndex, newIndex));
    }
    setActiveId(null);
  };
  
  const handleDragCancel = () => {
    setActiveId(null);
  };

  const sortedExpenses = getSortedExpenses();
  const activeExpense = activeId ? expenses.find(e => e.id === activeId) : null;
  
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.3',
        },
      },
    }),
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-500">
        <p>{t('noExpensesYet')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header Controls */}
      {/* Header Controls */}
      <div className="mb-2">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-800">
           <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('expenses')}</h3>
        </div>
        
        <div className="flex items-center justify-between h-9">
          {/* Left: Priority/Order Button */}
          <div className="flex-1 flex items-center justify-start">
            {sortBy === 'priority' && (
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 text-sm font-medium ${
                  isEditMode 
                    ? 'bg-money-green border-transparent text-white shadow-sm hover:bg-money-green-dark' 
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {isEditMode ? <Check size={16} /> : <GripVertical size={16} />}
                {isEditMode ? t('done') : t('order')}
              </button>
            )}
          </div>

          {/* Right: Controls (Hide Paid + Sort) */}
          <div className="flex-1 flex items-center justify-end gap-3">
              <button
              onClick={() => setHidePaid(!hidePaid)}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center justify-center ${
                hidePaid
                ? 'bg-money-green border-transparent text-white shadow-sm'
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              title={hidePaid ? t('showAllExpenses') : t('showWhatsLeft')}
              >
              <ListFilter size={18} />
              </button>
              <div className="flex items-center gap-1">
              <div className="w-32">
                  <Dropdown
                value={sortBy}
                onChange={handleSortChange}
                options={[
                      { value: 'default', label: t('default') },
                      { value: 'priority', label: t('priority') },
                      { value: 'payment_date', label: t('dueDate') },
                      { value: 'date', label: t('addedDate') },
                      { value: 'amount', label: t('amount') }
                  ]}
                  />
              </div>
              </div>
          </div>
        </div>
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext 
          items={sortedExpenses} 
          strategy={verticalListSortingStrategy}
          disabled={sortBy !== 'priority' || !isEditMode}
        >
          <div className="space-y-3">
            {sortedExpenses.map((expense) => (
              <SortableExpenseItem
                key={expense.id}
                expense={expense}
                onDelete={requestDelete}
                onEdit={onEdit}
                onTogglePaid={requestTogglePaid}
                isEditMode={isEditMode}
              />
            ))}
          </div>
        </SortableContext>
        
        <DragOverlay dropAnimation={dropAnimation}>
          {activeExpense ? (
             <ExpenseItem
               expense={activeExpense}
               onDelete={onDelete}
               onEdit={onEdit}
               onTogglePaid={onTogglePaid}
               isEditMode={isEditMode}
               isOverlay={true}
             />
          ) : null}
        </DragOverlay>
      </DndContext>

      
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={() => setConfirmationState({ ...confirmationState, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={
          confirmationState.type === 'delete' ? t('confirmDeleteTitle') : 
          confirmationState.type === 'unpay' ? t('confirmUnpaidTitle') :
          t('confirmPaidTitle')
        }
        message={
          confirmationState.type === 'delete' ? t('confirmDeleteMessage') : 
          confirmationState.type === 'unpay' ? t('confirmUnpaidMessage') :
          t('confirmPaidMessage')
        }
        confirmText={t('accept')}
        cancelText={t('decline')}
        type={confirmationState.type === 'delete' ? 'danger' : 'primary'}
      />
    </div>
  );
};

export default ExpenseList;
