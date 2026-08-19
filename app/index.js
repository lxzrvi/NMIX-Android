import React, { useEffect, useRef, useState } from 'react';
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

const ACCENT = '#319b79';

const bios = [
  "I'm currently doing a diploma in web development and building my skills step by step.",
  "I'm learning HTML, CSS and JavaScript and understanding more about how real websites work.",
  "I enjoy taking small ideas and turning them into projects that I can improve as I learn more.",
  "I'm learning responsive design, interfaces and how to make websites feel smoother and easier to use.",
  "I keep experimenting with new web development concepts so I can improve with every project I build.",
  "NMIX is one of my projects for practising JavaScript logic, useful tools, interaction and interface design."
];

export default function Welcome() {
  const orb1 = useRef(new Animated.Value(0)).current;
  const orb2 = useRef(new Animated.Value(0)).current;
  const shine = useRef(new Animated.Value(0)).current;
  const entrance = useRef(new Animated.Value(0)).current;

  const [bioIndex, setBioIndex] = useState(0);
  const bioAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 850,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();

    const animation1 = Animated.loop(
      Animated.sequence([
        Animated.timing(orb1, {
          toValue: 1,
          duration: 7000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(orb1, {
          toValue: 0,
          duration: 7000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    );

    const animation2 = Animated.loop(
      Animated.sequence([
        Animated.timing(orb2, {
          toValue: 1,
          duration: 8500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(orb2, {
          toValue: 0,
          duration: 8500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    );

    const shineAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shine, {
          toValue: 1,
          duration: 4200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(shine, {
          toValue: 0,
          duration: 4200,
          useNativeDriver: true
        })
      ])
    );

    animation1.start();
    animation2.start();
    shineAnimation.start();

    const bioTimer = setInterval(() => {
      Animated.timing(bioAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      }).start(() => {
        setBioIndex(i => (i + 1) % bios.length);

        bioAnim.setValue(0);

        Animated.timing(bioAnim, {
          toValue: 1,
          duration: 550,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        }).start();
      });
    }, 6800);

    return () => {
      animation1.stop();
      animation2.stop();
      shineAnimation.stop();
      clearInterval(bioTimer);
    };
  }, []);

  async function shareNMIX() {
    try {
      await Share.share({
        title: 'NMIX',
        message:
          'Check out NMIX — anything with numbers! https://lxzrvi.github.io/NMIX/'
      });
    } catch {}
  }

  return (
    <LinearGradient
      colors={[
        '#03140f',
        '#0d3b2d',
        '#319b79',
        '#0a3528',
        '#03140f'
      ]}
      locations={[0, 0.27, 0.55, 0.8, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Animated.View
          style={[
            styles.orb,
            styles.orbOne,
            {
              transform: [
                {
                  translateX: orb1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-80, 130]
                  })
                },
                {
                  translateY: orb1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-70, 90]
                  })
                },
                {
                  scale: orb1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.25]
                  })
                }
              ]
            }
          ]}
        />

        <Animated.View
          style={[
            styles.orb,
            styles.orbTwo,
            {
              transform: [
                {
                  translateX: orb2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, -130]
                  })
                },
                {
                  translateY: orb2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, -60]
                  })
                }
              ]
            }
          ]}
        />

        <Animated.View
          style={[
            styles.middleGlow,
            {
              opacity: shine.interpolate({
                inputRange: [0, 1],
                outputRange: [0.08, 0.25]
              }),
              transform: [
                {
                  translateX: shine.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-170, 170]
                  })
                },
                { rotate: '-18deg' }
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
                  translateY: entrance.interpolate({
                    inputRange: [0, 1],
                    outputRange: [25, 0]
                  })
                }
              ]
            }
          ]}
        >
          <View style={styles.brand}>
            <Text style={styles.subtitle}>ANYTHING WITH NUMBERS</Text>
            <Text style={styles.logo}>NMIX</Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={() => router.push('/main')}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.buttonPressed
              ]}
            >
              <Text style={styles.actionText}>Start</Text>
            </Pressable>

            <Pressable
              onPress={shareNMIX}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.buttonPressed
              ]}
            >
              <Text style={styles.actionText}>Share</Text>
            </Pressable>
          </View>

          <View style={styles.contributor}>
            <Text style={styles.heading}>Contributor</Text>

            <View style={styles.columns}>
              <View style={styles.about}>
                <Text style={styles.name}>Alex Ravi</Text>

                <Animated.Text
                  style={[
                    styles.bio,
                    {
                      opacity: bioAnim,
                      transform: [
                        {
                          translateY: bioAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [15, 0]
                          })
                        }
                      ]
                    }
                  ]}
                >
                  {bios[bioIndex]}
                </Animated.Text>
              </View>

              <View style={styles.skillsArea}>
                <Text style={styles.skillTitle}>Skills</Text>

                <View style={styles.chips}>
                  {['HTML', 'CSS', 'JavaScript'].map(item => (
                    <View key={item} style={styles.chip}>
                      <Text style={styles.chipText}>{item}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.learning}>Learning More</Text>

                <View style={styles.chips}>
                  {[
                    'Responsive Design',
                    'UI / UX',
                    'Web APIs'
                  ].map(item => (
                    <View key={item} style={styles.chip}>
                      <Text style={styles.chipText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.contacts}>
              <Pressable
                onPress={() => Linking.openURL('tel:+919805414723')}
                style={({ pressed }) => [
                  styles.contactButton,
                  pressed && styles.buttonPressed
                ]}
              >
                <Text style={styles.contactText}>Contact</Text>
              </Pressable>

              <Pressable
                onPress={() => Linking.openURL('mailto:lxzrvi@gmail.com')}
                style={({ pressed }) => [
                  styles.contactButton,
                  pressed && styles.buttonPressed
                ]}
              >
                <Text style={styles.contactText}>Go to Mail</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.footer,
            { opacity: entrance }
          ]}
        >
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Alex Ravi
          </Text>
          <Text style={styles.footerSmall}>All Rights Reserved</Text>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    overflow: 'hidden'
  },

  safe: {
    flex: 1
  },

  orb: {
    position: 'absolute',
    borderRadius: 999
  },

  orbOne: {
    width: 390,
    height: 390,
    left: -180,
    top: -160,
    backgroundColor: 'rgba(105,214,178,0.24)'
  },

  orbTwo: {
    width: 460,
    height: 460,
    right: -220,
    bottom: -200,
    backgroundColor: 'rgba(49,155,121,0.30)'
  },

  middleGlow: {
    position: 'absolute',
    top: '34%',
    left: '15%',
    width: '70%',
    height: 150,
    borderRadius: 100,
    backgroundColor: '#d8fff2'
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
    color: '#ddf8ef',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 3
  },

  logo: {
    marginTop: 2,
    color: '#ffffff',
    fontSize: 46,
    lineHeight: 55,
    fontWeight: '900',
    letterSpacing: 6,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 7 },
    textShadowRadius: 20
  },

  actions: {
    width: '72%',
    maxWidth: 280,
    gap: 10,
    marginBottom: 18
  },

  actionButton: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: '#ffffff',
    elevation: 6
  },

  actionText: {
    color: '#174c3b',
    fontWeight: '600'
  },

  buttonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.88
  },

  contributor: {
    position: 'relative',
    width: '100%',
    maxWidth: 460,
    padding: 12,
    paddingBottom: 54,
    borderWidth: 1,
    borderColor: '#bec5c2',
    borderRadius: 16,
    backgroundColor: 'rgba(245,245,245,0.96)',
    elevation: 9
  },

  heading: {
    marginBottom: 10,
    color: '#202321',
    fontSize: 14,
    fontWeight: '700'
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
    borderRadius: 11,
    backgroundColor: '#dedede'
  },

  name: {
    color: ACCENT,
    fontSize: 16,
    fontWeight: '800'
  },

  bio: {
    marginTop: 8,
    color: '#66706c',
    fontSize: 11,
    lineHeight: 17
  },

  skillsArea: {
    flex: 1,
    padding: 8
  },

  skillTitle: {
    color: '#202321',
    fontSize: 12,
    fontWeight: '700'
  },

  learning: {
    marginTop: 10,
    color: '#66706c',
    fontSize: 10,
    fontWeight: '600'
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
    borderColor: 'rgba(49,155,121,0.20)',
    borderRadius: 999,
    backgroundColor: 'rgba(49,155,121,0.12)'
  },

  chipText: {
    color: '#216e56',
    fontSize: 9,
    fontWeight: '600'
  },

  contacts: {
    position: 'absolute',
    right: 12,
    bottom: 11,
    flexDirection: 'row',
    gap: 7
  },

  contactButton: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: ACCENT
  },

  contactText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600'
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 8,
    alignItems: 'center'
  },

  footerText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 10
  },

  footerSmall: {
    marginTop: 1,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 8
  }
});
