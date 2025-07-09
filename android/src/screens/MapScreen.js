import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { Colors, Typography } from '../styles/theme';

const MapScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

  // TODO: Ensure Google Maps API Key is configured for Android and iOS
  // Android: In AndroidManifest.xml
  // iOS: In AppDelegate.m/mm

  const requestLocationPermission = async () => {
    // Same as in FeedScreen.js, consider refactoring to a utility
    try {
      if (Platform.OS === 'ios') {
        const status = await Geolocation.requestAuthorization('whenInUse');
        return status === 'granted';
      } else if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location to show events near you.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return false;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const fetchEvents = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/events/feed?latitude=${latitude}&longitude=${longitude}&radius=25000`);
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events. Please try again later.');
      Alert.alert('Error', 'Failed to fetch events. Please ensure the backend is running and accessible.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLocationAndFetchEvents = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setInitialRegion({
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
            fetchEvents(latitude, longitude);
          },
          (err) => {
            console.error('Geolocation Error:', err);
            setError('Could not get your location. Please enable location services.');
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        setError('Location permission denied. Cannot display map.');
        setLoading(false);
      }
    };

    getLocationAndFetchEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}> 
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.text}>Loading Map...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {initialRegion && (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {events.map(event => (
            <Marker
              key={event.id}
              coordinate={{
                latitude: event.latitude,
                longitude: event.longitude,
              }}
              title={event.title}
              description={event.description}
            />
          ))}
        </MapView>
      )}
      {!initialRegion && <Text style={styles.text}>Getting your location...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginTop: Spacing.medium,
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
    textAlign: 'center',
  },
});

export default MapScreen;
