// tests/test.js
import { extractKeywords, findBestGroup, createNewGroup } from '../src/utils/tabGrouping.js';

// Mock tabs for testing
const mockTabs = [
  {
    id: 1,
    title: 'GitHub - Advanced Tab Manager',
    url: 'https://github.com/user/advanced-tab-manager'
  },
  {
    id: 2,
    title: 'JavaScript Best Practices - MDN',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'
  },
  {
    id: 3,
    title: 'Another GitHub Repository',
    url: 'https://github.com/user/another-repo'
  }
];

// Test keyword extraction
console.log('Testing keyword extraction...');
const keywords = extractKeywords(mockTabs[0].title + ' ' + mockTabs[0].url);
console.assert(keywords.includes('github'), 'Should extract "github" keyword');
console.assert(keywords.includes('advanced'), 'Should extract "advanced" keyword');
console.assert(keywords.includes('manager'), 'Should extract "manager" keyword');

// Test group creation
console.log('Testing group creation...');
const group = createNewGroup(['github', 'repository']);
console.assert(group.name === 'github repository', 'Should create group with correct name');
console.assert(Array.isArray(group.keywords), 'Should have keywords array');

// Test group matching
console.log('Testing group matching...');
const groups = {
  'github repos': { keywords: ['github', 'repository', 'code'] },
  'javascript': { keywords: ['javascript', 'programming', 'web'] }
};

const bestGroup = findBestGroup(['github', 'code', 'test'], groups, 2);
console.assert(bestGroup === 'github repos', 'Should find best matching group');

console.log('All tests completed!');
