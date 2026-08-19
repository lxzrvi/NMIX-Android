import React, { useEffect } from 'react';

import {
  View
} from 'react-native';

import {
  router
} from 'expo-router';

import AsyncStorage
  from '@react-native-async-storage/async-storage';

const WELCOME_KEY =
  'nmix-welcome-seen';

export default function Startup() {
  useEffect(() => {
    async function openApp() {
      try {
        const seen =
          await AsyncStorage.getItem(
            WELCOME_KEY
          );

        router.replace(
          seen === '1'
            ? '/main'
            : '/welcome'
        );
      } catch {
        router.replace(
          '/welcome'
        );
      }
    }

    openApp();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#07110f'
      }}
    />
  );
}
