const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force Metro to prefer CommonJS (require) over ESM (import) to avoid ESM 'import.meta' syntax errors in packages like Zustand
config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native'];

module.exports = config;
