// src/components/TabDashboard.jsx

import React, { useEffect, useState } from 'react';
import { getStorageData, setStorageData } from '../services/storage';
import {
  groupTabs,
  defaultGroupingRules,
  updateGroupingRules,
} from '../utils/grouping';

const TabDashboard = () => {
  const [groupedTabs, setGroupedTabs] = useState({});
  const [groupingRules, setGroupingRules] = useState(defaultGroupingRules);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load grouping rules from storage on mount
    const loadGroupingRules = async () => {
      try {
        const storedRules = await getStorageData('groupingRules');
        if (storedRules) {
          setGroupingRules(storedRules);
        }
      } catch (error) {
        console.error('Error loading grouping rules:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGroupingRules();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Fetch and group tabs whenever grouping rules change
      fetchAndGroupTabs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupingRules]);

  const fetchAndGroupTabs = () => {
    chrome.tabs.query({}, (tabs) => {
      chrome.runtime.sendMessage(
        { type: 'GROUP_TABS', payload: { tabs, groupingRules } },
        (groupResponse) => {
          if (groupResponse.status === 'Tabs grouped') {
            setGroupedTabs(groupResponse.groupedTabs);
          }
        }
      );
    });
  };

  const handleAddGroup = async () => {
    // Example: Adding a new group called "Research"
    const newGroup = {
      group: 'Research',
      keywords: ['google.com', 'wikipedia.org'],
    };
    const updatedRules = updateGroupingRules(groupingRules, newGroup);
    setGroupingRules(updatedRules);
    await setStorageData('groupingRules', updatedRules);
  };

  const handleResetGroups = async () => {
    setGroupingRules(defaultGroupingRules);
    await setStorageData('groupingRules', defaultGroupingRules);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Tab Dashboard</h1>
      <button onClick={handleAddGroup}>Add "Research" Group</button>
      <button onClick={handleResetGroups}>Reset Groups</button>
      {Object.entries(groupedTabs).map(([groupName, tabs]) => (
        <div key={groupName}>
          <h2>
            {groupName} ({tabs.length})
          </h2>
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
      ))}
    </div>
  );
};

export default TabDashboard;