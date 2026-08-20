import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider } from '../src/useNMixSettings';
import useNMixFonts from '../src/useNMixFonts';

// Prevent splash screen from auto-hiding before fonts are ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsLoaded = useNMixFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="main" />
        </Stack>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
