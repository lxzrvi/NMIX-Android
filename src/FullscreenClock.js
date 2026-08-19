import React, { useEffect, useRef, useState } from 'react';

import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
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
  const [now, setNow] = useState(new Date());

  const entrance = useRef(
    new Animated.Value(0)
  ).current;

  const glow = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    if (!visible) return;

    setNow(new Date());
    entrance.setValue(0);

    Animated.timing(entrance, {
      toValue: 1,
      duration: 650,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true
    }).start();

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 7000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),

        Animated.timing(glow, {
          toValue: 0,
          duration: 7000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    );

    glowLoop.start();

    const timer = setInterval(
      () => setNow(new Date()),
      1000
    );

    return () => {
      clearInterval(timer);
      glowLoop.stop();
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
      onRequestClose={onClose}
    >
      <StatusBar hidden />

      <LinearGradient
        colors={[
          '#050b09',
          '#0a1713',
          theme.topOne,
          '#07100d'
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.page}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glowA,
            {
              opacity: glow.interpolate({
                inputRange: [0, 1],
                outputRange: [0.18, 0.48]
              }),

              transform: [
                {
                  translateX: glow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-80, 110]
                  })
                },
                {
                  translateY: glow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 70]
                  })
                }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={[
              'transparent',
              `${theme.accent}08`,
              `${theme.accent}42`,
              `${theme.accentLight}12`,
              'transparent'
            ]}
            style={styles.glowGradient}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.brand,
            {
              opacity: entrance,
              transform: [
                {
                  translateY: entrance.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-15, 0]
                  })
                }
              ]
            }
          ]}
        >
          <Text
            style={[
              styles.brandSub,
              { fontFamily: bold }
            ]}
          >
            ANYTHING WITH NUMBERS
          </Text>

          <Text
            style={[
              styles.brandTitle,
              { fontFamily: logoFont }
            ]}
          >
            NMIX
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.center,
            {
              opacity: entrance,
              transform: [
                {
                  scale: entrance.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.94, 1]
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
                color: theme.accentLight,
                fontFamily: bold
              }
            ]}
          >
            NMIX • LOCAL TIME
          </Text>

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.4}
            style={[
              styles.time,
              { fontFamily: bold }
            ]}
          >
            {formatTime(now)}
          </Text>

          <Text
            style={[
              styles.date,
              { fontFamily: regular }
            ]}
          >
            {formatDate(now)}
          </Text>
        </Animated.View>

        <Pressable
          onPress={onClose}
          style={({ pressed }) => [
            styles.exit,
            pressed && styles.pressed
          ]}
        >
          <Text
            style={[
              styles.exitText,
              { fontFamily: regular }
            ]}
          >
            ×  Exit
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

  glowA: {
    position: 'absolute',
    width: 650,
    height: 650,
    left: -290,
    top: -250
  },

  glowGradient: {
    flex: 1,
    borderRadius: 330
  },

  brand: {
    position: 'absolute',
    top: 20,
    left: 20
  },

  brandSub: {
    color: 'rgba(255,255,255,.62)',
    fontSize: 6,
    letterSpacing: 1.6
  },

  brandTitle: {
    color: '#fff',
    fontSize: 22,
    letterSpacing: 4
  },

  center: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },

  live: {
    marginBottom: 6,
    fontSize: 10,
    letterSpacing: 3
  },

  time: {
    width: '100%',
    color: '#fff',
    textAlign: 'center',
    includeFontPadding: false,
    fontSize: 88,
    lineHeight: 105
  },

  date: {
    marginTop: 14,
    color: 'rgba(255,255,255,.68)',
    textAlign: 'center',
    fontSize: 14
  },

  exit: {
    position: 'absolute',
    right: 18,
    bottom: 22,
    height: 43,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.12)',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,.09)'
  },

  exitText: {
    color: '#fff',
    fontSize: 13
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.94 }]
  }
});
