// packages/core/src/utils/hooks.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store';  // From store

// Hook: usePersona - Detects role and loads module-specific data
export const usePersona = (user) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
      // Future: Load persona-specific data (e.g., fetch('/api/persona-data'))
    }
  }, [user, dispatch]);

  return { role: user?.role };
};

// Example: useCUJ - For dynamic CUJ loading (extensible)
export const useCUJ = (cujId) => {
  // Logic to load CUJ-specific components/services
  return { status: 'loaded' };  // Stub; extend for real
}; 