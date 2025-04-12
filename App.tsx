import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import HomePage from './screens/homePage';

export default function App() {
  return (
    <View style={styles.container}>
      <HomePage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});