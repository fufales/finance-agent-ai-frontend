import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
// NotificationToast is removed as per user request to remove "green floating box"

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('notification_settings');
    return saved ? JSON.parse(saved) : {
      browserNotifications: false
    };
  });

  useEffect(() => {
    localStorage.setItem('notifications_history', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('notification_settings', JSON.stringify(settings));
  }, [settings]);

  const playSound = () => {
    try {
      const audio = new Audio('/mixkit-confirmation-tone-2867.wav');
      audio.play().catch(e => console.error("Error playing sound:", e));
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  };

  const showBrowserNotification = useCallback((message) => {
    if (!settings.browserNotifications) return;

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
  }, [settings.browserNotifications]);

  const addNotification = useCallback((message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      date: new Date().toISOString(),
      read: false
    };

    // 1. Update History
    setNotifications(prev => [newNotification, ...prev]);

    // 2. Play Sound
    playSound();

    // 3. Show Browser Notification
    showBrowserNotification(message);

    // 4. No Toast (removed)
  }, [showBrowserNotification]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleBrowserNotifications = (enabled) => {
    setSettings(prev => ({ ...prev, browserNotifications: enabled }));
    if (enabled && "Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  // Alias for backward compatibility
  const showNotification = addNotification;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ 
      showNotification, 
      notifications, 
      unreadCount, 
      markAsRead, 
      removeNotification, 
      clearAll, 
      markAllAsRead,
      settings,
      toggleBrowserNotifications
    }}>
      {children}
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
