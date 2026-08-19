import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import {
  fontFamily,
  logoFont
} from './useNMixFonts';

export default function FullscreenClock({
  visible,
  onClose,
  theme,
  font
}) {
  const { width, height } = useWindowDimensions();

  const landscape = width > height;

  const [now, setNow] = useState(new Date());

  const entrance = useRef(
    new Animated.Value(0)
  ).current;

  const ambient = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    if (!visible) return;

    setNow(new Date());

    entrance.setValue(0);

    Animated.timing(entrance, {
      toValue: 1,
      duration: 650,
      easing: Easing.bezier(
        0.22,
        1,
        0.36,
        1
      ),
      useNativeDriver: true
    }).start();

    const ambientLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(ambient, {
          toValue: 1,
          duration: 8000,
          easing:
            Easing.inOut(
              Easing.ease
            ),
          useNativeDriver: true
        }),

        Animated.timing(ambient, {
          toValue: 0,
          duration: 8000,
          easing:
            Easing.inOut(
              Easing.ease
            ),
          useNativeDriver: true
        })
      ])
    );

    ambientLoop.start();

    const clock = setInterval(
      () => setNow(new Date()),
      1000
    );

    return () => {
      clearInterval(clock);
      ambientLoop.stop();
    };
  }, [visible]);

  const regular = fontFamily(font);
  const bold = fontFamily(font, true);

  return (
    <Modal
      visible={visible}
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      supportedOrientations={[
        'portrait',
        'portrait-upside-down',
        'landscape-left',
        'landscape-right'
      ]}
      onRequestClose={onClose}
    >
      <StatusBar hidden />

      <LinearGradient
        colors={[
          '#030806',
          theme.topOne,
          '#091612',
          theme.topThree,
          '#020604'
        ]}
        locations={[
          0,
          0.28,
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
              styles.glowOne,
              {
                opacity:
                  ambient.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      0.35,
                      0.85
                    ]
                  }),

                transform: [
                  {
                    translateX:
                      ambient.interpolate({
                        inputRange:
                          [0, 1],
                        outputRange:
                          [-100, 140]
                      })
                  },

                  {
                    translateY:
                      ambient.interpolate({
                        inputRange:
                          [0, 1],
                        outputRange:
                          [-60, 90]
                      })
                  },

                  {
                    scale:
                      ambient.interpolate({
                        inputRange:
                          [0, 1],
                        outputRange:
                          [1, 1.25]
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
                `${theme.accent}2F`,
                `${theme.accentLight}0B`,
                'transparent'
              ]}
              style={styles.glowFill}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.glowTwo,
              {
                opacity:
                  ambient.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      0.7,
                      0.28
                    ]
                  }),

                transform: [
                  {
                    translateX:
                      ambient.interpolate({
                        inputRange:
                          [0, 1],
                        outputRange:
                          [120, -100]
                      })
                  },

                  {
                    translateY:
                      ambient.interpolate({
                        inputRange:
                          [0, 1],
                        outputRange:
                          [70, -70]
                      })
                  }
                ]
              }
            ]}
          >
            <LinearGradient
              colors={[
                'transparent',
                `${theme.accent}04`,
                `${theme.accent}26`,
                'transparent'
              ]}
              style={styles.glowFill}
            />
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.brand,
            landscape &&
              styles.brandLandscape,
            {
              opacity: entrance,

              transform: [
                {
                  translateY:
                    entrance.interpolate({
                      inputRange:
                        [0, 1],
                      outputRange:
                        [-12, 0]
                    })
                }
              ]
            }
          ]}
        >
          <Text
            style={[
              styles.brandSub,
              {
                fontFamily: bold,
                color:
                  theme.accentLight
              }
            ]}
          >
            EVERYTHING WITH NUMBERS
          </Text>

          <View style={styles.brandClipFix}>
            <Text
              numberOfLines={1}
              style={[
                styles.brandTitle,
                {
                  fontFamily: logoFont
                }
              ]}
            >
              NMIX
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.center,

            landscape &&
              styles.centerLandscape,

            {
              opacity: entrance,

              transform: [
                {
                  scale:
                    entrance.interpolate({
                      inputRange:
                        [0, 1],
                      outputRange:
                        [0.94, 1]
                    })
                }
              ]
            }
          ]}
        >
          <Text
            style={[
              styles.live,
              {
                color:
                  theme.accentLight,
                fontFamily: bold
              }
            ]}
          >
            NMIX • LOCAL TIME
          </Text>

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.35}
            style={[
              styles.time,

              landscape &&
                styles.timeLandscape,

              {
                fontFamily: bold
              }
            ]}
          >
            {formatTime(now)}
          </Text>

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.date,

              landscape &&
                styles.dateLandscape,

              {
                fontFamily: regular
              }
            ]}
          >
            {formatDate(now)}
          </Text>
        </Animated.View>

        <Pressable
          onPress={onClose}
          style={({ pressed }) => [
            styles.exit,

            landscape &&
              styles.exitLandscape,

            pressed &&
              styles.pressed
          ]}
        >
          <Text
            style={[
              styles.exitX,
              {
                fontFamily: regular
              }
            ]}
          >
            ×
          </Text>

          <Text
            style={[
              styles.exitText,
              {
                fontFamily: regular
              }
            ]}
          >
            Exit
          </Text>
        </Pressable>
      </LinearGradient>
    </Modal>
  );
}

function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function formatDate(date) {
  return date.toLocaleDateString([], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    overflow: 'hidden'
  },

  glowOne: {
    position: 'absolute',
    width: 720,
    height: 720,
    left: -340,
    top: -330
  },

  glowTwo: {
    position: 'absolute',
    width: 760,
    height: 760,
    right: -390,
    bottom: -390
  },

  glowFill: {
    flex: 1,
    borderRadius: 400
  },

  brand: {
    position: 'absolute',
    zIndex: 10,
    top: 22,
    left: 22,
    alignItems: 'flex-start'
  },

  brandLandscape: {
    top: 16,
    left: 20
  },

  brandSub: {
    fontSize: 6,
    letterSpacing: 1.5
  },

  brandClipFix: {
    minWidth: 125,
    paddingHorizontal: 5,
    paddingVertical: 2,
    overflow: 'visible'
  },

  brandTitle: {
    color: '#ffffff',
    fontSize: 23,
    lineHeight: 32,
    letterSpacing: 4,
    includeFontPadding: false
  },

  center: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: 'center',
    alignItems: 'center'
  },

  centerLandscape: {
    paddingHorizontal: 80
  },

  live: {
    marginBottom: 5,
    fontSize: 10,
    letterSpacing: 3,
    textAlign: 'center'
  },

  time: {
    width: '100%',
    color: '#ffffff',
    fontSize: 82,
    lineHeight: 105,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false
  },

  timeLandscape: {
    fontSize: 118,
    lineHeight: 138
  },

  date: {
    width: '95%',
    marginTop: 12,
    color:
      'rgba(255,255,255,.68)',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center'
  },

  dateLandscape: {
    marginTop: 3,
    fontSize: 15
  },

  exit: {
    position: 'absolute',
    right: 18,
    bottom: 22,
    height: 43,
    paddingHorizontal: 15,
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,.13)',
    borderRadius: 999,
    backgroundColor:
      'rgba(255,255,255,.09)'
  },

  exitLandscape: {
    right: 20,
    bottom: 16
  },

  exitX: {
    color: '#ffffff',
    fontSize: 20,
    lineHeight: 22
  },

  exitText: {
    color: '#ffffff',
    fontSize: 12
  },

  pressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.94
      }
    ]
  }
});
