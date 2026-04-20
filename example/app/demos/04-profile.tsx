import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { forwardRef, useRef } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  FieldForm,
  FieldInput
} from '../../../packages/react-native-fieldflow/src';
import { IconButton } from '../../components/showcase';
import { ShowcaseColors as C, ShowcaseRadius, ShowcaseSpacing } from '../../constants/showcase-theme';

/**
 * Reusable LabeledInput component using forwardRef.
 * Making it forwardRef compatible ensures it works seamlessly 
 * with FieldForm's internal registration and nextRef logic.
 */
const LabeledInput = forwardRef<TextInput, any>(({ label, style, ...props }, ref) => (
  <View style={[styles.labeledInputWrapper, style]}>
    <Text style={styles.label}>{label}</Text>
    <FieldInput
      ref={ref}
      style={styles.fieldInput}
      placeholderTextColor={C.textTertiary}
      {...props}
    />
  </View>
));

LabeledInput.displayName = 'LabeledInput';

export default function ProfileDemo() {
  const router = useRouter();

  // Create a ref for the Username field to demonstrate nextRef override.
  const usernameRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
              <Text style={styles.doneText}>Save</Text>
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <IconButton
              icon="close"
              onPress={() => router.back()}
              color={C.textPrimary}
            />
          ),
        }}
      />

      <FieldForm
        autofocusFirst
        extraScrollPadding={100}
        keyboardVerticalOffset={0}
        scrollViewProps={{
          contentContainerStyle: styles.scrollContent,
          keyboardDismissMode: 'interactive',
        }}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color={C.textTertiary} />
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={12} color="#FFF" />
            </View>
          </View>
          <Text style={styles.changePhotoText}>Change Profile Photo</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <LabeledInput
              label="First Name"
              placeholder="Zuck"
              style={{ flex: 1 }}
              nextRef={usernameRef} // OVERRIDE: Focus Username after this field
            />
            <LabeledInput
              label="Last Name"
              placeholder="Berg"
              style={{ flex: 1 }}
            />
          </View>

          <View style={styles.annotation}>
            <Ionicons name="git-branch-outline" size={14} color={C.accent} />
            <Text style={styles.annotationText}>
              nextRef skips Last Name in the focus chain — fill it freely without Next/Done pressure.
            </Text>
          </View>

          <LabeledInput
            ref={usernameRef}
            label="Username"
            placeholder="zuck_official"
            autoCapitalize="none"
          />

          <LabeledInput
            label="Bio"
            placeholder="Building the future..."
            multiline
            numberOfLines={3}
            skip // EXCLUDE from focus chain entirely
            style={styles.bioWrapper}
          />
          <Text style={styles.bioNote}>Bio is skipped from focus chain for free typing.</Text>

          <LabeledInput
            label="Website"
            placeholder="https://meta.com"
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.spacer} />
      </FieldForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bgPrimary,
  },
  doneText: {
    fontSize: 16,
    fontWeight: '700',
    color: C.accent,
    marginRight: 8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  avatarSection: {
    paddingVertical: ShowcaseSpacing.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: C.borderSubtle,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: C.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ShowcaseSpacing.sm,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: C.bgPrimary,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.accent,
  },
  section: {
    padding: ShowcaseSpacing.xl,
    gap: ShowcaseSpacing.xl,
  },
  row: {
    flexDirection: 'row',
    gap: ShowcaseSpacing.lg,
  },
  labeledInputWrapper: {
    gap: ShowcaseSpacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textTertiary,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldInput: {
    height: 48,
    fontSize: 16,
    color: C.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingVertical: 8,
  },
  bioWrapper: {
    marginTop: 8,
  },
  bioNote: {
    fontSize: 12,
    color: C.textTertiary,
    marginTop: -ShowcaseSpacing.lg,
    marginLeft: 4,
  },
  annotation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShowcaseSpacing.sm,
    backgroundColor: C.accentLight,
    padding: ShowcaseSpacing.md,
    borderRadius: ShowcaseRadius.md,
    marginTop: -ShowcaseSpacing.md,
  },
  annotationText: {
    flex: 1,
    fontSize: 12,
    color: C.accent,
    fontWeight: '500',
  },
  spacer: {
    height: 100,
  },
});
