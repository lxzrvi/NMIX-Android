import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  Animated,
  Easing,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';

import {
  LinearGradient
} from 'expo-linear-gradient';

import * as ScreenOrientation
  from 'expo-screen-orientation';

import {
  RotateIcon,
  WallpaperIcon
} from './icons';

import MotionPressable
  from './MotionPressable';

import ClockWallpaperPicker, {
  BUILTIN_WALLPAPERS,
  loadClockWallpaper
} from './ClockWallpaperPicker';

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
  const {
    width,
    height
  } = useWindowDimensions();

  const landscape =
    width > height;

  const [now, setNow] =
    useState(new Date());

  const [
    wallpaperPicker,
    setWallpaperPicker
  ] = useState(false);

  const [
    wallpaper,
    setWallpaper
  ] = useState({
    type: 'builtin',
    id: 'midnight'
  });

  const entrance = useRef(
    new Animated.Value(0)
  ).current;

  const ambient = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    loadClockWallpaper()
      .then(setWallpaper)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setNow(new Date());

    entrance.setValue(0);

    Animated.timing(
      entrance,
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

    const ambientLoop =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            ambient,
            {
              toValue: 1,
              duration: 8500,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver:
                true
            }
          ),

          Animated.timing(
            ambient,
            {
              toValue: 0,
              duration: 8500,
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

    ambientLoop.start();

    const clock =
      setInterval(
        () =>
          setNow(
            new Date()
          ),
        1000
      );

    return () => {
      clearInterval(
        clock
      );

      ambientLoop.stop();
    };
  }, [visible]);

  const regular =
    fontFamily(font);

  const bold =
    fontFamily(
      font,
      true
    );

  const builtin =
    wallpaper.type ===
      'builtin'
      ? (
          BUILTIN_WALLPAPERS[
            wallpaper.id
          ] ||
          BUILTIN_WALLPAPERS
            .midnight
        )
      : null;

  async function rotateScreen() {
    try {
      if (landscape) {
        await ScreenOrientation
          .lockAsync(
            ScreenOrientation
              .OrientationLock
              .PORTRAIT_UP
          );
      } else {
        await ScreenOrientation
          .lockAsync(
            ScreenOrientation
              .OrientationLock
              .LANDSCAPE_RIGHT
          );
      }
    } catch {}
  }

  async function exitClock() {
    try {
      await ScreenOrientation
        .unlockAsync();
    } catch {}

    onClose();
  }

  if (!visible) {
    return null;
  }

  return (
    <View
      style={
        styles.fullscreenRoot
      }
    >
      <StatusBar hidden />

      {wallpaper.type ===
        'custom' &&
      wallpaper.uri ? (
        <Image
          source={{
            uri: wallpaper.uri
          }}
          resizeMode="cover"
          style={
            StyleSheet.absoluteFill
          }
        />
      ) : (
        <LinearGradient
          colors={
            builtin.colors
          }
          locations={[
            0,
            0.32,
            0.68,
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
            StyleSheet.absoluteFill
          }
        />
      )}

      <LinearGradient
        pointerEvents="none"
        colors={[
          'rgba(1,5,4,.18)',
          'rgba(2,8,6,.28)',
          'rgba(1,5,4,.48)'
        ]}
        style={
          StyleSheet.absoluteFill
        }
      />

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
                ambient.interpolate({
                  inputRange:
                    [0, 1],
                  outputRange:
                    [0.18, 0.46]
                }),

              transform: [
                {
                  translateX:
                    ambient.interpolate({
                      inputRange:
                        [0, 1],
                      outputRange:
                        [-110, 130]
                    })
                },

                {
                  translateY:
                    ambient.interpolate({
                      inputRange:
                        [0, 1],
                      outputRange:
                        [-70, 85]
                    })
                },

                {
                  scale:
                    ambient.interpolate({
                      inputRange:
                        [0, 1],
                      outputRange:
                        [1, 1.24]
                    })
                }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={[
              'transparent',
              `${theme.accent}06`,
              `${theme.accent}2B`,
              `${theme.accentLight}08`,
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
          styles.brand,

          landscape &&
            styles.brandLandscape,

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
              color:
                theme.accentLight,

              fontFamily:
                bold
            }
          ]}
        >
          EVERYTHING WITH NUMBERS
        </Text>

        <View
          style={
            styles.brandFix
          }
        >
          <Text
            numberOfLines={1}
            style={[
              styles.brandTitle,
              {
                fontFamily:
                  logoFont
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
            opacity:
              entrance,

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

              fontFamily:
                bold
            }
          ]}
        >
          NMIX • LOCAL TIME
        </Text>

        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={
            0.3
          }
          style={[
            styles.time,

            landscape &&
              styles.timeLandscape,

            {
              fontFamily:
                bold
            }
          ]}
        >
          {formatTime(now)}
        </Text>

        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={
            0.6
          }
          style={[
            styles.date,

            landscape &&
              styles.dateLandscape,

            {
              fontFamily:
                regular
            }
          ]}
        >
          {formatDate(now)}
        </Text>
      </Animated.View>

      <View
        style={[
          styles.controls,

          landscape &&
            styles.controlsLandscape
        ]}
      >
        <MotionPressable
          onPress={
            rotateScreen
          }
          style={
            styles.control
          }
        >
          <RotateIcon
            size={19}
            color="#ffffff"
          />

          <Text
            style={[
              styles.controlLabel,
              {
                fontFamily:
                  regular
              }
            ]}
          >
            Rotate
          </Text>
        </MotionPressable>

        <MotionPressable
          onPress={() =>
            setWallpaperPicker(
              true
            )
          }
          style={
            styles.control
          }
        >
          <WallpaperIcon
            size={19}
            color="#ffffff"
          />

          <Text
            style={[
              styles.controlLabel,
              {
                fontFamily:
                  regular
              }
            ]}
          >
            Wallpaper
          </Text>
        </MotionPressable>

        <MotionPressable
          onPress={
            exitClock
          }
          style={
            styles.exitControl
          }
        >
          <Text
            style={[
              styles.exitX,
              {
                fontFamily:
                  regular
              }
            ]}
          >
            ×
          </Text>

          <Text
            style={[
              styles.controlLabel,
              {
                fontFamily:
                  regular
              }
            ]}
          >
            Exit
          </Text>
        </MotionPressable>
      </View>

      <ClockWallpaperPicker
        visible={
          wallpaperPicker
        }
        onClose={() =>
          setWallpaperPicker(
            false
          )
        }
        current={
          wallpaper
        }
        onChange={
          setWallpaper
        }
        theme={theme}
        font={font}
      />
    </View>
  );
}

