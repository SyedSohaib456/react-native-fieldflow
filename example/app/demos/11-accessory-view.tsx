import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Platform, 
  TouchableOpacity, 
  Switch,
  Alert,
  ScrollView
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  FieldForm, 
  FieldInput 
} from '../../../packages/react-native-fieldflow/src';
import { ShowcaseColors as C, ShowcaseSpacing, ShowcaseRadius } from '../../constants/showcase-theme';
import { IconButton } from '../../components/showcase';

export default function AccessoryViewDemo() {
  const router = useRouter();
  const [useSimpleButton, setUseSimpleButton] = useState(false);

  const handleSend = () => {
    Alert.alert('Sent', 'Message sent successfully!');
  };

  const renderToolbar = () => (
    <View style={styles.toolbar}>
      <View style={styles.toolbarLeft}>
        <TouchableOpacity style={styles.toolBtn}>
          <Ionicons name="at-outline" size={18} color={C.accent} />
          <Text style={styles.toolText}>Mention</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn}>
          <Ionicons name="hash-outline" size={18} color={C.accent} />
          <Text style={styles.toolText}>Tag</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn}>
          <Ionicons name="image-outline" size={18} color={C.textTertiary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
        <Text style={styles.sendBtnText}>Send</Text>
        <Ionicons name="paper-plane" size={16} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  const renderSimpleButton = () => (
    <View style={styles.simpleButtonWrapper}>
      <TouchableOpacity style={styles.fullWidthBtn} onPress={handleSend}>
        <Text style={styles.fullWidthBtnText}>Post Comment</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerLeft: () => (
            <IconButton 
              icon="chevron-back" 
              onPress={() => router.back()} 
            />
          ),
        }} 
      />

      <View style={styles.configBar}>
        <Text style={styles.configLabel}>Show simple submit button instead of toolbar</Text>
        <Switch 
          value={useSimpleButton} 
          onValueChange={setUseSimpleButton}
          trackColor={{ false: C.border, true: C.accent }}
        />
      </View>

      <FieldForm 
        keyboardAccessoryView={useSimpleButton ? renderSimpleButton() : renderToolbar()}
        keyboardAccessoryViewMode="always"
        extraScrollPadding={100}
        keyboardVerticalOffset={0}
        scrollViewProps={{
          contentContainerStyle: styles.scrollContent,
          keyboardDismissMode: 'interactive',
        }}
      >
        <View style={styles.card}>
            <View style={styles.inputSection}>
                <Text style={styles.label}>Subject</Text>
                <FieldInput placeholder="What's on your mind?" style={styles.subjectInput} />
            </View>
            <View style={[styles.inputSection, { borderBottomWidth: 0 }]}>
                <Text style={styles.label}>Message</Text>
                <FieldInput 
                    placeholder="Type your message here..." 
                    multiline 
                    numberOfLines={6} 
                    skip 
                    style={styles.msgInput} 
                />
            </View>
        </View>

        <View style={styles.parityBox}>
            <Text style={styles.parityTitle}>Native Platform Parity</Text>
            <View style={styles.parityRow}>
                <View style={styles.parityItem}>
                    <View style={styles.parityCheck}>
                        <Ionicons name="logo-apple" size={14} color={C.accent} />
                        <Text style={styles.parityPlatform}>iOS</Text>
                        <Ionicons name="checkmark-circle" size={16} color={C.accent} />
                    </View>
                    <Text style={styles.parityEvent}>keyboardWillShow</Text>
                </View>
                <View style={styles.parityDivider} />
                <View style={styles.parityItem}>
                    <View style={styles.parityCheck}>
                        <Ionicons name="logo-android" size={14} color={C.accent} />
                        <Text style={styles.parityPlatform}>Android</Text>
                        <Ionicons name="checkmark-circle" size={16} color={C.accent} />
                    </View>
                    <Text style={styles.parityEvent}>keyboardDidShow</Text>
                </View>
            </View>
            <Text style={styles.parityDesc}>
                FieldFlow handles the timing mismatch automatically. Your accessory view always lands flush.
            </Text>
        </View>

        <View style={styles.comparisonNote}>
            <Text style={styles.compNoteText}>
                <Text style={styles.bold}>Without this prop:</Text> You&apos;d need useKeyboardHeight() + Animated.View marginBottom (8+ lines).
            </Text>
            <Text style={styles.compNoteText}>
                <Text style={styles.bold}>With FieldFlow:</Text> Handled with a single prop. 0 extra lines.
            </Text>
        </View>
      </FieldForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bgSecondary,
  },
  configBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: ShowcaseSpacing.lg,
    backgroundColor: C.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: C.borderSubtle,
    gap: 12,
  },
  configLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: C.textSecondary,
  },
  scrollContent: {
    padding: ShowcaseSpacing.lg,
    paddingTop: ShowcaseSpacing.xl,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: C.bgPrimary,
    borderRadius: ShowcaseRadius.lg,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  inputSection: {
    padding: ShowcaseSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: C.borderSubtle,
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subjectInput: {
    fontSize: 18,
    fontWeight: '600',
    color: C.textPrimary,
    height: 40,
  },
  msgInput: {
    fontSize: 16,
    color: C.textPrimary,
    minHeight: 120,
    textAlignVertical: 'top',
    marginTop: 4,
  },
  parityBox: {
    marginTop: ShowcaseSpacing.xxl,
    backgroundColor: C.accentLight,
    borderRadius: ShowcaseRadius.lg,
    padding: ShowcaseSpacing.lg,
    borderWidth: 1,
    borderColor: C.accentBorder,
  },
  parityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.accent,
    marginBottom: ShowcaseSpacing.md,
    textAlign: 'center',
  },
  parityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ShowcaseSpacing.md,
  },
  parityItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  parityCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  parityPlatform: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textPrimary,
  },
  parityEvent: {
    fontSize: 11,
    fontWeight: '600',
    color: C.textSecondary,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  parityDivider: {
    width: 1,
    height: 30,
    backgroundColor: C.accentBorder,
  },
  parityDesc: {
    fontSize: 12,
    color: C.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  comparisonNote: {
    marginTop: ShowcaseSpacing.xl,
    gap: 8,
    paddingHorizontal: 8,
  },
  compNoteText: {
    fontSize: 12,
    color: C.textTertiary,
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
    color: C.textSecondary,
  },
  toolbar: {
    height: 56,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ShowcaseSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: C.border,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  toolbarLeft: {
    flexDirection: 'row',
    gap: ShowcaseSpacing.lg,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toolText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.accent,
  },
  sendBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: C.accent,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sendBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  simpleButtonWrapper: {
    padding: ShowcaseSpacing.lg,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  fullWidthBtn: {
    height: 50,
    backgroundColor: C.accent,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
