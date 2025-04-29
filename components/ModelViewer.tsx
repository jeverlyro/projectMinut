import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import WebView from "react-native-webview";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

// Define the expected route parameters
type ModelViewerRouteParams = {
  modelInfo: {
    name: string;
    modelUrl: string;
    description: string;
  };
};

// Define the type for the route prop
type ModelViewerRouteProp = RouteProp<
  Record<string, ModelViewerRouteParams>,
  string
>;

export default function ModelViewer() {
  const route = useRoute<ModelViewerRouteProp>();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { name, modelUrl, description } = route.params?.modelInfo || {};

  useEffect(() => {
    // Set status bar to light mode for dark background
    StatusBar.setBarStyle("light-content");
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("#252129");
    }

    return () => {
      // Reset when unmounting
      StatusBar.setBarStyle("dark-content");
      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor("transparent");
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#252129" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.webViewContainer}>
        <WebView
          source={{
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                  <style>
                    body, html {
                      margin: 0;
                      padding: 0;
                      height: 100%;
                      width: 100%;
                      overflow: hidden;
                      background-color: #e0e0e0;
                    }
                    iframe {
                      width: 100%;
                      height: 100%;
                      border: none;
                    }
                  </style>
                </head>
                <body>
                  <iframe src="${modelUrl}" allowfullscreen></iframe>
                </body>
              </html>
            `,
          }}
          style={styles.webView}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          originWhitelist={["*"]}
          javaScriptEnabled={true}
          onError={() => {
            setError("Failed to load 3D model from web source");
            setIsLoading(false);
          }}
        />

        {isLoading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#252129" />
            <Text style={styles.loadingText}>Loading 3D Model...</Text>
          </View>
        )}

        {error && (
          <View style={styles.overlay}>
            <Ionicons name="alert-circle-outline" size={40} color="#ff4d4d" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Deskripsi:</Text>
        <Text style={styles.descriptionText}>
          {description || "No description available."}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Gabarito-Bold",
    color: "#252129",
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    height: 500,
  },
  webView: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "Gabarito-Regular",
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    marginTop: 10,
    fontFamily: "Gabarito-Regular",
    fontSize: 16,
    color: "#ff4d4d",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  descriptionContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
    flex: 1,
  },
  descriptionTitle: {
    fontFamily: "Gabarito-Bold",
    fontSize: 16,
    color: "#252129",
    marginBottom: 8,
  },
  descriptionText: {
    fontFamily: "Gabarito-Regular",
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
