/**
 * Hooks Screen — Keyboard State Demo
 *
 * Live metrics for all keyboard hooks plus imperative subscription log.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  dismissKeyboard,
  FieldForm,
  subscribeKeyboard,
  useKeyboardHeight,
  useKeyboardState,
  useKeyboardVisible,
} from '../../../packages/react-native-fieldflow/src';
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

export default function HooksScreen() {
  const insets = useSafeAreaInsets();

  const height = useKeyboardHeight();
  const visible = useKeyboardVisible();
  const state = useKeyboardState();

  // ── Toggle which hooks are "shown" ──────────────────
  const [showHeight, setShowHeight] = useState(true);
  const [showVisible, setShowVisible] = useState(true);
  const [showState, setShowState] = useState(true);
  const [showSubscribe, setShowSubscribe] = useState(true);

  // ── Imperative subscription ─────────────────────────
  const [events, setEvents] = useState<string[]>([]);
  const countRef = useRef(0);

  useEffect(() => {
    if (!showSubscribe) return;
    const unsub = subscribeKeyboard(
      ({ height: h }) => {
        countRef.current += 1;
        setEvents(prev => [
          `#${countRef.current} show → ${Math.round(h)}px`,
          ...prev.slice(0, 7),
        ]);
      },
      () => {
        countRef.current += 1;
        setEvents(prev => [
          `#${countRef.current} hide`,
          ...prev.slice(0, 7),
        ]);
      },
    );
    return unsub;
  }, [showSubscribe]);

  // ── Animated bar ────────────────────────────────────
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: height,
      useNativeDriver: false,
      tension: 100,
      friction: 14,
    }).start();
  }, [height, animValue]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <FieldForm
        extraScrollPadding={100}
        keyboardVerticalOffset={0}
        scrollViewProps={{
          contentContainerStyle: styles.scrollContent,
          keyboardDismissMode: 'interactive',
        }}>

        {/* ── Header ───────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.title}>Hooks & State</Text>
          <Text style={styles.subtitle}>
            Tap the input below to see hook values update in real-time.
          </Text>
        </View>

        {/* ── Hook Toggles ─────────────────────────── */}
        <View style={styles.section}>
          <SectionLabel title="Active Hooks" description="Toggle to enable / disable each hook" />
          <View style={styles.toggleStack}>
            <FeatureCard
              icon="analytics-outline"
              title="useKeyboardHeight"
              description="Returns keyboard height in px"
              toggleValue={showHeight}
              onToggle={setShowHeight}
            />
            <FeatureCard
              icon="eye-outline"
              title="useKeyboardVisible"
              description="Returns boolean visibility"
              toggleValue={showVisible}
              onToggle={setShowVisible}
            />
            <FeatureCard
              icon="git-merge-outline"
              title="useKeyboardState"
              description="Combined { height, visible }"
              toggleValue={showState}
              onToggle={setShowState}
            />
            <FeatureCard
              icon="notifications-outline"
              title="subscribeKeyboard"
              description="Imperative event subscription"
              toggleValue={showSubscribe}
              onToggle={setShowSubscribe}
            />
          </View>
        </View>

        {/* ── Metrics ──────────────────────────────── */}
        <View style={styles.section}>
          <SectionLabel title="Live Values" />
          <View style={styles.metricsCard}>
            {showHeight ? (
              <View style={styles.metricRow}>
                <View style={styles.metricLeft}>
                  <Ionicons name="analytics-outline" size={16} color={C.textTertiary} />
                  <Text style={styles.metricLabel}>Height</Text>
                </View>
                <View style={styles.metricRight}>
                  <Text style={styles.metricValue}>{Math.round(height)}</Text>
                  <Text style={styles.metricUnit}>px</Text>
                </View>
              </View>
            ) : null}

            {showHeight && showVisible ? <View style={styles.metricSep} /> : null}

            {showVisible ? (
              <View style={styles.metricRow}>
                <View style={styles.metricLeft}>
                  <Ionicons name="eye-outline" size={16} color={C.textTertiary} />
                  <Text style={styles.metricLabel}>Visible</Text>
                </View>
                <View style={styles.boolRow}>
                  <View style={[styles.boolDot, visible && styles.boolDotActive]} />
                  <Text style={[styles.metricValue, visible && styles.valueActive]}>
                    {visible ? 'true' : 'false'}
                  </Text>
                </View>
              </View>
            ) : null}

            {showVisible && showState ? <View style={styles.metricSep} /> : null}

            {showState ? (
              <View style={styles.metricRow}>
                <View style={styles.metricLeft}>
                  <Ionicons name="git-merge-outline" size={16} color={C.textTertiary} />
                  <Text style={styles.metricLabel}>State</Text>
                </View>
                <View style={styles.pillRow}>
                  <StatusPill label="h" value={`${Math.round(state.height)}`} active={state.height > 0} />
                  <StatusPill label="v" value={state.visible ? 'T' : 'F'} active={state.visible} />
                </View>
              </View>
            ) : null}

            {!showHeight && !showVisible && !showState ? (
              <Text style={styles.emptyMetric}>Enable a hook above to see values</Text>
            ) : null}
          </View>
        </View>

        {/* ── Height Bar ───────────────────────────── */}
        {showHeight ? (
          <View style={styles.section}>
            <SectionLabel title="Height Visualizer" />
            <View style={styles.barContainer}>
              <Animated.View
                style={[
                  styles.barFill,
                  {
                    width: animValue.interpolate({
                      inputRange: [0, 400],
                      outputRange: ['0%', '100%'],
                      extrapolate: 'clamp',
                    }),
                  },
                ]}
              />
              <Text style={styles.barLabel}>{Math.round(height)} / ~400</Text>
            </View>
          </View>
        ) : null}

        {/* ── Trigger Input ────────────────────────── */}
        <View style={styles.section}>
          <SectionLabel title="Trigger" description="Focus to activate hooks" />
          <StyledInput
            icon="chatbubble-outline"
            placeholder="Tap here to open keyboard..."
            plain
          />
          <ActionButton
            title="dismissKeyboard()"
            onPress={dismissKeyboard}
            variant="outline"
          />
        </View>

        {/* ── Event Log ────────────────────────────── */}
        {showSubscribe ? (
          <View style={styles.section}>
            <SectionLabel title="Event Log" description="subscribeKeyboard output" />
            <View style={styles.logCard}>
              {events.length === 0 ? (
                <Text style={styles.logEmpty}>No events yet</Text>
              ) : (
                events.map((event, i) => (
                  <Text
                    key={`${event}-${i}`}
                    style={[styles.logLine, i === 0 && styles.logLatest]}>
                    {event}
                  </Text>
                ))
              )}
            </View>
            {events.length > 0 ? (
              <ActionButton
                title="Clear"
                onPress={() => { setEvents([]); countRef.current = 0; }}
                variant="secondary"
                compact
              />
            ) : null}
          </View>
        ) : null}
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

  // Metrics
  metricsCard: {
    borderRadius: ShowcaseRadius.md,
    borderWidth: 1,
    borderColor: C.border,
    padding: ShowcaseSpacing.lg,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ShowcaseSpacing.xs,
  },
  metricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShowcaseSpacing.sm,
  },
  metricRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: C.textSecondary,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: C.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  metricUnit: {
    fontSize: 13,
    color: C.textTertiary,
    fontWeight: '500',
  },
  valueActive: {
    color: C.accent,
  },
  metricSep: {
    height: 1,
    backgroundColor: C.borderSubtle,
    marginVertical: 6,
  },
  boolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShowcaseSpacing.sm,
  },
  boolDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.textTertiary,
  },
  boolDotActive: {
    backgroundColor: C.accent,
  },
  pillRow: {
    flexDirection: 'row',
    gap: ShowcaseSpacing.xs,
  },
  emptyMetric: {
    fontSize: 14,
    color: C.textTertiary,
    textAlign: 'center',
    paddingVertical: ShowcaseSpacing.lg,
  },

  // Bar
  barContainer: {
    height: 36,
    backgroundColor: C.bgInput,
    borderRadius: ShowcaseRadius.sm,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  barFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: C.accentLight,
    borderRadius: ShowcaseRadius.sm,
  },
  barLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: C.textSecondary,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },

  // Log
  logCard: {
    backgroundColor: C.bgInput,
    borderRadius: ShowcaseRadius.md,
    padding: ShowcaseSpacing.md,
    gap: 4,
    maxHeight: 240,
  },
  logEmpty: {
    fontSize: 14,
    color: C.textTertiary,
    textAlign: 'center',
    paddingVertical: ShowcaseSpacing.lg,
  },
  logLine: {
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
});
