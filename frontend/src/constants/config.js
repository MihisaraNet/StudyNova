// App-wide configuration constants

// ─── API ────────────────────────────────────────────────────────────────────
// For Android Emulator: 10.0.2.2 maps to localhost
// For Physical Device: replace with your machine's local IP (e.g., 192.168.1.5)
// For Production (Render): https://your-app.onrender.com

import { Platform } from 'react-native';

export const API_BASE_URL = __DEV__
  ? (Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080')
  : 'https://your-app.onrender.com';

export const API_TIMEOUT = 10000; // 10 seconds

// ─── JWT ────────────────────────────────────────────────────────────────────
export const TOKEN_KEY = 'auth_token';
export const USER_KEY  = 'auth_user';

// ─── Gemini AI ───────────────────────────────────────────────────────────────
export const GEMINI_API_KEY = '';  // Set your key here or load from env
export const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// ─── Pagination ──────────────────────────────────────────────────────────────
export const PAGE_SIZE = 10;


