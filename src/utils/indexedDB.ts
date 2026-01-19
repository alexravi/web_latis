// IndexedDB utility for caching large assets like cities.json

const DB_NAME = 'latis-cache';
const DB_VERSION = 1;
const STORE_NAME = 'assets';

interface CacheEntry {
  key: string;
  data: unknown;
  timestamp: number;
  expiry: number; // milliseconds
}

// Open database
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

// Get cached data
export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result as CacheEntry | undefined;
        if (!result) {
          resolve(null);
          return;
        }

        // Check if expired
        if (result.expiry && Date.now() > result.timestamp + result.expiry) {
          // Delete expired entry
          const deleteTransaction = db.transaction([STORE_NAME], 'readwrite');
          deleteTransaction.objectStore(STORE_NAME).delete(key);
          resolve(null);
          return;
        }

        resolve(result.data as T);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error reading from IndexedDB:', error);
    return null;
  }
};

// Set cached data
export const setCachedData = async (
  key: string,
  data: unknown,
  expiryMs?: number
): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const entry: CacheEntry = {
      key,
      data,
      timestamp: Date.now(),
      expiry: expiryMs || 0, // 0 means never expire
    };

    store.put(entry);
  } catch (error) {
    console.error('Error writing to IndexedDB:', error);
  }
};

// Clear all cached data
export const clearCache = async (): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.clear();
  } catch (error) {
    console.error('Error clearing IndexedDB cache:', error);
  }
};

// Clear expired entries
export const clearExpiredEntries = async (): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('timestamp');
    const range = IDBKeyRange.upperBound(Date.now());

    return new Promise((resolve, reject) => {
      const request = index.openCursor(range);
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
        if (cursor) {
          const entry = cursor.value as CacheEntry;
          if (entry.expiry && Date.now() > entry.timestamp + entry.expiry) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error clearing expired entries:', error);
  }
};
