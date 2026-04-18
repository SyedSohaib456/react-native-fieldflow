import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FieldForm, FieldInput } from '../../../packages/react-native-fieldflow/src';
import { IconButton } from '../../components/showcase';

const THEME = {
  incoming: '#FFFFFF',
  outgoing: '#10B981',
  background: '#F1F5F1',
  textMain: '#064E3B',
  textContrast: '#FFFFFF',
  accent: '#059669',
};

export default function ChatComposerDemo() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSend = () => {
    Alert.alert('FieldFlow', 'Message sent! Zero manual ref management.');
  };

  const renderFullAccessory = () => (
    <View style={styles.accessoryWrapper}>
      <View style={styles.accessoryContainer}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="happy-outline" size={26} color="#6B7280" />
          </TouchableOpacity>

          <FieldInput
            placeholder="Type a message"
            multiline
            isAccessoryField
            style={styles.input}
          />

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="attach-outline" size={26} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Stack.Screen
        options={{
          headerLeft: () => <IconButton icon="chevron-back" onPress={() => router.back()} />,
          title: 'FieldFlow Chat',
          headerShadowVisible: false,
        }}
      />

      <FieldForm
        keyboardAccessoryView={renderFullAccessory()}
        keyboardAccessoryViewMode="always"
        extraScrollPadding={20}
        chatMode
        avoidKeyboard
        scrollViewProps={{
          contentContainerStyle: styles.scrollContent,
          keyboardDismissMode: 'interactive',
        }}
      >
        <View style={styles.messagesArea}>
          {/* Incoming 1 */}
          <View style={styles.messageRow}>
            <View style={styles.incomingBubble}>
              <Text style={styles.messageText}>
                Tired of wiring up 5 refs for one form. Better way? 😩
              </Text>
              <Text style={styles.timestamp}>10:42 AM</Text>
            </View>
          </View>

          {/* Outgoing 1 */}
          <View style={styles.messageRow}>
            <View style={styles.outgoingBubble}>
              <Text style={[styles.messageText, { color: THEME.textContrast }]}>
                Try <Text style={{ fontWeight: '800' }}>FieldFlow</Text>. It automates focus chaining. Just wrap and go.
              </Text>
              <View style={styles.messageFooter}>
                <Text style={[styles.timestamp, { color: 'rgba(255,255,255,0.7)' }]}>10:43 AM</Text>
                <Ionicons name="checkmark-done" size={16} color="#FFF" />
              </View>
            </View>
          </View>

          {/* Incoming 2 */}
          <View style={styles.messageRow}>
            <View style={styles.incomingBubble}>
              <Text style={styles.messageText}>
                Does it handle the returnKey and auto-focus?
              </Text>
              <Text style={styles.timestamp}>10:44 AM</Text>
            </View>
          </View>

          {/* Outgoing 2 */}
          <View style={styles.messageRow}>
            <View style={styles.outgoingBubble}>
              <Text style={[styles.messageText, { color: THEME.textContrast }]}>
                Yep. Zero boilerplate. Synced accessory views, no jitter on Android.
              </Text>
              <View style={styles.messageFooter}>
                <Text style={[styles.timestamp, { color: 'rgba(255,255,255,0.7)' }]}>10:45 AM</Text>
                <Ionicons name="checkmark-done" size={16} color="#FFF" />
              </View>
            </View>
          </View>
          <View style={styles.messageRow}>
            <View style={styles.incomingBubble}>
              <Text style={styles.messageText}>
                Wait, I just tried it... Wow. This is actually amazing. 🤯
              </Text>
              <Text style={styles.timestamp}>10:42 AM</Text>
            </View>
          </View>
        </View>
        {/* New Incoming 3 */}


        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>High-Performance Flow</Text>
          <Text style={styles.infoText}>
            Eliminate KeyboardAvoidingView struggles. Auto-focus chaining in under 10 lines of code.
          </Text>
        </View>
      </FieldForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  scrollContent: { paddingBottom: 40 },
  messagesArea: { paddingHorizontal: 12, paddingTop: 16, gap: 10 },
  messageRow: { marginVertical: 1 },
  incomingBubble: {
    alignSelf: 'flex-start',
    backgroundColor: THEME.incoming,
    padding: 8,
    borderRadius: 18,
    borderBottomLeftRadius: 5,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  outgoingBubble: {
    alignSelf: 'flex-end',
    backgroundColor: THEME.outgoing,
    padding: 8,
    borderRadius: 18,
    borderBottomRightRadius: 5,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: THEME.textMain,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
  accessoryWrapper: {
    backgroundColor: 'transparent'
  },
  accessoryContainer: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 12,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  iconButton: {
    padding: 4,
  },
  sendButton: {
    backgroundColor: THEME.accent,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  infoCard: {
    margin: 12,
    backgroundColor: '#E1F2E9',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#A7D7C0',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.accent,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#4B5563',
  },
});