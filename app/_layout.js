import React, {
  useEffect
} from 'react';

import {
  Stack
} from 'expo-router';

import {
  StatusBar
} from 'expo-status-bar';

import * as SplashScreen
  from 'expo-splash-screen';

import {
  NMixSoundProvider
} from '../src/useNMixSounds';

SplashScreen
  .preventAutoHideAsync()
  .catch(
    () => {}
  );

export default function RootLayout() {
  useEffect(() => {
    SplashScreen
      .hideAsync()
      .catch(
        () => {}
      );
  }, []);

  return (
    <NMixSoundProvider>
      <StatusBar
        style="light"
      />

      <Stack
        screenOptions={{
          headerShown:
            false,

          animation:
            'fade',

          contentStyle: {
            backgroundColor:
              '#07110f'
          }
        }}
      />
    </NMixSoundProvider>
  );
}
