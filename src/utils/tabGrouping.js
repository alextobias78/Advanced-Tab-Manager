// src/utils/tabGrouping.js

export const stopWords = [
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'you', 'your', 'are',
  'was', 'what', 'when', 'how', 'where', 'can', 'not', 'have', 'has', 'but',
  'all', 'any', 'get', 'use', 'out', 'www', 'com', 'org', 'net', 'html',
  'htm', 'php', 'https', 'http', 'www2', 'about', 'blank'
];

export function extractKeywords(text) {
  if (!text) return [];
  const words = text.toLowerCase().split(/[\s\|\-_,/:.?&]+/);
  return words.filter(word => word.length > 2 && !stopWords.includes(word));
}

export function findBestGroup(allKeywords, tabGroups, matchThreshold) {
  let bestGroup = null;
  let maxMatches = 0;

  for (const groupName in tabGroups) {
    const groupKeywords = tabGroups[groupName].keywords;
    const matches = allKeywords.filter(word => groupKeywords.includes(word)).length;

    if (matches > maxMatches) {
      bestGroup = groupName;
      maxMatches = matches;
    }
  }

  return maxMatches >= matchThreshold ? bestGroup : null;
}

export function createNewGroup(allKeywords) {
  const groupName = (allKeywords.slice(0, 3).join(' ') || 'Other').trim();
  return {
    name: groupName,
    keywords: allKeywords,
    tabs: []
  };
}
