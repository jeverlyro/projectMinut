import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

const { width, height } = Dimensions.get("window");

const ModelViewerScreen = ({ route, navigation }) => {
  const { modelInfo } = route.params;
  const [isLoading, setIsLoading] = useState(true);

  // HTML content for the 3D model viewer
  const modelViewerHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${modelInfo.name} 3D Model</title>
        <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
        <style>
          body {
            margin: 0;
            padding: 0;
            width: 100vw;
            height: 100vh;
            background-color: #f5f5f5;
          }
          model-viewer {
            width: 100%;
            height: 100%;
            background-color: #f5f5f5;
          }
        </style>
      </head>
      <body>
        <model-viewer
          src="${modelInfo.modelUrl}"
          alt="${modelInfo.name}"
          auto-rotate
          camera-controls
          ar
          ar-modes="webxr scene-viewer quick-look"
          environment-image="neutral"
          shadow-intensity="1"
        ></model-viewer>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#252129" />
        </TouchableOpacity>
        <Text style={styles.title}>{modelInfo.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.modelContainer}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#252129" />
            <Text style={styles.loadingText}>Memuat model 3D...</Text>
          </View>
        )}

        <WebView
          source={{ html: modelViewerHTML }}
          style={styles.webview}
          onLoadEnd={() => setIsLoading(false)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Panduan Penggunaan:</Text>
        <View style={styles.instructionRow}>
          <Ionicons name="finger-print-outline" size={20} color="#252129" />
          <Text style={styles.infoText}>
            Tekan dan geser untuk memutar model
          </Text>
        </View>
        <View style={styles.instructionRow}>
          <Ionicons name="scan-outline" size={20} color="#252129" />
          <Text style={styles.infoText}>
            Cubit layar untuk memperbesar/memperkecil
          </Text>
        </View>
        <Text style={styles.modelDescription}>{modelInfo.description}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontFamily: "GabaritoBold",
    color: "#252129",
  },
  modelContainer: {
    width: width,
    height: height * 0.5,
    backgroundColor: "#f5f5f5",
    position: "relative",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "GabaritoRegular",
    fontSize: 16,
    color: "#666",
  },
  webview: {
    flex: 1,
  },
  infoContainer: {
    padding: 20,
  },
  infoTitle: {
    fontFamily: "GabaritoBold",
    fontSize: 18,
    marginBottom: 10,
    color: "#252129",
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontFamily: "GabaritoRegular",
    fontSize: 15,
    color: "#444",
    marginLeft: 10,
  },
  modelDescription: {
    fontFamily: "GabaritoRegular",
    fontSize: 15,
    color: "#555",
    marginTop: 16,
    lineHeight: 22,
  },
});

export default ModelViewerScreen;
