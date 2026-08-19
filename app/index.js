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
  Text,
  View
} from 'react-native';

import {
  router
} from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  LinearGradient
} from 'expo-linear-gradient';

const WELCOME_KEY =
  'nmix-welcome-seen';

const LOAD_TIME = 5000;

export default function Startup() {
  const [destination, setDestination] =
    useState(null);

  const intro = useRef(
    new Animated.Value(0)
  ).current;

  const breathe = useRef(
    new Animated.Value(0)
  ).current;

  const orbit = useRef(
    new Animated.Value(0)
  ).current;

  const progress = useRef(
    new Animated.Value(0)
  ).current;

  const glow = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    async function prepare() {
      try {
        const seen =
          await AsyncStorage.getItem(
            WELCOME_KEY
          );

        setDestination(
          seen === '1'
            ? '/main'
            : '/welcome'
        );
      } catch {
        setDestination(
          '/welcome'
        );
      }
    }

    prepare();

    Animated.timing(
      intro,
      {
        toValue: 1,
        duration: 700,
        easing:
          Easing.bezier(
            0.22,
            1,
            0.36,
            1
          ),
        useNativeDriver: true
      }
    ).start();

    const breatheLoop =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            breathe,
            {
              toValue: 1,
              duration: 1300,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver: true
            }
          ),

          Animated.timing(
            breathe,
            {
              toValue: 0,
              duration: 1300,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver: true
            }
          )
        ])
      );

    const orbitLoop =
      Animated.loop(
        Animated.timing(
          orbit,
          {
            toValue: 1,
            duration: 4200,
            easing:
              Easing.linear,
            useNativeDriver: true
          }
        )
      );

    const glowLoop =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            glow,
            {
              toValue: 1,
              duration: 1800,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver: true
            }
          ),

          Animated.timing(
            glow,
            {
              toValue: 0,
              duration: 1800,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver: true
            }
          )
        ])
      );

    breatheLoop.start();
    orbitLoop.start();
    glowLoop.start();

    Animated.timing(
      progress,
      {
        toValue: 1,
        duration: LOAD_TIME,
        easing:
          Easing.bezier(
            0.22,
            1,
            0.36,
            1
          ),
        useNativeDriver: false
      }
    ).start();

    return () => {
      breatheLoop.stop();
      orbitLoop.stop();
      glowLoop.stop();
    };
  }, []);

  useEffect(() => {
    if (!destination) {
      return;
    }

    const timer =
      setTimeout(() => {
        router.replace(
          destination
        );
      }, LOAD_TIME);

    return () =>
      clearTimeout(timer);
  }, [destination]);

  const rotate =
    orbit.interpolate({
      inputRange: [0, 1],
      outputRange: [
        '0deg',
        '360deg'
      ]
    });

  const progressWidth =
    progress.interpolate({
      inputRange: [0, 1],
      outputRange: [
        '0%',
        '100%'
      ]
    });

  return (
    <LinearGradient
      colors={[
        '#020706',
        '#071a14',
        '#123c2f',
        '#07150f',
        '#020706'
      ]}
      locations={[
        0,
        0.27,
        0.52,
        0.78,
        1
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
        pointerEvents="none"
        style={[
          styles.ambientGlow,
          {
            opacity:
              glow.interpolate({
                inputRange:
                  [0, 1],
                outputRange:
                  [0.18, 0.46]
              }),

            transform: [
              {
                scale:
                  glow.interpolate({
                    inputRange:
                      [0, 1],
                    outputRange:
                      [0.9, 1.22]
                  })
              }
            ]
          }
        ]}
      />

      <Animated.View
        style={[
          styles.center,
          {
            opacity:
              intro,

            transform: [
              {
                translateY:
                  intro.interpolate({
                    inputRange:
                      [0, 1],
                    outputRange:
                      [18, 0]
                  })
              }
            ]
          }
        ]}
      >
        <View
          style={
            styles.logoStage
          }
        >
          <Animated.View
            style={[
              styles.outerRing,
              {
                transform: [
                  {
                    rotate
                  },

                  {
                    scale:
                      breathe.interpolate({
                        inputRange:
                          [0, 1],
                        outputRange:
                          [1, 1.06]
                      })
                  }
                ]
              }
            ]}
          />

          <Animated.View
            style={[
              styles.innerRing,
              {
                transform: [
                  {
                    rotate:
                      orbit.interpolate({
                        inputRange:
                          [0, 1],
                        outputRange:
                          [
                            '0deg',
                            '-360deg'
                          ]
                      })
                  }
                ]
              }
            ]}
          />

          <Animated.View
            style={{
              transform: [
                {
                  scale:
                    breathe.interpolate({
                      inputRange:
                        [0, 1],
                      outputRange:
                        [0.96, 1.03]
                    })
                }
              ]
            }}
          >
            <Image
              source={require(
                '../assets/icon.png'
              )}
              resizeMode="contain"
              style={
                styles.logo
              }
            />
          </Animated.View>
        </View>

        <Text
          style={
            styles.loadingTitle
          }
        >
          NMIX
        </Text>

        <Text
          style={
            styles.loadingSub
          }
        >
          EVERYTHING WITH NUMBERS
        </Text>

        <View
          style={
            styles.progressTrack
          }
        >
          <Animated.View
            style={[
              styles.progressFill,
              {
                width:
                  progressWidth
              }
            ]}
          />
        </View>

        <Text
          style={
            styles.preparing
          }
        >
          Preparing your experience
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles =
  StyleSheet.create({
    page: {
      flex: 1,
      justifyContent:
        'center',
      alignItems:
        'center',
      overflow:
        'hidden'
    },

    ambientGlow: {
      position:
        'absolute',
      width: 360,
      height: 360,
      borderRadius: 180,
      backgroundColor:
        'rgba(49,155,121,.20)'
    },

    center: {
      width: '100%',
      paddingHorizontal: 30,
      justifyContent:
        'center',
      alignItems:
        'center'
    },

    logoStage: {
      width: 188,
      height: 188,
      justifyContent:
        'center',
      alignItems:
        'center'
    },

    outerRing: {
      position:
        'absolute',
      width: 184,
      height: 184,
      borderWidth: 2,
      borderColor:
        'rgba(105,214,178,.34)',
      borderTopColor:
        '#69d6b2',
      borderRadius: 92
    },

    innerRing: {
      position:
        'absolute',
      width: 164,
      height: 164,
      borderWidth: 1,
      borderColor:
        'rgba(255,255,255,.16)',
      borderRightColor:
        'rgba(255,255,255,.72)',
      borderRadius: 82
    },

    logo: {
      width: 142,
      height: 142
    },

    loadingTitle: {
      marginTop: 15,
      color: '#ffffff',
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: 6
    },

    loadingSub: {
      marginTop: 4,
      color:
        'rgba(220,248,239,.72)',
      fontSize: 8,
      fontWeight: '600',
      letterSpacing: 2.5
    },

    progressTrack: {
      width: 190,
      height: 3,
      marginTop: 27,
      overflow:
        'hidden',
      borderRadius: 99,
      backgroundColor:
        'rgba(255,255,255,.10)'
    },

    progressFill: {
      height: '100%',
      borderRadius: 99,
      backgroundColor:
        '#69d6b2'
    },

    preparing: {
      marginTop: 9,
      color:
        'rgba(255,255,255,.48)',
      fontSize: 9,
      letterSpacing: 0.5
    }
  });
