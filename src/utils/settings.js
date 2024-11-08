// src/utils/settings.js

export const defaultSettings = {
  matchThreshold: 2,
  enableGrouping: true,
  enableUrgency: true,
  maxGroupSize: 10,
  autoCleanupInactive: false,
  inactiveTabTimeout: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
};

export class SettingsManager {
  constructor() {
    this.settings = { ...defaultSettings };
  }

  async loadSettings() {
    const result = await chrome.storage.sync.get(['settings']);
    this.settings = {
      ...defaultSettings,
      ...(result.settings || {})
    };
    return this.settings;
  }

  async updateSettings(newSettings) {
    this.settings = {
      ...this.settings,
      ...newSettings
    };
    await chrome.storage.sync.set({ settings: this.settings });
    return this.settings;
  }

  async resetToDefaults() {
    this.settings = { ...defaultSettings };
    await chrome.storage.sync.set({ settings: this.settings });
    return this.settings;
  }
}

export const settingsManager = new SettingsManager();
