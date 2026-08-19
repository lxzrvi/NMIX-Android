import React, { useEffect } from 'react';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    const id = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 150);

    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: {
            backgroundColor: '#07110f'
          }
        }}
      />
    </>
  );
}
