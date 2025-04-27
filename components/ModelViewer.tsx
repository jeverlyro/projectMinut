import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { GLView, ExpoWebGLRenderingContext } from "expo-gl";
import { Asset } from "expo-asset";
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  AmbientLight,
  DirectionalLight,
  Group,
  Object3DEventMap,
  Box3,
  Vector3,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import WebView from "react-native-webview";

// Define the expected route parameters
type ModelViewerRouteParams = {
  modelInfo: {
    name: string;
    modelUrl: string | { uri: string } | number;
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
  const { modelInfo } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const rotationX = useRef(0);
  const rotationY = useRef(0);
  const modelRef = useRef<Group<Object3DEventMap> | null>(null);
  const glViewRef = useRef<GLView>(null);

  // Check if the modelUrl is a web URL
  const isWebModel =
    typeof modelInfo.modelUrl === "string" &&
    modelInfo.modelUrl.startsWith("http");

  // --- Gesture Handling ---
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, gestureState) => {
        if (!isWebModel) {
          rotationY.current += gestureState.dx * 0.005;
          rotationX.current += gestureState.dy * 0.005;

          rotationX.current = Math.max(
            -Math.PI / 2,
            Math.min(Math.PI / 2, rotationX.current)
          );
        }
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  // --- Three.js Initialization ---
  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new WebGLRenderer({ context: gl, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Platform.OS === "web" ? window.devicePixelRatio : 1);
    renderer.setClearColor(0xeeeeee);

    const ambientLight = new AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // --- Model Loading ---
    try {
      setIsLoading(true);
      setError(null);

      let assetUri: string | null = null;

      if (typeof modelInfo.modelUrl === "number") {
        // Handle local assets loaded via require()
        const asset = Asset.fromModule(modelInfo.modelUrl);
        await asset.downloadAsync();
        if (!asset.localUri && !asset.uri) {
          throw new Error("Could not get local URI for the model asset");
        }
        assetUri = asset.localUri || asset.uri;
        console.log("Asset loaded from module with URI:", assetUri);
      } else if (
        typeof modelInfo.modelUrl === "object" &&
        modelInfo.modelUrl.uri
      ) {
        // Handle object with URI property
        assetUri = modelInfo.modelUrl.uri;
        console.log("Asset using provided URI:", assetUri);
      }

      if (!assetUri) {
        throw new Error("Model URL is invalid or could not be resolved.");
      }

      const loader = new GLTFLoader();

      if (Platform.OS === "web") {
        // @ts-ignore - needed for web
        loader.setCrossOrigin("anonymous");
      }

      try {
        const gltfData = await new Promise((resolve, reject) => {
          loader.load(
            assetUri!,
            resolve,
            // Progress callback
            (xhr) => {
              if (xhr.lengthComputable) {
                const percentComplete = (xhr.loaded / xhr.total) * 100;
                console.log(
                  `Model loading: ${Math.round(percentComplete)}% complete`
                );
              }
            },
            // Error callback
            (err) => {
              console.error("GLTFLoader detailed error:", err);
              reject(err);
            }
          );
        });

        // @ts-ignore - type adjustment
        const loadedModel = gltfData.scene;

        // Center and scale model
        const box = new Box3().setFromObject(loadedModel);
        const center = box.getCenter(new Vector3());
        const size = box.getSize(new Vector3());

        loadedModel.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.0 / maxDim;
        if (isFinite(scale) && scale > 0) {
          loadedModel.scale.set(scale, scale, scale);
        } else {
          loadedModel.scale.set(0.5, 0.5, 0.5);
        }

        modelRef.current = loadedModel;
        scene.add(loadedModel);
        setIsLoading(false);
      } catch (loaderError) {
        console.error("GLTFLoader Error:", loaderError);
        setError(
          `Failed to load model: ${
            loaderError instanceof Error ? loaderError.message : "Unknown error"
          }`
        );
        setIsLoading(false);
      }
    } catch (e: unknown) {
      console.error("Error during model preparation:", e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Failed to prepare model: ${errorMessage}`);
      setIsLoading(false);
    }

    // --- Render Loop ---
    const render = () => {
      requestAnimationFrame(render);

      if (modelRef.current) {
        modelRef.current.rotation.y = rotationY.current;
        modelRef.current.rotation.x = rotationX.current;
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  // Render web model viewer for URLs
  if (isWebModel) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#252129" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{modelInfo.name}</Text>
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
                    <iframe src="${modelInfo.modelUrl}" allowfullscreen></iframe>
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
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Deskripsi:</Text>
          <Text style={styles.descriptionText}>
            {modelInfo.description || "No description available."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render local model viewer for GLTF files
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#252129" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{modelInfo.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.container} {...panResponder.panHandlers}>
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

        {!error && (
          <GLView
            ref={glViewRef}
            style={styles.glView}
            onContextCreate={onContextCreate}
          />
        )}
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Deskripsi:</Text>
        <Text style={styles.descriptionText}>
          {modelInfo.description || "No description available."}
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
  container: {
    flex: 1,
    backgroundColor: "#e0e0e0",
  },
  webViewContainer: {
    height: 500,
    backgroundColor: "#e0e0e0",
  },
  glView: {
    flex: 1,
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
    flex: 1, // Allow description to take remaining space
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
