import { useLocalSearchParams, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import VelaSignUp from '@/components/showcase/screens/VelaSignUp';
import VelaOTP from '@/components/showcase/screens/VelaOTP';
import MarloPayment from '@/components/showcase/screens/MarloPayment';
import ProfileEdit from '@/components/showcase/screens/ProfileEdit';
import AddressForm from '@/components/showcase/screens/AddressForm';
import PulseOnboarding from '@/components/showcase/screens/PulseOnboarding';
import ChatCompose from '@/components/showcase/screens/ChatCompose';
import WayfarerSearch from '@/components/showcase/screens/WayfarerSearch';
import { ShowcaseColors as C } from '@/constants/showcase-theme';

export default function ShowcaseDetailScreen() {
  const { id } = useLocalSearchParams();

  const renderContent = () => {
    switch (id) {
      case 'vela-signup':
        return <VelaSignUp />;
      case 'vela-otp':
        return <VelaOTP />;
      case 'marlo-payment':
        return <MarloPayment />;
      case 'profile-edit':
        return <ProfileEdit />;
      case 'address-form':
        return <AddressForm />;
      case 'pulse-onboarding':
        return <PulseOnboarding />;
      case 'thread-chat':
        return <ChatCompose />;
      case 'wayfarer-search':
        return <WayfarerSearch />;
      default:
        return (
          <View style={styles.center}>
            <Text style={styles.text}>{`Demo for "${id}" coming soon.`}</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: '',
          headerTransparent: true,
          headerTintColor: id?.toString().includes('vela') ? '#FFF' : C.textPrimary,
        }} 
      />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bgPrimary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    fontSize: 16,
    color: C.textSecondary,
    textAlign: 'center',
  },
});
