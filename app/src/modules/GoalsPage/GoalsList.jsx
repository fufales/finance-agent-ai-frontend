import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Edit2, Trash2, Plane, AlertTriangle, HelpCircle, Target, ArrowLeft, CreditCard, Banknote, Smartphone, FileText, Car, Home } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

const GoalsList = ({ goals, onEdit, onDelete, onAdd, onBack }) => {
  const { t } = useLanguage();
  const [goalToDelete, setGoalToDelete] = React.useState(null);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Emergency': return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' };
      case 'CreditCardDebt': return { icon: CreditCard, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' };
      case 'Debts': return { icon: Banknote, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' };
      case 'Vacation': return { icon: Plane, color: 'text-sky-500', bg: 'bg-sky-100 dark:bg-sky-900/30' };
      case 'Gadgets': return { icon: Smartphone, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-900/30' };
      case 'Tax': return { icon: FileText, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' };
      case 'Car': return { icon: Car, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' };
      case 'Home': return { icon: Home, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' };
      default: return { icon: HelpCircle, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' };
    }
  };

  const calculateProgress = (paid, total) => {
    if (!total || total === 0) return 0;
    return Math.min(Math.round((paid / total) * 100), 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('goals')}</h2>
      </div>

      {goals.length === 0 ? (
        <div 
          onClick={onAdd}
          className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 cursor-pointer hover:border-money-green hover:text-money-green transition-colors text-center"
        >
          <Target className="w-12 h-12 mb-3 opacity-50" />
          <p className="font-medium text-lg mb-1">{t('addGoal')}</p>
          <p className="text-sm opacity-70">Start tracking your financial goals</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {goals.map(goal => {
            const { icon: Icon, color, bg } = getCategoryIcon(goal.category);
            const progress = calculateProgress(goal.paidAmount, goal.totalAmount);
            
            return (
              <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${bg} ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{goal.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t(`goal_cat_${goal.category}`)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEdit(goal)}
                      className="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setGoalToDelete(goal)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-600 dark:text-gray-300">
                      ${goal.paidAmount?.toLocaleString()}
                    </span>
                    <span className="text-gray-900 dark:text-white opacity-70">
                      ${goal.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        progress >= 100 ? 'bg-green-500' : 'bg-money-green'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xs font-bold text-money-green">{progress}%</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div 
            onClick={onAdd}
            className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 cursor-pointer hover:border-money-green hover:text-money-green transition-colors"
          >
            <Target className="w-8 h-8 mb-2 opacity-50" />
            <p className="font-medium text-sm">{t('addGoal')}</p>
          </div>
        </div>
      )}



      <ConfirmationModal
        isOpen={!!goalToDelete}
        onClose={() => setGoalToDelete(null)}
        onConfirm={() => {
            if (goalToDelete) {
                onDelete(goalToDelete.id);
                setGoalToDelete(null);
            }
        }}
        title={t('confirmDeleteGoalTitle')}
        message={t('confirmDeleteGoalMessage')}
        confirmText={t('accept')}
        cancelText={t('decline')}
        type="danger"
      />
    </div>
  );
};

export default GoalsList;
