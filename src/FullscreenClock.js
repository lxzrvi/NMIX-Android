import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import {
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';

import Svg, {
  Circle,
  Line
} from 'react-native-svg';

import {
  LinearGradient
} from 'expo-linear-gradient';

import {
  useSafeAreaInsets
} from 'react-native-safe-area-context';

import AsyncStorage
  from '@react-native-async-storage/async-storage';

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

const TIP_KEY =
  'nmix-fullscreen-style-tip-seen';

const STYLE_KEY =
  'nmix-fullscreen-clock-style';

const CLOCK_STYLES = [
  'Classic',
  'Clean',
  'Minimal',
  'Seconds Focus',
  'Split',
  'Elegant',
  'Cinema',
  'Stacked',
  'Analog',
  'Hybrid'
];

const FOREGROUND = '#F4F7F6';
const FOREGROUND_SOFT =
  'rgba(244,247,246,.74)';
const FOREGROUND_MUTED =
  'rgba(244,247,246,.52)';
const FOREGROUND_FAINT =
  'rgba(244,247,246,.36)';

export default function FullscreenClock({
  visible,
  onClose,
  theme,
  themeName = 'green',
  font
}) {
  const {
    width,
    height
  } = useWindowDimensions();

  const insets =
    useSafeAreaInsets();

  const landscape =
    width > height;

  const [
    now,
    setNow
  ] = useState(
    new Date()
  );

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

  const [
    chromeVisible,
    setChromeVisible
  ] = useState(true);

  const [
    clockStyle,
    setClockStyle
  ] = useState(0);

  const [
    showTip,
    setShowTip
  ] = useState(false);

  const entrance =
    useRef(
      new Animated.Value(0)
    ).current;

  const ambient =
    useRef(
      new Animated.Value(0)
    ).current;

  const chrome =
    useRef(
      new Animated.Value(1)
    ).current;

  const tipMotion =
    useRef(
      new Animated.Value(0)
    ).current;

  const styleMotion =
    useRef(
      new Animated.Value(1)
    ).current;

  useEffect(() => {
    async function load() {
      try {
        const [
          savedWallpaper,
          savedStyle
        ] =
          await Promise.all([
            loadClockWallpaper(),

            AsyncStorage.getItem(
              STYLE_KEY
            )
          ]);

        setWallpaper(
          savedWallpaper
        );

        const parsed =
          Number(
            savedStyle
          );

        if (
          Number.isInteger(
            parsed
          ) &&
          parsed >= 0 &&
          parsed <
            CLOCK_STYLES.length
        ) {
          setClockStyle(
            parsed
          );
        }
      } catch {}
    }

    load();
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setNow(
      new Date()
    );

    setChromeVisible(
      true
    );

    chrome.setValue(
      1
    );

    entrance.setValue(
      0
    );

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

              duration:
                ambientDuration(
                  themeName
                ),

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

              duration:
                ambientDuration(
                  themeName
                ),

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

    showFirstTip();

    return () => {
      clearInterval(
        clock
      );

      ambientLoop.stop();
    };
  }, [
    visible,
    themeName
  ]);

  useEffect(() => {
    Animated.timing(
      chrome,
      {
        toValue:
          chromeVisible
            ? 1
            : 0,

        duration: 480,

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
  }, [
    chromeVisible
  ]);

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

  const parts =
    useMemo(
      () =>
        getTimeParts(
          now
        ),
      [now]
    );

  async function showFirstTip() {
    try {
      const seen =
        await AsyncStorage
          .getItem(
            TIP_KEY
          );

      if (
        seen === '1'
      ) {
        return;
      }

      setShowTip(
        true
      );

      tipMotion.setValue(
        0
      );

      Animated.sequence([
        Animated.delay(
          400
        ),

        Animated.timing(
          tipMotion,
          {
            toValue: 1,

            duration: 500,

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
        ),

        Animated.delay(
          2600
        ),

        Animated.timing(
          tipMotion,
          {
            toValue: 0,

            duration: 450,

            useNativeDriver:
              true
          }
        )
      ]).start(() => {
        setShowTip(
          false
        );
      });

      await AsyncStorage
        .setItem(
          TIP_KEY,
          '1'
        );
    } catch {}
  }

  function changeStyle() {
    const next =
      (
        clockStyle + 1
      ) %
      CLOCK_STYLES.length;

    styleMotion
      .stopAnimation();

    Animated.timing(
      styleMotion,
      {
        toValue: 0,
        duration: 140,
        useNativeDriver:
          true
      }
    ).start(() => {
      setClockStyle(
        next
      );

      AsyncStorage
        .setItem(
          STYLE_KEY,
          String(next)
        )
        .catch(
          () => {}
        );

      styleMotion
        .setValue(0);

      Animated.timing(
        styleMotion,
        {
          toValue: 1,

          duration: 420,

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
  }

  function toggleCinema() {
    if (
      wallpaperPicker
    ) {
      return;
    }

    setChromeVisible(
      value =>
        !value
    );
  }

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
    setWallpaperPicker(
      false
    );

    try {
      await ScreenOrientation
        .unlockAsync();
    } catch {}

    onClose();
  }

  return (
    <Modal
      visible={
        visible
      }
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      supportedOrientations={[
        'portrait',
        'portrait-upside-down',
        'landscape-left',
        'landscape-right'
      ]}
      onRequestClose={
        exitClock
      }
    >
      <StatusBar hidden />

      <View
        style={
          styles.page
        }
      >
        {wallpaper.type ===
          'custom' &&
        wallpaper.uri ? (
          <Image
            key={
              wallpaper.uri
            }
            source={{
              uri:
                wallpaper.uri
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

        {/*
         * Neutral readability overlay.
         * It deliberately does not use the
         * selected app theme.
         */}
        <LinearGradient
          pointerEvents="none"
          colors={
            wallpaper.type ===
            'custom'
              ? [
                  'rgba(0,0,0,.22)',
                  'rgba(0,0,0,.28)',
                  'rgba(0,0,0,.52)'
                ]
              : [
                  'rgba(0,0,0,.13)',
                  'rgba(0,0,0,.18)',
                  'rgba(0,0,0,.40)'
                ]
          }
          style={
            StyleSheet.absoluteFill
          }
        />

        <AmbientTheme
          motion={
            ambient
          }
          theme={
            theme
          }
          themeName={
            themeName
          }
        />

        <Pressable
          style={
            StyleSheet.absoluteFill
          }
          onPress={
            toggleCinema
          }
        />

        {/*
         * BRANDING / CHROME
         * disappears in cinema mode.
         */}
        <Animated.View
          pointerEvents={
            chromeVisible
              ? 'auto'
              : 'none'
          }
          style={[
            styles.brand,

            {
              top:
                Math.max(
                  landscape
                    ? 14
                    : 20,

                  insets.top +
                  8
                ),

              left:
                Math.max(
                  20,
                  insets.left +
                  16
                ),

              opacity:
                chrome,

              transform: [
                {
                  translateY:
                    chrome.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [-18, 0]
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

          <View
            style={
              styles.localPill
            }
          >
            <View
              style={
                styles.localDot
              }
            />

            <Text
              style={[
                styles.localText,

                {
                  fontFamily:
                    bold
                }
              ]}
            >
              NMIX • LOCAL TIME
            </Text>
          </View>
        </Animated.View>

        {/*
         * TIME + DATE remain visible when
         * cinema mode hides the chrome.
         */}
        <Animated.View
          style={[
            styles.clockArea,

            {
              paddingHorizontal:
                landscape
                  ? 70
                  : 20,

              opacity:
                entrance,

              transform: [
                {
                  scale:
                    entrance.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [0.97, 1]
                    })
                }
              ]
            }
          ]}
        >
          <Pressable
            onPress={
              changeStyle
            }
            style={
              styles.clockTap
            }
          >
            <Animated.View
              style={[
                styles.clockContent,

                {
                  opacity:
                    styleMotion,

                  transform: [
                    {
                      scale:
                        styleMotion
                          .interpolate({
                            inputRange:
                              [0, 1],

                            outputRange:
                              [0.96, 1]
                          })
                    },

                    {
                      translateY:
                        styleMotion
                          .interpolate({
                            inputRange:
                              [0, 1],

                            outputRange:
                              [8, 0]
                          })
                    }
                  ]
                }
              ]}
            >
              <ClockStyle
                index={
                  clockStyle
                }
                now={
                  now
                }
                parts={
                  parts
                }
                landscape={
                  landscape
                }
                regular={
                  regular
                }
                bold={
                  bold
                }
              />
            </Animated.View>
          </Pressable>
        </Animated.View>

        <Animated.View
          pointerEvents={
            chromeVisible
              ? 'auto'
              : 'none'
          }
          style={[
            styles.controls,

            {
              right:
                Math.max(
                  16,
                  insets.right +
                  12
                ),

              bottom:
                Math.max(
                  14,
                  insets.bottom +
                  10
                ),

              opacity:
                chrome,

              transform: [
                {
                  translateY:
                    chrome.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [22, 0]
                    })
                }
              ]
            }
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
              color={
                FOREGROUND
              }
            />

            <Text
              style={[
                styles.controlText,

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
              color={
                FOREGROUND
              }
            />

            <Text
              style={[
                styles.controlText,

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
              styles.exit
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
                styles.controlText,

                {
                  fontFamily:
                    regular
                }
              ]}
            >
              Exit
            </Text>
          </MotionPressable>
        </Animated.View>

        {showTip && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.tip,

              {
                opacity:
                  tipMotion,

                transform: [
                  {
                    translateY:
                      tipMotion
                        .interpolate({
                          inputRange:
                            [0, 1],

                          outputRange:
                            [10, 0]
                        })
                  }
                ]
              }
            ]}
          >
            <Text
              style={[
                styles.tipText,

                {
                  fontFamily:
                    regular
                }
              ]}
            >
              Tap clock to change style
            </Text>
          </Animated.View>
        )}

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
          theme={
            theme
          }
          font={
            font
          }
        />
      </View>
    </Modal>
  );
}

function ClockStyle({
  index,
  now,
  parts,
  landscape,
  regular,
  bold
}) {
  const date =
    formatDate(
      now
    );

  if (index === 0) {
    return (
      <View
        style={
          styles.styleCenter
        }
      >
        <Text
          style={[
            styles.styleName,

            {
              fontFamily:
                bold
            }
          ]}
        >
          CLASSIC DIGITAL
        </Text>

        <View
          style={
            styles.classicRow
          }
        >
          <Text
            style={[
              styles.bigTime,

              landscape &&
                styles.bigTimeLandscape,

              {
                fontFamily:
                  bold
              }
            ]}
          >
            {parts.h12}:{parts.minute}:{parts.second}
          </Text>

          <Text
            style={[
              styles.period,

              {
                fontFamily:
                  bold
              }
            ]}
          >
            {parts.period}
          </Text>
        </View>

        <DateText
          text={
            date
          }
          font={
            regular
          }
        />
      </View>
    );
  }

  if (index === 1) {
    return (
      <View
        style={
          styles.styleCenter
        }
      >
        <Text
          style={[
            styles.styleName,

            {
              fontFamily:
                bold
            }
          ]}
        >
          CLEAN
        </Text>

        <Text
          style={[
            styles.bigTime,

            landscape &&
              styles.bigTimeLandscape,

            {
              fontFamily:
                bold
            }
          ]}
        >
          {parts.h24}:{parts.minute}:{parts.second}
        </Text>

        <DateText
          text={
            date
          }
          font={
            regular
          }
        />
      </View>
    );
  }

  if (index === 2) {
    return (
      <View
        style={
          styles.styleCenter
        }
      >
        <Text
          style={[
            styles.minimalTime,

            landscape &&
              styles.minimalLandscape,

            {
              fontFamily:
                regular
            }
          ]}
        >
          {parts.h24}:{parts.minute}
        </Text>

        <DateText
          text={
            date
          }
          font={
            regular
          }
        />
      </View>
    );
  }

  if (index === 3) {
    return (
      <View
        style={
          styles.styleCenter
        }
      >
        <View
          style={
            styles.secondsRow
          }
        >
          <Text
            style={[
              styles.hoursMinutes,

              {
                fontFamily:
                  bold
              }
            ]}
          >
            {parts.h24}:{parts.minute}
          </Text>

          <Text
            style={[
              styles.secondsBig,

              {
                fontFamily:
                  bold
              }
            ]}
          >
            {parts.second}
          </Text>
        </View>

        <DateText
          text={
            date
          }
          font={
            regular
          }
        />
      </View>
    );
  }

  if (index === 4) {
    return (
      <View
        style={
          styles.styleCenter
        }
      >
        <View
          style={
            styles.splitRow
          }
        >
          <TimeCard
            value={
              parts.h24
            }
            label="HOUR"
            font={
              bold
            }
          />

          <Text
            style={[
              styles.splitColon,

              {
                fontFamily:
                  bold
              }
            ]}
          >
            :
          </Text>

          <TimeCard
            value={
              parts.minute
            }
            label="MIN"
            font={
              bold
            }
          />

          <Text
            style={[
              styles.splitColon,

              {
                fontFamily:
                  bold
              }
            ]}
          >
            :
          </Text>

          <TimeCard
            value={
              parts.second
            }
            label="SEC"
            font={
              bold
            }
          />
        </View>

        <DateText
          text={
            date
          }
          font={
            regular
          }
        />
      </View>
    );
  }

  if (index === 5) {
    return (
      <View
        style={
          styles.styleCenter
        }
      >
        <Text
          style={[
            styles.elegant,

            {
              fontFamily:
                regular
            }
          ]}
        >
          {parts.h12}:{parts.minute}
        </Text>

        <Text
          style={[
            styles.elegantPeriod,

            {
              fontFamily:
                regular
            }
          ]}
        >
          {parts.period}
        </Text>

        <DateText
          text={
            date
          }
          font={
            regular
          }
        />
      </View>
    );
  }

  if (index === 6) {
    return (
      <View
        style={
          styles.styleCenter
        }
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            styles.cinema,

            {
              fontFamily:
                bold
            }
          ]}
        >
          {parts.h24}:{parts.minute}
        </Text>

        <Text
          style={[
            styles.cinemaSeconds,

            {
              fontFamily:
                regular
            }
          ]}
        >
          {parts.second}
        </Text>

        <DateText
          text={
            date
          }
          font={
            regular
          }
        />
      </View>
    );
  }

  if (index === 7) {
    return (
      <View
        style={
          styles.styleCenter
        }
      >
        <View
          style={
            styles.stacked
          }
        >
          <Text
            style={[
              styles.stackedHour,

              {
                fontFamily:
                  bold
              }
            ]}
          >
            {parts.h24}
          </Text>

          <View
            style={
              styles.stackLine
            }
          />

          <Text
            style={[
              styles.stackedMinute,

              {
                fontFamily:
                  bold
              }
            ]}
          >
            {parts.minute}
          </Text>
        </View>

        <DateText
          text={
            date
          }
          font={
            regular
          }
        />
      </View>
    );
  }

  if (index === 8) {
    return (
      <View
        style={
          styles.styleCenter
        }
      >
        <AnalogClock
          now={
            now
          }
          size={
            landscape
              ? 260
              : 280
          }
        />

        <DateText
          text={
            date
          }
          font={
            regular
          }
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.hybrid,

        landscape &&
          styles.hybridLandscape
      ]}
    >
      <AnalogClock
        now={
          now
        }
        size={
          landscape
            ? 220
            : 210
        }
      />

      <View
        style={
          styles.hybridDigital
        }
      >
        <Text
          style={[
            styles.hybridTime,

            {
              fontFamily:
                bold
            }
          ]}
        >
          {parts.h24}:{parts.minute}
        </Text>

        <Text
          style={[
            styles.hybridSeconds,

            {
              fontFamily:
                bold
            }
          ]}
        >
          {parts.second}
        </Text>

        <DateText
          text={
            date
          }
          font={
            regular
          }
        />
      </View>
    </View>
  );
}

function AnalogClock({
  now,
  size
}) {
  const center =
    size / 2;

  const radius =
    size * 0.43;

  const seconds =
    now.getSeconds();

  const minutes =
    now.getMinutes() +
    seconds / 60;

  const hours =
    (
      now.getHours() %
      12
    ) +
    minutes / 60;

  const secondAngle =
    seconds * 6;

  const minuteAngle =
    minutes * 6;

  const hourAngle =
    hours * 30;

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <Circle
        cx={center}
        cy={center}
        r={radius}
        fill="rgba(0,0,0,.18)"
        stroke="rgba(244,247,246,.40)"
        strokeWidth="2"
      />

      {Array.from({
        length: 12
      }).map(
        (
          _,
          index
        ) => {
          const angle =
            (
              index *
                30 -
              90
            ) *
            Math.PI /
            180;

          const outer =
            radius -
            11;

          const inner =
            radius -
            21;

          return (
            <Line
              key={
                index
              }

              x1={
                center +
                Math.cos(
                  angle
                ) *
                  inner
              }

              y1={
                center +
                Math.sin(
                  angle
                ) *
                  inner
              }

              x2={
                center +
                Math.cos(
                  angle
                ) *
                  outer
              }

              y2={
                center +
                Math.sin(
                  angle
                ) *
                  outer
              }

              stroke={
                index %
                  3 ===
                0
                  ? FOREGROUND
                  : FOREGROUND_FAINT
              }

              strokeWidth={
                index %
                  3 ===
                0
                  ? 3
                  : 1.5
              }

              strokeLinecap="round"
            />
          );
        }
      )}

      <Hand
        center={
          center
        }
        radius={
          radius *
          0.50
        }
        angle={
          hourAngle
        }
        width={5}
        color={
          FOREGROUND
        }
      />

      <Hand
        center={
          center
        }
        radius={
          radius *
          0.70
        }
        angle={
          minuteAngle
        }
        width={3.5}
        color={
          FOREGROUND
        }
      />

      <Hand
        center={
          center
        }
        radius={
          radius *
          0.76
        }
        angle={
          secondAngle
        }
        width={1.8}
        color={
          FOREGROUND_SOFT
        }
      />

      <Circle
        cx={
          center
        }
        cy={
          center
        }
        r="5"
        fill={
          FOREGROUND
        }
      />
    </Svg>
  );
}

function Hand({
  center,
  radius,
  angle,
  width,
  color
}) {
  const radians =
    (
      angle -
      90
    ) *
    Math.PI /
    180;

  return (
    <Line
      x1={
        center
      }
      y1={
        center
      }

      x2={
        center +
        Math.cos(
          radians
        ) *
          radius
      }

      y2={
        center +
        Math.sin(
          radians
        ) *
          radius
      }

      stroke={
        color
      }

      strokeWidth={
        width
      }

      strokeLinecap="round"
    />
  );
}

function DateText({
  text,
  font
}) {
  return (
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      style={[
        styles.date,

        {
          fontFamily:
            font
        }
      ]}
    >
      {text}
    </Text>
  );
}

function TimeCard({
  value,
  label,
  font
}) {
  return (
    <View
      style={
        styles.timeCard
      }
    >
      <Text
        style={[
          styles.timeCardValue,

          {
            fontFamily:
              font
          }
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.timeCardLabel,

          {
            fontFamily:
              font
          }
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function AmbientTheme({
  motion,
  theme,
  themeName
}) {
  const x =
    motion.interpolate({
      inputRange:
        [0, 1],

      outputRange:
        themeName ===
          'blue'
          ? [
              -180,
              180
            ]
          : [
              -100,
              110
            ]
    });

  const y =
    motion.interpolate({
      inputRange:
        [0, 1],

      outputRange:
        themeName ===
          'orange'
          ? [
              -100,
              130
            ]
          : [
              -65,
              85
            ]
    });

  const scale =
    motion.interpolate({
      inputRange:
        [0, 1],

      outputRange:
        themeName ===
          'rose'
          ? [
              0.88,
              1.28
            ]
          : [
              1,
              1.20
            ]
    });

  return (
    <View
      pointerEvents="none"
      style={
        StyleSheet.absoluteFill
      }
    >
      <Animated.View
        style={[
          styles.ambient,

          {
            opacity:
              motion.interpolate({
                inputRange:
                  [0, 1],

                outputRange:
                  [0.10, 0.25]
              }),

            transform: [
              {
                translateX:
                  x
              },

              {
                translateY:
                  y
              },

              {
                scale
              }
            ]
          }
        ]}
      >
        <LinearGradient
          colors={[
            'transparent',
            `${theme.accent}03`,
            `${theme.accent}24`,
            `${theme.accentLight}05`,
            'transparent'
          ]}
          style={
            styles.ambientFill
          }
        />
      </Animated.View>
    </View>
  );
}

function ambientDuration(
  themeName
) {
  const values = {
    green: 9000,
    blue: 10500,
    purple: 9500,
    orange: 8200,
    rose: 7600
  };

  return (
    values[
      themeName
    ] ||
    9000
  );
}

function getTimeParts(
  date
) {
  const rawHour =
    date.getHours();

  const h12Value =
    rawHour %
      12 ||
    12;

  return {
    h12:
      String(
        h12Value
      ).padStart(
        2,
        '0'
      ),

    h24:
      String(
        rawHour
      ).padStart(
        2,
        '0'
      ),

    minute:
      String(
        date.getMinutes()
      ).padStart(
        2,
        '0'
      ),

    second:
      String(
        date.getSeconds()
      ).padStart(
        2,
        '0'
      ),

    period:
      rawHour >= 12
        ? 'PM'
        : 'AM'
  };
}

function formatDate(
  date
) {
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
    page: {
      flex: 1,

      overflow:
        'hidden',

      backgroundColor:
        '#030806'
    },

    ambient: {
      position:
        'absolute',

      width: 720,
      height: 720,

      left: -340,
      top: -330
    },

    ambientFill: {
      flex: 1,

      borderRadius: 380
    },

    brand: {
      position:
        'absolute',

      zIndex: 30,

      alignItems:
        'flex-start'
    },

    brandSub: {
      color:
        FOREGROUND_MUTED,

      fontSize: 6,

      lineHeight: 9,

      letterSpacing: 1.4
    },

    brandFix: {
      minWidth: 150,

      paddingRight: 18,

      overflow:
        'visible'
    },

    brandTitle: {
      color:
        FOREGROUND,

      fontSize: 23,

      lineHeight: 34,

      letterSpacing: 4,

      includeFontPadding:
        false
    },

    localPill: {
      minHeight: 25,

      marginTop: 3,

      paddingHorizontal: 9,

      flexDirection:
        'row',

      alignItems:
        'center',

      gap: 6,

      borderWidth: 1,

      borderColor:
        'rgba(244,247,246,.16)',

      borderRadius: 999,

      backgroundColor:
        'rgba(0,0,0,.18)'
    },

    localDot: {
      width: 5,

      height: 5,

      borderRadius: 3,

      backgroundColor:
        FOREGROUND_SOFT
    },

    localText: {
      color:
        FOREGROUND_MUTED,

      fontSize: 7.2,

      lineHeight: 11,

      letterSpacing: 1
    },

    clockArea: {
      flex: 1,

      justifyContent:
        'center',

      alignItems:
        'center'
    },

    clockTap: {
      width: '100%',

      minHeight: '55%',

      justifyContent:
        'center',

      alignItems:
        'center'
    },

    clockContent: {
      width: '100%',

      justifyContent:
        'center',

      alignItems:
        'center'
    },

    styleCenter: {
      width: '100%',

      justifyContent:
        'center',

      alignItems:
        'center'
    },

    styleName: {
      marginBottom: 6,

      color:
        FOREGROUND_MUTED,

      fontSize: 8,

      letterSpacing: 2.5
    },

    classicRow: {
      flexDirection:
        'row',

      justifyContent:
        'center',

      alignItems:
        'flex-end'
    },

    bigTime: {
      color:
        FOREGROUND,

      fontSize: 72,

      lineHeight: 88,

      includeFontPadding:
        false,

      textShadowColor:
        'rgba(0,0,0,.28)',

      textShadowRadius: 12
    },

    bigTimeLandscape: {
      fontSize: 105,

      lineHeight: 122
    },

    period: {
      marginLeft: 9,

      marginBottom: 13,

      color:
        FOREGROUND_SOFT,

      fontSize: 16,

      lineHeight: 20
    },

    date: {
      width: '90%',

      marginTop: 9,

      color:
        FOREGROUND_SOFT,

      fontSize: 13,

      lineHeight: 20,

      textAlign:
        'center',

      textShadowColor:
        'rgba(0,0,0,.45)',

      textShadowRadius: 9
    },

    minimalTime: {
      color:
        FOREGROUND,

      fontSize: 92,

      lineHeight: 110,

      letterSpacing: 2,

      includeFontPadding:
        false,

      textShadowColor:
        'rgba(0,0,0,.28)',

      textShadowRadius: 12
    },

    minimalLandscape: {
      fontSize: 135,

      lineHeight: 150
    },

    secondsRow: {
      flexDirection:
        'row',

      alignItems:
        'flex-end'
    },

    hoursMinutes: {
      color:
        FOREGROUND,

      fontSize: 78,

      lineHeight: 96
    },

    secondsBig: {
      marginLeft: 12,

      marginBottom: 10,

      color:
        FOREGROUND_SOFT,

      fontSize: 28,

      lineHeight: 34
    },

    splitRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      gap: 7
    },

    splitColon: {
      color:
        FOREGROUND_MUTED,

      fontSize: 28
    },

    timeCard: {
      minWidth: 77,

      paddingHorizontal: 12,

      paddingVertical: 12,

      alignItems:
        'center',

      borderWidth: 1,

      borderColor:
        'rgba(244,247,246,.16)',

      borderRadius: 15,

      backgroundColor:
        'rgba(0,0,0,.23)'
    },

    timeCardValue: {
      color:
        FOREGROUND,

      fontSize: 34,

      lineHeight: 40
    },

    timeCardLabel: {
      marginTop: 2,

      color:
        FOREGROUND_FAINT,

      fontSize: 7
    },

    elegant: {
      color:
        FOREGROUND,

      fontSize: 88,

      lineHeight: 105,

      letterSpacing: 3
    },

    elegantPeriod: {
      marginTop: -7,

      color:
        FOREGROUND_SOFT,

      fontSize: 13,

      letterSpacing: 4
    },

    cinema: {
      width: '100%',

      color:
        FOREGROUND,

      fontSize: 132,

      lineHeight: 150,

      textAlign:
        'center',

      includeFontPadding:
        false,

      textShadowColor:
        'rgba(0,0,0,.30)',

      textShadowRadius: 14
    },

    cinemaSeconds: {
      marginTop: -10,

      color:
        FOREGROUND_SOFT,

      fontSize: 23,

      letterSpacing: 8
    },

    stacked: {
      alignItems:
        'center'
    },

    stackedHour: {
      color:
        FOREGROUND,

      fontSize: 96,

      lineHeight: 102
    },

    stackLine: {
      width: 105,

      height: 3,

      marginVertical: 5,

      borderRadius: 99,

      backgroundColor:
        FOREGROUND_MUTED
    },

    stackedMinute: {
      color:
        FOREGROUND,

      fontSize: 96,

      lineHeight: 102
    },

    hybrid: {
      flexDirection:
        'column',

      alignItems:
        'center',

      gap: 12
    },

    hybridLandscape: {
      flexDirection:
        'row',

      justifyContent:
        'center',

      gap: 30
    },

    hybridDigital: {
      alignItems:
        'center'
    },

    hybridTime: {
      color:
        FOREGROUND,

      fontSize: 54,

      lineHeight: 65
    },

    hybridSeconds: {
      color:
        FOREGROUND_SOFT,

      fontSize: 17,

      letterSpacing: 6
    },

    controls: {
      position:
        'absolute',

      zIndex: 40,

      flexDirection:
        'row',

      alignItems:
        'center',

      gap: 8
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
        'rgba(244,247,246,.16)',

      borderRadius: 999,

      backgroundColor:
        'rgba(0,0,0,.32)'
    },

    exit: {
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
        'rgba(244,247,246,.20)',

      borderRadius: 999,

      backgroundColor:
        'rgba(0,0,0,.40)'
    },

    controlText: {
      color:
        FOREGROUND,

      fontSize: 10,

      lineHeight: 14
    },

    exitX: {
      color:
        FOREGROUND,

      fontSize: 19,

      lineHeight: 21
    },

    tip: {
      position:
        'absolute',

      left: 0,

      right: 0,

      bottom: 82,

      alignItems:
        'center',

      zIndex: 35
    },

    tipText: {
      paddingHorizontal: 14,

      paddingVertical: 8,

      overflow:
        'hidden',

      color:
        FOREGROUND,

      fontSize: 10,

      borderRadius: 999,

      backgroundColor:
        'rgba(0,0,0,.48)'
    }
  });
