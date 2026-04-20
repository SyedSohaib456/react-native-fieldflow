import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import {
  FieldForm,
  FieldInput
} from '../../../packages/react-native-fieldflow/src';
import { ActionButton, IconButton } from '../../components/showcase';
import { ShowcaseColors as C, ShowcaseRadius, ShowcaseSpacing } from '../../constants/showcase-theme';

export default function SignupDemo() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleSubmit = () => {
    Alert.alert('Success', 'Sign up form submitted! Focus chain worked perfectly.');
  };

  const renderStepIndicator = () => (
    <View style={styles.indicatorContainer}>
      <View style={styles.stepsRow}>
        {[1, 2, 3, 4, 5].map((step, idx) => (
          <View
            key={step}
            style={[
              styles.stepCircle,
              activeIndex === idx && styles.stepCircleActive
            ]}
          >
            <Text style={[
              styles.stepText,
              activeIndex === idx && styles.stepTextActive
            ]}>{step}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.stepCounter}>Field {activeIndex + 1} of 5</Text>
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
        autofocusFirst
        onSubmit={handleSubmit}
        extraScrollPadding={140}
        keyboardVerticalOffset={0}
        scrollViewProps={{
          contentContainerStyle: styles.scrollContent,
          keyboardDismissMode: 'interactive',
        }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Demonstrating the zero-ref focus chain.</Text>
        </View>

        {renderStepIndicator()}

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Full Name</Text>
            <FieldInput
              placeholder="Jane Doe"
              textContentType="name"
              placeholderTextColor={styles.placeholderColor.color}
              onFocus={() => setActiveIndex(0)}
              style={[styles.input, activeIndex === 0 && styles.inputActive]}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email Address</Text>
            <FieldInput
              placeholder="jane@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={styles.placeholderColor.color}
              textContentType="emailAddress"
              onFocus={() => setActiveIndex(1)}
              style={[styles.input, activeIndex === 1 && styles.inputActive]}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Phone Number</Text>
            <FieldInput
              placeholder="+1 (555) 000-0000"
              keyboardType="phone-pad"
              placeholderTextColor={styles.placeholderColor.color}
              textContentType="telephoneNumber"
              onFocus={() => setActiveIndex(2)}
              style={[styles.input, activeIndex === 2 && styles.inputActive]}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <FieldInput
              placeholder="Choose a password"
              // secureTextEntry
              placeholderTextColor={styles.placeholderColor.color}
              // textContentType="newPassword"
              onFocus={() => setActiveIndex(3)}
              style={[styles.input, activeIndex === 3 && styles.inputActive]}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirm Password</Text>
            <FieldInput
              placeholder="Repeat password"
              // secureTextEntry
              placeholderTextColor={styles.placeholderColor.color}
              // textContentType="newPassword"
              onFocus={() => setActiveIndex(4)}
              style={[styles.input, activeIndex === 4 && styles.inputActive]}
            />
          </View>

          <ActionButton
            title="Create Account"
            onPress={handleSubmit}
            style={styles.submitButton}
          />

          <View style={styles.callout}>
            <Text style={styles.calloutTitle}>The Selling Point</Text>
            <Text style={styles.calloutText}>
              All 5 fields are chained automatically. No manual refs, no focus state wiring, just zero-config primitives.
            </Text>
          </View>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: ShowcaseSpacing.xl,
    paddingBottom: 40,
  },
  header: {
    marginBottom: ShowcaseSpacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: C.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: C.textSecondary,
    marginTop: ShowcaseSpacing.xs,
  },
  indicatorContainer: {
    backgroundColor: C.bgCard,
    borderRadius: ShowcaseRadius.lg,
    padding: ShowcaseSpacing.lg,
    marginBottom: ShowcaseSpacing.xl,
    alignItems: 'center',
    gap: ShowcaseSpacing.sm,
  },
  stepsRow: {
    flexDirection: 'row',
    gap: ShowcaseSpacing.sm,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  stepCircleActive: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.textSecondary,
  },
  stepTextActive: {
    color: '#FFF',
  },
  stepCounter: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  form: {
    gap: ShowcaseSpacing.lg,
  },
  inputWrapper: {
    gap: ShowcaseSpacing.xs,
  },
  label: {
    fontSize: 14,
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
  placeholderColor: {
    color: C.textSecondary,
  },
  inputActive: {
    borderColor: C.accent,
    backgroundColor: C.bgPrimary,
  },
  submitButton: {
    marginTop: ShowcaseSpacing.md,
    height: 56,
  },
  callout: {
    marginTop: ShowcaseSpacing.lg,
    padding: ShowcaseSpacing.lg,
    backgroundColor: C.accentLight,
    borderRadius: ShowcaseRadius.md,
    borderWidth: 1,
    borderColor: C.accentBorder,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.accent,
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 13,
    lineHeight: 18,
    color: C.textPrimary,
    opacity: 0.8,
  },
});
