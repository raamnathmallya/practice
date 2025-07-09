import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { GoogleSignin, status } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { Colors, Typography, Spacing } from '../styles/theme';

// Replace with your actual Web Client ID from Firebase project settings
const WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID'; 

const LoginScreen = ({ onLoginSuccess }) => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID on the server)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:', userInfo);

      // Send ID token to your backend
      const backendResponse = await axios.post('http://localhost:8000/auth/google', {
        token: userInfo.idToken,
      });
      console.log('Backend Response:', backendResponse.data);

      // Securely store the API token from your backend
      // For now, we'll just log it.
      const apiToken = backendResponse.data.api_token; // Assuming your backend returns an api_token
      console.log('API Token from backend:', apiToken);

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      if (error.code === status.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        Alert.alert('Sign In Cancelled', 'You cancelled the Google Sign-In process.');
      } else if (error.code === status.IN_PROGRESS) {
        // operation (e.g. sign in) already in progress
        Alert.alert('Sign In In Progress', 'Google Sign-In is already in progress.');
      } else if (error.code === status.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Alert.alert('Play Services Not Available', 'Google Play Services are not available or outdated on your device.');
      } else {
        // some other error happened
        console.error('Google Sign-In Error:', error);
        Alert.alert('Sign In Error', `An error occurred during Google Sign-In: ${error.message}`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Psst..</Text>
      <Text style={styles.subtitle}>Discover events around you</Text>
      
      <TouchableOpacity style={styles.googleSignInButton} onPress={handleGoogleSignIn}>
        <Text style={styles.googleSignInButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.large,
  },
  title: {
    ...Typography.h1,
    color: Colors.primary,
    marginBottom: Spacing.small,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.large * 2,
  },
  googleSignInButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    borderRadius: 8,
    elevation: 3, // For Android shadow
    shadowColor: Colors.textPrimary, // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  googleSignInButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
