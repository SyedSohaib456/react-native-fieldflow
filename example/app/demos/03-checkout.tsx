import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, Alert, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  FieldForm, 
  FieldInput 
} from '../../../packages/react-native-fieldflow/src';
import { ShowcaseColors as C, ShowcaseSpacing, ShowcaseRadius } from '../../constants/showcase-theme';
import { ActionButton, IconButton } from '../../components/showcase';

export default function CheckoutDemo() {
  const router = useRouter();
  const [hasPromo, setHasPromo] = useState(false);

  const handleSubmit = () => {
    Alert.alert('Payment Processed', 'Thank you for your order!');
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
            <Text style={styles.title}>Final step</Text>
            <Text style={styles.subtitle}>Demonstrating dynamic skip prop logic.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.card}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Card Number</Text>
              <FieldInput 
                placeholder="0000 0000 0000 0000"
                keyboardType="number-pad"
                textContentType="creditCardNumber"
                style={styles.input}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputWrapper, { flex: 1.5 }]}>
                <Text style={styles.label}>Expiry</Text>
                <FieldInput 
                  placeholder="MM/YY"
                  keyboardType="numbers-and-punctuation"
                  style={styles.input}
                />
              </View>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <Text style={styles.label}>CVV</Text>
                <FieldInput 
                  placeholder="123"
                  keyboardType="number-pad"
                  maxLength={3}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Cardholder Name</Text>
              <FieldInput 
                placeholder="J. Appleseed"
                textContentType="name"
                style={styles.input}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.promoHeader}>
            <Text style={styles.sectionTitle}>Promotions</Text>
            <View style={styles.switchWrapper}>
              <Text style={styles.switchLabel}>I have a promo code</Text>
              <Switch 
                value={hasPromo} 
                onValueChange={setHasPromo}
                trackColor={{ false: C.border, true: C.accent }}
              />
            </View>
          </View>

          <View style={[styles.card, !hasPromo && styles.cardDisabled]}>
            <FieldInput 
              placeholder="Enter discount code"
              autoCapitalize="characters"
              skip={!hasPromo} // DYNAMIC SKIP HERE
              style={[styles.input, !hasPromo && styles.inputDisabled]}
              editable={hasPromo}
            />
            {!hasPromo && (
              <View style={styles.skipCallout}>
                <Ionicons name="information-circle" size={16} color={C.textTertiary} />
                <Text style={styles.skipText}>
                  skip={'{true}'} removes this field from the chain dynamically — no re-render wiring needed.
                </Text>
              </View>
            )}
          </View>
        </View>

        <ActionButton 
          title="Place order" 
          onPress={handleSubmit} 
          style={styles.submitButton}
        />
        
        <Text style={styles.footerNote}>
          Note: extraScrollPadding={'{100}'} is active on this form to ensure 
          input visibility on smaller screens even with large keyboards.
        </Text>
      </FieldForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bgSecondary,
  },
  scrollContent: {
    padding: ShowcaseSpacing.xl,
    paddingBottom: 40,
  },
  header: {
    marginBottom: ShowcaseSpacing.xxl,
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
  section: {
    marginBottom: ShowcaseSpacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: ShowcaseSpacing.sm,
    marginLeft: 4,
  },
  card: {
    backgroundColor: C.bgPrimary,
    borderRadius: ShowcaseRadius.lg,
    padding: ShowcaseSpacing.lg,
    gap: ShowcaseSpacing.md,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardDisabled: {
    backgroundColor: C.bgSecondary,
    borderStyle: 'dashed',
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ShowcaseSpacing.sm,
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShowcaseSpacing.sm,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: C.textSecondary,
  },
  row: {
    flexDirection: 'row',
    gap: ShowcaseSpacing.md,
  },
  inputWrapper: {
    gap: ShowcaseSpacing.xs,
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
    paddingHorizontal: ShowcaseSpacing.md,
    fontSize: 15,
    color: C.textPrimary,
    borderWidth: 1,
    borderColor: C.borderSubtle,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  skipCallout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ShowcaseSpacing.sm,
    marginTop: 4,
  },
  skipText: {
    flex: 1,
    fontSize: 12,
    color: C.textTertiary,
    lineHeight: 16,
  },
  submitButton: {
    marginTop: ShowcaseSpacing.md,
    height: 56,
  },
  footerNote: {
    fontSize: 12,
    color: C.textTertiary,
    textAlign: 'center',
    marginTop: ShowcaseSpacing.xl,
    lineHeight: 18,
    paddingHorizontal: ShowcaseSpacing.lg,
  },
});
