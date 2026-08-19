import React, { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'nmix-welcome-seen';

export default function Startup() {
  useEffect(() => {
    async function start() {
      try {
        const seen = await AsyncStorage.getItem(KEY);

        router.replace(
          seen === '1'
            ? '/main'
            : '/welcome'
        );
      } catch {
        router.replace('/welcome');
      }
    }

    start();
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
