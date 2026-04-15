import React from 'react';
import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  FieldForm, 
  FieldInput 
} from '../../../packages/react-native-fieldflow/src';
import { ShowcaseColors as C, ShowcaseSpacing, ShowcaseRadius } from '../../constants/showcase-theme';
import { IconButton } from '../../components/showcase';

export default function ReactNavigationDemo() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 
        Custom header simulation.
        We still use Stack.Screen to hide the layout's default header 
        if we want a fully custom experience, but for this demo 
        we'll just use the layout's header for consistency.
      */}
      <Stack.Screen 
        options={{ 
          headerLeft: () => (
            <IconButton 
              icon="chevron-back" 
              onPress={() => router.back()} 
              color="#FFF"
              backgroundColor={C.accent}
            />
          ),
          headerStyle: { backgroundColor: C.accent },
          headerTintColor: '#FFF',
        }} 
      />

      <FieldForm 
        extraScrollPadding={100}
        keyboardVerticalOffset={0}
        scrollViewProps={{
          contentContainerStyle: styles.scrollContent,
          keyboardDismissMode: 'interactive',
        }}
      >
        <View style={styles.infoBanner}>
            <Ionicons name="checkmark-circle" size={20} color={C.accent} />
            <View style={{ flex: 1 }}>
                <Text style={styles.infoTitle}>Automatic Measurement</Text>
                <Text style={styles.infoText}>
                    FieldFlow measures the <Text style={styles.bold}>usable window height</Text> instead of screen height. 
                    It automatically detects the space taken by this header.
                </Text>
            </View>
        </View>

        <View style={styles.form}>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Street Address</Text>
                <FieldInput placeholder="123 Infinite Loop" style={styles.input} />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>City</Text>
                <FieldInput placeholder="Cupertino" style={styles.input} />
            </View>
            <View style={styles.row}>
                <View style={[styles.inputWrapper, { flex: 2 }]}>
                    <Text style={styles.label}>State / Province</Text>
                    <FieldInput placeholder="CA" style={styles.input} />
                </View>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                    <Text style={styles.label}>Zip</Text>
                    <FieldInput placeholder="95014" keyboardType="number-pad" style={styles.input} />
                </View>
            </View>

            <TouchableOpacity style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Update Shipping Address</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.comparisonBox}>
            <Text style={styles.compLabel}>The Old Way (Manual Offsets):</Text>
            <View style={styles.crossedOut}>
                <Text style={styles.monospace}>
                    {`behavior={Platform.OS === 'ios' ? 'padding' : 'height'} \nkeyboardVerticalOffset={64}`}
                </Text>
            </View>
            <View style={styles.arrowRow}>
                <Ionicons name="arrow-down" size={16} color={C.textTertiary} />
                <Text style={styles.becomesText}>Becomes</Text>
            </View>
            <View style={styles.newWay}>
                <Text style={styles.monospaceGreen}>
                    {`<FieldForm> ... </FieldForm>`}
                </Text>
            </View>
            <Text style={styles.compFooter}>Zero manual math. Zero platform-conditional offsets.</Text>
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
  scrollContent: {
    padding: ShowcaseSpacing.xl,
    paddingTop: ShowcaseSpacing.xxl,
    paddingBottom: 40,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: C.accentLight,
    padding: ShowcaseSpacing.lg,
    borderRadius: ShowcaseRadius.md,
    gap: ShowcaseSpacing.md,
    marginBottom: ShowcaseSpacing.xxl,
    borderWidth: 1,
    borderColor: C.accentBorder,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.accent,
    marginBottom: 2,
  },
  infoText: {
    fontSize: 13,
    color: C.textPrimary,
    lineHeight: 18,
    opacity: 0.8,
  },
  form: {
    gap: ShowcaseSpacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: ShowcaseSpacing.md,
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
  comparisonBox: {
    marginTop: ShowcaseSpacing.xxxl,
    padding: ShowcaseSpacing.lg,
    backgroundColor: C.bgSecondary,
    borderRadius: ShowcaseRadius.lg,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  compLabel: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '700',
    color: C.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: ShowcaseSpacing.lg,
  },
  crossedOut: {
    backgroundColor: C.bgCard,
    padding: 12,
    borderRadius: 8,
    opacity: 0.5,
  },
  monospace: {
    fontSize: 11,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: C.danger,
    textDecorationLine: 'line-through',
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 12,
  },
  becomesText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textTertiary,
    textTransform: 'uppercase',
  },
  newWay: {
    backgroundColor: C.accentLight,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.accentBorder,
  },
  monospaceGreen: {
    fontSize: 11,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: C.accent,
    fontWeight: '700',
  },
  compFooter: {
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  bold: {
    fontWeight: '700',
  },
});
