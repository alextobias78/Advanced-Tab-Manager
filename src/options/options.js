// src/options/options.js
import { settingsManager } from '../utils/settings.js';

class OptionsManager {
  constructor() {
    this.initializeElements();
    this.loadSettings();
    this.attachEventListeners();
  }

  initializeElements() {
    this.elements = {
      matchThreshold: document.getElementById('matchThreshold'),
      enableGrouping: document.getElementById('enableGrouping'),
      autoCleanupInactive: document.getElementById('autoCleanupInactive'),
      inactiveTabTimeout: document.getElementById('inactiveTabTimeout'),
      saveBtn: document.getElementById('saveBtn'),
      resetBtn: document.getElementById('resetBtn')
    };
  }

  async loadSettings() {
    const settings = await settingsManager.loadSettings();
    this.elements.matchThreshold.value = settings.matchThreshold;
    this.elements.enableGrouping.checked = settings.enableGrouping;
    this.elements.autoCleanupInactive.checked = settings.autoCleanupInactive;
    this.elements.inactiveTabTimeout.value = Math.floor(settings.inactiveTabTimeout / (24 * 60 * 60 * 1000)); // Convert ms to days
  }

  attachEventListeners() {
    this.elements.saveBtn.addEventListener('click', () => this.saveSettings());
    this.elements.resetBtn.addEventListener('click', () => this.resetSettings());
  }

  async saveSettings() {
    const newSettings = {
      matchThreshold: parseInt(this.elements.matchThreshold.value),
      enableGrouping: this.elements.enableGrouping.checked,
      autoCleanupInactive: this.elements.autoCleanupInactive.checked,
      inactiveTabTimeout: parseInt(this.elements.inactiveTabTimeout.value) * 24 * 60 * 60 * 1000 // Convert days to ms
    };

    await settingsManager.updateSettings(newSettings);
    this.showToast('Settings saved successfully!');
  }

  async resetSettings() {
    if (confirm('Reset all settings to default values?')) {
      await settingsManager.resetToDefaults();
      await this.loadSettings();
      this.showToast('Settings reset to defaults!');
    }
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger reflow
    toast.offsetHeight;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize options page
document.addEventListener('DOMContentLoaded', () => {
  new OptionsManager();
});
