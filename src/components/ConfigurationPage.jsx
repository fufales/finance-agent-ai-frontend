import React from 'react';
import { ArrowLeft } from 'lucide-react';
import DataControls from './DataControls';

const ConfigurationPage = ({ onBack, data, onImport }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">Configuration</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h3>
        <DataControls data={data} onImport={onImport} />
      </div>
    </div>
  );
};

export default ConfigurationPage;
