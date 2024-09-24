// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
  
    // Fetch the list of tabs from the background script
    chrome.runtime.getBackgroundPage((backgroundPage) => {
      const tabsInfo = backgroundPage.tabsInfo;
  
      // Create a list to display tabs
      const tabList = document.createElement('ul');
  
      for (const tabId in tabsInfo) {
        const tab = tabsInfo[tabId];
        const listItem = document.createElement('li');
  
        // Display the tab title and URL
        listItem.textContent = `${tab.title} - ${tab.url}`;
        listItem.addEventListener('click', () => {
          // Activate the tab when clicked
          chrome.tabs.update(parseInt(tabId), { active: true });
        });
  
        tabList.appendChild(listItem);
      }
  
      // Clear the loading message and display the tabs
      app.innerHTML = '';
      app.appendChild(tabList);
    });
  });