function formatTime(date) {
  return date
    .toLocaleTimeString(
      [],
      {
        hour:
          '2-digit',
        minute:
          '2-digit',
        second:
          '2-digit'
      }
    );
}

function formatDate(date) {
  return date
    .toLocaleDateString(
      [],
      {
        weekday:
          'long',
        day:
          'numeric',
        month:
          'long',
        year:
          'numeric'
      }
    );
}

const styles =
  StyleSheet.create({
    fullscreenRoot: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 5000,
      overflow:
        'hidden',
      backgroundColor:
        '#030806'
    },

    glowOne: {
      position:
        'absolute',
      width: 700,
      height: 700,
      left: -330,
      top: -320
    },

    glowFill: {
      flex: 1,
      borderRadius: 360
    },

    brand: {
      position:
        'absolute',
      zIndex: 20,
      top: 22,
      left: 22,
      alignItems:
        'flex-start'
    },

    brandLandscape: {
      top: 15,
      left: 20
    },

    brandSub: {
      fontSize: 6,
      lineHeight: 9,
      letterSpacing: 1.4
    },

    brandFix: {
      minWidth: 135,
      paddingRight: 10,
      overflow:
        'visible'
    },

    brandTitle: {
      color: '#fff',
      fontSize: 23,
      lineHeight: 33,
      letterSpacing: 4,
      includeFontPadding:
        false
    },

    center: {
      flex: 1,
      paddingHorizontal: 22,
      justifyContent:
        'center',
      alignItems:
        'center'
    },

    centerLandscape: {
      paddingHorizontal: 80
    },

    live: {
      marginBottom: 5,
      fontSize: 10,
      letterSpacing: 3,
      textAlign:
        'center'
    },

    time: {
      width: '100%',
      color: '#fff',
      fontSize: 82,
      lineHeight: 105,
      textAlign:
        'center',
      textAlignVertical:
        'center',
      includeFontPadding:
        false
    },

    timeLandscape: {
      fontSize: 116,
      lineHeight: 135
    },

    date: {
      width: '94%',
      marginTop: 10,
      color:
        'rgba(255,255,255,.72)',
      fontSize: 14,
      lineHeight: 21,
      textAlign:
        'center'
    },

    dateLandscape: {
      marginTop: 1,
      fontSize: 15
    },

    controls: {
      position:
        'absolute',
      zIndex: 30,
      right: 17,
      bottom: 20,
      flexDirection:
        'row',
      alignItems:
        'center',
      gap: 8
    },

    controlsLandscape: {
      right: 18,
      bottom: 14
    },

    control: {
      minHeight: 42,
      paddingHorizontal: 12,
      flexDirection:
        'row',
      justifyContent:
        'center',
      alignItems:
        'center',
      gap: 7,
      borderWidth: 1,
      borderColor:
        'rgba(255,255,255,.13)',
      borderRadius: 999,
      backgroundColor:
        'rgba(255,255,255,.09)'
    },

    exitControl: {
      minHeight: 42,
      paddingHorizontal: 13,
      flexDirection:
        'row',
      justifyContent:
        'center',
      alignItems:
        'center',
      gap: 7,
      borderWidth: 1,
      borderColor:
        'rgba(255,255,255,.16)',
      borderRadius: 999,
      backgroundColor:
        'rgba(255,255,255,.12)'
    },

    controlLabel: {
      color: '#fff',
      fontSize: 10
    },

    exitX: {
      color: '#fff',
      fontSize: 19,
      lineHeight: 21
    }
  });
