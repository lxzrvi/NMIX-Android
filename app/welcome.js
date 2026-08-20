import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  Animated,
  Easing,
  Linking,
  Share,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  LinearGradient
} from 'expo-linear-gradient';

import {
  router
} from 'expo-router';

import AsyncStorage
  from '@react-native-async-storage/async-storage';

import useNMixFonts, {
  logoFont
} from '../src/useNMixFonts';

import useNMixSettings
  from '../src/useNMixSettings';

import MotionPressable
  from '../src/MotionPressable';

const WELCOME_KEY =
  'nmix-welcome-seen';

const descriptions = [
  'NMIX brings useful number tools together in one simple and responsive interface.',
  'Calculate, count, generate random values and work with time from one place.',
  'NMIX keeps everyday number tools quick, clean and easy to reach.',
  'Use the calculator, timer, local clock, stopwatch and counters without switching between apps.',
  'Themes, dark mode and fonts let you personalize how NMIX looks and feels.',
  'NMIX is built as a native Android experience with smooth interaction and offline-ready tools.'
];

export default function Welcome() {
  const fontsLoaded =
    useNMixFonts();

  const {
    loaded,
    theme,
    dark
  } = useNMixSettings();

  const [
    descriptionIndex,
    setDescriptionIndex
  ] = useState(0);

  const entrance =
    useRef(
      new Animated.Value(0)
    ).current;

  const glowOne =
    useRef(
      new Animated.Value(0)
    ).current;

  const glowTwo =
    useRef(
      new Animated.Value(0)
    ).current;

  const descriptionMotion =
    useRef(
      new Animated.Value(1)
    ).current;

  useEffect(() => {
    Animated.timing(
      entrance,
      {
        toValue: 1,
        duration: 900,

        easing:
          Easing.bezier(
            0.22,
            1,
            0.36,
            1
          ),

        useNativeDriver:
          true
      }
    ).start();

    const first =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            glowOne,
            {
              toValue: 1,
              duration: 10500,

              easing:
                Easing.inOut(
                  Easing.ease
                ),

              useNativeDriver:
                true
            }
          ),

          Animated.timing(
            glowOne,
            {
              toValue: 0,
              duration: 10500,

              easing:
                Easing.inOut(
                  Easing.ease
                ),

              useNativeDriver:
                true
            }
          )
        ])
      );

    const second =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            glowTwo,
            {
              toValue: 1,
              duration: 13000,

              easing:
                Easing.inOut(
                  Easing.ease
                ),

              useNativeDriver:
                true
            }
          ),

          Animated.timing(
            glowTwo,
            {
              toValue: 0,
              duration: 13000,

              easing:
                Easing.inOut(
                  Easing.ease
                ),

              useNativeDriver:
                true
            }
          )
        ])
      );

    first.start();
    second.start();

    const timer =
      setInterval(
        () => {
          Animated.timing(
            descriptionMotion,
            {
              toValue: 0,
              duration: 260,
              useNativeDriver:
                true
            }
          ).start(() => {
            setDescriptionIndex(
              value =>
                (
                  value + 1
                ) %
                descriptions.length
            );

            descriptionMotion
              .setValue(0);

            Animated.timing(
              descriptionMotion,
              {
                toValue: 1,
                duration: 650,

                easing:
                  Easing.bezier(
                    0.22,
                    1,
                    0.36,
                    1
                  ),

                useNativeDriver:
                  true
              }
            ).start();
          });
        },
        6800
      );

    return () => {
      first.stop();
      second.stop();

      clearInterval(
        timer
      );
    };
  }, []);

  async function enterApp() {
    try {
      await AsyncStorage
        .setItem(
          WELCOME_KEY,
          '1'
        );
    } catch {}

    router.replace(
      '/main'
    );
  }

  async function shareApp() {
    try {
      await Share.share({
        title: 'NMIX',

        message:
          'Check out NMIX — everything with numbers! https://lxzrvi.github.io/NMIX/'
      });
    } catch {}
  }

  function openGithub() {
    Linking
      .openURL(
        'https://github.com/lxzrvi'
      )
      .catch(
        () => {}
      );
  }

  function openWebsite() {
    Linking
      .openURL(
        'https://lxzrvi.github.io/NMIX/'
      )
      .catch(
        () => {}
      );
  }

  if (
    !fontsLoaded ||
    !loaded
  ) {
    return (
      <View
        style={{
          flex: 1,

          backgroundColor:
            '#07110f'
        }}
      />
    );
  }

  const accent =
    theme.accent;

  const text =
    dark
      ? '#edf4f1'
      : '#202321';

  const muted =
    dark
      ? '#aab6b1'
      : '#66706c';

  const glassBackground =
    dark
      ? 'rgba(15,22,19,.82)'
      : 'rgba(241,248,245,.88)';

  const glassBorder =
    dark
      ? 'rgba(255,255,255,.075)'
      : 'rgba(255,255,255,.42)';

  const innerBackground =
    dark
      ? 'rgba(255,255,255,.052)'
      : 'rgba(255,255,255,.50)';

  return (
    <LinearGradient
      colors={[
        '#020807',
        theme.topOne,
        theme.topTwo,
        theme.topThree,
        '#020807'
      ]}
      locations={[
        0,
        0.24,
        0.52,
        0.79,
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
      style={
        styles.page
      }
    >
      <View
        pointerEvents="none"
        style={
          StyleSheet.absoluteFill
        }
      >
        <Animated.View
          style={[
            styles.glowA,

            {
              opacity:
                glowOne.interpolate({
                  inputRange:
                    [0, 1],

                  outputRange:
                    [0.30, 0.80]
                }),

              transform: [
                {
                  translateX:
                    glowOne.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [-120, 125]
                    })
                },

                {
                  translateY:
                    glowOne.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [-90, 105]
                    })
                },

                {
                  scale:
                    glowOne.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [1, 1.23]
                    })
                }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={[
              'transparent',
              `${theme.accentLight}05`,
              `${theme.accentLight}2B`,
              `${theme.accentLight}07`,
              'transparent'
            ]}
            style={
              styles.glowFill
            }
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.glowB,

            {
              opacity:
                glowTwo.interpolate({
                  inputRange:
                    [0, 1],

                  outputRange:
                    [0.58, 0.18]
                }),

              transform: [
                {
                  translateX:
                    glowTwo.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [130, -120]
                    })
                },

                {
                  translateY:
                    glowTwo.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [100, -90]
                    })
                }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={[
              'transparent',
              `${accent}04`,
              `${accent}25`,
              `${accent}05`,
              'transparent'
            ]}
            style={
              styles.glowFill
            }
          />
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.content,

          {
            opacity:
              entrance,

            transform: [
              {
                translateY:
                  entrance.interpolate({
                    inputRange:
                      [0, 1],

                    outputRange:
                      [25, 0]
                  })
              }
            ]
          }
        ]}
      >
        <View
          style={
            styles.brand
          }
        >
          <Text
            style={[
              styles.subtitle,

              {
                color:
                  theme.accentLight
              }
            ]}
          >
            EVERYTHING WITH NUMBERS
          </Text>

          <View
            style={
              styles.logoFix
            }
          >
            <Text
              numberOfLines={1}
              style={
                styles.logo
              }
            >
              NMIX
            </Text>
          </View>
        </View>

        <View
          style={
            styles.actions
          }
        >
          <MotionPressable
            onPress={
              enterApp
            }
            style={[
              styles.actionButton,

              {
                backgroundColor:
                  glassBackground,

                borderColor:
                  glassBorder
              }
            ]}
          >
            <LinearGradient
              pointerEvents="none"
              colors={[
                'rgba(255,255,255,.085)',
                'rgba(255,255,255,.012)',
                `${accent}08`
              ]}
              style={[
                StyleSheet.absoluteFill,
                styles.actionGradient
              ]}
            />

            <Text
              style={[
                styles.actionText,

                {
                  color:
                    accent
                }
              ]}
            >
              Start
            </Text>
          </MotionPressable>

          <MotionPressable
            onPress={
              shareApp
            }
            style={[
              styles.actionButton,

              {
                backgroundColor:
                  glassBackground,

                borderColor:
                  glassBorder
              }
            ]}
          >
            <LinearGradient
              pointerEvents="none"
              colors={[
                'rgba(255,255,255,.085)',
                'rgba(255,255,255,.012)',
                `${accent}08`
              ]}
              style={[
                StyleSheet.absoluteFill,
                styles.actionGradient
              ]}
            />

            <Text
              style={[
                styles.actionText,

                {
                  color:
                    accent
                }
              ]}
            >
              Share
            </Text>
          </MotionPressable>
        </View>

        <View
          style={[
            styles.infoCard,

            {
              backgroundColor:
                glassBackground
            }
          ]}
        >
          <LinearGradient
            pointerEvents="none"
            colors={[
              'rgba(255,255,255,.09)',
              'rgba(255,255,255,.015)',
              `${accent}06`
            ]}
            style={
              StyleSheet.absoluteFill
            }
          />

          <Text
            style={[
              styles.heading,

              {
                color:
                  text
              }
            ]}
          >
            More Info
          </Text>

          <View
            style={
              styles.columns
            }
          >
            <View
              style={[
                styles.appBox,

                {
                  backgroundColor:
                    innerBackground,

                  borderColor:
                    dark
                      ? 'rgba(255,255,255,.07)'
                      : 'rgba(0,0,0,.055)'
                }
              ]}
            >
              <View
                style={
                  styles.appNameFix
                }
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.appName,

                    {
                      color:
                        accent
                    }
                  ]}
                >
                  NMIX
                </Text>
              </View>

              <Animated.Text
                style={[
                  styles.description,

                  {
                    color:
                      muted,

                    opacity:
                      descriptionMotion,

                    transform: [
                      {
                        translateY:
                          descriptionMotion
                            .interpolate({
                              inputRange:
                                [0, 1],

                              outputRange:
                                [13, 0]
                            })
                      }
                    ]
                  }
                ]}
              >
                {
                  descriptions[
                    descriptionIndex
                  ]
                }
              </Animated.Text>
            </View>

            <View
              style={[
                styles.detailsBox,

                {
                  backgroundColor:
                    innerBackground,

                  borderColor:
                    dark
                      ? 'rgba(255,255,255,.07)'
                      : 'rgba(0,0,0,.055)'
                }
              ]}
            >
              <Text
                style={[
                  styles.detailsHeading,

                  {
                    color:
                      text
                  }
                ]}
              >
                App Details
              </Text>

              <View
                style={
                  styles.chips
                }
              >
                {[
                  'React Native',
                  'Expo',
                  'JavaScript'
                ].map(
                  item => (
                    <Chip
                      key={
                        item
                      }
                      text={
                        item
                      }
                      accent={
                        accent
                      }
                      color={
                        dark
                          ? theme.accentLight
                          : theme.accentDark
                      }
                    />
                  )
                )}
              </View>

              <Text
                style={[
                  styles.builtFor,

                  {
                    color:
                      muted
                  }
                ]}
              >
                Built For
              </Text>

              <View
                style={
                  styles.chips
                }
              >
                {[
                  'Android',
                  'Offline Tools',
                  'Native UI'
                ].map(
                  item => (
                    <Chip
                      key={
                        item
                      }
                      text={
                        item
                      }
                      accent={
                        accent
                      }
                      color={
                        dark
                          ? theme.accentLight
                          : theme.accentDark
                      }
                    />
                  )
                )}
              </View>
            </View>
          </View>

          <View
            style={
              styles.infoActions
            }
          >
            <MotionPressable
              onPress={
                openWebsite
              }
              style={[
                styles.infoActionButton,

                {
                  backgroundColor:
                    accent
                }
              ]}
            >
              <Text
                style={
                  styles.infoActionText
                }
              >
                Web
              </Text>
            </MotionPressable>

            <MotionPressable
              onPress={
                openGithub
              }
              style={[
                styles.infoActionButton,

                {
                  backgroundColor:
                    accent
                }
              ]}
            >
              <Text
                style={
                  styles.infoActionText
                }
              >
                GitHub
              </Text>
            </MotionPressable>
          </View>
        </View>
      </Animated.View>

      <View
        pointerEvents="none"
        style={
          styles.bottomBrand
        }
      >
        <View
          style={
            styles.bottomLogoFix
          }
        >
          <Text
            numberOfLines={1}
            style={[
              styles.bottomLogo,

              {
                color:
                  theme.accentLight
              }
            ]}
          >
            NMIX
          </Text>
        </View>
      </View>

      <View
        style={
          styles.footer
        }
      >
        <Text
          style={
            styles.footerMain
          }
        >
          © {new Date().getFullYear()} Alex Ravi
        </Text>

        <Text
          style={
            styles.footerSub
          }
        >
          All Rights Reserved
        </Text>
      </View>
    </LinearGradient>
  );
}

