# Advanced Tab Management Extension

The Advanced Tab Management Extension is a powerful Chrome extension designed to help users organize and manage their browser tabs efficiently. It automatically groups tabs based on content similarity, provides an intuitive interface for tab management, and offers customizable settings to suit individual preferences.

## Features

- **Automatic Tab Grouping**: Tabs are automatically grouped based on content similarity using keyword extraction from titles and URLs.
- **Dynamic Group Management**: Groups are updated in real-time as tabs are opened, closed, or updated.
- **Intuitive User Interface**: Easy-to-use popup interface for managing tab groups and individual tabs.
- **Customizable Settings**: Users can adjust grouping thresholds and enable/disable features through the options page.
- **Tab Count Display**: Shows the number of tabs in each group for quick reference.
- **Quick Tab Navigation**: Easily switch to any tab by clicking on it in the popup interface.
- **Tab Closing**: Close tabs directly from the extension popup.
- **Favicon Display**: Shows favicons for each tab for easy visual identification.

## Installation

1. Clone this repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Click on the extension icon in the Chrome toolbar to open the popup interface.
2. View your tabs organized into groups based on content similarity.
3. Click on a tab title to switch to that tab.
4. Use the close button (×) next to each tab to close it.
5. Click the "Refresh" button to manually update the tab groups.
6. Access the options page by clicking the "Options" button to customize the extension settings.

## Configuration

Access the options page to customize the following settings:

- **Match Threshold**: Adjust the similarity threshold for grouping tabs.
- **Enable Grouping**: Toggle automatic tab grouping on or off.
- **Enable Urgency**: (Feature to be implemented) Prioritize certain tab groups.

## File Structure

```
tab-manager-ext/
│
├── background.js      # Background script for tab management logic
├── manifest.json      # Extension manifest file
├── options.html       # Options page HTML
├── options.js         # Options page JavaScript
├── popup.html         # Popup interface HTML
├── popup.js           # Popup interface JavaScript
│
├── icons/
│   ├── default_favicon.png
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   ├── loading_favicon.svg
│   └── refresh.svg
│
└── styles/
    ├── options.css    # Styles for the options page
    └── popup.css      # Styles for the popup interface
```

## Technologies Used

- JavaScript (ES6+)
- Chrome Extension APIs
- HTML5
- CSS3

## Contributing

Contributions to the Advanced Tab Management Extension are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to your fork.
5. Submit a pull request to the main repository.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

For any questions or support, please open an issue in the GitHub repository.