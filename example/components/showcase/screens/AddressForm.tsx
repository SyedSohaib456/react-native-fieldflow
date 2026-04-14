import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { 
  FieldForm, 
  FieldInput, 
  FieldSelect 
} from 'react-native-fieldflow';
import { Ionicons } from '@expo/vector-icons';

import { SpecHeader } from '../SpecHeader';
import { ShowcaseColors as C, ShowcaseSpacing as S, ShowcaseRadius as R } from '../../../constants/showcase-theme';

export default function AddressForm() {
  const handleFinish = (values: any) => {
    console.log('Address Form:', values);
  };

  const countries = [
    { label: 'United States', value: 'US' },
    { label: 'United Kingdom', code: 'GB', value: 'GB' },
    { label: 'Canada', value: 'CA' },
    { label: 'Australia', value: 'AU' },
    { label: 'Germany', value: 'DE' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: C.bgPrimary }]}>
      <SpecHeader 
        title="Shipping Address" 
        subtitle="Address validation with nested field logic."
      />

      <FieldForm 
        onFinish={handleFinish}
        style={styles.form}
        extraScrollPadding={80}
      >
        <View style={styles.section}>
          <FieldInput
            name="addressLine1"
            label="Address Line 1"
            placeholder="Street address, P.O. box"
            leftIcon={<Ionicons name="location-outline" size={18} color={C.accent} />}
            rules={{ required: 'Address is required' }}
          />
          <FieldInput
            name="addressLine2"
            label="Address Line 2 (Optional)"
            placeholder="Apartment, suite, unit, building"
            leftIcon={<Ionicons name="business-outline" size={18} color={C.accent} />}
          />
        </View>

        <View style={styles.section}>
          <FieldSelect
            name="country"
            label="Country"
            options={countries}
            placeholder="Select country"
            leftIcon={<Ionicons name="globe-outline" size={18} color={C.accent} />}
          />

          <View style={styles.row}>
            <View style={styles.flex2}>
              <FieldInput
                name="city"
                label="City"
                placeholder="San Francisco"
              />
            </View>
            <View style={{ width: S.md }} />
            <View style={styles.flex1}>
              <FieldInput
                name="zipCode"
                label="Zip Code"
                placeholder="94103"
                keyboardType="number-pad"
              />
            </View>
          </View>
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
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
});
