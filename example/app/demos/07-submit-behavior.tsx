import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  FieldForm, 
  FieldInput 
} from '../../../packages/react-native-fieldflow/src';
import { ShowcaseColors as C, ShowcaseSpacing, ShowcaseRadius } from '../../constants/showcase-theme';
import { ActionButton, IconButton } from '../../components/showcase';

export default function SubmitBehaviorDemo() {
  const router = useRouter();
  const [autoSubmit, setAutoSubmit] = useState(false);
  const [logs, setLogs] = useState<{ id: string, type: string, time: string }[]>([]);

  const handleFormSubmit = useCallback((type: 'button' | 'done-key') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [{ id: Math.random().toString(), type, time }, ...prev].slice(0, 5));
  }, []);

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

      <View style={styles.controlPanel}>
        <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Submit on Done key</Text>
                <Text style={styles.switchSubtitle}>Automatically triggers onSubmit on last field.</Text>
            </View>
            <Switch 
                value={autoSubmit} 
                onValueChange={setAutoSubmit} 
                trackColor={{ false: C.border, true: C.accent }}
            />
        </View>
      </View>

      <FieldForm 
        submitOnLastFieldDone={autoSubmit}
        onSubmit={() => handleFormSubmit('done-key')}
        extraScrollPadding={100}
        keyboardVerticalOffset={0}
        scrollViewProps={{
          contentContainerStyle: styles.scrollContent,
          keyboardDismissMode: 'interactive',
        }}
      >
        <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Full Name</Text>
                <FieldInput placeholder="John Doe" style={styles.input} />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Email Address</Text>
                <FieldInput placeholder="john@example.com" keyboardType="email-address" style={styles.input} />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Message</Text>
                <FieldInput 
                    placeholder="Tell us more..." 
                    multiline 
                    style={styles.multilineInput} 
                    // Note: onFormSubmit on individual inputs overrides form-level behavior
                    // but for this demo we're using the form-level submitOnLastFieldDone prop.
                />
            </View>

            <ActionButton 
                title="Submit form" 
                onPress={() => handleFormSubmit('button')} 
                style={styles.submitBtn}
            />
        </View>

        <View style={styles.logSection}>
            <Text style={styles.logTitle}>Submission Log</Text>
            <View style={styles.logBox}>
                {logs.length === 0 ? (
                    <Text style={styles.emptyLog}>No submissions yet.</Text>
                ) : (
                    logs.map(log => (
                        <View key={log.id} style={styles.logRow}>
                            <Ionicons 
                                name={log.type === 'done-key' ? 'keypad-outline' : 'send-outline'} 
                                size={14} 
                                color={C.accent} 
                            />
                            <Text style={styles.logTime}>{log.time}</Text>
                            <Text style={styles.logDesc}>
                                Submitted via <Text style={styles.bold}>{log.type === 'done-key' ? 'Done key' : 'Button tap'}</Text>
                            </Text>
                        </View>
                    ))
                )}
            </View>
        </View>

        <View style={styles.usageNote}>
            <Text style={styles.usageText}>
                <Text style={styles.bold}>Pro Tip:</Text> Use <Text style={styles.monospace}>submitOnLastFieldDone</Text> to provide a seamless &quot;one-tap&quot; finish for short forms. For longer multiline fields, keep it disabled to avoid accidental submissions.
            </Text>
        </View>
      </FieldForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bgPrimary,
  },
  controlPanel: {
    padding: ShowcaseSpacing.xl,
    backgroundColor: C.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: C.borderSubtle,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShowcaseSpacing.md,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.textPrimary,
  },
  switchSubtitle: {
    fontSize: 13,
    color: C.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: ShowcaseSpacing.xl,
    paddingBottom: 40,
  },
  formContainer: {
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
    backgroundColor: C.bgSecondary,
    borderRadius: ShowcaseRadius.md,
    paddingHorizontal: ShowcaseSpacing.lg,
    fontSize: 16,
    color: C.textPrimary,
    borderWidth: 1,
    borderColor: C.borderSubtle,
  },
  multilineInput: {
    minHeight: 120,
    backgroundColor: C.bgSecondary,
    borderRadius: ShowcaseRadius.md,
    paddingHorizontal: ShowcaseSpacing.lg,
    paddingVertical: ShowcaseSpacing.md,
    fontSize: 16,
    color: C.textPrimary,
    borderWidth: 1,
    borderColor: C.borderSubtle,
    textAlignVertical: 'top',
  },
  submitBtn: {
    height: 56,
    marginTop: ShowcaseSpacing.md,
  },
  logSection: {
    marginTop: ShowcaseSpacing.xxl,
    gap: ShowcaseSpacing.sm,
  },
  logTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  logBox: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: ShowcaseRadius.lg,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  emptyLog: {
    padding: ShowcaseSpacing.xxl,
    textAlign: 'center',
    color: C.textTertiary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShowcaseSpacing.md,
    padding: ShowcaseSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: C.borderSubtle,
  },
  logTime: {
    fontSize: 12,
    color: C.textTertiary,
    width: 65,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  logDesc: {
    fontSize: 13,
    color: C.textSecondary,
  },
  bold: {
    fontWeight: '700',
    color: C.textPrimary,
  },
  monospace: {
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    backgroundColor: C.bgCard,
    fontSize: 12,
  },
  usageNote: {
    marginTop: ShowcaseSpacing.xl,
    padding: ShowcaseSpacing.lg,
    backgroundColor: C.accentLight,
    borderRadius: ShowcaseRadius.md,
  },
  usageText: {
    fontSize: 13,
    lineHeight: 19,
    color: C.textPrimary,
    opacity: 0.8,
  },
});
