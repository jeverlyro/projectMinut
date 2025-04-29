const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// Add this to prevent asset bundling issues
defaultConfig.resolver.sourceExts.push("cjs");

module.exports = defaultConfig;
