import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar as RNStatusBar,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SavedItemsProvider } from "./services/SavedItemsContext";

import HomePage from "./screens/main/homePage";
import ExploreScreen from "./screens/main/explorePage";
import ProfileScreen from "./screens/profileScreens/profilePage";
import SignInScreen from "./screens/authScreens/signinPage";
import SignUpScreen from "./screens/authScreens/signupPage";
import OtpVerificationScreen from "./screens/authScreens/OtpVerificationScreen";
import BottomNavbar from "./components/bottomNavbar";
import SavedItemsScreen from "./screens/profileScreens/savedItemsScreen";
import ProfileDetailsScreen from "./screens/profileScreens/profileDetailsPage";
import SettingsScreen from "./screens/settingScreens/settingsPage";
import EditProfileScreen from "./screens/profileScreens/editProfileScreen";
import ChangePasswordScreen from "./screens/settingScreens/changePasswordScreen";
import ModelViewer from "./components/ModelViewer";

// Define the type for the navigation stack parameters
type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  OtpVerification: { email: string; userId: string };
  MainApp: undefined;
  SavedItems: undefined;
  ProfileDetails: undefined;
  Settings: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  ModelViewer: {
    modelInfo: { name: string; modelUrl: number | { uri: string } };
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const loadFonts = () => {
  return Font.loadAsync({
    "Gabarito-Regular": require("./assets/fonts/Gabarito-Regular.ttf"),
    "Gabarito-Bold": require("./assets/fonts/Gabarito-Bold.ttf"),
    "Gabarito-SemiBold": require("./assets/fonts/Gabarito-SemiBold.ttf"),
  });
};

const MainAppScreen = () => {
  const [activeScreen, setActiveScreen] = useState("Home");

  const renderScreen = () => {
    switch (activeScreen) {
      case "Home":
        return <HomePage />;
      case "Explore":
        return <ExploreScreen />;
      case "Profile":
        return <ProfileScreen />;
      default:
        return <HomePage />;
    }
  };

  const handleTabChange = (tabName: string) => {
    setActiveScreen(tabName);
  };

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
      <BottomNavbar activeTab={activeScreen} onChangeTab={handleTabChange} />
    </View>
  );
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
      }
    }

    prepare();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <SavedItemsProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SignIn">
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OtpVerification"
              component={OtpVerificationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MainApp"
              component={MainAppScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SavedItems"
              component={SavedItemsScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ProfileDetails"
              component={ProfileDetailsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ModelViewer"
              component={ModelViewer}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SavedItemsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: RNStatusBar.currentHeight || 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
