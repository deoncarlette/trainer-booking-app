// utils/dataUtils.js

/**
 * Utility functions for managing data reloads and cache invalidation
 */

// Method 1: Event-based reload system
class DataReloadManager {
  constructor() {
    this.listeners = new Set();
  }

  // Add a reload listener
  addListener(callback) {
    this.listeners.add(callback);
    // Return cleanup function
    return () => this.listeners.delete(callback);
  }

  // Trigger reload for all listeners
  triggerReload(reason = 'manual') {
    console.log(`🔄 Triggering data reload: ${reason}`);
    this.listeners.forEach(callback => {
      try {
        callback(reason);
      } catch (error) {
        console.error('Error in reload listener:', error);
      }
    });
  }

  // Clear all listeners
  clear() {
    this.listeners.clear();
  }
}

// Global instance
export const dataReloadManager = new DataReloadManager();

// Method 2: Local Storage based reload trigger
export const createReloadTrigger = (key = 'dataReload') => {
  const triggerReload = (reason = 'manual') => {
    const timestamp = Date.now();
    localStorage.setItem(key, JSON.stringify({ timestamp, reason }));

    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('dataReload', {
      detail: { timestamp, reason, key }
    }));
  };

  const getLastReload = () => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  return { triggerReload, getLastReload };
};

// Method 3: Simple force reload with timeout
export const createForceReload = (reloadFunction, delay = 1000) => {
  let timeoutId = null;

  return (reason = 'manual') => {
    console.log(`🔄 Scheduling reload in ${delay}ms: ${reason}`);

    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Schedule the reload
    timeoutId = setTimeout(() => {
      console.log(`🔄 Executing reload: ${reason}`);
      reloadFunction();
      timeoutId = null;
    }, delay);
  };
};

// Method 4: React hook for handling reloads
export const useDataReload = (fetchFunction, dependencies = []) => {
  const [loading, setLoading] = useState(false);
  const [lastReload, setLastReload] = useState(Date.now());
  const [error, setError] = useState(null);

  // Force reload function
  const forceReload = useCallback(async (reason = 'manual') => {
    console.log(`🔄 Force reloading data: ${reason}`);
    setLoading(true);
    setError(null);

    try {
      await fetchFunction();
      setLastReload(Date.now());
    } catch (err) {
      console.error('Reload failed:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  // Auto reload when dependencies change
  useEffect(() => {
    forceReload('dependency_change');
  }, dependencies);

  // Listen for global reload events
  useEffect(() => {
    const handleReload = (event) => {
      forceReload(`global_event: ${event.detail?.reason || 'unknown'}`);
    };

    window.addEventListener('dataReload', handleReload);
    return () => window.removeEventListener('dataReload', handleReload);
  }, [forceReload]);

  return { loading, error, lastReload, forceReload };
};

// Method 5: Optimistic updates with rollback
export const createOptimisticUpdate = (updateFunction, rollbackFunction) => {
  return async (optimisticData, actualUpdateFunction) => {
    // Apply optimistic update immediately
    updateFunction(optimisticData);

    try {
      // Perform actual update
      const result = await actualUpdateFunction();

      if (!result.success) {
        throw new Error(result.error || 'Update failed');
      }

      // Success - the optimistic update was correct
      return result;
    } catch (error) {
      console.error('Optimistic update failed, rolling back:', error);

      // Rollback the optimistic change
      rollbackFunction();

      // Rethrow the error
      throw error;
    }
  };
};

// Method 6: Firebase real-time listener with manual refresh
export const createFirebaseReloader = (collection, docId, callback) => {
  let unsubscribe = null;
  let manualRefreshTimeout = null;

  const startListening = () => {
    // Your Firebase real-time listener setup would go here
    // unsubscribe = onSnapshot(doc(db, collection, docId), callback);
    console.log(`🔊 Started listening to ${collection}/${docId}`);
  };

  const stopListening = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    console.log(`🔇 Stopped listening to ${collection}/${docId}`);
  };

  const forceRefresh = async () => {
    console.log(`🔄 Force refreshing ${collection}/${docId}`);

    // Clear any existing timeout
    if (manualRefreshTimeout) {
      clearTimeout(manualRefreshTimeout);
    }

    // Stop listening temporarily
    stopListening();

    // Wait a bit, then restart
    manualRefreshTimeout = setTimeout(() => {
      startListening();
      manualRefreshTimeout = null;
    }, 500);
  };

  // Start listening immediately
  startListening();

  return {
    forceRefresh,
    stopListening,
    restart: () => {
      stopListening();
      startListening();
    }
  };
};

// Helper function for debugging reload issues
export const debugReload = (componentName, data) => {
  console.group(`🔍 Debug Reload - ${componentName}`);
  console.log('Timestamp:', new Date().toISOString());
  console.log('Data length:', Array.isArray(data) ? data.length : Object.keys(data || {}).length);
  console.log('Data sample:', data);
  console.groupEnd();
};

// Export all methods
export default {
  dataReloadManager,
  createReloadTrigger,
  createForceReload,
  useDataReload,
  createOptimisticUpdate,
  createFirebaseReloader,
  debugReload
};