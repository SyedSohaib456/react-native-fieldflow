import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { 
  FieldForm, 
  FieldInput, 
  FieldPassword 
} from 'react-native-fieldflow';
import { Ionicons } from '@expo/vector-icons';

import { SpecHeader } from '../SpecHeader';
import { ShowcaseColors as C, ShowcaseSpacing as S, ShowcaseRadius as R } from '../../../constants/showcase-theme';

export default function VelaSignUp() {
  const handleFinish = (values: any) => {
    console.log('Vela Sign Up:', values);
  };

  const velaTheme = {
    colors: {
      background: 'rgba(255, 255, 255, 0.05)',
      backgroundFocused: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.1)',
      borderFocused: '#6366F1',
      text: '#FFFFFF',
      placeholder: 'rgba(255, 255, 255, 0.3)',
      label: 'rgba(255, 255, 255, 0.7)',
    },
  };

  return (
    <View style={styles.container}>
      <SpecHeader 
        title="Vela Crypto" 
        subtitle="Secure account creation with dark mode support."
        dark
      />

      <FieldForm 
        onFinish={handleFinish}
        style={styles.form}
        theme={velaTheme}
        extraScrollPadding={60}
      >
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account Security</Text>
          <FieldInput
            name="email"
            label="Email"
            placeholder="trader@vela.exchange"
            leftIcon={<Ionicons name="mail-outline" size={18} color="#FFF" />}
            containerStyle={styles.field}
          />
          <FieldPassword
            name="password"
            label="Create Password"
            placeholder="••••••••"
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color="#FFF" />}
            containerStyle={styles.field}
          />
          <FieldPassword
            name="confirm"
            label="Confirm Password"
            placeholder="••••••••"
            leftIcon={<Ionicons name="shield-checkmark-outline" size={18} color="#FFF" />}
            containerStyle={styles.field}
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
    backgroundColor: '#0A1128', // Vela Navy
  },
  form: {
    paddingHorizontal: S.xl,
    paddingTop: S.xl,
  },
  section: {
    // Spacing handled by theme and container
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: S.xl,
  },
  field: {
    marginBottom: S.xl,
  },
});
