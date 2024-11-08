// src/background/background.js
import { extractKeywords, findBestGroup, createNewGroup } from '../utils/tabGrouping.js';
import { settingsManager } from '../utils/settings.js';

class TabManager {
  constructor() {
    this.tabsInfo = {};
    this.tabGroups = {};
    this.initialize();
  }

  async initialize() {
    await settingsManager.loadSettings();
    this.initializeEventListeners();
    this.initializeTabs();
  }

  initializeEventListeners() {
    chrome.tabs.onCreated.addListener(tab => this.handleTabCreated(tab));
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => this.handleTabUpdated(tabId, changeInfo, tab));
    chrome.tabs.onRemoved.addListener(tabId => this.handleTabRemoved(tabId));
    chrome.storage.onChanged.addListener((changes, area) => this.handleSettingsChanged(changes, area));
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => this.handleMessage(message, sender, sendResponse));
  }

  async initializeTabs() {
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => this.tabsInfo[tab.id] = tab);
    await this.regroupTabs();
  }

  async handleTabCreated(tab) {
    this.tabsInfo[tab.id] = tab;
    await this.regroupTabs();
  }

  async handleTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' || changeInfo.url) {
      this.tabsInfo[tabId] = tab;
      await this.regroupTabs();
    }
  }

  async handleTabRemoved(tabId) {
    delete this.tabsInfo[tabId];
    await this.regroupTabs();
  }

  handleSettingsChanged(changes, area) {
    if (area === 'sync' && changes.settings) {
      settingsManager.loadSettings().then(() => this.regroupTabs());
    }
  }

  handleMessage(message, sender, sendResponse) {
    switch (message.action) {
      case 'getTabGroups':
        sendResponse({ tabGroups: this.tabGroups });
        break;
      case 'moveTabToGroup':
        this.moveTabToGroup(message.tabId, message.groupName);
        sendResponse({ success: true });
        break;
      case 'createNewGroup':
        this.createCustomGroup(message.groupName);
        sendResponse({ success: true });
        break;
    }
    return true;
  }

  async regroupTabs() {
    if (!settingsManager.settings.enableGrouping) return;

    this.tabGroups = {};
    for (const tabId in this.tabsInfo) {
      await this.assignTabToGroup(this.tabsInfo[tabId]);
    }

    if (settingsManager.settings.autoCleanupInactive) {
      await this.cleanupInactiveTabs();
    }

    await chrome.storage.local.set({ tabGroups: this.tabGroups });
  }

  async assignTabToGroup(tab) {
    const titleKeywords = extractKeywords(tab.title || '');
    const urlKeywords = extractKeywords(tab.url || '');
    const allKeywords = [...new Set([...titleKeywords, ...urlKeywords])];

    if (allKeywords.length === 0) {
      this.addTabToGroup('Other', tab, []);
      return;
    }

    const bestGroup = findBestGroup(allKeywords, this.tabGroups, settingsManager.settings.matchThreshold);
    if (bestGroup) {
      this.addTabToGroup(bestGroup, tab, allKeywords);
    } else {
      const newGroup = createNewGroup(allKeywords);
      this.addTabToGroup(newGroup.name, tab, newGroup.keywords);
    }
  }

  addTabToGroup(groupName, tab, keywords) {
    if (!this.tabGroups[groupName]) {
      this.tabGroups[groupName] = { keywords: [], tabs: [] };
    }
    this.tabGroups[groupName].keywords = [...new Set([...this.tabGroups[groupName].keywords, ...keywords])];
    this.tabGroups[groupName].tabs.push(tab);
  }

  async cleanupInactiveTabs() {
    const now = Date.now();
    const timeout = settingsManager.settings.inactiveTabTimeout;
    
    for (const groupName in this.tabGroups) {
      const group = this.tabGroups[groupName];
      group.tabs = group.tabs.filter(tab => {
        const lastAccessed = tab.lastAccessed || now;
        return (now - lastAccessed) < timeout;
      });
    }
  }

  async moveTabToGroup(tabId, targetGroupName) {
    const tab = this.tabsInfo[tabId];
    if (!tab) return;

    // Remove tab from current group
    for (const groupName in this.tabGroups) {
      this.tabGroups[groupName].tabs = this.tabGroups[groupName].tabs.filter(t => t.id !== tabId);
    }

    // Add to new group
    this.addTabToGroup(targetGroupName, tab, []);
    await chrome.storage.local.set({ tabGroups: this.tabGroups });
  }

  createCustomGroup(groupName) {
    if (!this.tabGroups[groupName]) {
      this.tabGroups[groupName] = { keywords: [], tabs: [] };
      chrome.storage.local.set({ tabGroups: this.tabGroups });
    }
  }
}

// Initialize the tab manager
const tabManager = new TabManager();
