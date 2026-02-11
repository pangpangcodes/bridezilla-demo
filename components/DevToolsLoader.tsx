'use client';

import { useEffect } from 'react';

/**
 * Client component that loads development tools in development mode
 * Must be a client component to access window object
 */
export function DevToolsLoader() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/lib/devTools');
    }
  }, []);

  return null;
}
