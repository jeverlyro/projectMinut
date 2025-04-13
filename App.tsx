import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar as RNStatusBar, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomePage from './screens/homePage';
import ExploreScreen from './screens/explorePage';
import ProfileScreen from './screens/profilePage';
import SignInScreen from './screens/signinPage';
import SignUpScreen from './screens/signupPage';
import BottomNavbar from './components/bottomNavbar';

const Stack = createStackNavigator();

const loadFonts = () => {
  return Font.loadAsync({
    "Gabarito-Regular": require("./assets/fonts/Gabarito-Regular.ttf"),
    "Gabarito-Bold": require("./assets/fonts/Gabarito-Bold.ttf"),
    "Gabarito-SemiBold": require("./assets/fonts/Gabarito-SemiBold.ttf"),
  });
};

const MainAppScreen = () => {
  const [activeScreen, setActiveScreen] = useState('Home');
  
  const renderScreen = () => {
    switch(activeScreen) {
      case 'Home':
        return <HomePage />;
      case 'Explore':
        return <ExploreScreen />;
      case 'Profile':
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
      <BottomNavbar 
        activeTab={activeScreen} 
        onChangeTab={handleTabChange} 
      />
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
            name="MainApp" 
            component={MainAppScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
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
