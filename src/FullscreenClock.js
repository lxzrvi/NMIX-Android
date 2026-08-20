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

const STYLE_KEY =
  'nmix-fullscreen-clock-style';

const COLOR_KEY =
  'nmix-fullscreen-clock-color';

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

const CLOCK_COLORS = [
  {
    name: 'WHITE',
    color: '#F5F7F6'
  },
  {
    name: 'WARM',
    color: '#FFE3B5'
  },
  {
    name: 'MINT',
    color: '#BDF5DF'
  },
  {
    name: 'SKY',
    color: '#BFE5FF'
  },
  {
    name: 'VIOLET',
    color: '#DDCBFF'
  },
  {
    name: 'ROSE',
    color: '#FFCADA'
  }
];

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
    colorIndex,
    setColorIndex
  ] = useState(0);

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

  const styleMotion =
    useRef(
      new Animated.Value(1)
    ).current;

  const colorMotion =
    useRef(
      new Animated.Value(1)
    ).current;

  useEffect(() => {
    async function load() {
      try {
        const [
          savedWallpaper,
          savedStyle,
          savedColor
        ] =
          await Promise.all([
            loadClockWallpaper(),

            AsyncStorage
              .getItem(
                STYLE_KEY
              ),

            AsyncStorage
              .getItem(
                COLOR_KEY
              )
          ]);

        setWallpaper(
          savedWallpaper
        );

        const style =
          Number(
            savedStyle
          );

        if (
          Number.isInteger(
            style
          ) &&
          style >= 0 &&
          style <
            CLOCK_STYLES.length
        ) {
          setClockStyle(
            style
          );
        }

        const color =
          Number(
            savedColor
          );

        if (
          Number.isInteger(
            color
          ) &&
          color >= 0 &&
          color <
            CLOCK_COLORS.length
        ) {
          setColorIndex(
            color
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

  const clockColor =
    CLOCK_COLORS[
      colorIndex
    ].color;

  const clockColorName =
    CLOCK_COLORS[
      colorIndex
    ].name;

  function changeStyle(
    direction
  ) {
    const next =
      (
        clockStyle +
        direction +
        CLOCK_STYLES.length
      ) %
      CLOCK_STYLES.length;

    styleMotion
      .stopAnimation();

    Animated.timing(
      styleMotion,
      {
        toValue: 0,

        duration: 130,

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

  function changeColor(
    direction
  ) {
    const next =
      (
        colorIndex +
        direction +
        CLOCK_COLORS.length
      ) %
      CLOCK_COLORS.length;

    colorMotion
      .stopAnimation();

    Animated.timing(
      colorMotion,
      {
        toValue: 0,

        duration: 120,

        useNativeDriver:
          true
      }
    ).start(() => {
      setColorIndex(
        next
      );

      AsyncStorage
        .setItem(
          COLOR_KEY,
          String(next)
        )
        .catch(
          () => {}
        );

      colorMotion
        .setValue(0);

      Animated.timing(
        colorMotion,
        {
          toValue: 1,

          duration: 380,

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

  function hideControls() {
    setChromeVisible(
      false
    );
  }

  function restoreControls() {
    if (
      wallpaperPicker ||
      chromeVisible
    ) {
      return;
    }

    setChromeVisible(
      true
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

        <LinearGradient
          pointerEvents="none"
          colors={
            wallpaper.type ===
            'custom'
              ? [
                  'rgba(0,0,0,.22)',
                  'rgba(0,0,0,.27)',
                  'rgba(0,0,0,.50)'
                ]
              : [
                  'rgba(0,0,0,.12)',
                  'rgba(0,0,0,.17)',
                  'rgba(0,0,0,.38)'
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

        {/*
         * Screen tap ONLY restores controls
         * when they have been hidden.
         */}
        {!chromeVisible && (
          <Pressable
            style={[
              StyleSheet.absoluteFill,
              styles.restoreTouch
            ]}
            onPress={
              restoreControls
            }
          />
        )}

        <Animated.View
          pointerEvents="none"
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
          <Animated.View
            style={[
              styles.clockContent,

              {
                opacity:
                  Animated.multiply(
                    styleMotion,
                    colorMotion
                  ),

                transform: [
                  {
                    scale:
                      styleMotion
                        .interpolate({
                          inputRange:
                            [0, 1],

                          outputRange:
                            [0.97, 1]
                        })
                  },

                  {
                    translateY:
                      styleMotion
                        .interpolate({
                          inputRange:
                            [0, 1],

                          outputRange:
                            [7, 0]
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
              color={
                clockColor
              }
            />
          </Animated.View>
        </Animated.View>

        {/*
         * Everything below is chrome and
         * disappears with Hide.
         */}
        <Animated.View
          pointerEvents={
            chromeVisible
              ? 'box-none'
              : 'none'
          }
          style={[
            styles.chromeLayer,

            {
              opacity:
                chrome
            }
          ]}
        >
          <Animated.View
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
                style={[
                  styles.localDot,

                  {
                    backgroundColor:
                      clockColor
                  }
                ]}
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
           * STYLE arrows.
           */}
          <View
            pointerEvents="box-none"
            style={
              styles.styleNavigation
            }
          >
            <SideButton
              text="‹"
              onPress={() =>
                changeStyle(
                  -1
                )
              }
              side="left"
              font={
                regular
              }
            />

            <View
              pointerEvents="none"
              style={
                styles.navCenter
              }
            >
              <Text
                style={[
                  styles.navCaption,

                  {
                    fontFamily:
                      regular
                  }
                ]}
              >
                CLOCK STYLE
              </Text>

              <Text
                numberOfLines={1}
                style={[
                  styles.navValue,

                  {
                    fontFamily:
                      bold
                  }
                ]}
              >
                {
                  CLOCK_STYLES[
                    clockStyle
                  ]
                }
              </Text>
            </View>

            <SideButton
              text="›"
              onPress={() =>
                changeStyle(
                  1
                )
              }
              side="right"
              font={
                regular
              }
            />
          </View>

          {/*
           * COLOR arrows, positioned slightly
           * lower than style controls.
           */}
          <View
            pointerEvents="box-none"
            style={
              styles.colorNavigation
            }
          >
            <SideButton
              text="‹"
              onPress={() =>
                changeColor(
                  -1
                )
              }
              side="left"
              small
              font={
                regular
              }
            />

            <View
              pointerEvents="none"
              style={
                styles.colorCenter
              }
            >
              <View
                style={[
                  styles.colorDot,

                  {
                    backgroundColor:
                      clockColor
                  }
                ]}
              />

              <Text
                style={[
                  styles.colorName,

                  {
                    color:
                      clockColor,

                    fontFamily:
                      bold
                  }
                ]}
              >
                {clockColorName}
              </Text>
            </View>

            <SideButton
              text="›"
              onPress={() =>
                changeColor(
                  1
                )
              }
              side="right"
              small
              font={
                regular
              }
            />
          </View>

          <Animated.View
            style={[
              styles.controls,

              {
                right:
                  Math.max(
                    12,
                    insets.right +
                    10
                  ),

                left:
                  Math.max(
                    12,
                    insets.left +
                    10
                  ),

                bottom:
                  Math.max(
                    14,
                    insets.bottom +
                    10
                  ),

                transform: [
                  {
                    translateY:
                      chrome.interpolate({
                        inputRange:
                          [0, 1],

                        outputRange:
                          [24, 0]
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
                size={18}
                color="#ffffff"
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
                size={18}
                color="#ffffff"
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
                hideControls
              }
              style={[
                styles.control,
                styles.hideControl
              ]}
            >
              <View
                style={
                  styles.hideIcon
                }
              >
                <View
                  style={
                    styles.hideEye
                  }
                />
              </View>

              <Text
                style={[
                  styles.controlText,

                  {
                    fontFamily:
                      regular
                  }
                ]}
              >
                Hide
              </Text>
            </MotionPressable>

            <MotionPressable
              onPress={
                exitClock
              }
              style={[
                styles.control,
                styles.exit
              ]}
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
        </Animated.View>

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

function SideButton({
  text,
  onPress,
  side,
  small = false,
  font
}) {
  return (
    <MotionPressable
      onPress={
        onPress
      }
      hitSlop={10}
      style={[
        styles.sideButton,

        small &&
          styles.sideButtonSmall,

        side ===
          'left'
          ? styles.sideLeft
          : styles.sideRight
      ]}
    >
      <Text
        style={[
          styles.sideArrow,

          small &&
            styles.sideArrowSmall,

          {
            fontFamily:
              font
          }
        ]}
      >
        {text}
      </Text>
    </MotionPressable>
  );
}

function ClockStyle({
  index,
  now,
  parts,
  landscape,
  regular,
  bold,
  color
}) {
  const date =
    formatDate(
      now
    );

  if (
    index === 0
  ) {
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
              color:
                withOpacity(
                  color,
                  0.60
                ),

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
                color,

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
                color:
                  withOpacity(
                    color,
                    0.72
                  ),

                fontFamily:
                  bold
              }
            ]}
          >
            {parts.period}
          </Text>
        </View>

        <DateText
          text={date}
          font={regular}
          color={color}
        />
      </View>
    );
  }

  if (
    index === 1
  ) {
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
              color:
                withOpacity(
                  color,
                  0.60
                ),

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
              color,
              fontFamily:
                bold
            }
          ]}
        >
          {parts.h24}:{parts.minute}:{parts.second}
        </Text>

        <DateText
          text={date}
          font={regular}
          color={color}
        />
      </View>
    );
  }

  if (
    index === 2
  ) {
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
              color,

              fontFamily:
                regular
            }
          ]}
        >
          {parts.h24}:{parts.minute}
        </Text>

        <DateText
          text={date}
          font={regular}
          color={color}
        />
      </View>
    );
  }

  if (
    index === 3
  ) {
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
                color,

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
                color:
                  withOpacity(
                    color,
                    0.72
                  ),

                fontFamily:
                  bold
              }
            ]}
          >
            {parts.second}
          </Text>
        </View>

        <DateText
          text={date}
          font={regular}
          color={color}
        />
      </View>
    );
  }

  if (
    index === 4
  ) {
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
            font={bold}
            color={color}
          />

          <Text
            style={[
              styles.splitColon,

              {
                color:
                  withOpacity(
                    color,
                    0.60
                  ),

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
            font={bold}
            color={color}
          />

          <Text
            style={[
              styles.splitColon,

              {
                color:
                  withOpacity(
                    color,
                    0.60
                  ),

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
            font={bold}
            color={color}
          />
        </View>

        <DateText
          text={date}
          font={regular}
          color={color}
        />
      </View>
    );
  }

  if (
    index === 5
  ) {
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
              color,

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
              color:
                withOpacity(
                  color,
                  0.70
                ),

              fontFamily:
                regular
            }
          ]}
        >
          {parts.period}
        </Text>

        <DateText
          text={date}
          font={regular}
          color={color}
        />
      </View>
    );
  }

  if (
    index === 6
  ) {
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
              color,

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
              color:
                withOpacity(
                  color,
                  0.72
                ),

              fontFamily:
                regular
            }
          ]}
        >
          {parts.second}
        </Text>

        <DateText
          text={date}
          font={regular}
          color={color}
        />
      </View>
    );
  }

  if (
    index === 7
  ) {
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
                color,

                fontFamily:
                  bold
              }
            ]}
          >
            {parts.h24}
          </Text>

          <View
            style={[
              styles.stackLine,

              {
                backgroundColor:
                  withOpacity(
                    color,
                    0.60
                  )
              }
            ]}
          />

          <Text
            style={[
              styles.stackedMinute,

              {
                color,

                fontFamily:
                  bold
              }
            ]}
          >
            {parts.minute}
          </Text>
        </View>

        <DateText
          text={date}
          font={regular}
          color={color}
        />
      </View>
    );
  }

  if (
    index === 8
  ) {
    return (
      <View
        style={
          styles.styleCenter
        }
      >
        <AnalogClock
          now={now}
          size={
            landscape
              ? 260
              : 280
          }
          color={color}
        />

        <DateText
          text={date}
          font={regular}
          color={color}
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
        now={now}
        size={
          landscape
            ? 220
            : 210
        }
        color={color}
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
              color,

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
              color:
                withOpacity(
                  color,
                  0.72
                ),

              fontFamily:
                bold
            }
          ]}
        >
          {parts.second}
        </Text>

        <DateText
          text={date}
          font={regular}
          color={color}
        />
      </View>
    </View>
  );
}

function AnalogClock({
  now,
  size,
  color
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
        stroke={
          withOpacity(
            color,
            0.42
          )
        }
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
              key={index}

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
                withOpacity(
                  color,
                  index %
                    3 ===
                  0
                    ? 0.92
                    : 0.38
                )
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
        center={center}
        radius={
          radius *
          0.50
        }
        angle={
          hourAngle
        }
        width={5}
        color={color}
      />

      <Hand
        center={center}
        radius={
          radius *
          0.70
        }
        angle={
          minuteAngle
        }
        width={3.5}
        color={color}
      />

      <Hand
        center={center}
        radius={
          radius *
          0.76
        }
        angle={
          secondAngle
        }
        width={1.8}
        color={
          withOpacity(
            color,
            0.72
          )
        }
      />

      <Circle
        cx={center}
        cy={center}
        r="5"
        fill={color}
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
      x1={center}
      y1={center}

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

      stroke={color}

      strokeWidth={
        width
      }

      strokeLinecap="round"
    />
  );
}

function DateText({
  text,
  font,
  color
}) {
  return (
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      style={[
        styles.date,

        {
          color:
            withOpacity(
              color,
              0.70
            ),

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
  font,
  color
}) {
  return (
    <View
      style={[
        styles.timeCard,

        {
          borderColor:
            withOpacity(
              color,
              0.18
            )
        }
      ]}
    >
      <Text
        style={[
          styles.timeCardValue,

          {
            color,

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
            color:
              withOpacity(
                color,
                0.48
              ),

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
          ? [-180, 180]
          : [-100, 110]
    });

  const y =
    motion.interpolate({
      inputRange:
        [0, 1],

      outputRange:
        themeName ===
          'orange'
          ? [-100, 130]
          : [-65, 85]
    });

  const scale =
    motion.interpolate({
      inputRange:
        [0, 1],

      outputRange:
        themeName ===
          'rose'
          ? [0.88, 1.28]
          : [1, 1.20]
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
                  [0.10, 0.24]
              }),

            transform: [
              {
                translateX: x
              },

              {
                translateY: y
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
            `${theme.accent}22`,
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

/*
 * Our palette is #RRGGBB.
 * SVG/Text both accept rgba().
 */
function withOpacity(
  hex,
  opacity
) {
  const clean =
    String(hex)
      .replace(
        '#',
        ''
      );

  if (
    clean.length !==
    6
  ) {
    return hex;
  }

  const r =
    parseInt(
      clean.slice(
        0,
        2
      ),
      16
    );

  const g =
    parseInt(
      clean.slice(
        2,
        4
      ),
      16
    );

  const b =
    parseInt(
      clean.slice(
        4,
        6
      ),
      16
    );

  return `rgba(${r},${g},${b},${opacity})`;
}

const styles =
  StyleSheet.create({
    page: {
      flex: 1,
      overflow: 'hidden',
      backgroundColor:
        '#030806'
    },

    restoreTouch: {
      zIndex: 90
    },

    ambient: {
      position: 'absolute',
      width: 720,
      height: 720,
      left: -340,
      top: -330
    },

    ambientFill: {
      flex: 1,
      borderRadius: 380
    },

    clockArea: {
      flex: 1,
      zIndex: 10,
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

    chromeLayer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 40
    },

    brand: {
      position: 'absolute',
      zIndex: 45,
      alignItems:
        'flex-start'
    },

    brandSub: {
      color:
        'rgba(245,247,246,.54)',
      fontSize: 6,
      lineHeight: 9,
      letterSpacing: 1.4
    },

    brandFix: {
      minWidth: 175,
      paddingHorizontal: 4,
      paddingRight: 24,
      overflow: 'visible'
    },

    brandTitle: {
      color: '#F5F7F6',
      fontSize: 23,
      lineHeight: 36,
      letterSpacing: 4,
      includeFontPadding:
        false
    },

    localPill: {
      minHeight: 25,
      marginTop: 3,
      paddingHorizontal: 9,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderWidth: 1,
      borderColor:
        'rgba(255,255,255,.15)',
      borderRadius: 999,
      backgroundColor:
        'rgba(0,0,0,.22)'
    },

    localDot: {
      width: 5,
      height: 5,
      borderRadius: 3
    },

    localText: {
      color:
        'rgba(255,255,255,.58)',
      fontSize: 7.2,
      lineHeight: 11,
      letterSpacing: 1
    },

    styleNavigation: {
      position: 'absolute',
      zIndex: 60,
      left: 12,
      right: 12,
      top: '39%',
      height: 54,
      justifyContent: 'center'
    },

    colorNavigation: {
      position: 'absolute',
      zIndex: 60,
      left: 12,
      right: 12,
      top: '55%',
      height: 46,
      justifyContent: 'center'
    },

    sideButton: {
      position: 'absolute',
      width: 46,
      height: 46,
      top: 4,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor:
        'rgba(255,255,255,.16)',
      borderRadius: 23,
      backgroundColor:
        'rgba(0,0,0,.31)'
    },

    sideButtonSmall: {
      width: 38,
      height: 38,
      top: 4,
      borderRadius: 19
    },

    sideLeft: {
      left: 0
    },

    sideRight: {
      right: 0
    },

    sideArrow: {
      color: '#ffffff',
      fontSize: 33,
      lineHeight: 36,
      includeFontPadding:
        false
    },

    sideArrowSmall: {
      fontSize: 27,
      lineHeight: 30
    },

    navCenter: {
      position: 'absolute',
      left: 60,
      right: 60,
      top: 4,
      height: 46,
      justifyContent: 'center',
      alignItems: 'center'
    },

    navCaption: {
      color:
        'rgba(255,255,255,.40)',
      fontSize: 6.5,
      letterSpacing: 1.6
    },

    navValue: {
      marginTop: 2,
      color:
        'rgba(255,255,255,.76)',
      fontSize: 9.5,
      letterSpacing: 0.8,
      textAlign: 'center'
    },

    colorCenter: {
      position: 'absolute',
      left: 52,
      right: 52,
      top: 4,
      height: 38,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 7
    },

    colorDot: {
      width: 7,
      height: 7,
      borderRadius: 4
    },

    colorName: {
      fontSize: 8,
      letterSpacing: 1.2
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
      fontSize: 8,
      letterSpacing: 2.5
    },

    classicRow: {
      flexDirection: 'row',
      justifyContent:
        'center',
      alignItems:
        'flex-end'
    },

    bigTime: {
      fontSize: 72,
      lineHeight: 88,
      includeFontPadding:
        false,
      textShadowColor:
        'rgba(0,0,0,.35)',
      textShadowRadius: 10
    },

    bigTimeLandscape: {
      fontSize: 105,
      lineHeight: 122
    },

    period: {
      marginLeft: 9,
      marginBottom: 13,
      fontSize: 16,
      lineHeight: 20
    },

    date: {
      width: '90%',
      marginTop: 9,
      fontSize: 13,
      lineHeight: 20,
      textAlign: 'center',
      textShadowColor:
        'rgba(0,0,0,.45)',
      textShadowRadius: 8
    },

    minimalTime: {
      fontSize: 92,
      lineHeight: 110,
      letterSpacing: 2,
      includeFontPadding:
        false,
      textShadowColor:
        'rgba(0,0,0,.34)',
      textShadowRadius: 11
    },

    minimalLandscape: {
      fontSize: 135,
      lineHeight: 150
    },

    secondsRow: {
      flexDirection: 'row',
      alignItems:
        'flex-end'
    },

    hoursMinutes: {
      fontSize: 78,
      lineHeight: 96
    },

    secondsBig: {
      marginLeft: 12,
      marginBottom: 10,
      fontSize: 28,
      lineHeight: 34
    },

    splitRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'center',
      gap: 7
    },

    splitColon: {
      fontSize: 28
    },

    timeCard: {
      minWidth: 77,
      paddingHorizontal: 12,
      paddingVertical: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 15,
      backgroundColor:
        'rgba(0,0,0,.23)'
    },

    timeCardValue: {
      fontSize: 34,
      lineHeight: 40
    },

    timeCardLabel: {
      marginTop: 2,
      fontSize: 7
    },

    elegant: {
      fontSize: 88,
      lineHeight: 105,
      letterSpacing: 3
    },

    elegantPeriod: {
      marginTop: -7,
      fontSize: 13,
      letterSpacing: 4
    },

    cinema: {
      width: '100%',
      fontSize: 132,
      lineHeight: 150,
      textAlign: 'center',
      includeFontPadding:
        false,
      textShadowColor:
        'rgba(0,0,0,.35)',
      textShadowRadius: 12
    },

    cinemaSeconds: {
      marginTop: -10,
      fontSize: 23,
      letterSpacing: 8
    },

    stacked: {
      alignItems: 'center'
    },

    stackedHour: {
      fontSize: 96,
      lineHeight: 102
    },

    stackLine: {
      width: 105,
      height: 3,
      marginVertical: 5,
      borderRadius: 99
    },

    stackedMinute: {
      fontSize: 96,
      lineHeight: 102
    },

    hybrid: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12
    },

    hybridLandscape: {
      flexDirection: 'row',
      justifyContent:
        'center',
      gap: 30
    },

    hybridDigital: {
      alignItems: 'center'
    },

    hybridTime: {
      fontSize: 54,
      lineHeight: 65
    },

    hybridSeconds: {
      fontSize: 17,
      letterSpacing: 6
    },

    controls: {
      position: 'absolute',
      zIndex: 70,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent:
        'flex-end',
      alignItems: 'center',
      gap: 7
    },

    control: {
      minHeight: 40,
      paddingHorizontal: 11,
      flexDirection: 'row',
      justifyContent:
        'center',
      alignItems: 'center',
      gap: 6,
      borderWidth: 1,
      borderColor:
        'rgba(255,255,255,.16)',
      borderRadius: 999,
      backgroundColor:
        'rgba(0,0,0,.34)'
    },

    hideControl: {
      borderColor:
        'rgba(255,255,255,.21)'
    },

    exit: {
      backgroundColor:
        'rgba(0,0,0,.43)'
    },

    controlText: {
      color: '#ffffff',
      fontSize: 9.5,
      lineHeight: 14
    },

    exitX: {
      color: '#ffffff',
      fontSize: 18,
      lineHeight: 20
    },

    hideIcon: {
      width: 17,
      height: 13,
      justifyContent:
        'center',
      alignItems:
        'center',
      borderWidth: 1.5,
      borderColor:
        '#ffffff',
      borderRadius: 9
    },

    hideEye: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor:
        '#ffffff'
    }
  });
