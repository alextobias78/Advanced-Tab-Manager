// src/services/storage.js

/**
 * Retrieves data from chrome.storage.sync.
 *
 * @param {string} key - The key of the data to retrieve.
 * @returns {Promise<any>} - The retrieved data.
 */
const getStorageData = (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get([key], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[key]);
        }
      });
    });
  };
  
  /**
   * Sets data in chrome.storage.sync.
   *
   * @param {string} key - The key under which to store the data.
   * @param {any} value - The data to store.
   * @returns {Promise<void>}
   */
  const setStorageData = (key, value) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  };
  
  /**
   * Removes data from chrome.storage.sync.
   *
   * @param {string} key - The key of the data to remove.
   * @returns {Promise<void>}
   */
  const removeStorageData = (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.remove([key], () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  };
  
  /**
   * Clears all data from chrome.storage.sync.
   *
   * @returns {Promise<void>}
   */
  const clearStorage = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.clear(() => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  };
  
  export { getStorageData, setStorageData, removeStorageData, clearStorage };