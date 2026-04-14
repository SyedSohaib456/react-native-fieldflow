import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { 
  FieldForm, 
  FieldInput, 
  FieldPhone, 
  FieldDate 
} from 'react-native-fieldflow';

import { Ionicons } from '@expo/vector-icons';

import { SpecHeader } from '../SpecHeader';
import { ShowcaseColors as C, ShowcaseSpacing as S, ShowcaseRadius as R } from '../../../constants/showcase-theme';

export default function PulseOnboarding() {

  const handleFinish = (values: any) => {
    console.log('Pulse Onboarding:', values);
  };

  return (
    <View style={[styles.container, { backgroundColor: C.bgPrimary }]}>
      <SpecHeader 
        title="Pulse Onboarding" 
        subtitle="Healthcare registration with smart field inference."
      />

      <FieldForm 
        onFinish={handleFinish}
        style={styles.form}
        extraScrollPadding={60}
      >
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Personal Information</Text>
          <FieldInput
            name="fullName"
            label="Full Name"
            placeholder="John Doe"
            leftIcon={<Ionicons name="person-outline" size={18} color={C.pulseRose} />}
            rules={{ required: 'Full name is required' }}
          />

          <View style={styles.row}>
            <View style={styles.flex1}>
              <FieldDate
                name="dob"
                label="Date of Birth"
                placeholder="MM/DD/YYYY"
                leftIcon={<Ionicons name="calendar-outline" size={18} color={C.pulseRose} />}
              />
            </View>
            <View style={{ width: S.md }} />
            <View style={styles.flex1}>
              <FieldInput
                name="bloodType"
                label="Blood Group"
                placeholder="B+"
                leftIcon={<Ionicons name="medical-outline" size={18} color={C.pulseRose} />}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Contact Details</Text>
          <FieldInput
            name="email"
            label="Email Address"
            placeholder="john@pulse.hc"
            leftIcon={<Ionicons name="mail-outline" size={18} color={C.pulseRose} />}
            rules={{ 
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
            }}
          />
          <FieldPhone
            name="phone"
            label="Emergency Contact"
            defaultCountry="US"
            leftIcon={<Ionicons name="call-outline" size={18} color={C.pulseRose} />}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Security</Text>
          <FieldInput
            name="idNumber"
            label="Medical ID Number"
            placeholder="P-12345678"
            leftIcon={<Ionicons name="barcode-outline" size={18} color={C.pulseRose} />}
          />
        </View>

        <View style={{ height: S.xxl }} />
      </FieldForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    paddingHorizontal: S.xl,
  },
  section: {
    marginBottom: S.xl,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: C.pulseRose,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: S.lg,
    opacity: 0.8,
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
});
