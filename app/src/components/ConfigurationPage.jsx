import React from 'react';
import { ArrowLeft } from 'lucide-react';
import DataControls from './DataControls';
import Dropdown from './Dropdown';
import { useLanguage } from '../context/LanguageContext';
import { usePWA } from '../usePWA';

const ConfigurationPage = ({ onBack, data, onImport }) => {
  const { language, setLanguage, t } = useLanguage();
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
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('dataManagement')}</h3>
        <DataControls data={data} onImport={onImport} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
         <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('appInfo')}</h3>
         <div className="flex flex-col gap-2">
            <p className="text-gray-600 dark:text-gray-400">{t('version')}: <span className="font-mono font-medium text-gray-900 dark:text-white">dev-0.7.5</span></p>
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
