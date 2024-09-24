// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const groupsContainer = document.getElementById('groups-container');
  const refreshBtn = document.getElementById('refresh-btn');

  refreshBtn.addEventListener('click', () => {
    groupsContainer.innerHTML = '<p>Refreshing...</p>';
    setTimeout(() => {
      loadTabGroups();
    }, 100);
  });

  function loadTabGroups() {
    chrome.storage.local.get(['tabGroups'], (result) => {
      const tabGroups = result.tabGroups;

      if (!tabGroups || Object.keys(tabGroups).length === 0) {
        groupsContainer.innerHTML = '<p>No tabs open.</p>';
        return;
      }

      groupsContainer.innerHTML = '';

      for (const groupName in tabGroups) {
        const group = tabGroups[groupName];

        const groupCard = document.createElement('div');
        groupCard.className = 'group-card';

        const groupHeader = document.createElement('div');
        groupHeader.className = 'group-header';

        const groupTitle = document.createElement('h2');
        groupTitle.textContent = groupName;

        const groupCount = document.createElement('span');
        groupCount.textContent = `${group.tabs.length} tab(s)`;

        groupHeader.appendChild(groupTitle);
        groupHeader.appendChild(groupCount);

        const tabList = document.createElement('ul');
        tabList.className = 'tab-list';

        group.tabs.forEach((tab) => {
          const listItem = document.createElement('li');
          listItem.className = 'tab-item';

          const tabLink = document.createElement('a');
          tabLink.href = '#';
          tabLink.textContent = tab.title || 'Untitled';
          tabLink.title = tab.url;
          tabLink.addEventListener('click', (e) => {
            e.preventDefault();
            chrome.tabs.update(tab.id, { active: true });
          });

          const favicon = document.createElement('img');
          favicon.src = tab.favIconUrl || 'icons/default_favicon.png';
          favicon.alt = '';
          favicon.className = 'favicon';
          favicon.onerror = () => {
            favicon.src = 'icons/default_favicon.png';
          };

          const closeBtn = document.createElement('button');
          closeBtn.className = 'close-btn';
          closeBtn.title = 'Close Tab';
          closeBtn.innerText = '×';
          closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            chrome.tabs.remove(tab.id, () => {
              listItem.remove();
            });
          });

          listItem.appendChild(favicon);
          listItem.appendChild(tabLink);
          listItem.appendChild(closeBtn);
          tabList.appendChild(listItem);
        });

        groupCard.appendChild(groupHeader);
        groupCard.appendChild(tabList);
        groupsContainer.appendChild(groupCard);
      }
    });
  }

  loadTabGroups();

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.tabGroups) {
      loadTabGroups();
    }
  });
});