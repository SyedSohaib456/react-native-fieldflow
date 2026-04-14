import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { 
  FieldForm, 
  FieldInput, 
  FieldAmount 
} from 'react-native-fieldflow';
import { Ionicons } from '@expo/vector-icons';

import { SpecHeader } from '../SpecHeader';
import { ShowcaseColors as C, ShowcaseSpacing as S, ShowcaseRadius as R } from '../../../constants/showcase-theme';

export default function MarloPayment() {
  const handleFinish = (values: any) => {
    console.log('Marlo Payment:', values);
  };

  return (
    <View style={[styles.container, { backgroundColor: C.bgPrimary }]}>
      <SpecHeader 
        title="Marlo Checkout" 
        subtitle="Luxury e-commerce payment flow with haptics."
      />

      <FieldForm 
        onFinish={handleFinish}
        style={styles.form}
        extraScrollPadding={120}
      >
        <View style={styles.card}>
          <Text style={styles.cardInfo}>Payable Amount</Text>
          <FieldAmount
            name="amount"
            currency="USD"
            placeholder="0.00"
            inputStyle={styles.amountInput}
            containerStyle={{ marginBottom: 0 }}
            inputContainerStyle={{ borderWidth: 0, backgroundColor: 'transparent', height: 48 }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Customer Information</Text>
          <FieldInput
            name="email"
            label="Email"
            placeholder="client@luxury.marlo"
            leftIcon={<Ionicons name="mail-outline" size={18} color={C.marloGold} />}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Card Details</Text>
          <FieldInput
            name="cardNumber"
            label="Card Number"
            placeholder="0000 0000 0000 0000"
            leftIcon={<Ionicons name="card-outline" size={18} color={C.marloGold} />}
            keyboardType="number-pad"
            containerStyle={{ marginBottom: S.md }}
          />

          <View style={styles.row}>
            <View style={styles.flex1}>
              <FieldInput
                name="expiry"
                label="Expiry Date"
                placeholder="MM/YY"
                leftIcon={<Ionicons name="calendar-outline" size={18} color={C.marloGold} />}
              />
            </View>
            <View style={{ width: S.lg }} />
            <View style={{ flex: 0.7 }}>
              <FieldInput
                name="cvv"
                label="CVV"
                placeholder="123"
                leftIcon={<Ionicons name="lock-closed-outline" size={18} color={C.marloGold} />}
                keyboardType="number-pad"
                secureTextEntry
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
    paddingTop: S.xl,
  },
  card: {
    backgroundColor: C.textPrimary,
    padding: S.xl,
    borderRadius: R.lg,
    marginBottom: S.xl,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardInfo: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: S.xs,
  },
  amountInput: {
    color: '#D4AF37', // Marlo Gold
    fontSize: 28,
    fontWeight: '800',
  },
  section: {
    marginBottom: S.lg,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: C.marloGold,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: S.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flex1: {
    flex: 1,
  },
});
