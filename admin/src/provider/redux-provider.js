'use client';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useEffect } from 'react';
import { restoreSession } from '@/store/slices/authSlice';

function StateRehydrator({ children }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('authState');
      if (saved) {
        store.dispatch(restoreSession(JSON.parse(saved)));
      }
    }
  }, []);
  
  return children;
}

/**
 * ReduxProvider — wraps your app with the Redux store
 * Must be a client component because Redux uses browser APIs
 *
 * Usage in src/app/layout.js:
 *   import ReduxProvider from '@/components/ReduxProvider';
 *   <ReduxProvider>{children}</ReduxProvider>
 */
export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <StateRehydrator>
        {children}
      </StateRehydrator>
    </Provider>
  );
}
