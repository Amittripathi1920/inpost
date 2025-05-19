/**
 * Safe storage utility that handles cases where storage access is restricted
 */

// In-memory fallback when localStorage is not available
const memoryStorage: Record<string, string> = {};

/**
 * Safely gets an item from storage
 * Falls back to memory storage if localStorage is not available
 */
export function getStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('localStorage access denied, using memory fallback');
    return memoryStorage[key] || null;
  }
}

/**
 * Safely sets an item in storage
 * Falls back to memory storage if localStorage is not available
 */
export function setStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn('localStorage access denied, using memory fallback');
    memoryStorage[key] = value;
  }
}

/**
 * Safely removes an item from storage
 * Falls back to memory storage if localStorage is not available
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('localStorage access denied, using memory fallback');
    delete memoryStorage[key];
  }
}

/**
 * Safely clears all storage
 * Falls back to memory storage if localStorage is not available
 */
export function clearStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.warn('localStorage access denied, using memory fallback');
    Object.keys(memoryStorage).forEach(key => {
      delete memoryStorage[key];
    });
  }
}