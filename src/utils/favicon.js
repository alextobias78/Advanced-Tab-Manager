// src/utils/favicon.js

export class FaviconManager {
  static async getFaviconUrl(url) {
    // Try multiple favicon sources
    const sources = [
      this.getDirectFavicon(url),
      this.getGoogleFavicon(url),
      this.getDuckDuckGoFavicon(url),
      '../icons/default_favicon.png'
    ];

    for (const source of sources) {
      try {
        const response = await fetch(source);
        if (response.ok) {
          return source;
        }
      } catch (e) {
        continue;
      }
    }
    
    return '../icons/default_favicon.png';
  }

  static getDirectFavicon(url) {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
    } catch (e) {
      return null;
    }
  }

  static getGoogleFavicon(url) {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
    } catch (e) {
      return null;
    }
  }

  static getDuckDuckGoFavicon(url) {
    try {
      const urlObj = new URL(url);
      return `https://icons.duckduckgo.com/ip3/${urlObj.hostname}.ico`;
    } catch (e) {
      return null;
    }
  }
}
