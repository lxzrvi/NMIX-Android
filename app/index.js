import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  View
} from 'react-native';

import {
  router
} from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { LinearGradient } from 'expo-linear-gradient';

const KEY = 'nmix-welcome-seen';

export default function Startup() {
  const [destination, setDestination] =
    useState(null);

  const logo = useRef(
    new Animated.Value(0)
  ).current;

  const glow = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    async function prepare() {
      try {
        const seen =
          await AsyncStorage.getItem(KEY);

        setDestination(
          seen === '1'
            ? '/main'
            : '/welcome'
        );
      } catch {
        setDestination('/welcome');
      }
    }

    prepare();

    const logoAnimation =
      Animated.sequence([
        Animated.timing(logo, {
          toValue: 1,
          duration: 650,
          easing: Easing.bezier(
            0.22,
            1,
            0.36,
            1
          ),
          useNativeDriver: true
        }),

        Animated.delay(350),

        Animated.timing(logo, {
          toValue: 2,
          duration: 400,
          easing: Easing.in(
            Easing.cubic
          ),
          useNativeDriver: true
        })
      ]);

    const glowAnimation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: 850,
            easing:
              Easing.inOut(
                Easing.ease
              ),
            useNativeDriver: true
          }),

          Animated.timing(glow, {
            toValue: 0,
            duration: 850,
            easing:
              Easing.inOut(
                Easing.ease
              ),
            useNativeDriver: true
          })
        ])
      );

    glowAnimation.start();

    logoAnimation.start();

    return () => {
      glowAnimation.stop();
    };
  }, []);

  useEffect(() => {
    if (!destination) return;

    const id = setTimeout(() => {
      router.replace(destination);
    }, 1350);

    return () => clearTimeout(id);
  }, [destination]);

  return (
    <LinearGradient
      colors={[
        '#020807',
        '#0b261e',
        '#174b3a',
        '#06110d'
      ]}
      start={{
        x: 0,
        y: 0
      }}
      end={{
        x: 1,
        y: 1
      }}
      style={styles.page}
    >
      <Animated.View
        style={[
          styles.glow,
          {
            opacity:
              glow.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  0.15,
                  0.42
                ]
              }),

            transform: [
              {
                scale:
                  glow.interpolate({
                    inputRange:
                      [0, 1],
                    outputRange:
                      [0.8, 1.2]
                  })
              }
            ]
          }
        ]}
      />

      <Animated.View
        style={[
          styles.logoWrap,
          {
            opacity:
              logo.interpolate({
                inputRange: [
                  0,
                  0.35,
                  1,
                  1.7,
                  2
                ],
                outputRange: [
                  0,
                  1,
                  1,
                  1,
                  0
                ]
              }),

            transform: [
              {
                scale:
                  logo.interpolate({
                    inputRange: [
                      0,
                      1,
                      2
                    ],
                    outputRange: [
                      0.72,
                      1,
                      1.16
                    ]
                  })
              }
            ]
          }
        ]}
      >
        <Image
          source={require(
            '../assets/icon.png'
          )}
          resizeMode="contain"
          style={styles.logo}
        />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },

  glow: {
    position: 'absolute',
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor:
      'rgba(49,155,121,.22)'
  },

  logoWrap: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center'
  },

  logo: {
    width: 150,
    height: 150
  }
});
