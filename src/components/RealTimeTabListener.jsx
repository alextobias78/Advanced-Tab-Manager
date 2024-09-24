// src/components/RealTimeTabListener.jsx

import React, { useEffect, useState } from 'react';

const RealTimeTabListener = () => {
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    // Initial fetch of all tabs
    chrome.tabs.query({}, (fetchedTabs) => {
      setTabs(fetchedTabs);
    });

    // Listener for tab creation
    const handleTabCreated = (tab) => {
      setTabs((prevTabs) => [...prevTabs, tab]);
    };

    // Listener for tab removal
    const handleTabRemoved = ({ tabId }) => {
      setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId));
    };

    // Listener for tab updates
    const handleTabUpdated = (tab) => {
      setTabs((prevTabs) =>
        prevTabs.map((t) => (t.id === tab.id ? { ...t, ...tab } : t))
      );
    };

    // Register message listeners
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.type) {
        case 'TAB_CREATED':
          handleTabCreated(request.payload);
          break;
        case 'TAB_REMOVED':
          handleTabRemoved(request.payload);
          break;
        case 'TAB_UPDATED':
          handleTabUpdated(request.payload);
          break;
        default:
          break;
      }
    });

    // Cleanup listeners on unmount
    return () => {
      chrome.runtime.onMessage.removeListener(handleTabCreated);
      chrome.runtime.onMessage.removeListener(handleTabRemoved);
      chrome.runtime.onMessage.removeListener(handleTabUpdated);
    };
  }, []);

  return (
    <div>
      <h1>Live Tab Updates</h1>
      <ul>
        {tabs.map((tab) => (
          <li key={tab.id}>
            <a
              href={tab.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tab.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RealTimeTabListener;