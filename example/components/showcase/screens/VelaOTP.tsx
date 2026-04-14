import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { 
  FieldForm, 
  FieldOTP 
} from 'react-native-fieldflow';
import { Ionicons } from '@expo/vector-icons';

import { SpecHeader } from '../SpecHeader';
import { ShowcaseColors as C, ShowcaseSpacing as S, ShowcaseRadius as R } from '../../../constants/showcase-theme';

export default function VelaOTP() {
  const handleFinish = (values: any) => {
    console.log('Vela OTP Verification:', values);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#0A1128' }]}>
      <SpecHeader 
        title="Verify Identity" 
        subtitle="OTP entry with solid cell variants."
        dark
      />

      <FieldForm 
        onFinish={handleFinish}
        style={styles.form}
        extraScrollPadding={100}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={64} color={C.accent} />
          </View>
          
          <Text style={styles.instruction}>
            We&apos;ve sent a 6-digit code to your primary email address. 
            Please enter it below to proceed.
          </Text>

          <FieldOTP
            name="otp"
            length={6}
            variant="solid"
            autoFocus
            cellStyle={styles.otpCell}
            textStyle={styles.otpText}
            rules={{ required: 'OTP is required' }}
            accessoryView={
               <TouchableOpacity style={styles.resend}>
                <Text style={styles.resendText}>{`Didn't receive code? `}<Text style={{ color: C.accent }}>Resend</Text></Text>
              </TouchableOpacity>
            }
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
    backgroundColor: '#0A1128',
  },
  form: {
    paddingHorizontal: S.xl,
  },
  content: {
    alignItems: 'center',
    paddingTop: S.xxl,
  },
  iconContainer: {
    marginBottom: S.xl,
    opacity: 0.9,
  },
  instruction: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: S.xxxl,
    paddingHorizontal: S.xl,
  },
  otpCell: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    width: 44,
    height: 54,
  },
  otpText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  resend: {
    marginTop: S.xxxl,
  },
  resendText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
});
