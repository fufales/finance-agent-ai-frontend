import React from 'react';

const Switch = ({ checked, onChange, label, disabled = false }) => {
  return (
    <label className={`flex items-center justify-between cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {label && <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>}
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ${checked ? 'bg-money-green' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${checked ? 'transform translate-x-6' : ''}`}></div>
      </div>
    </label>
  );
};

export default Switch;
