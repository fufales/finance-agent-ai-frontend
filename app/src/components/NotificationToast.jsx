import React from 'react';
import './NotificationToast.css';

const NotificationToast = ({ message, type, onClose }) => {
  return (
    <div className={`notification-toast ${type}`}>
      <div className="notification-content">
        {message}
      </div>
      <button className="notification-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default NotificationToast;
