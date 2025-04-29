import { Platform } from "react-native";
import * as Location from "expo-location";

// Enable map libraries for Android
export async function enableMapLibraries() {
  if (Platform.OS === "android") {
    try {
      // Request location permissions (often helps with map initialization)
      const { status } = await Location.requestForegroundPermissionsAsync();

      // Pre-warm the location services
      if (status === "granted") {
        // Get location once to ensure services are ready
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });
      }

      return true;
    } catch (error) {
      console.warn("Error initializing map services:", error);
      return false;
    }
  }

  return true;
}