function Chip({
  text,
  accent,
  color
}) {
  return (
    <View
      style={[
        styles.chip,

        {
          backgroundColor:
            `${accent}18`,

          borderColor:
            `${accent}38`
        }
      ]}
    >
      <Text
        style={[
          styles.chipText,

          {
            color
          }
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles =
  StyleSheet.create({
    page: {
      flex: 1,
      overflow: 'hidden'
    },

    glowA: {
      position: 'absolute',
      width: 570,
      height: 570,
      left: -280,
      top: -270
    },

    glowB: {
      position: 'absolute',
      width: 680,
      height: 680,
      right: -345,
      bottom: -325
    },

    glowFill: {
      flex: 1,
      borderRadius: 350
    },

    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 50,
      paddingBottom: 76,
      justifyContent: 'center',
      alignItems: 'center'
    },

    brand: {
      alignItems: 'center',
      marginBottom: 18,
      overflow: 'visible'
    },

    subtitle: {
      fontFamily: 'Poppins-Bold',
      fontSize: 10,
      lineHeight: 15,
      letterSpacing: 2.8,
      textAlign: 'center'
    },

    /*
     * Extra width/padding protects both N
     * and X from Android font clipping.
     */
    logoFix: {
      width: 300,
      minHeight: 76,
      paddingHorizontal: 38,
      paddingVertical: 6,
      overflow: 'visible',
      justifyContent: 'center',
      alignItems: 'center'
    },

    logo: {
      width: '100%',
      color: '#ffffff',
      fontFamily: logoFont,
      fontSize: 46,
      lineHeight: 64,
      letterSpacing: 5,
      paddingHorizontal: 10,
      textAlign: 'center',
      includeFontPadding: false
    },

    actions: {
      width: '72%',
      maxWidth: 280,
      gap: 10,
      marginBottom: 18
    },

    actionButton: {
      position: 'relative',
      minHeight: 51,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 999,
      elevation: 5
    },

    actionGradient: {
      borderRadius: 999
    },

    actionText: {
      fontFamily: 'Poppins-Bold',
      fontSize: 14
    },

    infoCard: {
      position: 'relative',
      width: '100%',
      maxWidth: 460,
      minHeight: 210,
      padding: 13,
      paddingBottom: 59,
      overflow: 'hidden',
      borderRadius: 18,
      elevation: 8
    },

    heading: {
      marginBottom: 11,
      fontFamily: 'Poppins-Bold',
      fontSize: 14
    },

    columns: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: 10
    },

    appBox: {
      flex: 1,
      minHeight: 132,
      padding: 11,
      overflow: 'hidden',
      borderWidth: 1,
      borderRadius: 12
    },

    appNameFix: {
      minWidth: 105,
      paddingHorizontal: 5,
      overflow: 'visible'
    },

    appName: {
      fontFamily: logoFont,
      fontSize: 16,
      lineHeight: 26,
      letterSpacing: 1,
      includeFontPadding: false
    },

    description: {
      marginTop: 6,
      fontFamily: 'Poppins-Regular',
      fontSize: 10.5,
      lineHeight: 16
    },

    detailsBox: {
      flex: 1,
      minHeight: 132,
      padding: 10,
      borderWidth: 1,
      borderRadius: 12
    },

    detailsHeading: {
      fontFamily: 'Poppins-Bold',
      fontSize: 11.5
    },

    builtFor: {
      marginTop: 10,
      fontFamily: 'Poppins-Bold',
      fontSize: 9.5
    },

    chips: {
      marginTop: 7,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 5
    },

    chip: {
      paddingHorizontal: 7,
      paddingVertical: 4,
      borderWidth: 1,
      borderRadius: 999
    },

    chipText: {
      fontFamily: 'Poppins-Bold',
      fontSize: 8
    },

    infoActions: {
      position: 'absolute',
      left: 13,
      right: 13,
      bottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },

    infoActionButton: {
      minWidth: 80,
      minHeight: 34,
      paddingHorizontal: 15,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 999
    },

    infoActionText: {
      color: '#ffffff',
      fontFamily: 'Poppins-Bold',
      fontSize: 10
    },

    bottomBrand: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 41,
      alignItems: 'center',
      justifyContent: 'center'
    },

    bottomLogoFix: {
      minWidth: 100,
      paddingHorizontal: 16,
      paddingVertical: 2,
      overflow: 'visible',
      alignItems: 'center'
    },

    bottomLogo: {
      fontFamily: logoFont,
      fontSize: 12,
      lineHeight: 20,
      letterSpacing: 2.2,
      textAlign: 'center',
      includeFontPadding: false,
      opacity: 0.78
    },

    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 9,
      alignItems: 'center'
    },

    footerMain: {
      color: 'rgba(255,255,255,.72)',
      fontFamily: 'Poppins-Regular',
      fontSize: 10
    },

    footerSub: {
      color: 'rgba(255,255,255,.52)',
      fontFamily: 'Poppins-Regular',
      fontSize: 8
    }
  });
