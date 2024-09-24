// src/content.jsx

// Function to send page information to the background script
const sendPageInfo = () => {
    const pageInfo = {
      title: document.title,
      url: window.location.href,
    };
    chrome.runtime.sendMessage({ type: 'PAGE_INFO', payload: pageInfo });
  };
  
  // Execute the function when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', sendPageInfo);