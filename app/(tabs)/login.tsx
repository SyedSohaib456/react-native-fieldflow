/**
 * Login Screen — Chained Input Demo
 *
 * Realistic sign-in/sign-up form showcasing KeyboardInput chaining.
 * Includes feature toggles so users can see each behaviour.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  FieldForm,
  type FieldFormHandle,
  useKeyboardState,
} from '@/components/keyboard';
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

type FormMode = 'login' | 'signup';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const formRef = useRef<FieldFormHandle>(null);
  const { height: kbHeight, visible: kbVisible } = useKeyboardState();

  const [mode, setMode] = useState<FormMode>('login');
  const [submitted, setSubmitted] = useState(false);

  // Form values
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Feature toggles
  const [dismissOnSubmit, setDismissOnSubmit] = useState(true);
  const [dismissOnPastLast, setDismissOnPastLast] = useState(true);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    Alert.alert(
      mode === 'login' ? 'Signed In' : 'Account Created',
      `Email: ${email}`,
    );
    setTimeout(() => setSubmitted(false), 2500);
  }, [mode, email]);

  const toggleMode = useCallback(() => {
    setMode(prev => (prev === 'login' ? 'signup' : 'login'));
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setSubmitted(false);
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <FieldForm
        ref={formRef}
        onSubmit={handleSubmit}
        dismissKeyboardOnSubmit={dismissOnSubmit}
        dismissKeyboardOnFocusPastLast={dismissOnPastLast}
        extraScrollPadding={100}
        keyboardVerticalOffset={0}
        scrollViewProps={{
          contentContainerStyle: styles.scrollContent,
          keyboardDismissMode: 'interactive',
        }}>

        {/* ── Header ───────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text style={styles.subtitle}>
            {mode === 'login'
              ? 'Enter your email and password to access your account.'
              : 'Fill in your details to get started.'}
          </Text>
        </View>

        {/* ── Mode Toggle ──────────────────────────── */}
        <View style={styles.modeContainer}>
          <Pressable
            onPress={() => mode !== 'login' && toggleMode()}
            style={[styles.modeTab, mode === 'login' && styles.modeTabActive]}>
            <Text style={[styles.modeText, mode === 'login' && styles.modeTextActive]}>
              Sign In
            </Text>
          </Pressable>
          <Pressable
            onPress={() => mode !== 'signup' && toggleMode()}
            style={[styles.modeTab, mode === 'signup' && styles.modeTabActive]}>
            <Text style={[styles.modeText, mode === 'signup' && styles.modeTextActive]}>
              Sign Up
            </Text>
          </Pressable>
        </View>

        {/* ── Feature Toggles ──────────────────────── */}
        <View style={styles.section}>
          <SectionLabel title="Behaviour" description="Toggle to see the effect" />
          <View style={styles.toggleStack}>
            <FeatureCard
              icon="close-circle-outline"
              title="dismissKeyboardOnSubmit"
              description="Keyboard dismissed after form submit"
              toggleValue={dismissOnSubmit}
              onToggle={setDismissOnSubmit}
            />
            <FeatureCard
              icon="arrow-forward-circle-outline"
              title="dismissOnFocusPastLast"
              description="Dismiss when there is no next field"
              toggleValue={dismissOnPastLast}
              onToggle={setDismissOnPastLast}
            />
          </View>
        </View>

        {/* ── Form ─────────────────────────────────── */}
        <View style={styles.form}>
          {mode === 'signup' ? (
            <StyledInput
              icon="person-outline"
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          ) : null}

          <StyledInput
            icon="mail-outline"
            label="Email Address"
            placeholder="john@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <StyledInput
            icon="lock-closed-outline"
            label="Password"
            placeholder="min. 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {mode === 'signup' ? (
            <StyledInput
              icon="shield-checkmark-outline"
              label="Confirm Password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          ) : null}

          {mode === 'login' ? (
            <Pressable style={styles.forgotRow}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </Pressable>
          ) : null}

          <ActionButton
            title={submitted ? '✓ Success' : mode === 'login' ? 'Sign In' : 'Sign Up'}
            onPress={handleSubmit}
            variant={submitted ? 'secondary' : 'primary'}
          />

          {submitted ? (
            <View style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={16} color={C.accent} />
              <Text style={styles.successText}>
                {mode === 'login' ? 'Signed in' : 'Account created'} successfully
              </Text>
            </View>
          ) : null}
        </View>

        {/* ── Divider ──────────────────────────────── */}
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.orLine} />
        </View>

        {/* ── Social ───────────────────────────────── */}
        <View style={styles.socialSection}>
          <ActionButton
            title="Continue with Google"
            onPress={() => Alert.alert('Google')}
            variant="outline"
          />
          <ActionButton
            title="Continue with Apple"
            onPress={() => Alert.alert('Apple')}
            variant="outline"
          />
        </View>

        {/* ── Footer ───────────────────────────────── */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </Text>
          <Pressable onPress={toggleMode}>
            <Text style={styles.footerLink}>
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </Text>
          </Pressable>
        </View>

        {/* ── Chain Status ─────────────────────────── */}
        <View style={styles.section}>
          <SectionLabel title="Chain Status" />
          <View style={styles.statusRow}>
            <StatusPill label="Fields" value={String(mode === 'login' ? 2 : 4)} active />
            <StatusPill label="Chain" value={kbVisible ? 'Active' : 'Idle'} active={kbVisible} />
            <StatusPill label="Height" value={`${Math.round(kbHeight)}`} active={kbHeight > 0} />
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
    // marginBottom spacer now handled by KeyboardForm
  },

  header: {
    paddingHorizontal: ShowcaseSpacing.xl,
    paddingTop: ShowcaseSpacing.xxl,
    paddingBottom: ShowcaseSpacing.lg,
    gap: ShowcaseSpacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: C.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: C.textSecondary,
    lineHeight: 22,
  },

  modeContainer: {
    flexDirection: 'row',
    marginHorizontal: ShowcaseSpacing.xl,
    marginBottom: ShowcaseSpacing.xl,
    backgroundColor: C.bgInput,
    borderRadius: ShowcaseRadius.md,
    padding: 4,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: ShowcaseRadius.sm,
    alignItems: 'center',
  },
  modeTabActive: {
    backgroundColor: C.bgPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  modeText: {
    fontSize: 15,
    fontWeight: '500',
    color: C.textTertiary,
  },
  modeTextActive: {
    color: C.textPrimary,
    fontWeight: '600',
  },

  section: {
    paddingHorizontal: ShowcaseSpacing.xl,
    gap: ShowcaseSpacing.md,
    marginBottom: ShowcaseSpacing.xl,
  },
  toggleStack: {
    gap: ShowcaseSpacing.sm,
  },

  form: {
    paddingHorizontal: ShowcaseSpacing.xl,
    gap: ShowcaseSpacing.lg,
    marginBottom: ShowcaseSpacing.xl,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotText: {
    fontSize: 14,
    color: C.accent,
    fontWeight: '500',
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

  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ShowcaseSpacing.xl,
    marginBottom: ShowcaseSpacing.xl,
    gap: ShowcaseSpacing.md,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.separator,
  },
  orText: {
    fontSize: 14,
    color: C.textTertiary,
  },

  socialSection: {
    paddingHorizontal: ShowcaseSpacing.xl,
    gap: ShowcaseSpacing.sm,
    marginBottom: ShowcaseSpacing.xxl,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginBottom: ShowcaseSpacing.xxl,
  },
  footerText: {
    fontSize: 14,
    color: C.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    color: C.accent,
    fontWeight: '600',
  },

  statusRow: {
    flexDirection: 'row',
    gap: ShowcaseSpacing.sm,
    flexWrap: 'wrap',
  },
});
