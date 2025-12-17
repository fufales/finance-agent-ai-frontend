import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Building, Plane, AlertCircle, HelpCircle, Plus, Save } from 'lucide-react';
import Dropdown from './Dropdown';

const GoalForm = ({ onAdd, onUpdate, initialData, isEditing }) => {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    totalAmount: '',
    savedAmount: '',
    category: 'Other'
  });

  const categories = [
    { value: 'Emergency', label: t('cat_Emergency'), icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
    { value: 'House', label: t('cat_House'), icon: Building, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { value: 'Vacation', label: t('cat_Vacation'), icon: Plane, color: 'text-sky-500', bg: 'bg-sky-100 dark:bg-sky-900/30' },
    { value: 'Other', label: t('cat_Other'), icon: HelpCircle, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' }
  ];

  useEffect(() => {
    if (initialData && isEditing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: initialData.name || '',
        totalAmount: initialData.totalAmount || '',
        savedAmount: initialData.savedAmount || '',
        category: initialData.category || 'Other'
      });
    }
  }, [initialData, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const goalData = {
      name: formData.name,
      totalAmount: parseFloat(formData.totalAmount),
      savedAmount: parseFloat(formData.savedAmount),
      category: formData.category
    };

    if (isEditing) {
      onUpdate(goalData);
    } else {
      onAdd(goalData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{isEditing ? t('editGoal') : t('addGoal')}</h2>
      <div className="space-y-3">
        {/* Name Input */}
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          placeholder={t('goalName')}
        />

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-3">
            <div className="relative">
                <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalAmount: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder={t('totalAmount')}
                />
            </div>
            <div className="relative">
                <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.savedAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, savedAmount: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder={t('savedAmount')}
                />
            </div>
        </div>

        {/* Category Dropdown */}
        <Dropdown
            options={categories}
            value={formData.category}
            onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            placeholder={t('category')}
            getLabel={(option) => {
                 // For selected value display
                 const opt = categories.find(c => c.value === option) || categories.find(c => c.value === 'Other');
                 return opt ? opt.label : option;
            }}
            getIcon={(option) => {
                 // For selected value display icon
                 const opt = categories.find(c => c.value === option) || categories.find(c => c.value === 'Other');
                 return opt ? opt.icon : null;
            }}
        />

        {/* Inline Action Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-950 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors mt-2"
        >
          {isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isEditing ? t('save') : t('addGoal')}
        </button>
      </div>
    </form>
  );
};

export default GoalForm;
