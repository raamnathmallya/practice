import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Colors, Typography, Spacing } from '../styles/theme';

const ChatListScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This is a placeholder. In a real app, you'd fetch conversations relevant to the current user.
    // For now, we'll just list some dummy conversations or all conversations.
    const subscriber = firestore()
      .collection('conversations')
      .onSnapshot(querySnapshot => {
        const conversations = [];
        querySnapshot.forEach(documentSnapshot => {
          conversations.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setConversations(conversations);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading conversations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.conversationItem}
            onPress={() => navigation.navigate('ChatDetail', { conversationId: item.id, title: item.title || 'Chat' })}
          >
            <Text style={styles.conversationTitle}>{item.title || 'New Chat'}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage || 'No messages yet'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No conversations found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.medium,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.medium,
  },
  conversationItem: {
    backgroundColor: Colors.surface,
    padding: Spacing.medium,
    borderRadius: 8,
    marginBottom: Spacing.small,
    elevation: 2,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  conversationTitle: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  lastMessage: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.small,
  },
  emptyListText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.large,
  },
});

export default ChatListScreen;
