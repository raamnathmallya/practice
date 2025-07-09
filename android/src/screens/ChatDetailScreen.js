import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Colors, Typography, Spacing } from '../styles/theme';

const ChatDetailScreen = ({ route }) => {
  const { conversationId, title } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = firestore()
      .collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = [];
        querySnapshot.forEach(documentSnapshot => {
          messages.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
            createdAt: documentSnapshot.data().createdAt.toDate(), // Convert Firebase Timestamp to Date object
          });
        });
        setMessages(messages);
        setLoading(false);
      });

    return () => subscriber();
  }, [conversationId]);

  const sendMessage = useCallback(async () => {
    if (newMessage.trim() === '') {
      return;
    }

    try {
      await firestore()
        .collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .add({
          text: newMessage,
          createdAt: firestore.FieldValue.serverTimestamp(),
          userId: 'dummy_user_id', // TODO: Replace with actual user ID
          userName: 'Dummy User', // TODO: Replace with actual user name
        });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message.');
    }
  }, [newMessage, conversationId]);

  const renderMessage = ({ item }) => {
    // TODO: Differentiate between sent/received messages based on userId
    return (
      <View style={styles.messageBubble}>
        <Text style={styles.messageSender}>{item.userName}</Text>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{item.createdAt.toLocaleTimeString()}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Adjust as needed
    >
      <Text style={styles.chatTitle}>{title}</Text>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        inverted // To show latest messages at the bottom
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textSecondary}
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  chatTitle: {
    ...Typography.h2,
    textAlign: 'center',
    paddingVertical: Spacing.medium,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.textSecondary,
  },
  messagesList: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
  },
  messageBubble: {
    backgroundColor: Colors.primary,
    padding: Spacing.small,
    borderRadius: 8,
    marginBottom: Spacing.small,
    maxWidth: '80%',
    alignSelf: 'flex-start', // For received messages
  },
  messageSender: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: 'bold',
  },
  messageText: {
    ...Typography.body,
    color: Colors.surface,
  },
  messageTime: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.surface,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: Spacing.medium,
    borderTopWidth: 1,
    borderTopColor: Colors.textSecondary,
    backgroundColor: Colors.surface,
  },
  messageInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    marginRight: Spacing.small,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: Spacing.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: 'bold',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.medium,
    textAlign: 'center',
  },
});

export default ChatDetailScreen;
