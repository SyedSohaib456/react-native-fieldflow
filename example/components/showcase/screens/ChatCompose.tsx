import React from 'react';
import { StyleSheet, View, Text, FlatList, Platform } from 'react-native';
import { 
  FieldForm, 
  FieldInput, 
} from 'react-native-fieldflow';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SpecHeader } from '../SpecHeader';
import { ShowcaseColors as C, ShowcaseSpacing as S, ShowcaseRadius as R } from '../../../constants/showcase-theme';

const MOCK_MESSAGES = [
  { id: '1', text: 'Hey! How is the new FieldFlow library coming along?', sender: 'Alice', time: '10:30 AM' },
  { id: '2', text: 'It is amazing! The keyboard avoidance is so smooth. 🚀', sender: 'Me', time: '10:32 AM' },
  { id: '3', text: 'Did you try the haptics engine yet?', sender: 'Alice', time: '10:33 AM' },
];

export default function ChatCompose() {
  const insets = useSafeAreaInsets();

  const handleFinish = (values: any) => {
    console.log('Chat Send:', values);
  };

  const renderMessage = ({ item }: { item: typeof MOCK_MESSAGES[0] }) => {
    const isMe = item.sender === 'Me';
    return (
      <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.otherMessageRow]}>
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
          <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
            {item.text}
          </Text>
          <Text style={[styles.timeText, isMe ? styles.myTimeText : styles.otherTimeText]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: C.bgSecondary }]}>
      <SpecHeader 
        title="Thread Conversation" 
        subtitle="Chat UI pattern with sticky input handling."
        dark
      />

      <FlatList
        data={MOCK_MESSAGES}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={[styles.chatList, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      />

      <View 
        style={[styles.inputWrapper, { paddingBottom: Math.max(insets.bottom, S.md) }]}
      >
        <FieldForm 
          onFinish={handleFinish}
          scrollable={false}
          style={styles.form}
          extraScrollPadding={0} // No extra padding needed for bottom fixed views, safe area handles it
        >
          <FieldInput
            name="message"
            placeholder="Type a message..."
            multiline
            inputContainerStyle={styles.chatInputContainer}
            inputStyle={styles.chatInput}
            containerStyle={{ marginBottom: 0 }}
            leftIcon={<Ionicons name="add" size={24} color={C.threadTeal} />}
            rightIcon={
              <View style={[styles.sendBtn, { backgroundColor: C.threadTeal }]}>
                <Ionicons name="arrow-up" size={18} color="#FFF" />
              </View>
            }
          />
        </FieldForm>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatList: {
    padding: S.lg,
  },
  messageRow: {
    marginVertical: S.xs,
    flexDirection: 'row',
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  otherMessageRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    paddingHorizontal: S.lg,
    paddingVertical: S.md,
    borderRadius: R.lg,
    maxWidth: '80%',
  },
  myBubble: {
    backgroundColor: '#008080', // Thread Teal
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#1C1C1E',
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
  myTimeText: {
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'right',
  },
  otherTimeText: {
    color: '#AEAEB2',
  },
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingTop: S.md,
    paddingHorizontal: S.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  form: {
    flex: 0,
  },
  chatInputContainer: {
    borderWidth: 0,
    backgroundColor: '#F2F2F7',
    borderRadius: 24,
    paddingHorizontal: 12,
  },
  chatInput: {
    fontSize: 16,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
