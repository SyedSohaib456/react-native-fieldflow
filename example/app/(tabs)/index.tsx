/**
 * Home — Keyboard Form Showcase
 *
 * Package overview with live toggles for key features,
 * quick demo form, API list, and navigation to detail screens.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import {
  FieldForm,
  useKeyboardState,
  type FieldFormHandle,
} from 'react-native-fieldflow';
import {
  ActionButton,
  FeatureCard,
  SectionLabel,
  StatusPill,
  StyledInput,
} from '@/components/showcase';
import {
  ShowcaseColors as C,
  ShowcaseRadius,
  ShowcaseSpacing,
} from '@/constants/showcase-theme';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const formRef = useRef<FieldFormHandle>(null);
  const { height: kbHeight, visible: kbVisible } = useKeyboardState();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // ── Feature toggles ────────────────────────────────
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [avoidEnabled, setAvoidEnabled] = useState(true);
  const [chainEnabled, setChainEnabled] = useState(true);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    Alert.alert('Submitted', `Name: ${name}\nEmail: ${email}`);
    setTimeout(() => setSubmitted(false), 2500);
  }, [name, email]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <FieldForm
        ref={formRef}
        onSubmit={handleSubmit}
        scrollable={scrollEnabled}
        avoidKeyboard={avoidEnabled}
        extraScrollPadding={100}
        keyboardVerticalOffset={0}
        scrollViewProps={{
          contentContainerStyle: styles.scrollContent,
          keyboardDismissMode: 'interactive',
        }}>

        {/* ── Header ───────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.title}>FieldFlow</Text>
          <Text style={styles.subtitle}>
            Scroll, avoid, field chains, and hooks — no native dependencies.
          </Text>
        </View>

        {/* ── Live Status ──────────────────────────── */}
        <View style={styles.statusRow}>
          <StatusPill
            label="Keyboard"
            value={kbVisible ? 'Open' : 'Closed'}
            active={kbVisible}
          />
          <StatusPill
            label="Height"
            value={`${Math.round(kbHeight)}px`}
            active={kbHeight > 0}
          />
        </View>

        {/* ── Feature Toggles ──────────────────────── */}
        <View style={styles.section}>
          <SectionLabel title="Features" description="Toggle to preview behaviour" />
          <View style={styles.toggleList}>
            <FeatureCard
              icon="resize-outline"
              title="Scrollable"
              description="Wraps content in a ScrollView"
              toggleValue={scrollEnabled}
              onToggle={setScrollEnabled}
            />
            <FeatureCard
              icon="arrow-up-outline"
              title="Avoid Keyboard"
              description="Pushes content above the keyboard"
              toggleValue={avoidEnabled}
              onToggle={setAvoidEnabled}
            />
            <FeatureCard
              icon="link-outline"
              title="Input Chaining"
              description="Next / Done auto-chains field focus"
              toggleValue={chainEnabled}
              onToggle={setChainEnabled}
            />
          </View>
        </View>

        {/* ── Quick Demo Form ──────────────────────── */}
        <View style={styles.section}>
          <SectionLabel
            title="Quick Demo"
            description="Tap Next to chain focus, Done to submit"
          />
          <View style={styles.card}>
            <StyledInput
              icon="person-outline"
              label="Your name"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            <StyledInput
              icon="mail-outline"
              label="Email address"
              placeholder="john@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <ActionButton title="Continue" onPress={handleSubmit} />
            {submitted ? (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle" size={16} color={C.accent} />
                <Text style={styles.successText}>Form submitted successfully</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* ── Separator ────────────────────────────── */}
        <View style={styles.separator} />

        {/* ── Screen Navigation ────────────────────── */}
        <View style={styles.section}>
          <SectionLabel title="Explore" />
          <View style={styles.navStack}>
            <FeatureCard
              icon="document-text-outline"
              title="Login Form"
              description="Chained inputs with Next / Done"
              onPress={() => router.push('/(tabs)/login')}
            />
            <FeatureCard
              icon="pulse-outline"
              title="Hooks & State"
              description="useKeyboardHeight, useKeyboardState"
              onPress={() => router.push('/(tabs)/hooks')}
            />
            <FeatureCard
              icon="settings-outline"
              title="Advanced"
              description="Imperative ref, callbacks, nextRef"
              onPress={() => router.push('/(tabs)/advanced')}
            />
          </View>
        </View>

        {/* ── API Surface ──────────────────────────── */}
        <View style={styles.section}>
          <SectionLabel title="Exports" />
          <View style={styles.apiList}>
            {[
              { name: 'FieldForm', icon: 'albums-outline' as const, tag: 'Component' },
              { name: 'FieldInput', icon: 'create-outline' as const, tag: 'Component' },
              { name: 'useKeyboardHeight', icon: 'analytics-outline' as const, tag: 'Hook' },
              { name: 'useKeyboardVisible', icon: 'eye-outline' as const, tag: 'Hook' },
              { name: 'useKeyboardState', icon: 'git-merge-outline' as const, tag: 'Hook' },
              { name: 'dismissKeyboard', icon: 'close-circle-outline' as const, tag: 'Fn' },
              { name: 'subscribeKeyboard', icon: 'notifications-outline' as const, tag: 'Fn' },
            ].map((item, i, arr) => (
              <View
                key={item.name}
                style={[
                  styles.apiRow,
                  i < arr.length - 1 && styles.apiRowBorder,
                ]}>
                <Ionicons name={item.icon} size={16} color={C.textTertiary} />
                <Text style={styles.apiName}>{item.name}</Text>
                <Text style={styles.apiTag}>{item.tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </FieldForm>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bgPrimary,
  },
  scrollContent: {
    // marginBottom and height spacer now handled by KeyboardForm
  },

  header: {
    paddingHorizontal: ShowcaseSpacing.xl,
    paddingTop: ShowcaseSpacing.xxl,
    paddingBottom: ShowcaseSpacing.lg,
    gap: ShowcaseSpacing.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: C.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: C.textSecondary,
    lineHeight: 23,
  },

  statusRow: {
    flexDirection: 'row',
    gap: ShowcaseSpacing.sm,
    paddingHorizontal: ShowcaseSpacing.xl,
    marginBottom: ShowcaseSpacing.xl,
  },

  section: {
    paddingHorizontal: ShowcaseSpacing.xl,
    gap: ShowcaseSpacing.md,
    marginBottom: ShowcaseSpacing.xxl,
  },

  toggleList: {
    gap: ShowcaseSpacing.sm,
  },

  card: {
    borderRadius: ShowcaseRadius.lg,
    padding: ShowcaseSpacing.lg,
    gap: ShowcaseSpacing.md,
    borderWidth: 1,
    borderColor: C.border,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShowcaseSpacing.sm,
    backgroundColor: C.accentLight,
    borderRadius: ShowcaseRadius.sm,
    paddingHorizontal: ShowcaseSpacing.md,
    paddingVertical: ShowcaseSpacing.sm + 2,
  },
  successText: {
    fontSize: 14,
    color: C.accent,
    fontWeight: '500',
  },

  separator: {
    height: 1,
    backgroundColor: C.separator,
    marginHorizontal: ShowcaseSpacing.xl,
    marginBottom: ShowcaseSpacing.xxl,
  },

  navStack: {
    gap: ShowcaseSpacing.sm,
  },

  apiList: {
    borderRadius: ShowcaseRadius.md,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  apiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShowcaseSpacing.sm,
    paddingHorizontal: ShowcaseSpacing.lg,
    paddingVertical: ShowcaseSpacing.md,
  },
  apiRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: C.borderSubtle,
  },
  apiName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: C.textPrimary,
    ...Platform.select({
      ios: { fontFamily: 'ui-monospace' },
      default: { fontFamily: 'monospace' },
    }),
  },
  apiTag: {
    fontSize: 12,
    fontWeight: '500',
    color: C.textTertiary,
  },
});
