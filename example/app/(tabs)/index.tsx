/**
 * Home — Keyboard Form Showcase
 *
 * Package overview with live toggles for key features,
 * quick demo form, API list, and navigation to detail screens.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ActionButton,
  FeatureCard,
  SectionLabel,
  StyledInput
} from '@/components/showcase';
import {
  ShowcaseColors as C,
  ShowcaseRadius,
  ShowcaseSpacing,
} from '@/constants/showcase-theme';
import {
  FieldForm,
  type FieldFormHandle
} from '../../../packages/react-native-fieldflow/src';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const formRef = useRef<FieldFormHandle>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // ── Feature toggles ────────────────────────────────
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [avoidEnabled, setAvoidEnabled] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [chainEnabled, setChainEnabled] = useState(true);
  const [dismissOnTap, setDismissOnTap] = useState(true);

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
        autoScroll={autoScroll}
        chainEnabled={chainEnabled}
        dismissKeyboardOnTap={dismissOnTap}
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

        {/* ── Demo Categories ──────────────────────── */}
        <View style={styles.section}>
          <SectionLabel
            title="Core Basics"
            description="The essentials of FieldFlow: chaining and avoidance"
          />
          <View style={styles.navStack}>
            <FeatureCard
              icon="log-in-outline"
              title="01. Login"
              description="Simplest possible form with 2 fields, no config"
              onPress={() => router.push('/demos/01-login')}
            />
            <FeatureCard
              icon="person-add-outline"
              title="02. Sign Up"
              description="5-field chain with focus visualizer"
              onPress={() => router.push('/demos/02-signup')}
            />
            <FeatureCard
              icon="cart-outline"
              title="03. Checkout"
              description="Dynamic field skipping with skip prop"
              onPress={() => router.push('/demos/03-checkout')}
            />
            <FeatureCard
              icon="create-outline"
              title="04. Profile Edit"
              description="nextRef override & two column layout"
              onPress={() => router.push('/demos/04-profile')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionLabel
            title="Hooks & Behavior"
            description="Lifting UI and responding to keyboard state"
          />
          <View style={styles.navStack}>
            <FeatureCard
              icon="move-outline"
              title="05. Floating Button"
              description="Lift UI using useKeyboardHeight"
              onPress={() => router.push('/demos/05-floating-button')}
            />
            <FeatureCard
              icon="browsers-outline"
              title="06. Collapsing Header"
              description="Animate UI out using useKeyboardVisible"
              onPress={() => router.push('/demos/06-collapsing-header')}
            />
            <FeatureCard
              icon="checkmark-done-outline"
              title="07. Submit Behavior"
              description="submitOnLastFieldDone contrast demo"
              onPress={() => router.push('/demos/07-submit-behavior')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionLabel
            title="Advanced Layouts"
            description="Deep customisation and platform parity"
          />
          <View style={styles.navStack}>
            <FeatureCard
              icon="list-outline"
              title="08. Long Form / Scroll"
              description="scrollViewProps & RefreshControl"
              onPress={() => router.push('/demos/08-long-form')}
            />
            <FeatureCard
              icon="navigate-outline"
              title="09. React Navigation"
              description="Automatic window height measurement"
              onPress={() => router.push('/demos/09-react-navigation')}
            />
            <FeatureCard
              icon="git-compare-outline"
              title="10. Before / After"
              description="FieldFlow vs Boilerplate (LoC saved)"
              onPress={() => router.push('/demos/10-comparison')}
            />
            <FeatureCard
              icon="chatbox-ellipses-outline"
              title="11. Accessory View"
              description="Chat composer with accessory toolbar"
              onPress={() => router.push('/demos/11-accessory-view')}
            />
            <FeatureCard
              icon="layers-outline"
              title="12. Dynamic Forms"
              description="Adding and removing fields on the fly"
              onPress={() => router.push('/demos/12-dynamic-forms')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionLabel title="Live Status" />
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
            <FeatureCard
              icon="color-filter-outline"
              title="Auto Scroll"
              description="Scroll to focused field"
              toggleValue={autoScroll}
              onToggle={setAutoScroll}
            />
            <FeatureCard
              icon="hand-right-outline"
              title="Tap to Dismiss"
              description="Tap empty area to close"
              toggleValue={dismissOnTap}
              onToggle={setDismissOnTap}
            />
          </View>
        </View>

        {/* ── Quick Demo Form ──────────────────────── */}
        <View style={styles.section}>
          <SectionLabel
            title="Quick Test"
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
