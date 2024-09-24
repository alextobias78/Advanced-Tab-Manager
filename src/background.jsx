// src/background.jsx

import { groupTabs, defaultGroupingRules } from './utils/grouping';
import { getStorageData } from './services/storage';

// Listener for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Advanced Tab Manager installed/updated.');
  // Initialize default settings or perform setup tasks if necessary
});

// Function to fetch all open tabs
const fetchAllTabs = async () => {
  try {
    const tabs = await chrome.tabs.query({});
    console.log('Fetched Tabs:', tabs);
    // Send tabs data to the UI or process further
    chrome.runtime.sendMessage({ type: 'FETCHED_TABS', payload: tabs });
  } catch (error) {
    console.error('Error fetching tabs:', error);
  }
};

// Function to retrieve grouping rules from storage
const getGroupingRules = async () => {
  try {
    const rules = await getStorageData('groupingRules');
    return rules || defaultGroupingRules;
  } catch (error) {
    console.error('Error retrieving grouping rules:', error);
    return defaultGroupingRules;
  }
};

// Listener for messages from other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'FETCH_TABS':
      chrome.tabs.query({}, (tabs) => {
        sendResponse({ status: 'Tabs fetched', tabs });
      });
      break;

    case 'GROUP_TABS':
      (async () => {
        const { tabs, groupingRules } = request.payload;
        const groupedTabs = groupTabs(tabs, groupingRules);
        sendResponse({ status: 'Tabs grouped', groupedTabs });
      })();
      return true; // Indicates asynchronous response

    case 'GET_GROUPING_RULES':
      (async () => {
        const rules = await getGroupingRules();
        sendResponse({ status: 'Grouping rules retrieved', groupingRules: rules });
      })();
      return true;

    // Handle other message types as needed

    default:
      console.warn('Unknown message type:', request.type);
      sendResponse({ status: 'Unknown message type' });
  }

  return true; // Keeps the message channel open for asynchronous responses
});

// Monitor tab creation
chrome.tabs.onCreated.addListener((tab) => {
  console.log('Tab Created:', tab);
  // Send this new tab data to the grouping algorithm or UI
  chrome.runtime.sendMessage({ type: 'TAB_CREATED', payload: tab });
});

// Monitor tab removal
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log('Tab Removed:', tabId, removeInfo);
  // Update internal tab lists or UI accordingly
  chrome.runtime.sendMessage({ type: 'TAB_REMOVED', payload: { tabId, removeInfo } });
});

// Monitor tab updates (e.g., URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    console.log('Tab Updated:', tab);
    // Re-evaluate the group for this tab if the URL has changed
    chrome.runtime.sendMessage({ type: 'TAB_UPDATED', payload: tab });
  }
});