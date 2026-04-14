import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  FieldForm,
  FieldInput,
  FieldOTP,
  FieldPhone,
  FieldPassword,
  FieldAmount,
} from '../../../packages/react-native-fieldflow/src';
import { SpecHeader } from '@/components/showcase/SpecHeader';
import { SectionLabel } from '@/components/showcase';
import {
  ShowcaseColors as C,
  ShowcaseRadius,
  ShowcaseSpacing as S,
} from '@/constants/showcase-theme';

export default function KitchenSinkScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <FieldForm
        style={styles.formContainer}
        scrollViewProps={{
          contentContainerStyle: [styles.scrollContent, { paddingBottom: insets.bottom + 40 }],
          showsVerticalScrollIndicator: false,
        }}>
        
        <SpecHeader
          title="Kitchen Sink"
          subtitle="Atomic catalog of every FieldFlow component and property variant."
        />

        {/* --- FIELD INPUT --- */}
        <View style={styles.section}>
          <SectionLabel title="FieldInput" description="Standard text variations" />
          <View style={styles.card}>
            <FieldInput name="default" label="Default Input" placeholder="Type something..." />
            <FieldInput name="email" label="Email Address" placeholder="you@domain.com" keyboardType="email-address" />
            <FieldInput name="multiline" label="Multiline" placeholder="Paragraph text..." multiline numberOfLines={3} />
            <FieldInput name="disabled" label="Disabled State" placeholder="Cannot edit this" disabled />
          </View>
        </View>

        {/* --- FIELD PASSWORD --- */}
        <View style={styles.section}>
          <SectionLabel title="FieldPassword" description="Secure entry with strength meter" />
          <View style={styles.card}>
            <FieldPassword name="pass1" label="Standard Password" placeholder="••••••••" />
            <FieldPassword name="pass2" label="With Strength Meter" placeholder="Type to see meter" showStrengthMeter />
          </View>
        </View>

        {/* --- FIELD OTP --- */}
        <View style={styles.section}>
          <SectionLabel title="FieldOTP" description="Fixed-length code entry" />
          <View style={styles.card}>
            <Text style={styles.label}>4-Digit Code</Text>
            <FieldOTP name="otp4" length={4} />
            
            <View style={styles.spacer} />
            
            <Text style={styles.label}>6-Digit Code (Secure)</Text>
            <FieldOTP name="otp6" length={6} secureTextEntry />
          </View>
        </View>

        {/* --- FIELD PHONE --- */}
        <View style={styles.section}>
          <SectionLabel title="FieldPhone" description="International number picker" />
          <View style={styles.card}>
            <FieldPhone name="phone1" label="US Default" defaultCountry="US" />
            <FieldPhone name="phone2" label="Searchable Regions" defaultCountry="GB" />
          </View>
        </View>

        {/* --- FIELD AMOUNT --- */}
        <View style={styles.section}>
          <SectionLabel title="FieldAmount" description="Currency and number formatting" />
          <View style={styles.card}>
            <FieldAmount name="amount1" label="USD Currency" currency="USD" placeholder="0.00" />
            <FieldAmount name="amount2" label="Fixed Decimals (0)" currency="EUR" precision={0} placeholder="0" />
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
  formContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  section: {
    paddingHorizontal: S.xl,
    gap: S.md,
    marginBottom: S.xxl,
  },
  card: {
    backgroundColor: C.bgCard,
    borderRadius: ShowcaseRadius.lg,
    padding: S.lg,
    gap: S.lg,
    borderWidth: 1,
    borderColor: C.borderSubtle,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textSecondary,
    marginBottom: -S.sm,
  },
  spacer: {
    height: S.md,
  },
});
