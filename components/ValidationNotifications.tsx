'use client';

import { useEffect, useState } from 'react';

interface ValidationNotification {
  id: string;
  type: 'schema' | 'api' | 'component' | 'success';
  severity: 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
  details?: string[];
}

/**
 * ValidationNotifications - Shows validation errors in the browser UI
 *
 * This component listens for validation events from the dev watcher
 * and displays them as toast notifications in the bottom-right corner.
 *
 * Only active in development mode.
 */
export function ValidationNotifications() {
  const [notifications, setNotifications] = useState<ValidationNotification[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (typeof window === 'undefined') return;

    // Listen for custom validation events
    const handleValidation = ((event: CustomEvent) => {
      const notification: ValidationNotification = {
        id: `${Date.now()}-${Math.random()}`,
        ...event.detail,
        timestamp: Date.now(),
      };

      setNotifications(prev => [...prev, notification]);

      // Auto-dismiss after 10 seconds for non-errors
      if (notification.severity !== 'error') {
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 10000);
      }
    }) as EventListener;

    window.addEventListener('validation-result', handleValidation);

    return () => {
      window.removeEventListener('validation-result', handleValidation);
    };
  }, []);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Prevent hydration mismatch by only rendering on client
  if (!mounted) return null;
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`
            rounded-lg shadow-lg p-4 transition-all duration-300 backdrop-blur-sm
            ${notification.severity === 'error' ? 'bg-red-500/90 text-white' : ''}
            ${notification.severity === 'warning' ? 'bg-yellow-500/90 text-gray-900' : ''}
            ${notification.severity === 'info' ? 'bg-blue-500/90 text-white' : ''}
          `}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">
                  {notification.severity === 'error' && '❌'}
                  {notification.severity === 'warning' && '⚠️'}
                  {notification.severity === 'info' && 'ℹ️'}
                </span>
                <span className="font-semibold capitalize">
                  {notification.type} Validation
                </span>
              </div>
              <p className="text-sm">{notification.message}</p>
              {notification.details && notification.details.length > 0 && (
                <ul className="mt-2 text-xs space-y-1 opacity-90">
                  {notification.details.slice(0, 3).map((detail, i) => (
                    <li key={i}>• {detail}</li>
                  ))}
                  {notification.details.length > 3 && (
                    <li className="italic">+ {notification.details.length - 3} more...</li>
                  )}
                </ul>
              )}
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="text-white hover:opacity-70 transition-opacity text-xl leading-none"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
