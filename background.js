// background.js

// Object to store tab information and groups
let tabsInfo = {};
let tabGroups = {};

// Keywords to ignore (common words)
const stopWords = [
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'you', 'your', 'are',
  'was', 'what', 'when', 'how', 'where', 'can', 'not', 'have', 'has', 'but',
  'all', 'any', 'get', 'use', 'out', 'www', 'com', 'org', 'net', 'html',
  'htm', 'php', 'https', 'http', 'www2', 'about', 'blank'
];

// Default user settings
let userSettings = {
  matchThreshold: 2,
  enableGrouping: true,
  enableUrgency: true
};

// Load user settings on startup and initialize tabs
chrome.storage.sync.get(['settings'], (result) => {
  const settings = result.settings || {};
  userSettings = {
    ...userSettings,
    ...settings
  };
  initializeTabs();
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.settings) {
    userSettings = {
      ...userSettings,
      ...changes.settings.newValue
    };
    regroupTabs();
  }
});

// Function to extract keywords from a string
function extractKeywords(text) {
  if (!text) return [];
  const words = text.toLowerCase().split(/[\s\|\-_,/:.?&]+/);
  return words.filter(word => word.length > 2 && !stopWords.includes(word));
}

// Function to assign a tab to a group based on keywords
function assignTabToGroup(tab) {
  const titleKeywords = extractKeywords(tab.title || '');
  const urlKeywords = extractKeywords(tab.url || '');
  const allKeywords = [...new Set([...titleKeywords, ...urlKeywords])];

  if (allKeywords.length === 0) {
    const groupName = 'Other';
    if (!tabGroups[groupName]) {
      tabGroups[groupName] = { keywords: [], tabs: [] };
    }
    tabGroups[groupName].tabs.push(tab);
    return;
  }

  let bestGroup = null;
  let maxMatches = 0;

  for (const groupName in tabGroups) {
    const groupKeywords = tabGroups[groupName].keywords;
    const matches = allKeywords.filter(word => groupKeywords.includes(word)).length;

    if (matches > maxMatches) {
      bestGroup = groupName;
      maxMatches = matches;
    }
  }

  const matchThreshold = userSettings.matchThreshold || 2;

  if (maxMatches >= matchThreshold && bestGroup) {
    tabGroups[bestGroup].keywords = [...new Set([...tabGroups[bestGroup].keywords, ...allKeywords])];
    tabGroups[bestGroup].tabs.push(tab);
  } else {
    const groupName = (allKeywords.slice(0, 3).join(' ') || 'Other').trim();
    if (!tabGroups[groupName]) {
      tabGroups[groupName] = { keywords: allKeywords, tabs: [] };
    }
    tabGroups[groupName].tabs.push(tab);
  }
}

// Function to regroup all tabs
function regroupTabs() {
  tabGroups = {};

  for (const tabId in tabsInfo) {
    const tab = tabsInfo[tabId];
    assignTabToGroup(tab);
  }

  console.log('tabGroups updated:', tabGroups);
  notifyPopup();
}

// Function to initialize tabs and group them
function initializeTabs() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      tabsInfo[tab.id] = tab;
    });
    regroupTabs();
  });
}

// Listen for tab creation
chrome.tabs.onCreated.addListener((tab) => {
  tabsInfo[tab.id] = tab;
  regroupTabs();
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' || changeInfo.url) {
    tabsInfo[tabId] = tab;
    regroupTabs();
  }
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabsInfo[tabId];
  regroupTabs();
});

// Log when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Advanced Tab Management Tool installed successfully.');
});

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getTabGroups') {
    sendResponse({ tabGroups });
  }
});

// Function to notify popup of changes
function notifyPopup() {
  chrome.runtime.sendMessage({ action: 'tabGroupsUpdated', tabGroups: tabGroups });
}