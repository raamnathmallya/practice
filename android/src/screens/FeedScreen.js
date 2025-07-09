import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, PermissionsAndroid, Platform, ActivityIndicator, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { Colors, Typography, Spacing } from '../styles/theme';

const EventCard = ({ event }) => {
  const startDate = new Date(event.start_time);
  const endDate = event.end_time ? new Date(event.end_time) : null;

  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={eventCardStyles.card}>
      <Text style={eventCardStyles.title}>{event.title}</Text>
      <Text style={eventCardStyles.description}>{event.description}</Text>
      <Text style={eventCardStyles.time}>Starts: {formatDateTime(startDate)}</Text>
      {endDate && <Text style={eventCardStyles.time}>Ends: {formatDateTime(endDate)}</Text>}
      <Text style={eventCardStyles.location}>Lat: {event.latitude.toFixed(4)}, Lon: {event.longitude.toFixed(4)}</Text>
      {/* TODO: Add distance from user, cover photo, RSVP counts */}
    </View>
  );
};

const eventCardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: Spacing.medium,
    marginBottom: Spacing.medium,
    elevation: 2,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.small,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.small,
  },
  time: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  location: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Sping.small,
  },
});

const FeedScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const requestLocationPermission = async () => {
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
            fetchEvents(position.coords.latitude, position.coords.longitude);
          },
          (err) => {
            console.error('Geolocation Error:', err);
            setError('Could not get your location. Please enable location services.');
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        setError('Location permission denied. Cannot fetch events.');
        setLoading(false);
      }
    };

    getLocationAndFetchEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.text}>Loading Events...</Text>
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
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No events found near your location.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.medium,
  },
  listContentContainer: {
    paddingVertical: Spacing.medium,
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
  emptyListText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.large,
  },
});

export default FeedScreen;
