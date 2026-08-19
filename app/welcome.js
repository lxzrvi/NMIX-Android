import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  Animated,
  Easing,
  Linking,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

import useNMixFonts, {
  logoFont
} from '../src/useNMixFonts';

import useNMixSettings from '../src/useNMixSettings';

const WELCOME_KEY = 'nmix-welcome-seen';

const descriptions = [
  'NMIX brings useful number tools together in one simple and responsive interface.',
  'Calculate, count, generate random values and work with time from one place.',
  'NMIX is designed to keep everyday number tools quick, clean and easy to reach.',
  'Use the calculator, timer, local clock, stopwatch and counters without switching between apps.',
  'Themes, dark mode and fonts let you personalize how NMIX looks and feels.',
  'NMIX is built as a native Android experience with smooth interaction and offline-ready tools.'
];

export default function Welcome() {
  const fontsLoaded = useNMixFonts();

  const {
    loaded,
    theme,
    dark
  } = useNMixSettings();

  const [descriptionIndex, setDescriptionIndex] =
    useState(0);

  const entrance = useRef(
    new Animated.Value(0)
  ).current;

  const glowA = useRef(
    new Animated.Value(0)
  ).current;

  const glowB = useRef(
    new Animated.Value(0)
  ).current;

  const descriptionAnim = useRef(
    new Animated.Value(1)
  ).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 900,
      easing: Easing.bezier(
        0.22,
        1,
        0.36,
        1
      ),
      useNativeDriver: true
    }).start();

    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(glowA, {
          toValue: 1,
          duration: 9500,
          easing:
            Easing.inOut(
              Easing.ease
            ),
          useNativeDriver: true
        }),

        Animated.timing(glowA, {
          toValue: 0,
          duration: 9500,
          easing:
            Easing.inOut(
              Easing.ease
            ),
          useNativeDriver: true
        })
      ])
    );

    const b = Animated.loop(
      Animated.sequence([
        Animated.timing(glowB, {
          toValue: 1,
          duration: 12000,
          easing:
            Easing.inOut(
              Easing.ease
            ),
          useNativeDriver: true
        }),

        Animated.timing(glowB, {
          toValue: 0,
          duration: 12000,
          easing:
            Easing.inOut(
              Easing.ease
            ),
          useNativeDriver: true
        })
      ])
    );

    a.start();
    b.start();

    const messageTimer = setInterval(() => {
      Animated.timing(
        descriptionAnim,
        {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        }
      ).start(() => {
        setDescriptionIndex(
          current =>
            (current + 1) %
            descriptions.length
        );

        descriptionAnim.setValue(0);

        Animated.timing(
          descriptionAnim,
          {
            toValue: 1,
            duration: 600,
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
      });
    }, 6800);

    return () => {
      a.stop();
      b.stop();
      clearInterval(messageTimer);
    };
  }, []);

  async function enterApp() {
    try {
      await AsyncStorage.setItem(
        WELCOME_KEY,
        '1'
      );
    } catch {}

    router.replace('/main');
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

  if (!fontsLoaded || !loaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#07110f'
        }}
      />
    );
  }

  const accent = theme.accent;

  const text =
    dark
      ? '#edf4f1'
      : '#202321';

  const muted =
    dark
      ? '#aab6b1'
      : '#66706c';

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
        0.25,
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
      style={styles.page}
    >
      <View
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      >
        <Animated.View
          style={[
            styles.glowA,
            {
              opacity:
                glowA.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    0.42,
                    0.9
                  ]
                }),

              transform: [
                {
                  translateX:
                    glowA.interpolate({
                      inputRange:
                        [0, 1],
                      outputRange:
                        [-100, 115]
                    })
                },

                {
                  translateY:
                    glowA.interpolate({
                      inputRange:
                        [0, 1],
                      outputRange:
                        [-80, 95]
                    })
                },

                {
                  scale:
                    glowA.interpolate({
                      inputRange:
                        [0, 1],
                      outputRange:
                        [1, 1.2]
                    })
                }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={[
              'transparent',
              `${theme.accentLight}08`,
              `${theme.accentLight}2E`,
              `${theme.accentLight}08`,
              'transparent'
            ]}
            style={styles.glowGradient}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.glowB,
            {
              opacity:
                glowB.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    0.75,
                    0.28
                  ]
                }),

              transform: [
                {
                  translateX:
                    glowB.interpolate({
                      inputRange:
                        [0, 1],
                      outputRange:
                        [110, -110]
                    })
                },

                {
                  translateY:
                    glowB.interpolate({
                      inputRange:
                        [0, 1],
                      outputRange:
                        [90, -80]
                    })
                }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={[
              'transparent',
              `${accent}06`,
              `${accent}2A`,
              `${accent}08`,
              'transparent'
            ]}
            style={styles.glowGradient}
          />
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: entrance,

            transform: [
              {
                translateY:
                  entrance.interpolate({
                    inputRange:
                      [0, 1],
                    outputRange:
                      [28, 0]
                  })
              }
            ]
          }
        ]}
      >
        <View style={styles.brand}>
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

          <View style={styles.logoClipFix}>
            <Text
              numberOfLines={1}
              style={styles.logo}
            >
              NMIX
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <GlassButton
            title="Start"
            onPress={enterApp}
            accent={accent}
          />

          <GlassButton
            title="Share"
            onPress={shareApp}
            accent={accent}
          />
        </View>

        <View
          style={[
            styles.infoCard,
            {
              borderColor:
                'rgba(255,255,255,.22)',

              backgroundColor:
                dark
                  ? 'rgba(14,23,20,.64)'
                  : 'rgba(238,248,244,.64)'
            }
          ]}
        >
          <LinearGradient
            pointerEvents="none"
            colors={[
              'rgba(255,255,255,.18)',
              'rgba(255,255,255,.04)',
              `${accent}0C`
            ]}
            style={StyleSheet.absoluteFill}
          />

          <Text
            style={[
              styles.infoHeading,
              {
                color: text
              }
            ]}
          >
            More Info
          </Text>

          <View style={styles.infoLayout}>
            <View
              style={[
                styles.aboutApp,
                {
                  backgroundColor:
                    dark
                      ? 'rgba(255,255,255,.055)'
                      : 'rgba(255,255,255,.32)'
                }
              ]}
            >
              <View style={styles.appNameWrap}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.appName,
                    {
                      color: accent
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
                    color: muted,

                    opacity:
                      descriptionAnim,

                    transform: [
                      {
                        translateY:
                          descriptionAnim.interpolate({
                            inputRange:
                              [0, 1],
                            outputRange:
                              [14, 0]
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

            <View style={styles.details}>
              <Text
                style={[
                  styles.detailTitle,
                  {
                    color: text
                  }
                ]}
              >
                App Details
              </Text>

              <View style={styles.chips}>
                {[
                  'React Native',
                  'Expo',
                  'JavaScript'
                ].map(item => (
                  <Chip
                    key={item}
                    text={item}
                    accent={accent}
                    light={
                      theme.accentLight
                    }
                    dark={dark}
                  />
                ))}
              </View>

              <Text
                style={[
                  styles.moreTitle,
                  {
                    color: muted
                  }
                ]}
              >
                Built For
              </Text>

              <View style={styles.chips}>
                {[
                  'Android',
                  'Offline Tools',
                  'Native UI'
                ].map(item => (
                  <Chip
                    key={item}
                    text={item}
                    accent={accent}
                    light={
                      theme.accentLight
                    }
                    dark={dark}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.links}>
            <Pressable
              onPress={() =>
                Linking.openURL(
                  'https://github.com/lxzrvi'
                )
              }
              style={({ pressed }) => [
                styles.githubButton,
                {
                  backgroundColor:
                    accent
                },
                pressed &&
                  styles.pressed
              ]}
            >
              <Text style={styles.githubText}>
                GitHub
              </Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} Alex Ravi
        </Text>

        <Text style={styles.footerSmall}>
          All Rights Reserved
        </Text>
      </View>
    </LinearGradient>
  );
}

function GlassButton({
  title,
  onPress,
  accent
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.glassButton,
        pressed &&
          styles.pressed
      ]}
    >
      <LinearGradient
        colors={[
          'rgba(255,255,255,.16)',
          `${accent}20`,
          'rgba(255,255,255,.08)'
        ]}
        start={{
          x: 0,
          y: 0
        }}
        end={{
          x: 1,
          y: 1
        }}
        style={styles.glassButtonFill}
      >
        <View
          pointerEvents="none"
          style={styles.glassHighlight}
        />

        <Text
          style={styles.glassButtonText}
        >
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

function Chip({
  text,
  accent,
  light,
  dark
}) {
  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor:
            `${accent}20`,

          borderColor:
            `${accent}45`
        }
      ]}
    >
      <Text
        style={[
          styles.chipText,
          {
            color:
              dark
                ? light
                : accent
          }
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    overflow: 'hidden'
  },

  glowA: {
    position: 'absolute',
    width: 560,
    height: 560,
    left: -270,
    top: -260
  },

  glowB: {
    position: 'absolute',
    width: 650,
    height: 650,
    right: -330,
    bottom: -310
  },

  glowGradient: {
    flex: 1,
    borderRadius: 340
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 52,
    justifyContent: 'center',
    alignItems: 'center'
  },

  brand: {
    alignItems: 'center',
    marginBottom: 18
  },

  subtitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    letterSpacing: 2.8,
    textAlign: 'center'
  },

  logoClipFix: {
    minWidth: 190,
    paddingHorizontal: 20,
    paddingVertical: 5,
    overflow: 'visible',
    alignItems: 'center'
  },

  logo: {
    color: '#fff',
    fontFamily: logoFont,
    fontSize: 46,
    lineHeight: 60,
    letterSpacing: 5,
    textAlign: 'center',
    includeFontPadding: false,
    textShadowColor:
      'rgba(0,0,0,.35)',
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

  glassButton: {
    height: 51,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,.29)',
    borderRadius: 999,
    backgroundColor:
      'rgba(255,255,255,.06)',
    elevation: 4
  },

  glassButtonFill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  glassHighlight: {
    position: 'absolute',
    top: 1,
    left: 18,
    right: 18,
    height: 1,
    backgroundColor:
      'rgba(255,255,255,.38)'
  },

  glassButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    textShadowColor:
      'rgba(0,0,0,.18)',
    textShadowRadius: 5
  },

  infoCard: {
    position: 'relative',
    width: '100%',
    maxWidth: 460,
    padding: 12,
    paddingBottom: 54,
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 18,
    elevation: 7
  },

  infoHeading: {
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
    fontSize: 14
  },

  infoLayout: {
    flexDirection: 'row',
    gap: 8
  },

  aboutApp: {
    flex: 1,
    minHeight: 132,
    padding: 12,
    overflow: 'hidden',
    borderRadius: 12
  },

  appNameWrap: {
    minWidth: 90,
    paddingRight: 12,
    overflow: 'visible'
  },

  appName: {
    fontFamily: logoFont,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 1,
    includeFontPadding: false
  },

  description: {
    marginTop: 7,
    fontFamily: 'Poppins-Regular',
    fontSize: 10.5,
    lineHeight: 16
  },

  details: {
    flex: 1,
    padding: 8
  },

  detailTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12
  },

  moreTitle: {
    marginTop: 10,
    fontFamily: 'Poppins-Bold',
    fontSize: 10
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
    fontSize: 8.5
  },

  links: {
    position: 'absolute',
    right: 12,
    bottom: 11
  },

  githubButton: {
    minWidth: 74,
    paddingHorizontal: 13,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 999
  },

  githubText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 10
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 9,
    alignItems: 'center'
  },

  footerText: {
    color:
      'rgba(255,255,255,.72)',
    fontFamily: 'Poppins-Regular',
    fontSize: 10
  },

  footerSmall: {
    color:
      'rgba(255,255,255,.54)',
    fontFamily: 'Poppins-Regular',
    fontSize: 8
  },

  pressed: {
    opacity: 0.78,
    transform: [
      {
        scale: 0.96
      }
    ]
  }
});
