/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import InterestSelectionScreen from './src/screens/InterestSelectionScreen';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manages overall login state
  const [hasSelectedInterests, setHasSelectedInterests] = useState(false); // Manages if user has selected interests

  // This logic would typically be more robust, involving actual authentication tokens and user profiles
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    // In a real app, you'd check if the user is new or has selected interests before showing this screen
    setHasSelectedInterests(false); // Simulate new user for demonstration
  };

  const handleInterestsSelected = () => {
    setHasSelectedInterests(true);
  };

  const renderScreen = () => {
    if (!isLoggedIn) {
      return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
    } else if (!hasSelectedInterests) {
      return <InterestSelectionScreen onInterestsSelected={handleInterestsSelected} />;
    } else {
      return <AppNavigator />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
