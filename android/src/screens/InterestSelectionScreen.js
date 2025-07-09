import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Colors, Typography, Spacing } from '../styles/theme';

const interestsData = [
  'Music', 'Sports', 'Food', 'Art', 'Technology', 'Nature',
  'Gaming', 'Movies', 'Books', 'Travel', 'Fashion', 'Health',
];

const InterestSelectionScreen = ({ onInterestsSelected }) => {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const renderInterestChip = ({ item }) => {
    const isSelected = selectedInterests.includes(item);
    return (
      <TouchableOpacity
        style={[styles.chip, isSelected ? styles.selectedChip : styles.unselectedChip]}
        onPress={() => toggleInterest(item)}
      >
        <Text style={[styles.chipText, isSelected ? styles.selectedChipText : styles.unselectedChipText]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleContinue = () => {
    console.log('Selected Interests:', selectedInterests);
    if (onInterestsSelected) {
      onInterestsSelected();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What are you interested in?</Text>
      <Text style={styles.subtitle}>Select at least 3 interests to get started.</Text>

      <FlatList
        data={interestsData}
        renderItem={renderInterestChip}
        keyExtractor={(item) => item}
        numColumns={2} // Adjust as needed for layout
        contentContainerStyle={styles.chipsContainer}
      />

      <TouchableOpacity
        style={[styles.continueButton, selectedInterests.length < 3 && styles.disabledButton]}
        onPress={handleContinue}
        disabled={selectedInterests.length < 3}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
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
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.small,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.large,
    textAlign: 'center',
  },
  chipsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.medium,
  },
  chip: {
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
    borderRadius: 20,
    margin: Spacing.small,
    borderWidth: 1,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  unselectedChip: {
    backgroundColor: Colors.surface,
    borderColor: Colors.textSecondary,
  },
  chipText: {
    ...Typography.body,
  },
  selectedChipText: {
    color: Colors.surface,
    fontWeight: 'bold',
  },
  unselectedChipText: {
    color: Colors.textPrimary,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    borderRadius: 8,
    marginTop: Spacing.large,
    width: '80%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.textSecondary,
  },
  continueButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: 'bold',
  },
});

export default InterestSelectionScreen;
