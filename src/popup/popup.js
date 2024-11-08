// src/popup/popup.js
import { settingsManager } from '../utils/settings.js';
import { FaviconManager } from '../utils/favicon.js';

class PopupManager {
  constructor() {
    this.groups = {};
    this.searchTimeout = null;
    this.initializeElements();
    this.attachEventListeners();
    this.loadGroups();
  }

  initializeElements() {
    this.groupsContainer = document.getElementById('groupsContainer');
    this.searchInput = document.getElementById('searchInput');
    this.refreshBtn = document.getElementById('refreshBtn');
    this.settingsBtn = document.getElementById('settingsBtn');
    this.newGroupBtn = document.getElementById('newGroupBtn');
    this.cleanupBtn = document.getElementById('cleanupBtn');
  }


  attachEventListeners() {
    this.refreshBtn.addEventListener('click', () => this.loadGroups());
    this.settingsBtn.addEventListener('click', () => this.openSettings());
    this.searchInput.addEventListener('input', () => this.handleSearch());
    this.newGroupBtn.addEventListener('click', () => this.createNewGroup());
    this.cleanupBtn.addEventListener('click', () => this.cleanupInactiveTabs());
  }

  async loadGroups() {
    const response = await chrome.runtime.sendMessage({ action: 'getTabGroups' });
    this.groups = response.tabGroups;
    this.renderGroups();
  }

  renderGroups(filterText = '') {
    this.groupsContainer.innerHTML = '';
    
    Object.entries(this.groups).forEach(([groupName, group]) => {
      if (this.shouldShowGroup(group, filterText)) {
        const groupElement = this.createGroupElement(groupName, group);
        this.groupsContainer.appendChild(groupElement);
      }
    });
  }

  shouldShowGroup(group, filterText) {
    if (!filterText) return true;
    const searchTerm = filterText.toLowerCase();
    
    return group.tabs.some(tab => 
      tab.title?.toLowerCase().includes(searchTerm) ||
      tab.url?.toLowerCase().includes(searchTerm)
    );
  }

  createGroupElement(groupName, group) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'group';
    
    const header = document.createElement('div');
    header.className = 'group-header';
    header.innerHTML = `
      <span class="group-name">${groupName}</span>
      <span class="tab-count">${group.tabs.length} tabs</span>
    `;
    
    const tabList = document.createElement('div');
    tabList.className = 'tab-list';
    
    group.tabs.forEach(tab => {
      const tabElement = this.createTabElement(tab, groupName);
      tabList.appendChild(tabElement);
    });
    
    groupDiv.appendChild(header);
    groupDiv.appendChild(tabList);
    return groupDiv;
  }

  async createTabElement(tab, groupName) {
    const tabDiv = document.createElement('div');
    tabDiv.className = 'tab-item';
    tabDiv.setAttribute('data-tab-id', tab.id);
    
    const favicon = document.createElement('img');
    favicon.className = 'tab-favicon';
    // Use FaviconManager to get the best available favicon
    favicon.src = await FaviconManager.getFaviconUrl(tab.url);
    favicon.onerror = async () => {
      favicon.src = '../icons/default_favicon.png';
    };
    
    const title = document.createElement('span');
    title.className = 'tab-title';
    title.textContent = tab.title;
    title.title = tab.title;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-tab';
    closeBtn.textContent = '×';
    closeBtn.title = 'Close tab';
    
    tabDiv.appendChild(favicon);
    tabDiv.appendChild(title);
    tabDiv.appendChild(closeBtn);
    
    tabDiv.addEventListener('click', (e) => {
      if (e.target !== closeBtn) {
        this.activateTab(tab.id);
      }
    });
    
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeTab(tab.id);
    });
    
    return tabDiv;
  }

  handleSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.renderGroups(this.searchInput.value);
    }, 300);
  }

  async activateTab(tabId) {
    await chrome.tabs.update(tabId, { active: true });
    const tab = await chrome.tabs.get(tabId);
    chrome.windows.update(tab.windowId, { focused: true });
  }

  async closeTab(tabId) {
    await chrome.tabs.remove(tabId);
    this.loadGroups();
  }

  async createNewGroup() {
    const groupName = prompt('Enter new group name:');
    if (groupName) {
      await chrome.runtime.sendMessage({ 
        action: 'createNewGroup', 
        groupName 
      });
      this.loadGroups();
    }
  }

  async cleanupInactiveTabs() {
    if (confirm('Clean up inactive tabs? This will close tabs that haven\'t been used recently.')) {
      await chrome.runtime.sendMessage({ action: 'cleanupInactiveTabs' });
      this.loadGroups();
    }
  }

  openSettings() {
    chrome.runtime.openOptionsPage();
  }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});

