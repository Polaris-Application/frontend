import { generateDefaultConfig, validateConfig } from './colourConfig.js';

const STORAGE_KEY = 'polaris.colourConfig';

export function loadConfig() {
  if (typeof window === 'undefined') {
    return generateDefaultConfig();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return generateDefaultConfig();
    const parsed = JSON.parse(raw);
    const errs = validateConfig(parsed);
    if (errs.length) {
      console.warn('Invalid colour config found in localStorage. Reverting to defaults.', errs);
      return generateDefaultConfig();
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load colour config', err);
    return generateDefaultConfig();
  }
}

export function saveConfig(cfg) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch (err) {
    console.error('Failed to persist colour config', err);
  }
} 