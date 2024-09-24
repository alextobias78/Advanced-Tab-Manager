// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const groupsContainer = document.getElementById('groups-container');
  const refreshBtn = document.getElementById('refresh-btn');
  const optionsBtn = document.getElementById('options-btn');

  // Preload default favicon
  const defaultFavicon = new Image();
  defaultFavicon.src = 'icons/default_favicon.png';

  // Preload loading favicon SVG
  const loadingFavicon = 'icons/loading_favicon.svg';

  refreshBtn.addEventListener('click', () => {
    groupsContainer.innerHTML = '<p>Refreshing...</p>';
    setTimeout(() => {
      loadTabGroups();
    }, 100);
  });

  // Add event listener for the options button
  optionsBtn.addEventListener('click', openOptionsPage);

  function openOptionsPage() {
    chrome.runtime.openOptionsPage();
  }

  function loadTabGroups() {
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

      groupsContainer.innerHTML = '';

      for (const groupName in tabGroups) {
        const group = tabGroups[groupName];
        createGroupCard(groupName, group);
      }
    });
  }

  function createGroupCard(groupName, group) {
    const groupCard = document.createElement('div');
    groupCard.className = 'group-card';
    groupCard.dataset.groupName = groupName;

    const groupHeader = document.createElement('div');
    groupHeader.className = 'group-header';

    const groupTitle = document.createElement('h2');
    groupTitle.textContent = groupName;

    const groupCount = document.createElement('span');
    groupCount.className = 'group-count';
    groupCount.textContent = `${group.tabs.length} tab(s)`;

    groupHeader.appendChild(groupTitle);
    groupHeader.appendChild(groupCount);

    const tabList = document.createElement('ul');
    tabList.className = 'tab-list';

    group.tabs.forEach((tab) => {
      const listItem = createTabListItem(tab, groupName);
      tabList.appendChild(listItem);
    });

    groupCard.appendChild(groupHeader);
    groupCard.appendChild(tabList);
    groupsContainer.appendChild(groupCard);
  }

  function createTabListItem(tab, groupName) {
    const listItem = document.createElement('li');
    listItem.className = 'tab-item';
    listItem.dataset.tabId = tab.id;

    const tabLink = document.createElement('a');
    tabLink.href = '#';
    tabLink.textContent = tab.title || 'Untitled';
    tabLink.title = tab.url;
    tabLink.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.update(tab.id, { active: true });
    });

    // Favicon
    const favicon = document.createElement('img');
    favicon.alt = '';
    favicon.className = 'favicon';
    favicon.src = loadingFavicon; // Use the loading SVG initially

    // Function to set default favicon
    const setDefaultFavicon = () => {
      favicon.src = defaultFavicon.src;
    };

    // Try to load the tab's favicon
    if (tab.favIconUrl) {
      const tempImage = new Image();
      tempImage.onload = () => {
        favicon.src = tab.favIconUrl;
      };
      tempImage.onerror = setDefaultFavicon;
      tempImage.src = tab.favIconUrl;
    } else {
      setDefaultFavicon();
    }

    // Close Button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.title = 'Close Tab';
    closeBtn.innerText = '×';
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      chrome.tabs.remove(tab.id, () => {
        listItem.remove();
        updateGroupAfterTabRemoval(groupName);
      });
    });

    listItem.appendChild(favicon);
    listItem.appendChild(tabLink);
    listItem.appendChild(closeBtn);

    return listItem;
  }

  function updateGroupAfterTabRemoval(groupName) {
    const groupCard = document.querySelector(`.group-card[data-group-name="${groupName}"]`);
    if (!groupCard) return;

    const tabList = groupCard.querySelector('.tab-list');
    const groupCount = groupCard.querySelector('.group-count');
    const remainingTabs = tabList.querySelectorAll('.tab-item');

    groupCount.textContent = `${remainingTabs.length} tab(s)`;

    if (remainingTabs.length === 0) {
      groupCard.remove();
    }

    if (document.querySelectorAll('.group-card').length === 0) {
      groupsContainer.innerHTML = '<p>No tabs open.</p>';
    }
  }

  loadTabGroups();

  // Listen for tab changes in real-time
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'tabChanged') {
      loadTabGroups();
    }
  });
});