# Advanced Tab Management Extension

A powerful Chrome extension that intelligently organizes and manages browser tabs using content analysis, automatic grouping, and smart cleanup features.

## Features

- **Intelligent Tab Grouping**: Automatically groups tabs based on content similarity using advanced keyword extraction
- **Real-time Updates**: Groups dynamically update as tabs are opened, closed, or modified
- **Smart Search**: Quickly find tabs across all groups with instant search
- **Customizable Settings**: Fine-tune grouping behavior and cleanup preferences
- **Inactive Tab Management**: Automatically identify and clean up inactive tabs
- **Modern UI**: Clean, responsive interface with smooth animations
- **Drag & Drop Support**: Easily reorganize tabs between groups
- **Performance Optimized**: Efficient background processing with minimal resource usage

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/Advanced-Tab-Manager.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

### Basic Usage
- Click the extension icon to view grouped tabs
- Use the search bar to find specific tabs
- Click any tab to switch to it
- Use the × button to close tabs

### Advanced Features
- Create custom groups using the "New Group" button
- Use the cleanup feature to manage inactive tabs
- Adjust grouping sensitivity in settings
- Configure automatic cleanup preferences

## Configuration

Access the options page through:
- Right-click the extension icon → Options
- Click the ⚙️ icon in the popup

### Available Settings
- **Match Threshold**: Adjust similarity sensitivity (1-5)
- **Auto Grouping**: Enable/disable automatic tab grouping
- **Cleanup Settings**: Configure inactive tab management
- **Timeout Duration**: Set inactivity threshold for cleanup

## Project Structure

```
src/
├── background/
│   └── background.js    # Core tab management logic
├── popup/
│   ├── popup.html      # Extension popup interface
│   └── popup.js        # Popup functionality
├── options/
│   ├── options.html    # Settings page
│   └── options.js      # Settings management
├── utils/
│   ├── settings.js     # Settings management
│   └── tabGrouping.js  # Tab grouping algorithms
└── styles/
    ├── popup.css       # Popup styles
    └── options.css     # Settings page styles
```

## Technical Details

### Tab Grouping Algorithm
- Extracts keywords from tab titles and URLs
- Filters common words and irrelevant terms
- Compares keyword similarity between tabs
- Groups tabs based on configurable threshold

### Performance Optimization
- Debounced search implementation
- Efficient DOM updates
- Optimized storage usage
- Background processing for heavy operations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Chrome Extensions API
- Modern JavaScript features
- Community feedback and contributions

---

For issues, feature requests, or contributions, please visit the GitHub repository.
