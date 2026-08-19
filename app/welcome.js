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

import {
  GalleryIcon
} from '../src/icons';

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

  const glowA =
    useRef(
      new Animated.Value(0)
    ).current;

  const glowB =
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

    const firstGlow =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            glowA,
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
            glowA,
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

    const secondGlow =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            glowB,
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
            glowB,
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

    firstGlow.start();
    secondGlow.start();

    const timer =
      setInterval(() => {
        Animated.timing(
          descriptionMotion,
          {
            toValue: 0,

            duration: 260,

            easing:
              Easing.out(
                Easing.ease
              ),

            useNativeDriver:
              true
          }
        ).start(() => {
          setDescriptionIndex(
            current =>
              (
                current + 1
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
      }, 6800);

    return () => {
      firstGlow.stop();
      secondGlow.stop();

      clearInterval(timer);
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
    Linking.openURL(
      'https://github.com/lxzrvi'
    ).catch(() => {});
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

  const actionBackground =
    dark
      ? '#101513'
      : '#ffffff';

  const cardBackground =
    dark
      ? 'rgba(16,23,20,.82)'
      : 'rgba(240,248,245,.84)';

  const innerBackground =
    dark
      ? 'rgba(255,255,255,.055)'
      : 'rgba(255,255,255,.52)';

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
            styles.glowOne,

            {
              opacity:
                glowA.interpolate({
                  inputRange:
                    [0, 1],

                  outputRange:
                    [0.32, 0.82]
                }),

              transform: [
                {
                  translateX:
                    glowA.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [-120, 125]
                    })
                },

                {
                  translateY:
                    glowA.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [-90, 105]
                    })
                },

                {
                  scale:
                    glowA.interpolate({
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

              `${theme.accentLight}06`,

              `${theme.accentLight}2D`,

              `${theme.accentLight}08`,

              'transparent'
            ]}
            style={
              styles.glowFill
            }
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.glowTwo,

            {
              opacity:
                glowB.interpolate({
                  inputRange:
                    [0, 1],

                  outputRange:
                    [0.62, 0.2]
                }),

              transform: [
                {
                  translateX:
                    glowB.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [130, -120]
                    })
                },

                {
                  translateY:
                    glowB.interpolate({
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

              `${accent}05`,

              `${accent}28`,

              `${accent}06`,

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
                      [26, 0]
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
                  actionBackground,

                borderColor:
                  dark
                    ? 'rgba(255,255,255,.13)'
                    : 'rgba(255,255,255,.82)'
              }
            ]}
          >
            <View
              pointerEvents="none"
              style={
                styles.actionHighlight
              }
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
                  actionBackground,

                borderColor:
                  dark
                    ? 'rgba(255,255,255,.13)'
                    : 'rgba(255,255,255,.82)'
              }
            ]}
          >
            <View
              pointerEvents="none"
              style={
                styles.actionHighlight
              }
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
                cardBackground,

              borderColor:
                dark
                  ? 'rgba(255,255,255,.13)'
                  : 'rgba(255,255,255,.48)'
            }
          ]}
        >
          <LinearGradient
            pointerEvents="none"
            colors={[
              'rgba(255,255,255,.12)',

              'rgba(255,255,255,.025)',

              `${accent}08`
            ]}
            style={
              StyleSheet.absoluteFill
            }
          />

          <Text
            style={[
              styles.infoTitle,

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
              styles.infoLayout
            }
          >
            <View
              style={[
                styles.appCard,

                {
                  backgroundColor:
                    innerBackground,

                  borderColor:
                    dark
                      ? 'rgba(255,255,255,.08)'
                      : 'rgba(0,0,0,.07)'
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
                          descriptionMotion.interpolate({
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
                styles.detailsCard,

                {
                  backgroundColor:
                    innerBackground,

                  borderColor:
                    dark
                      ? 'rgba(255,255,255,.08)'
                      : 'rgba(0,0,0,.07)'
                }
              ]}
            >
              <Text
                style={[
                  styles.detailsTitle,

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
                ].map(item => (
                  <InfoChip
                    key={item}

                    text={item}

                    accent={
                      accent
                    }

                    color={
                      dark
                        ? theme.accentLight
                        : theme.accentDark
                    }
                  />
                ))}
              </View>

              <Text
                style={[
                  styles.builtTitle,

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
                ].map(item => (
                  <InfoChip
                    key={item}

                    text={item}

                    accent={
                      accent
                    }

                    color={
                      dark
                        ? theme.accentLight
                        : theme.accentDark
                    }
                  />
                ))}
              </View>
            </View>
          </View>

          <MotionPressable
            onPress={
              openGithub
            }
            style={[
              styles.githubButton,

              {
                backgroundColor:
                  accent
              }
            ]}
          >
            <GalleryIcon
              size={15}
              color="#ffffff"
            />

            <Text
              style={
                styles.githubText
              }
            >
              GitHub
            </Text>
          </MotionPressable>
        </View>
      </Animated.View>

      <View
        style={
          styles.footer
        }
      >
        <Text
          style={
            styles.footerText
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

function InfoChip({
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
            `${accent}3E`
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
      overflow:
        'hidden'
    },

    glowOne: {
      position:
        'absolute',

      width: 570,

      height: 570,

      left: -280,

      top: -270
    },

    glowTwo: {
      position:
        'absolute',

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

      paddingBottom: 52,

      justifyContent:
        'center',

      alignItems:
        'center'
    },

    brand: {
      alignItems:
        'center',

      marginBottom: 18
    },

    subtitle: {
      fontFamily:
        'Poppins-Bold',

      fontSize: 10,

      lineHeight: 15,

      letterSpacing: 2.8,

      textAlign:
        'center'
    },

    logoFix: {
      minWidth: 200,

      paddingHorizontal: 22,

      paddingVertical: 4,

      overflow:
        'visible',

      alignItems:
        'center'
    },

    logo: {
      color:
        '#ffffff',

      fontFamily:
        logoFont,

      fontSize: 46,

      lineHeight: 60,

      letterSpacing: 5,

      textAlign:
        'center',

      includeFontPadding:
        false,

      textShadowColor:
        'rgba(0,0,0,.32)',

      textShadowOffset: {
        width: 0,
        height: 7
      },

      textShadowRadius: 20
    },

    actions: {
      width: '72%',

      maxWidth: 280,

      gap: 10,

      marginBottom: 18
    },

    actionButton: {
      position:
        'relative',

      minHeight: 51,

      overflow:
        'hidden',

      justifyContent:
        'center',

      alignItems:
        'center',

      borderWidth: 1,

      borderRadius: 999,

      elevation: 6
    },

    actionHighlight: {
      position:
        'absolute',

      top: 1,

      left: 20,

      right: 20,

      height: 1,

      backgroundColor:
        'rgba(255,255,255,.34)'
    },

    actionText: {
      fontFamily:
        'Poppins-Bold',

      fontSize: 14,

      lineHeight: 20
    },

    infoCard: {
      position:
        'relative',

      width: '100%',

      maxWidth: 460,

      minHeight: 205,

      padding: 12,

      paddingBottom: 55,

      overflow:
        'hidden',

      borderWidth: 1,

      borderRadius: 18,

      elevation: 8
    },

    infoTitle: {
      marginBottom: 10,

      fontFamily:
        'Poppins-Bold',

      fontSize: 14
    },

    infoLayout: {
      flexDirection:
        'row',

      gap: 9
    },

    appCard: {
      flex: 1,

      minHeight: 132,

      padding: 11,

      overflow:
        'hidden',

      borderWidth: 1,

      borderRadius: 12
    },

    appNameFix: {
      minWidth: 95,

      paddingRight: 10,

      overflow:
        'visible'
    },

    appName: {
      fontFamily:
        logoFont,

      fontSize: 16,

      lineHeight: 25,

      letterSpacing: 1,

      includeFontPadding:
        false
    },

    description: {
      marginTop: 6,

      fontFamily:
        'Poppins-Regular',

      fontSize: 10.5,

      lineHeight: 16
    },

    detailsCard: {
      flex: 1,

      minHeight: 132,

      padding: 10,

      borderWidth: 1,

      borderRadius: 12
    },

    detailsTitle: {
      fontFamily:
        'Poppins-Bold',

      fontSize: 11.5
    },

    builtTitle: {
      marginTop: 10,

      fontFamily:
        'Poppins-Bold',

      fontSize: 9.5
    },

    chips: {
      marginTop: 7,

      flexDirection:
        'row',

      flexWrap:
        'wrap',

      gap: 5
    },

    chip: {
      paddingHorizontal: 7,

      paddingVertical: 4,

      borderWidth: 1,

      borderRadius: 999
    },

    chipText: {
      fontFamily:
        'Poppins-Bold',

      fontSize: 8
    },

    githubButton: {
      position:
        'absolute',

      right: 12,

      bottom: 11,

      minHeight: 34,

      paddingHorizontal: 13,

      flexDirection:
        'row',

      gap: 6,

      justifyContent:
        'center',

      alignItems:
        'center',

      borderRadius: 999
    },

    githubText: {
      color:
        '#ffffff',

      fontFamily:
        'Poppins-Bold',

      fontSize: 10
    },

    footer: {
      position:
        'absolute',

      left: 0,

      right: 0,

      bottom: 9,

      alignItems:
        'center'
    },

    footerText: {
      color:
        'rgba(255,255,255,.72)',

      fontFamily:
        'Poppins-Regular',

      fontSize: 10
    },

    footerSub: {
      color:
        'rgba(255,255,255,.52)',

      fontFamily:
        'Poppins-Regular',

      fontSize: 8
    }
  });
