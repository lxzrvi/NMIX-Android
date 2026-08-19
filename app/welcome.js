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
  SafeAreaView,
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

const bios = [
  "I'm currently doing a diploma in web development and building my skills step by step.",
  "I'm learning HTML, CSS and JavaScript and understanding more about how real websites work.",
  "I enjoy taking small ideas and turning them into projects that I can improve as I learn more.",
  "I'm learning responsive design, interfaces and how to make websites feel smoother and easier to use.",
  "I keep experimenting with new web development concepts so I can improve with every project I build.",
  "NMIX is one of my projects for practising JavaScript logic, useful tools, interaction and interface design."
];

export default function Welcome() {
  const fontsLoaded = useNMixFonts();

  const {
    loaded,
    theme,
    dark
  } = useNMixSettings();

  const [bioIndex, setBioIndex] = useState(0);

  const entrance = useRef(
    new Animated.Value(0)
  ).current;

  const glowA = useRef(
    new Animated.Value(0)
  ).current;

  const glowB = useRef(
    new Animated.Value(0)
  ).current;

  const shine = useRef(
    new Animated.Value(0)
  ).current;

  const bioAnim = useRef(
    new Animated.Value(1)
  ).current;

  useEffect(() => {
    const intro = Animated.timing(
      entrance,
      {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }
    );

    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(glowA, {
          toValue: 1,
          duration: 9000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),

        Animated.timing(glowA, {
          toValue: 0,
          duration: 9000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    );

    const b = Animated.loop(
      Animated.sequence([
        Animated.timing(glowB, {
          toValue: 1,
          duration: 11500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),

        Animated.timing(glowB, {
          toValue: 0,
          duration: 11500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    );

    const s = Animated.loop(
      Animated.sequence([
        Animated.timing(shine, {
          toValue: 1,
          duration: 5500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),

        Animated.timing(shine, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true
        })
      ])
    );

    intro.start();
    a.start();
    b.start();
    s.start();

    const bioTimer = setInterval(() => {
      Animated.timing(bioAnim, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true
      }).start(() => {
        setBioIndex(
          value => (value + 1) % bios.length
        );

        bioAnim.setValue(0);

        Animated.timing(bioAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        }).start();
      });
    }, 6800);

    return () => {
      a.stop();
      b.stop();
      s.stop();
      clearInterval(bioTimer);
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
          'Check out NMIX — anything with numbers! https://lxzrvi.github.io/NMIX/'
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
        0.51,
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
      <View
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      >
        <Animated.View
          style={[
            styles.glowWrapA,
            {
              transform: [
                {
                  translateX:
                    glowA.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-100, 100]
                    })
                },
                {
                  translateY:
                    glowA.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-80, 100]
                    })
                },
                {
                  scale:
                    glowA.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3]
                    })
                }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={[
              'transparent',
              `${theme.accentLight}10`,
              `${theme.accentLight}35`,
              `${theme.accentLight}08`,
              'transparent'
            ]}
            locations={[
              0,
              0.18,
              0.5,
              0.8,
              1
            ]}
            style={styles.softGlow}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.glowWrapB,
            {
              transform: [
                {
                  translateX:
                    glowB.interpolate({
                      inputRange: [0, 1],
                      outputRange: [110, -100]
                    })
                },
                {
                  translateY:
                    glowB.interpolate({
                      inputRange: [0, 1],
                      outputRange: [90, -80]
                    })
                },
                {
                  scale:
                    glowB.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1.2, 0.9]
                    })
                }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={[
              'transparent',
              `${accent}10`,
              `${accent}3D`,
              `${accent}0A`,
              'transparent'
            ]}
            style={styles.softGlow}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.shine,
            {
              opacity:
                shine.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.04, 0.17]
                }),

              transform: [
                {
                  translateX:
                    shine.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-420, 420]
                    })
                },
                {
                  rotate: '-18deg'
                }
              ]
            }
          ]}
        />
      </View>

      <SafeAreaView style={styles.safe}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: entrance,

              transform: [
                {
                  translateY:
                    entrance.interpolate({
                      inputRange: [0, 1],
                      outputRange: [28, 0]
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
              ANYTHING WITH NUMBERS
            </Text>

            <Text style={styles.logo}>
              NMIX
            </Text>
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
              styles.card,
              {
                borderColor:
                  'rgba(255,255,255,0.22)',
                backgroundColor:
                  dark
                    ? 'rgba(12,20,17,0.72)'
                    : 'rgba(245,250,248,0.78)'
              }
            ]}
          >
            <View
              pointerEvents="none"
              style={StyleSheet.absoluteFill}
            >
              <LinearGradient
                colors={[
                  'rgba(255,255,255,0.19)',
                  'rgba(255,255,255,0.04)',
                  `${accent}10`
                ]}
                style={StyleSheet.absoluteFill}
              />
            </View>

            <Text
              style={[
                styles.heading,
                {
                  color:
                    dark
                      ? '#f2f7f5'
                      : '#202321'
                }
              ]}
            >
              Contributor
            </Text>

            <View style={styles.columns}>
              <View
                style={[
                  styles.about,
                  {
                    backgroundColor:
                      dark
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(255,255,255,0.42)'
                  }
                ]}
              >
                <Text
                  style={[
                    styles.name,
                    {
                      color: accent
                    }
                  ]}
                >
                  Alex Ravi
                </Text>

                <Animated.Text
                  style={[
                    styles.bio,
                    {
                      color:
                        dark
                          ? '#aebbb6'
                          : '#66706c',

                      opacity: bioAnim,

                      transform: [
                        {
                          translateY:
                            bioAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [14, 0]
                            })
                        }
                      ]
                    }
                  ]}
                >
                  {bios[bioIndex]}
                </Animated.Text>
              </View>

              <View style={styles.skills}>
                <Text
                  style={[
                    styles.skillTitle,
                    {
                      color:
                        dark
                          ? '#edf4f1'
                          : '#202321'
                    }
                  ]}
                >
                  Skills
                </Text>

                <View style={styles.chips}>
                  {[
                    'HTML',
                    'CSS',
                    'JavaScript'
                  ].map(item => (
                    <Chip
                      key={item}
                      text={item}
                      accent={accent}
                      light={theme.accentLight}
                      dark={dark}
                    />
                  ))}
                </View>

                <Text
                  style={[
                    styles.learning,
                    {
                      color:
                        dark
                          ? '#aebbb6'
                          : '#66706c'
                    }
                  ]}
                >
                  Learning More
                </Text>

                <View style={styles.chips}>
                  {[
                    'Responsive Design',
                    'UI / UX',
                    'Web APIs'
                  ].map(item => (
                    <Chip
                      key={item}
                      text={item}
                      accent={accent}
                      light={theme.accentLight}
                      dark={dark}
                    />
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.contacts}>
              <Pressable
                onPress={() =>
                  Linking.openURL(
                    'tel:+919805414723'
                  )
                }
                style={({ pressed }) => [
                  styles.contact,
                  {
                    backgroundColor: accent
                  },
                  pressed && styles.pressed
                ]}
              >
                <Text style={styles.contactText}>
                  Contact
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  Linking.openURL(
                    'mailto:lxzrvi@gmail.com'
                  )
                }
                style={({ pressed }) => [
                  styles.contact,
                  {
                    backgroundColor: accent
                  },
                  pressed && styles.pressed
                ]}
              >
                <Text style={styles.contactText}>
                  Go to Mail
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
      </SafeAreaView>
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
        styles.actionButton,
        {
          borderColor:
            'rgba(255,255,255,0.32)'
        },
        pressed && styles.pressed
      ]}
    >
      <LinearGradient
        colors={[
          'rgba(255,255,255,0.92)',
          'rgba(255,255,255,0.72)',
          `${accent}30`
        ]}
        start={{
          x: 0,
          y: 0
        }}
        end={{
          x: 1,
          y: 1
        }}
        style={styles.actionGradient}
      >
        <Text
          style={[
            styles.actionText,
            {
              color: '#123c30'
            }
          ]}
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

  safe: {
    flex: 1
  },

  glowWrapA: {
    position: 'absolute',
    width: 520,
    height: 520,
    left: -250,
    top: -240
  },

  glowWrapB: {
    position: 'absolute',
    width: 620,
    height: 620,
    right: -310,
    bottom: -290
  },

  softGlow: {
    flex: 1,
    borderRadius: 310
  },

  shine: {
    position: 'absolute',
    top: -100,
    bottom: -100,
    left: '40%',
    width: 130,
    backgroundColor: '#ffffff'
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 38
  },

  brand: {
    alignItems: 'center',
    marginBottom: 18
  },

  subtitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    letterSpacing: 3
  },

  logo: {
    marginTop: 2,
    color: '#fff',
    fontFamily: logoFont,
    fontSize: 46,
    lineHeight: 58,
    letterSpacing: 6,
    textShadowColor:
      'rgba(0,0,0,0.35)',
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
    height: 51,
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 999,
    elevation: 5
  },

  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  actionText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14
  },

  card: {
    position: 'relative',
    width: '100%',
    maxWidth: 460,
    padding: 12,
    paddingBottom: 54,
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 18,
    elevation: 8
  },

  heading: {
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
    fontSize: 14
  },

  columns: {
    flexDirection: 'row',
    gap: 8
  },

  about: {
    flex: 1,
    minHeight: 125,
    padding: 12,
    overflow: 'hidden',
    borderRadius: 12
  },

  name: {
    fontFamily: logoFont,
    fontSize: 16
  },

  bio: {
    marginTop: 8,
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    lineHeight: 17
  },

  skills: {
    flex: 1,
    padding: 8
  },

  skillTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12
  },

  learning: {
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
    fontSize: 9
  },

  contacts: {
    position: 'absolute',
    right: 12,
    bottom: 11,
    flexDirection: 'row',
    gap: 7
  },

  contact: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999
  },

  contactText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 10
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 8,
    alignItems: 'center'
  },

  footerText: {
    color:
      'rgba(255,255,255,0.72)',
    fontFamily: 'Poppins-Regular',
    fontSize: 10
  },

  footerSmall: {
    color:
      'rgba(255,255,255,0.54)',
    fontFamily: 'Poppins-Regular',
    fontSize: 8
  },

  pressed: {
    opacity: 0.82,
    transform: [
      {
        scale: 0.96
      }
    ]
  }
});
