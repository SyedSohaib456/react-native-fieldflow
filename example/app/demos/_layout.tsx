import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ShowcaseColors as C } from '@/constants/showcase-theme';

/**
 * Layout for the Demo Suite.
 * Enforces a professional Light Mode aesthetic for headers
 * and ensures proper Stack navigation registration.
 */
export default function DemosLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#1C1C1E',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 17,
          },
          headerShadowVisible: false,
          headerBackTitle: '', // Correct way to hide back title in native-stack
        }}
      >
        <Stack.Screen name="01-login" options={{ title: 'Login' }} />
        <Stack.Screen name="02-signup" options={{ title: 'Sign Up' }} />
        <Stack.Screen name="03-checkout" options={{ title: 'Checkout' }} />
        <Stack.Screen name="04-profile" options={{ title: 'Edit Profile' }} />
        <Stack.Screen name="05-floating-button" options={{ title: 'Floating Button' }} />
        <Stack.Screen name="06-collapsing-header" options={{ title: 'Aware Header' }} />
        <Stack.Screen name="07-submit-behavior" options={{ title: 'Submit Mode' }} />
        <Stack.Screen name="08-long-form" options={{ title: 'Job Application' }} />
        <Stack.Screen name="09-react-navigation" options={{ title: 'Address Edit' }} />
        <Stack.Screen name="10-comparison" options={{ title: 'Before / After' }} />
        <Stack.Screen name="11-accessory-view" options={{ title: 'Composer' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
