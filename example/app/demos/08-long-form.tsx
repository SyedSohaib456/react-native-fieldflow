import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Switch, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  FieldForm, 
  FieldInput 
} from '../../../packages/react-native-fieldflow/src';
import { ShowcaseColors as C, ShowcaseSpacing, ShowcaseRadius } from '../../constants/showcase-theme';
import { ActionButton, IconButton } from '../../components/showcase';

export default function LongFormDemo() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [scrollable, setScrollEnabled] = useState(true);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
        setRefreshing(false);
        Alert.alert('Refreshed', 'Draft reloaded successfully.');
    }, 1500);
  }, []);

  const handleSubmit = () => {
    Alert.alert('Application Sent', 'Good luck with your application!');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerRight: () => (
            <View style={[styles.badge, { marginRight: 16 }]}>
                <Text style={styles.badgeText}>8 fields · 0 refs</Text>
            </View>
          ),
          headerLeft: () => (
            <IconButton 
              icon="chevron-back" 
              onPress={() => router.back()} 
            />
          ),
        }} 
      />

      <View style={styles.configBar}>
        <View style={styles.configItem}>
            <Text style={styles.configLabel}>Enable Internal Scroll</Text>
            <Switch 
                value={scrollable} 
                onValueChange={setScrollEnabled}
                trackColor={{ false: C.border, true: C.accent }}
            />
        </View>
        <Text style={styles.configNote}>
             {scrollable ? 'Using FieldFlow’s managed ScrollView.' : 'Form is now a flat View — fits in parent scroll.'}
        </Text>
      </View>

      <FieldForm 
        scrollable={scrollable}
        extraScrollPadding={100}
        keyboardVerticalOffset={0}
        scrollViewProps={{
          contentContainerStyle: styles.scrollContent,
          keyboardDismissMode: 'interactive',
          refreshControl: (
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                tintColor={C.accent} 
                colors={[C.accent]}
            />
          )
        }}
      >
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Full Name</Text>
                <FieldInput placeholder="Alice Wonderland" style={styles.input} />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Email Address</Text>
                <FieldInput placeholder="alice@example.com" keyboardType="email-address" style={styles.input} />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Phone Number</Text>
                <FieldInput placeholder="+1 555-0199" keyboardType="phone-pad" style={styles.input} />
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Links</Text>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>LinkedIn URL</Text>
                <FieldInput placeholder="linkedin.com/in/alice" keyboardType="url" style={styles.input} />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>GitHub URL</Text>
                <FieldInput placeholder="github.com/alice" keyboardType="url" style={styles.input} />
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience & Bio</Text>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Years of Experience</Text>
                <FieldInput placeholder="5" keyboardType="number-pad" style={styles.input} />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Cover Letter</Text>
                <FieldInput 
                    placeholder="Tell us why you are a great fit..." 
                    multiline 
                    numberOfLines={5} 
                    skip 
                    style={styles.multilineInput} 
                />
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Referral</Text>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Referral Code (Optional)</Text>
                <FieldInput placeholder="REF-123" autoCapitalize="characters" style={styles.input} />
            </View>
        </View>

        <ActionButton 
            title="Submit Application" 
            onPress={handleSubmit} 
            style={styles.submitBtn}
        />
        
        <View style={styles.footer}>
            <Ionicons name="infinite-outline" size={16} color={C.textTertiary} />
            <Text style={styles.footerText}>
                Pull down to simulate draft reload
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
  badge: {
    backgroundColor: C.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ShowcaseRadius.md,
    marginRight: 16,
    borderWidth: 1,
    borderColor: C.accentBorder,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.accent,
  },
  configBar: {
    padding: ShowcaseSpacing.lg,
    backgroundColor: C.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: C.borderSubtle,
    gap: 4,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  configLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: C.textPrimary,
  },
  configNote: {
    fontSize: 12,
    color: C.textTertiary,
  },
  scrollContent: {
    padding: ShowcaseSpacing.xl,
    paddingBottom: ShowcaseSpacing.xxxl,
    gap: ShowcaseSpacing.xxl,
  },
  section: {
    gap: ShowcaseSpacing.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: ShowcaseSpacing.xs,
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
    height: 48,
    backgroundColor: C.bgCard,
    borderRadius: ShowcaseRadius.md,
    paddingHorizontal: ShowcaseSpacing.lg,
    fontSize: 15,
    color: C.textPrimary,
    borderWidth: 1,
    borderColor: C.border,
  },
  multilineInput: {
    minHeight: 120,
    backgroundColor: C.bgCard,
    borderRadius: ShowcaseRadius.md,
    paddingHorizontal: ShowcaseSpacing.lg,
    paddingVertical: ShowcaseSpacing.md,
    fontSize: 15,
    color: C.textPrimary,
    borderWidth: 1,
    borderColor: C.border,
    textAlignVertical: 'top',
  },
  submitBtn: {
    height: 56,
    marginTop: ShowcaseSpacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    opacity: 0.5,
    paddingVertical: ShowcaseSpacing.xl,
  },
  footerText: {
    fontSize: 12,
    color: C.textTertiary,
    fontStyle: 'italic',
  },
});
