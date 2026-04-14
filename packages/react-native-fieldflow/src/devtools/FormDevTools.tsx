/**
 * FormDevTools — DEV-only floating overlay for debugging form state.
 * Tree-shaken in production builds.
 */

import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useFieldFlowContext } from '../core/FormContext';
import { useKeyboardHeight } from '../keyboard/hooks';

// ─── No-op in production ─────────────────────────────────────────────────────

function DevToolsNoop() {
  return null;
}

// ─── DEV implementation ──────────────────────────────────────────────────────

function DevToolsImpl() {
  const ctx = useFieldFlowContext();
  const keyboardHeight = useKeyboardHeight();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((p) => !p), []);

  if (!ctx) {
    return (
      <TouchableOpacity style={styles.fab} onPress={toggle}>
        <Text style={styles.fabText}>🔧</Text>
      </TouchableOpacity>
    );
  }

  const state = ctx.store.getState();

  if (!isOpen) {
    return (
      <TouchableOpacity style={styles.fab} onPress={toggle} accessibilityLabel="Open DevTools">
        <Text style={styles.fabText}>🔧</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.header}>
        <Text style={styles.title}>⚡ FieldFlow DevTools</Text>
        <TouchableOpacity onPress={toggle}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Focus Chain */}
        <Text style={styles.sectionTitle}>Focus Chain ({state.fields.length})</Text>
        {state.fields.map((f, i) => (
          <View key={f.name} style={[styles.chainItem, f.name === state.focusedField && styles.chainItemActive]}>
            <Text style={styles.chainIndex}>{i}</Text>
            <Text style={[styles.chainName, f.name === state.focusedField && styles.chainNameActive]}>
              {f.name}
            </Text>
            <Text style={styles.chainType}>{f.type}</Text>
          </View>
        ))}

        {/* Values */}
        <Text style={styles.sectionTitle}>Values</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>
            {JSON.stringify(state.values, null, 2)}
          </Text>
        </View>

        {/* Errors */}
        {Object.keys(state.errors).length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Errors</Text>
            {Object.entries(state.errors).map(([name, err]) => (
              <View key={name} style={styles.errorItem}>
                <Text style={styles.errorName}>{name}</Text>
                <Text style={styles.errorMsg}>{err}</Text>
              </View>
            ))}
          </>
        ) : null}

        {/* Keyboard */}
        <Text style={styles.sectionTitle}>Keyboard</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Height:</Text>
          <Text style={styles.statusValue}>{keyboardHeight}px</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Visible:</Text>
          <Text style={styles.statusValue}>{keyboardHeight > 0 ? '✅' : '❌'}</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Focused:</Text>
          <Text style={styles.statusValue}>{state.focusedField ?? 'none'}</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Dirty:</Text>
          <Text style={styles.statusValue}>{state.isDirty ? '✅' : '❌'}</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Submitting:</Text>
          <Text style={styles.statusValue}>{state.isSubmitting ? '⏳' : '❌'}</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Submits:</Text>
          <Text style={styles.statusValue}>{state.submitCount}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

/**
 * FormDevTools — floating overlay that shows live form state.
 * Automatically excluded from production builds via __DEV__ check.
 */
export const FormDevTools = __DEV__ ? DevToolsImpl : DevToolsNoop;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  fabText: { fontSize: 20 },
  overlay: {
    position: 'absolute',
    bottom: 60,
    right: 12,
    left: 12,
    maxHeight: 400,
    backgroundColor: '#111827',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
    zIndex: 9999,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  title: { color: '#F9FAFB', fontSize: 15, fontWeight: '700' },
  close: { color: '#9CA3AF', fontSize: 18, fontWeight: '700', padding: 4 },
  content: { padding: 16 },
  sectionTitle: {
    color: '#6366F1',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 6,
  },
  chainItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  chainItemActive: { backgroundColor: '#312E81' },
  chainIndex: { color: '#6B7280', fontSize: 11, fontWeight: '600', width: 16 },
  chainName: { color: '#D1D5DB', fontSize: 13, fontWeight: '500', flex: 1, fontFamily: 'monospace' },
  chainNameActive: { color: '#A5B4FC' },
  chainType: { color: '#6B7280', fontSize: 11 },
  codeBlock: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 10,
    marginBottom: 4,
  },
  codeText: {
    color: '#D1D5DB',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  errorItem: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 3,
  },
  errorName: { color: '#FCA5A5', fontSize: 12, fontWeight: '600', fontFamily: 'monospace' },
  errorMsg: { color: '#F87171', fontSize: 12 },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  statusLabel: { color: '#9CA3AF', fontSize: 13 },
  statusValue: { color: '#D1D5DB', fontSize: 13, fontWeight: '600' },
});
