import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import HomePage from './screens/homePage';
import ExploreScreen from './screens/explorePage';
import ProfileScreen from './screens/profilePage';
import BottomNavbar from './components/bottomNavbar';
import SignInScreen from './screens/signinPage'; 
import SignUpScreen from './screens/signupPage';

const loadFonts = () => {
  return Font.loadAsync({
    'Gabarito-Regular': require('./assets/fonts/Gabarito-Regular.ttf'),
    'Gabarito-Bold': require('./assets/fonts/Gabarito-Bold.ttf'),
    'Gabarito-SemiBold': require('./assets/fonts/Gabarito-SemiBold.ttf'),
  });
};

export default function App() {
  const [activeTab, setActiveTab] = useState('SignIn');
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
        {/* We could add a loading indicator here */}
      </View>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'SignIn':
        return <SignInScreen />;
      case 'SignUp':
        return <SignUpScreen />;
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
      <BottomNavbar activeTab={activeTab} onChangeTab={setActiveTab} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContainer: {
    flex: 1,
  },
});