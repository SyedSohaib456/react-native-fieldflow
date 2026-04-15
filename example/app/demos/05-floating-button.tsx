import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Platform, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  FieldForm, 
  FieldInput,
  useKeyboardHeight
} from '../../../packages/react-native-fieldflow/src';
import { ShowcaseColors as C, ShowcaseSpacing, ShowcaseRadius } from '../../constants/showcase-theme';
import { ActionButton, IconButton } from '../../components/showcase';

export default function FloatingButtonDemo() {
  const router = useRouter();
  const kbHeight = useKeyboardHeight();
  
  // Use Animated.Value to smoothly drive the button height
  const liftAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(liftAnim, {
      toValue: kbHeight,
      useNativeDriver: false, // height/margin doesn't support native driver
      friction: 8,
      tension: 40,
    }).start();
  }, [kbHeight]);

  const renderFakeRow = (i: number) => (
    <View key={i} style={styles.fakeRow}>
      <View style={styles.fakeIcon} />
      <View style={styles.fakeContent}>
        <View style={[styles.fakeLine, { width: '60%' }]} />
        <View style={[styles.fakeLine, { width: '40%' }]} />
      </View>
      <View style={styles.fakePrice} />
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

      <FieldForm 
        avoidKeyboard={false} // IMPORTANT: We are handling avoidance manually via hook
        extraScrollPadding={100}
        keyboardVerticalOffset={0}
        scrollViewProps={{
          contentContainerStyle: styles.scrollContent,
          keyboardDismissMode: 'interactive',
        }}
      >
        <View style={styles.header}>
            <Text style={styles.title}>Filter Results</Text>
            <Text style={styles.subtitle}>Lift UI elements manually using useKeyboardHeight().</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputRow}>
            <View style={{ flex: 2 }}>
              <Text style={styles.label}>City</Text>
              <FieldInput placeholder="San Francisco" style={styles.input} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Min $</Text>
              <FieldInput placeholder="0" keyboardType="number-pad" style={styles.input} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Max $</Text>
              <FieldInput placeholder="10k" keyboardType="number-pad" style={styles.input} />
            </View>
          </View>
        </View>

        <View style={styles.resultsList}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(renderFakeRow)}
        </View>
      </FieldForm>

      {/* This button lifts exactly above the keyboard */}
      <Animated.View style={[styles.footer, { marginBottom: liftAnim }]}>
        <View style={styles.footerContent}>
          <View style={styles.readout}>
            <Ionicons name="stats-chart" size={14} color={C.accent} />
            <Text style={styles.readoutText}>Keyboard height: {Math.round(kbHeight)}px</Text>
          </View>
          <ActionButton 
            title="Apply 8 Filters" 
            onPress={() => router.back()} 
            style={styles.applyButton}
          />
        </View>
      </Animated.View>
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
    paddingBottom: 150, // Space for the floating footer
  },
  header: {
    marginBottom: ShowcaseSpacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: C.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: C.textSecondary,
    marginTop: 4,
  },
  formCard: {
    backgroundColor: C.bgSecondary,
    padding: ShowcaseSpacing.lg,
    borderRadius: ShowcaseRadius.md,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: ShowcaseSpacing.xl,
  },
  inputRow: {
    flexDirection: 'row',
    gap: ShowcaseSpacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 4,
    marginLeft: 2,
  },
  input: {
    height: 44,
    backgroundColor: C.bgPrimary,
    borderRadius: ShowcaseRadius.sm,
    paddingHorizontal: ShowcaseSpacing.md,
    fontSize: 14,
    color: C.textPrimary,
    borderWidth: 1,
    borderColor: C.borderSubtle,
  },
  resultsList: {
    gap: ShowcaseSpacing.lg,
  },
  fakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShowcaseSpacing.md,
    paddingBottom: ShowcaseSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: C.borderSubtle,
  },
  fakeIcon: {
    width: 48,
    height: 48,
    borderRadius: ShowcaseRadius.sm,
    backgroundColor: C.bgCard,
  },
  fakeContent: {
    flex: 1,
    gap: 8,
  },
  fakeLine: {
    height: 12,
    backgroundColor: C.bgCard,
    borderRadius: 6,
  },
  fakePrice: {
    width: 60,
    height: 20,
    backgroundColor: C.accentLight,
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: ShowcaseSpacing.xl,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: 1,
    borderTopColor: C.borderSubtle,
  },
  footerContent: {
    gap: ShowcaseSpacing.md,
  },
  readout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  readoutText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.textTertiary,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  applyButton: {
    height: 56,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
