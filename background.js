// background.js

// Log when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log('Advanced Tab Management Tool installed successfully.');
  });
  
  // Create an object to store tab information
  let tabsInfo = {};
  
  // Function to handle tab updates
  function handleTabUpdate(tabId, changeInfo, tab) {
    // Update our tabsInfo object
    tabsInfo[tabId] = tab;
    console.log(`Tab updated: ${tabId}`, tab);
  }
  
  // Function to handle tab removal
  function handleTabRemoval(tabId, removeInfo) {
    // Remove the tab from our tabsInfo object
    delete tabsInfo[tabId];
    console.log(`Tab removed: ${tabId}`);
  }
  
  // Add listeners for tab events
  chrome.tabs.onCreated.addListener((tab) => {
    tabsInfo[tab.id] = tab;
    console.log(`Tab created: ${tab.id}`, tab);
  });
  
  chrome.tabs.onUpdated.addListener(handleTabUpdate);
  
  chrome.tabs.onRemoved.addListener(handleTabRemoval);
  
  // Initialize tabsInfo with existing tabs
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      tabsInfo[tab.id] = tab;
    });
    console.log('Initial tabs loaded:', tabsInfo);
  });