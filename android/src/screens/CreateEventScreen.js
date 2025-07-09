import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { Colors, Typography, Spacing } from '../styles/theme';

const CreateEventScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleCreateEvent = async () => {
    if (!title || !latitude || !longitude) {
      Alert.alert('Missing Information', 'Please fill in at least Title, Latitude, and Longitude.');
      return;
    }

    try {
      const eventData = {
        title,
        description,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };
      
      // TODO: Add authentication token to headers
      const response = await axios.post('http://localhost:8000/events', eventData);
      console.log('Event created:', response.data);
      Alert.alert('Success', 'Event created successfully!');
      // Clear form or navigate away
      setTitle('');
      setDescription('');
      setStartTime(new Date());
      setEndTime(new Date());
      setLatitude('');
      setLongitude('');
    } catch (error) {
      console.error('Error creating event:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to create event. Please try again.');
    }
  };

  const onChangeStartTime = (event, selectedDate) => {
    const currentDate = selectedDate || startTime;
    setShowStartTimePicker(Platform.OS === 'ios');
    setStartTime(currentDate);
  };

  const onChangeEndTime = (event, selectedDate) => {
    const currentDate = selectedDate || endTime;
    setShowEndTimePicker(Platform.OS === 'ios');
    setEndTime(currentDate);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Create New Event</Text>

      <TextInput
        style={styles.input}
        placeholder="Event Title" 
        placeholderTextColor={Colors.textSecondary}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description (Optional)"
        placeholderTextColor={Colors.textSecondary}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.datePickerButton}>
        <Text style={styles.datePickerButtonText}>Start Time: {startTime.toLocaleString()}</Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker
          testID="startTimePicker"
          value={startTime}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onChangeStartTime}
        />
      )}

      <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.datePickerButton}>
        <Text style={styles.datePickerButtonText}>End Time: {endTime.toLocaleString()}</Text>
      </TouchableOpacity>
      {showEndTimePicker && (
        <DateTimePicker
          testID="endTimePicker"
          value={endTime}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onChangeEndTime}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Latitude" 
        placeholderTextColor={Colors.textSecondary}
        keyboardType="numeric"
        value={latitude}
        onChangeText={setLatitude}
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude" 
        placeholderTextColor={Colors.textSecondary}
        keyboardType="numeric"
        value={longitude}
        onChangeText={setLongitude}
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
        <Text style={styles.createButtonText}>Create Event</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.large,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.large,
    textAlign: 'center',
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: Spacing.medium,
    marginBottom: Spacing.medium,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: Spacing.medium,
    marginBottom: Spacing.medium,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.textSecondary,
  },
  datePickerButtonText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    borderRadius: 8,
    marginTop: Spacing.large,
    alignItems: 'center',
    elevation: 3,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  createButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: 'bold',
  },
});

export default CreateEventScreen;
