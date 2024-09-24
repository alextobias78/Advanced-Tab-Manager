// options.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settings-form');
  
    // Load saved settings
    chrome.storage.sync.get(['settings'], (result) => {
      const settings = result.settings || {};
      form.enableGrouping.checked = settings.enableGrouping !== false;
      form.enableUrgency.checked = settings.enableUrgency !== false;
    });
  
    // Save settings when the form is submitted
    form.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const settings = {
        enableGrouping: form.enableGrouping.checked,
        enableUrgency: form.enableUrgency.checked,
      };
  
      chrome.storage.sync.set({ settings }, () => {
        alert('Settings saved.');
      });
    });
  });