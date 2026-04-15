import React from 'react';
import { StyleSheet, Text, View, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  FieldForm, 
  FieldInput 
} from '../../../packages/react-native-fieldflow/src';
import { ShowcaseColors as C, ShowcaseSpacing, ShowcaseRadius } from '../../constants/showcase-theme';
import { ActionButton, IconButton } from '../../components/showcase';

export default function LoginDemo() {
  const router = useRouter();

  const handleSubmit = () => {
    Alert.alert('Success', 'Login form submitted!');
  };

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
        onSubmit={handleSubmit}
        extraScrollPadding={100}
        keyboardVerticalOffset={0}
        scrollViewProps={{
          contentContainerStyle: styles.scrollContent,
          keyboardDismissMode: 'interactive',
        }}
      >
        <View style={styles.header}>
            <View style={styles.iconCircle}>
                <Ionicons name="lock-closed" size={32} color={C.accent} />
            </View>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>The smallest possible working form.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email Address</Text>
            <FieldInput 
              placeholder="john@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
              style={styles.input}
              placeholderTextColor={C.textTertiary}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <FieldInput 
              placeholder="••••••••"
              secureTextEntry
              textContentType="password"
              style={styles.input}
              placeholderTextColor={C.textTertiary}
            />
          </View>

          <ActionButton 
            title="Sign in" 
            onPress={handleSubmit} 
            style={styles.submitButton}
          />

          <View style={styles.annotation}>
            <Ionicons name="sparkles" size={14} color={C.accent} />
            <Text style={styles.annotationText}>
              ↑ returnKeyType, blurOnSubmit, focus chain, keyboard avoidance — all automatic.
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
    backgroundColor: C.bgSecondary,
  },
  scrollContent: {
    padding: ShowcaseSpacing.xl,
    paddingTop: ShowcaseSpacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: ShowcaseSpacing.xxxl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ShowcaseSpacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: ShowcaseSpacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: C.textSecondary,
    textAlign: 'center',
  },
  form: {
    gap: ShowcaseSpacing.xl,
  },
  inputWrapper: {
    gap: ShowcaseSpacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: C.textSecondary,
    marginLeft: 4,
  },
  input: {
    height: 56,
    backgroundColor: C.bgCard,
    borderRadius: ShowcaseRadius.md,
    paddingHorizontal: ShowcaseSpacing.lg,
    fontSize: 16,
    color: C.textPrimary,
    borderWidth: 1,
    borderColor: C.border,
  },
  submitButton: {
    marginTop: ShowcaseSpacing.md,
    height: 56,
  },
  annotation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ShowcaseSpacing.sm,
    backgroundColor: C.bgSecondary,
    padding: ShowcaseSpacing.md,
    borderRadius: ShowcaseRadius.md,
    marginTop: ShowcaseSpacing.md,
    borderWidth: 1,
    borderColor: C.border,
  },
  annotationText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: C.textSecondary,
    fontStyle: 'italic',
  },
});
