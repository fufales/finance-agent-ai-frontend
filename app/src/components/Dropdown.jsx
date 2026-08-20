import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Dropdown = ({ value, onChange, options, placeholder = 'Select option', getIcon, getLabel, direction = 'down' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    // If option is an object, pass its value to onChange, otherwise pass the option itself
    const newValue = typeof option === 'object' ? option.value : option;
    onChange(newValue);
    setIsOpen(false);
  };

  const getOptionLabel = (option) => {
    if (getLabel) return getLabel(typeof option === 'object' ? option.value : option);
    if (typeof option === 'object') return option.label;
    return option;
  };

  const getOptionValue = (option) => {
    if (typeof option === 'object') return option.value;
    return option;
  };

  const renderOptionContent = (option) => {
    const label = getOptionLabel(option);
    const optionValue = getOptionValue(option);
    
    if (!getIcon) return label;
    
    // For icon retrieval, we use the value if it's an object option, or the option itself if string
    const Icon = getIcon(optionValue);
    return (
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        <span>{label}</span>
      </div>
    );
  };

  // Find the full option object if value is selected and options are objects
  const selectedOption = options.find(opt => getOptionValue(opt) === value) || value;

  const menuPositionClasses = direction === 'up' 
    ? 'bottom-full mb-1' 
    : 'mt-1';

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent transition-all"
      >
        <span className={`block truncate ${!value ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
          {value ? renderOptionContent(selectedOption) : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-auto py-1 ${menuPositionClasses}`}>
          {options.map((option) => {
            const optionValue = getOptionValue(option);
            const isSelected = value === optionValue;
            
            return (
              <button
                key={optionValue}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  isSelected ? 'text-money-green font-medium bg-green-50 dark:bg-green-900/20' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {renderOptionContent(option)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
