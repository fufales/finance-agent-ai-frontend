import React, { createContext, useState, useContext, useCallback } from 'react';
import NotificationToast from '../components/NotificationToast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const playSound = () => {
    try {
      const audio = new Audio('/mixkit-confirmation-tone-2867.wav');
      audio.play().catch(e => console.error("Error playing sound:", e));
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  };

  const showBrowserNotification = (message) => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(message);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(message);
        }
      });
    }
  };

  const showNotification = useCallback((message, type = 'info') => {
    // 1. Play Sound
    playSound();

    // 2. Show In-App Toast
    setNotification({ message, type });

    // 3. Show Browser Notification (optional, maybe check a config or just do it for now as requested)
    showBrowserNotification(message);

    // Auto dismiss toast after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
