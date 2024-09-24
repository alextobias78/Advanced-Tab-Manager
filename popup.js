// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const groupsContainer = document.getElementById('groups-container');
    const refreshBtn = document.getElementById('refresh-btn');
  
    // Refresh button functionality
    refreshBtn.addEventListener('click', () => {
      // Clear existing content before reloading
      groupsContainer.innerHTML = '<p>Refreshing...</p>';
      // Delay to allow the loading message to display
      setTimeout(() => {
        location.reload();
      }, 100);
    });
  
    // Send a message to the background script to get the tab groups
    chrome.runtime.sendMessage({ action: 'getTabGroups' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error getting tab groups:', chrome.runtime.lastError);
        groupsContainer.innerHTML = '<p>Error loading tab groups.</p>';
        return;
      }
  
      const tabGroups = response.tabGroups;
  
      if (!tabGroups || Object.keys(tabGroups).length === 0) {
        groupsContainer.innerHTML = '<p>No tabs open.</p>';
        return;
      }
  
      // Clear the groups container
      groupsContainer.innerHTML = '';
  
      for (const groupName in tabGroups) {
        const group = tabGroups[groupName];
  
        // Create a group card
        const groupCard = document.createElement('div');
        groupCard.className = 'group-card';
  
        // Group header
        const groupHeader = document.createElement('div');
        groupHeader.className = 'group-header';
  
        const groupTitle = document.createElement('h2');
        groupTitle.textContent = groupName;
  
        const groupCount = document.createElement('span');
        groupCount.textContent = `${group.tabs.length} tab(s)`;
  
        groupHeader.appendChild(groupTitle);
        groupHeader.appendChild(groupCount);
  
        // Tab list
        const tabList = document.createElement('ul');
        tabList.className = 'tab-list';
  
        group.tabs.forEach((tab) => {
          const listItem = document.createElement('li');
          listItem.className = 'tab-item';
  
          const tabLink = document.createElement('a');
          tabLink.href = '#';
          tabLink.textContent = tab.title || 'Untitled';
          tabLink.title = tab.url;
          tabLink.addEventListener('click', () => {
            // Activate the tab when clicked
            chrome.tabs.update(tab.id, { active: true });
          });
  
          // Favicon
          const favicon = document.createElement('img');
          favicon.src = tab.favIconUrl || 'icons/default_favicon.png';
          favicon.alt = '';
          favicon.className = 'favicon';
          favicon.onerror = () => {
            favicon.src = 'icons/default_favicon.png';
          };
  
          listItem.appendChild(favicon);
          listItem.appendChild(tabLink);
          tabList.appendChild(listItem);
        });
  
        groupCard.appendChild(groupHeader);
        groupCard.appendChild(tabList);
        groupsContainer.appendChild(groupCard);
      }
    });
  });