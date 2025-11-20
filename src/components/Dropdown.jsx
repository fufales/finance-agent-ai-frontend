import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Dropdown = ({ value, onChange, options, placeholder = 'Select option', getIcon }) => {
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
    onChange(option);
    setIsOpen(false);
  };

  const renderOptionContent = (option) => {
    if (!getIcon) return option;
    const Icon = getIcon(option);
    return (
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        <span>{option}</span>
      </div>
    );
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-money-green focus:border-transparent transition-all"
      >
        <span className={`block truncate ${!value ? 'text-gray-400' : 'text-gray-900'}`}>
          {value ? renderOptionContent(value) : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-auto py-1">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                value === option ? 'text-money-green font-medium bg-green-50' : 'text-gray-700'
              }`}
            >
              {renderOptionContent(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
