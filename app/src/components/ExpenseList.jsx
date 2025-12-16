import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, ArrowUpDown, GripVertical, Check } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatCurrency } from '../utils/format';
import { getCategoryIcon } from '../utils/categories';
import Dropdown from './Dropdown';

const ExpenseItem = ({ expense, onDelete, onEdit, onTogglePaid, isEditMode, isOverlay = false, dragHandleProps = {} }) => {
  // Calculate progress if paymentDay exists
  let progress = 0;
  let daysLeft = null;
  let isOverdue = false;
  let dueDate = null;
  
  if (expense.paymentDay) {
    const now = new Date();
    dueDate = new Date(now.getFullYear(), now.getMonth(), expense.paymentDay);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Reset hours to start of day for accurate day calculation
    const cleanDue = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    const cleanNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const totalDuration = cleanDue - startOfMonth;
    const elapsed = cleanNow - startOfMonth;
    
    if (totalDuration > 0) {
      progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    } else {
      progress = 100; 
    }

    const diffTime = cleanDue - cleanNow;
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    isOverdue = daysLeft < 0;
  }

  return (
    <div 
      className={`p-4 rounded-xl shadow-sm border border-l-4 group transition-colors flex flex-col gap-3 touch-manipulation bg-white dark:bg-gray-800
        ${expense.paid ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}
        ${expense.period === 1 ? 'border-l-blue-400' : 'border-l-purple-400'}
        ${isOverlay ? 'shadow-xl ring-2 ring-money-green ring-opacity-50 opacity-95 scale-105 cursor-grabbing z-50' : ''}
      `}
    >
      <div className="flex items-center justify-between w-full">
        {isEditMode && (
          <div 
            {...dragHandleProps}
            className="mr-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1"
          >
            <GripVertical size={20} />
          </div>
        )}
        
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => !isEditMode && onTogglePaid(expense.id)}
            disabled={isEditMode}
            className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
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
          <div className="min-w-0 flex-1">
            <p className={`font-medium break-words ${expense.paid ? 'text-gray-500 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
              {expense.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
               <span>{expense.category} • Period {expense.period}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className={`font-semibold mr-2 ${expense.paid ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>{formatCurrency(expense.amount)}</span>
          <button
            onClick={() => onEdit(expense)}
            disabled={isEditMode}
            className={`p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors ${isEditMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            disabled={isEditMode}
            className={`p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ${isEditMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {expense.paymentDay && !expense.paid && (
        <div className={`w-full ${isEditMode ? 'pl-[5.5rem]' : 'pl-[3.25rem]'}`}>
          <div className="flex justify-between items-center mb-1">
            <span className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
               {isOverdue ? 'Overdue' : 'Due'}: {dueDate ? dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Day ${expense.paymentDay}`}
            </span>
            <span className="text-xs text-gray-400">
               {isOverdue 
                 ? `${Math.abs(daysLeft)} days late` 
                 : daysLeft === 0 
                   ? 'Due today' 
                   : `${daysLeft} days left`
               }
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isOverdue ? 'bg-red-400' : 'bg-money-green'}`} 
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
    touchAction: 'none', // Prevent scrolling while dragging
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
  const [sortBy, setSortBy] = useState(() => {
    return localStorage.getItem('expense_sort_option') || 'default';
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    localStorage.setItem('expense_sort_option', sortBy);
    if (sortBy !== 'priority') {
      setIsEditMode(false);
    }
  }, [sortBy]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), // Increased distance slightly to prevent accidental drags
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const getDaysLeft = (expense) => {
    if (!expense.paymentDay) return Infinity;
    const now = new Date();
    let dueDate = new Date(now.getFullYear(), now.getMonth(), expense.paymentDay);
    const cleanDue = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    const cleanNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = cleanDue - cleanNow;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getSortedExpenses = () => {
    const sorted = [...expenses];
    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'amount':
        return sorted.sort((a, b) => b.amount - a.amount);
      case 'priority':
        return expenses; // Return original order
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
        <p>No expenses yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Expenses</h3>
        <div className="flex items-center gap-2">
          {sortBy === 'priority' && (
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium ${
                isEditMode 
                  ? 'bg-money-green text-white hover:bg-money-green-dark' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {isEditMode ? <Check size={14} /> : <GripVertical size={14} />}
              {isEditMode ? 'Done' : 'Order'}
            </button>
          )}
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <div className="w-48">
            <Dropdown
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'default', label: 'Default (Period)' },
                { value: 'priority', label: 'Priority (Custom)' },
                { value: 'payment_date', label: 'Payment Date (Closest)' },
                { value: 'date', label: 'Date (Newest)' },
                { value: 'amount', label: 'Amount (Highest)' }
              ]}
            />
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
                onDelete={onDelete}
                onEdit={onEdit}
                onTogglePaid={onTogglePaid}
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
    </div>
  );
};

export default ExpenseList;
