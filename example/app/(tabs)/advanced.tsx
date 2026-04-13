/**
 * Advanced Screen — Power Features
 *
 * Imperative ref, config toggles, nextRef, keyboard callbacks.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  FieldForm,
  FieldInput,
  dismissKeyboard,
  useKeyboardState,
  type FieldFormHandle,
} from '../../../packages/react-native-fieldflow/src';
import {
  ActionButton,
  FeatureCard,
  SectionLabel,
  StyledInput,
} from '@/components/showcase';
import {
  ShowcaseColors as C,
  ShowcaseRadius,
  ShowcaseSpacing,
} from '@/constants/showcase-theme';

export default function AdvancedScreen() {
  const insets = useSafeAreaInsets();
  const formRef = useRef<FieldFormHandle>(null);
  const orphanRef = useRef<TextInput>(null);
  const customTargetRef = useRef<TextInput>(null);
  const { visible: kbVisible } = useKeyboardState();

  // ── Callbacks log ───────────────────────────────────
  const [log, setLog] = useState<string[]>([]);
  const addLog = useCallback((msg: string) => {
    setLog(prev => [msg, ...prev.slice(0, 7)]);
  }, []);

  // ── Config toggles ─────────────────────────────────
  const [scrollable, setScrollable] = useState(true);
  const [avoidKeyboard, setAvoidKeyboard] = useState(true);
  const [dismissOnPast, setDismissOnPast] = useState(true);
  const [androidBackDismiss, setAndroidBackDismiss] = useState(true);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <FieldForm
        ref={formRef}
        scrollable={scrollable}
        avoidKeyboard={avoidKeyboard}
        dismissKeyboardOnFocusPastLast={dismissOnPast}
        androidDismissKeyboardOnBackPress={androidBackDismiss}
        extraScrollPadding={100}
        keyboardVerticalOffset={0}
        onKeyboardShow={({ height }) => addLog(`show → ${Math.round(height)}px`)}
        onKeyboardHide={() => addLog('hide')}
        scrollViewProps={{
          contentContainerStyle: styles.scrollContent,
          keyboardDismissMode: 'interactive',
        }}>

        {/* ── Header ───────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.title}>Advanced</Text>
          <Text style={styles.subtitle}>
            Imperative API, config flags, and custom focus targets.
          </Text>
        </View>

        {/* ── Config Toggles ───────────────────────── */}
        <View style={styles.section}>
          <SectionLabel title="Configuration" description="Toggle props and see behaviour change" />
          <View style={styles.toggleStack}>
            <FeatureCard
              icon="resize-outline"
              title="scrollable"
              description="Wrap content in a ScrollView"
              toggleValue={scrollable}
              onToggle={setScrollable}
            />
            <FeatureCard
              icon="arrow-up-outline"
              title="avoidKeyboard"
              description="Wrap in KeyboardAvoidingView"
              toggleValue={avoidKeyboard}
              onToggle={setAvoidKeyboard}
            />
            <FeatureCard
              icon="arrow-forward-circle-outline"
              title="dismissOnFocusPastLast"
              description="Dismiss when no next field exists"
              toggleValue={dismissOnPast}
              onToggle={setDismissOnPast}
            />
            <FeatureCard
              icon="phone-portrait-outline"
              title="androidBackDismiss"
              description="Hardware back dismisses keyboard"
              toggleValue={androidBackDismiss}
              onToggle={setAndroidBackDismiss}
            />
          </View>
        </View>

        {/* ── Imperative Ref ───────────────────────── */}
        <View style={styles.section}>
          <SectionLabel title="Imperative Ref" description="KeyboardFormHandle methods" />

          <StyledInput icon="text-outline" label="Field A" placeholder="Registered input A" />
          <StyledInput icon="text-outline" label="Field B" placeholder="Registered input B" />

          <View>
            <Text style={styles.orphanLabel}>
              <Ionicons name="warning-outline" size={13} color={C.warning} /> Plain TextInput (orphan)
            </Text>
            <TextInput
              ref={orphanRef}
              style={styles.orphanInput}
              placeholder="Not registered with form"
              placeholderTextColor={C.textTertiary}
            />
          </View>

          <View style={styles.buttonGrid}>
            <ActionButton
              title="focusNext(0)"
              onPress={() => formRef.current?.focusNext(0)}
              variant="outline"
              compact
              style={styles.flex1}
            />
            <ActionButton
              title="focusNext(1)"
              onPress={() => formRef.current?.focusNext(1)}
              variant="outline"
              compact
              style={styles.flex1}
            />
          </View>
          <ActionButton
            title="scrollInputIntoView(orphan)"
            onPress={() => formRef.current?.scrollInputIntoView(orphanRef.current)}
            variant="outline"
            compact
          />
          <ActionButton
            title="dismissKeyboard()"
            onPress={() => formRef.current?.dismissKeyboard()}
            variant="outline"
            compact
          />
        </View>

        {/* ── nextRef ──────────────────────────────── */}
        <View style={styles.section}>
          <SectionLabel title="Custom Focus Target" description="nextRef overrides chain order" />

          <StyledInput
            icon="play-outline"
            label="Start here"
            placeholder='Press "Next" on keyboard →'
            nextRef={customTargetRef}
          />
          <StyledInput
            icon="play-skip-forward-outline"
            label="Skipped"
            placeholder="This field is skipped"
          />
          <View>
            <View style={styles.targetLabelRow}>
              <Ionicons name="flag-outline" size={14} color={C.accent} />
              <Text style={styles.targetLabel}>Target (via nextRef)</Text>
            </View>
            <FieldInput
              ref={customTargetRef}
              style={styles.targetInput}
              placeholder="← Focus jumps here"
              placeholderTextColor={C.textTertiary}
            />
          </View>
        </View>

        {/* ── Callbacks Log ────────────────────────── */}
        <View style={styles.section}>
          <SectionLabel title="Keyboard Callbacks" description="onKeyboardShow / onKeyboardHide" />
          <View style={styles.logCard}>
            {log.length === 0 ? (
              <Text style={styles.logEmpty}>No events yet — focus an input</Text>
            ) : (
              log.map((entry, i) => (
                <View key={`${entry}-${i}`} style={styles.logRow}>
                  <Ionicons
                    name={i === 0 ? 'radio-button-on' : 'radio-button-off'}
                    size={10}
                    color={i === 0 ? C.accent : C.textTertiary}
                  />
                  <Text style={[styles.logText, i === 0 && styles.logLatest]}>
                    {entry}
                  </Text>
                </View>
              ))
            )}
          </View>
          {log.length > 0 ? (
            <ActionButton
              title="Clear"
              onPress={() => setLog([])}
              variant="secondary"
              compact
            />
          ) : null}
        </View>

        {/* ── Code ─────────────────────────────────── */}
        <View style={styles.section}>
          <SectionLabel title="Code Reference" />
          <View style={styles.codeBlock}>
            <Text style={styles.codeLine}>{'const ref = useRef<FieldFormHandle>(null);'}</Text>
            <Text style={styles.codeLine}>{'ref.current?.focusNext(0);'}</Text>
            <Text style={styles.codeLine}>{'ref.current?.scrollInputIntoView(input);'}</Text>
            <Text style={styles.codeLine}>{'ref.current?.dismissKeyboard();'}</Text>
            <Text style={styles.codeComment}>{''}</Text>
            <Text style={styles.codeLine}>{'<FieldInput nextRef={targetRef} />'}</Text>
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

  section: {
    paddingHorizontal: ShowcaseSpacing.xl,
    gap: ShowcaseSpacing.md,
    marginBottom: ShowcaseSpacing.xxl,
  },
  toggleStack: {
    gap: ShowcaseSpacing.sm,
  },

  // Orphan
  orphanLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: C.warning,
    marginBottom: ShowcaseSpacing.sm,
    marginLeft: 2,
  },
  orphanInput: {
    fontSize: 16,
    color: C.textPrimary,
    backgroundColor: C.bgInput,
    borderRadius: ShowcaseRadius.md,
    borderWidth: 1,
    borderColor: C.warning + '40',
    borderStyle: 'dashed',
    paddingHorizontal: ShowcaseSpacing.lg,
    paddingVertical: 14,
  },

  // Target
  targetLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: ShowcaseSpacing.sm,
    marginLeft: 2,
  },
  targetLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: C.accent,
  },
  targetInput: {
    fontSize: 16,
    color: C.textPrimary,
    backgroundColor: C.bgInput,
    borderRadius: ShowcaseRadius.md,
    borderWidth: 1,
    borderColor: C.accent + '40',
    paddingHorizontal: ShowcaseSpacing.lg,
    paddingVertical: 14,
  },

  buttonGrid: {
    flexDirection: 'row',
    gap: ShowcaseSpacing.sm,
  },
  flex1: {
    flex: 1,
  },

  // Log
  logCard: {
    backgroundColor: C.bgInput,
    borderRadius: ShowcaseRadius.md,
    padding: ShowcaseSpacing.md,
    gap: 6,
  },
  logEmpty: {
    fontSize: 14,
    color: C.textTertiary,
    textAlign: 'center',
    paddingVertical: ShowcaseSpacing.lg,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShowcaseSpacing.sm,
  },
  logText: {
    fontSize: 13,
    color: C.textSecondary,
    ...Platform.select({
      ios: { fontFamily: 'ui-monospace' },
      default: { fontFamily: 'monospace' },
    }),
  },
  logLatest: {
    color: C.textPrimary,
    fontWeight: '600',
  },

  // Code
  codeBlock: {
    backgroundColor: C.bgInput,
    borderRadius: ShowcaseRadius.md,
    padding: ShowcaseSpacing.lg,
    gap: 3,
  },
  codeLine: {
    fontSize: 13,
    color: C.textPrimary,
    ...Platform.select({
      ios: { fontFamily: 'ui-monospace' },
      default: { fontFamily: 'monospace' },
    }),
  },
  codeComment: {
    fontSize: 13,
    color: C.textTertiary,
    ...Platform.select({
      ios: { fontFamily: 'ui-monospace' },
      default: { fontFamily: 'monospace' },
    }),
  },
});
