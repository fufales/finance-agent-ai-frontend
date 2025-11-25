import React from 'react';
import { ArrowLeft } from 'lucide-react';
import DataControls from './DataControls';
import Dropdown from './Dropdown';
import { useLanguage } from '../context/LanguageContext';

const ConfigurationPage = ({ onBack, data, onImport }) => {
  const { language, setLanguage, t } = useLanguage();

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
    </div>
  );
};

export default ConfigurationPage;
