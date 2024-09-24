// src/utils/grouping.js

/**
 * Defines default grouping rules based on keywords.
 * Users can customize these rules via the settings panel.
 */
const defaultGroupingRules = {
    Work: ['github.com', 'stackoverflow.com', 'jira.com', 'slack.com'],
    Entertainment: ['youtube.com', 'netflix.com', 'spotify.com'],
    News: ['bbc.com', 'cnn.com', 'nytimes.com'],
    Social: ['facebook.com', 'twitter.com', 'linkedin.com'],
    Shopping: ['amazon.com', 'ebay.com', 'aliexpress.com'],
  };
  
  /**
   * Groups tabs based on the provided rules.
   *
   * @param {Array} tabs - Array of tab objects fetched from chrome.tabs.query.
   * @param {Object} groupingRules - Object containing grouping criteria.
   * @returns {Object} - An object where keys are group names and values are arrays of tabs.
   */
  const groupTabs = (tabs, groupingRules = defaultGroupingRules) => {
    const groups = {};
  
    tabs.forEach((tab) => {
      if (!tab.url) {
        // Skip tabs without a URL (e.g., new tab pages)
        return;
      }
  
      const url = new URL(tab.url);
      const hostname = url.hostname;
  
      let matched = false;
  
      // Iterate through grouping rules to find a match
      for (const [groupName, keywords] of Object.entries(groupingRules)) {
        if (keywords.some((keyword) => hostname.includes(keyword))) {
          if (!groups[groupName]) {
            groups[groupName] = [];
          }
          groups[groupName].push(tab);
          matched = true;
          break; // Stop checking after the first match
        }
      }
  
      // Assign to 'Others' group if no match is found
      if (!matched) {
        if (!groups['Others']) {
          groups['Others'] = [];
        }
        groups['Others'].push(tab);
      }
    });
  
    return groups;
  };
  
  /**
   * Allows dynamic updating of grouping rules.
   * This function can be expanded based on user interactions.
   *
   * @param {Object} existingRules - The current grouping rules.
   * @param {Object} newRule - The new rule to add or update.
   * @returns {Object} - The updated grouping rules.
   */
  const updateGroupingRules = (existingRules, newRule) => {
    const { group, keywords } = newRule;
    return {
      ...existingRules,
      [group]: keywords,
    };
  };
  
  export { groupTabs, defaultGroupingRules, updateGroupingRules };