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
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">{t('configuration')}</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('language')}</h3>
        <Dropdown
            value={language}
            onChange={setLanguage}
            options={languageOptions}
            placeholder={t('selectLanguage')}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dataManagement')}</h3>
        <DataControls data={data} onImport={onImport} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
         <h3 className="text-lg font-semibold text-gray-800 mb-4">App Info</h3>
         <div className="flex flex-col gap-2">
            <p className="text-gray-600">Version: <span className="font-mono font-medium text-gray-900">dev-0.5.3</span></p>
            {needRefresh && (
              <div className="mt-2 p-4 bg-blue-50 text-blue-800 rounded-lg flex flex-col gap-2">
                 <p className="text-sm">A new version of the app is available.</p>
                 <button 
                   onClick={() => updateServiceWorker(true)}
                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-fit"
                 >
                   Update Now
                 </button>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ConfigurationPage;
