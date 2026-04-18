import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  FieldForm,
  FieldInput,
  useKeyboardVisible
} from '../../../packages/react-native-fieldflow/src';
import { IconButton } from '../../components/showcase';
import { ShowcaseColors as C, ShowcaseRadius, ShowcaseSpacing } from '../../constants/showcase-theme';

export default function CollapsingHeaderDemo() {
  const router = useRouter();
  const isKeyboardVisible = useKeyboardVisible();

  // Header animation values
  const headerAnim = useRef(new Animated.Value(1)).current; // 1 = visible, 0 = hidden

  // Event logs state
  const [logs, setLogs] = useState<{ id: string, msg: string, time: string }[]>([]);

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: isKeyboardVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: false, // animating height
    }).start();
  }, [isKeyboardVisible]);

  const addLog = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [{ id: Math.random().toString(), msg, time }, ...prev].slice(0, 3));
  }, []);

  const headerHeight = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 160],
  });

  const headerOpacity = headerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <IconButton icon="chevron-back" onPress={() => router.back()} />
          ),
        }}
      />

      <FieldForm
        onKeyboardShow={(p) => addLog(`Keyboard shown at ${Math.round(p.height)}px`)}
        onKeyboardHide={() => addLog('Keyboard hidden')}
        extraScrollPadding={100}
        keyboardVerticalOffset={0}
        scrollViewProps={{
          contentContainerStyle: styles.scrollContent,
          keyboardDismissMode: 'interactive',
        }}
      >
        <Animated.View style={[styles.header, { height: headerHeight, opacity: headerOpacity }]}>
          <View style={styles.illustration}>
            <Ionicons name="shield-checkmark" size={60} color={C.accent} />
          </View>
          <Text style={styles.title}>Secure Access</Text>
          <Text style={styles.subtitle}>Header collapses when you start typing.</Text>
        </Animated.View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email Address</Text>
            <FieldInput placeholder="user@example.com" style={styles.input} />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <FieldInput placeholder="••••••••" secureTextEntry style={styles.input} />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>2FA Code</Text>
            <FieldInput
              placeholder="000000"
              keyboardType="number-pad"
              maxLength={6}
              style={styles.input}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Verify Identity</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.logSection}>
          <Text style={styles.logHeader}>Event Listeners:</Text>
          <View style={styles.logBox}>
            {logs.length === 0 ? (
              <Text style={styles.emptyLog}>No events yet. Try opening the keyboard.</Text>
            ) : (
              logs.map(log => (
                <View key={log.id} style={styles.logRow}>
                  <Text style={styles.logTime}>{log.time}</Text>
                  <Text style={styles.logMsg}>{log.msg}</Text>
                </View>
              ))
            )}
          </View>
        </View> */}
      </FieldForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bgPrimary,
  },
  scrollContent: {
    padding: ShowcaseSpacing.xl,
    paddingTop: Platform.OS === 'ios' ? 100 : 110,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  illustration: {
    width: 90,
    height: 90,
    borderRadius: ShowcaseRadius.lg,
    backgroundColor: C.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ShowcaseSpacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: C.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: C.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  form: {
    paddingTop: ShowcaseSpacing.xl,
    gap: ShowcaseSpacing.lg,
  },
  inputWrapper: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textSecondary,
    marginLeft: 4,
  },
  input: {
    height: 52,
    backgroundColor: C.bgCard,
    borderRadius: ShowcaseRadius.md,
    paddingHorizontal: ShowcaseSpacing.lg,
    fontSize: 16,
    color: C.textPrimary,
    borderWidth: 1,
    borderColor: C.border,
  },
  submitBtn: {
    height: 56,
    backgroundColor: C.accent,
    borderRadius: ShowcaseRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ShowcaseSpacing.md,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  logSection: {
    marginTop: ShowcaseSpacing.xxl,
    gap: ShowcaseSpacing.sm,
  },
  logHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  logBox: {
    backgroundColor: C.bgSecondary,
    borderRadius: ShowcaseRadius.md,
    padding: ShowcaseSpacing.md,
    borderWidth: 1,
    borderColor: C.borderSubtle,
    minHeight: 100,
  },
  emptyLog: {
    fontSize: 13,
    color: C.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  logRow: {
    flexDirection: 'row',
    gap: ShowcaseSpacing.md,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  logTime: {
    fontSize: 11,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: C.accent,
    width: 70,
  },
  logMsg: {
    flex: 1,
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: C.textSecondary,
  },
});
