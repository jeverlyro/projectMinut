const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// Add support for 3D model file types
defaultConfig.resolver.assetExts.push(
  "glb",
  "gltf",
  "obj",
  "mtl",
  "fbx",
  "stl"
);

module.exports = defaultConfig;
