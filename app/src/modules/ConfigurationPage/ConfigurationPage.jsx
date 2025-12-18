import React from 'react';
import { ArrowLeft } from 'lucide-react';
import DataControls from './DataControls';
import Dropdown from '../../components/Dropdown';
import Switch from '../../components/Switch';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { usePWA } from '../../usePWA';

const ConfigurationPage = ({ onBack, data, onImport, dashboardConfig, updateDashboardConfig }) => {
  const { language, setLanguage, t } = useLanguage();
  const { showNotification } = useNotification();
  const { needRefresh, updateServiceWorker } = usePWA();

  const languageOptions = [
    { label: t('english'), value: 'en' },
    { label: t('spanish'), value: 'es' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('configuration')}</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('language')}</h3>
        <Dropdown
            value={language}
            onChange={setLanguage}
            options={languageOptions}
            placeholder={t('selectLanguage')}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('mainDashboardCard')}</h3>
        <div className="space-y-4">
            {dashboardConfig && (
                <>
                    <Switch 
                        label={t('showPaid')} 
                        checked={dashboardConfig.showPaid} 
                        onChange={(checked) => updateDashboardConfig({ showPaid: checked })} 
                    />
                    <Switch 
                        label={t('showIncome')} 
                        checked={dashboardConfig.showIncome} 
                        onChange={(checked) => updateDashboardConfig({ showIncome: checked })} 
                    />
                    <Switch 
                        label={t('showDebtPercentage')} 
                        checked={dashboardConfig.showDebtPercentage} 
                        onChange={(checked) => updateDashboardConfig({ showDebtPercentage: checked })} 
                    />
                    <Switch 
                        label={t('showDebtAmount')} 
                        checked={dashboardConfig.showDebtAmount} 
                        onChange={(checked) => updateDashboardConfig({ showDebtAmount: checked })} 
                    />
                </>
            )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('dataManagement')}</h3>
        <DataControls data={data} onImport={onImport} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('notifications')}</h3>
        <button
            onClick={() => showNotification(t('testNotificationMessage'), 'success')}
            className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium flex items-center justify-center gap-2"
        >
            {t('testNotification')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
         <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('appInfo')}</h3>
         <div className="flex flex-col gap-2">
            <p className="text-gray-600 dark:text-gray-400">{t('version')}: <span className="font-mono font-medium text-gray-900 dark:text-white">dev-0.9.0</span></p>
            
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t('devNotes')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {t('latestUpdate')}
                </p>
            </div>

            {needRefresh && (
              <div className="mt-2 p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg flex flex-col gap-2">
                 <p className="text-sm">{t('newVersionAvailable')}</p>
                 <button 
                   onClick={() => updateServiceWorker(true)}
                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-fit"
                 >
                   {t('updateNow')}
                 </button>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ConfigurationPage;
