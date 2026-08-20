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
  PanResponder,
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

import useNMixSounds
  from './useNMixSounds';

const STYLE_KEY =
  'nmix-fullscreen-clock-style';

const COLOR_KEY =
  'nmix-fullscreen-clock-color';

const FONT_KEY =
  'nmix-fullscreen-clock-font';

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
    name: 'White',
    color: '#F5F7F6'
  },
  {
    name: 'Warm',
    color: '#FFE1AD'
  },
  {
    name: 'Mint',
    color: '#B9F3DA'
  },
  {
    name: 'Sky',
    color: '#B9E2FF'
  },
  {
    name: 'Violet',
    color: '#DAC8FF'
  },
  {
    name: 'Rose',
    color: '#FFC6D8'
  }
];

const CLOCK_FONTS = [
  'Poppins',
  'Inter',
  'Outfit',
  'Nunito',
  'Quicksand'
];

const EASE =
  Easing.bezier(
    0.22,
    1,
    0.36,
    1
  );

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

  const {
    select:
      playSelect
  } = useNMixSounds();

  const landscape =
    width >
    height;

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

  const [
    clockFont,
    setClockFont
  ] = useState(
    font ||
    'Poppins'
  );

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

  const hiddenBrand =
    useRef(
      new Animated.Value(0)
    ).current;

  const clockChange =
    useRef(
      new Animated.Value(1)
    ).current;

  useEffect(() => {
    async function load() {
      try {
        const [
          savedWallpaper,
          savedStyle,
          savedColor,
          savedFont
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
              ),

            AsyncStorage
              .getItem(
                FONT_KEY
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

        if (
          savedFont &&
          CLOCK_FONTS.includes(
            savedFont
          )
        ) {
          setClockFont(
            savedFont
          );
        } else if (
          font &&
          CLOCK_FONTS.includes(
            font
          )
        ) {
          setClockFont(
            font
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

    hiddenBrand.setValue(
      0
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
          EASE,

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

    const timer =
      setInterval(
        () =>
          setNow(
            new Date()
          ),
        1000
      );

    return () => {
      clearInterval(
        timer
      );

      ambientLoop.stop();
    };
  }, [
    visible,
    themeName
  ]);

  useEffect(() => {
    chrome.stopAnimation();
    hiddenBrand.stopAnimation();

    Animated.parallel([
      Animated.timing(
        chrome,
        {
          toValue:
            chromeVisible
              ? 1
              : 0,

          duration: 460,

          easing:
            EASE,

          useNativeDriver:
            true
        }
      ),

      Animated.timing(
        hiddenBrand,
        {
          toValue:
            chromeVisible
              ? 0
              : 1,

          duration:
            chromeVisible
              ? 280
              : 600,

          delay:
            chromeVisible
              ? 0
              : 150,

          easing:
            EASE,

          useNativeDriver:
            true
        }
      )
    ]).start();
  }, [
    chromeVisible
  ]);

  const regular =
    fontFamily(
      clockFont
    );

  const bold =
    fontFamily(
      clockFont,
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

  const selectedColor =
    CLOCK_COLORS[
      colorIndex
    ];

  const clockColor =
    selectedColor
      .color;

  function animateClockChange(
    callback
  ) {
    clockChange
      .stopAnimation();

    Animated.timing(
      clockChange,
      {
        toValue: 0,

        duration: 100,

        useNativeDriver:
          true
      }
    ).start(() => {
      callback();

      clockChange
        .setValue(0);

      Animated.timing(
        clockChange,
        {
          toValue: 1,

          duration: 340,

          easing:
            EASE,

          useNativeDriver:
            true
        }
      ).start();
    });
  }

  function changeStyle(
    direction
  ) {
    const next =
      wrapIndex(
        clockStyle +
        direction,

        CLOCK_STYLES.length
      );

    animateClockChange(
      () => {
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
      }
    );
  }

  function changeColor(
    direction
  ) {
    const next =
      wrapIndex(
        colorIndex +
        direction,

        CLOCK_COLORS.length
      );

    animateClockChange(
      () => {
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
      }
    );
  }

  function changeFont(
    direction
  ) {
    const current =
      Math.max(
        0,

        CLOCK_FONTS
          .indexOf(
            clockFont
          )
      );

    const nextIndex =
      wrapIndex(
        current +
        direction,

        CLOCK_FONTS.length
      );

    const next =
      CLOCK_FONTS[
        nextIndex
      ];

    animateClockChange(
      () => {
        setClockFont(
          next
        );

        AsyncStorage
          .setItem(
            FONT_KEY,
            next
          )
          .catch(
            () => {}
          );
      }
    );
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

  const carouselWidth =
    Math.min(
      landscape
        ? 220
        : 195,

      Math.max(
        168,
        width * 0.45
      )
    );

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
                  'rgba(0,0,0,.28)',
                  'rgba(0,0,0,.52)'
                ]
              : [
                  'rgba(0,0,0,.12)',
                  'rgba(0,0,0,.17)',
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

        {!chromeVisible && (
          <Pressable
            onPress={
              restoreControls
            }
            style={[
              StyleSheet.absoluteFill,
              styles.restoreTouch
            ]}
          />
        )}

        <Animated.View
          pointerEvents="none"
          style={[
            styles.clockArea,

            {
              paddingHorizontal:
                landscape
                  ? 78
                  : 22,

              opacity:
                entrance,

              transform: [
                {
                  scale:
                    entrance
                      .interpolate({
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
                  clockChange,

                transform: [
                  {
                    translateY:
                      clockChange
                        .interpolate({
                          inputRange:
                            [0, 1],

                          outputRange:
                            [5, 0]
                        })
                  },

                  {
                    scale:
                      clockChange
                        .interpolate({
                          inputRange:
                            [0, 1],

                          outputRange:
                            [0.98, 1]
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

        <Animated.View
          pointerEvents="none"
          style={[
            styles.hiddenBrand,

            {
              opacity:
                hiddenBrand,

              transform: [
                {
                  translateY:
                    hiddenBrand
                      .interpolate({
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
          <View
            style={
              styles.hiddenBrandFix
            }
          >
            <Text
              numberOfLines={1}
              style={[
                styles.hiddenBrandText,

                {
                  color:
                    withOpacity(
                      clockColor,
                      0.68
                    ),

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
                    18,
                    insets.left +
                    14
                  ),

                transform: [
                  {
                    translateY:
                      chrome
                        .interpolate({
                          inputRange:
                            [0, 1],

                          outputRange:
                            [-16, 0]
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

            <Text
              style={[
                styles.localTime,

                {
                  fontFamily:
                    regular
                }
              ]}
            >
              NMIX • LOCAL TIME
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.carouselStack,

              {
                top:
                  Math.max(
                    landscape
                      ? 14
                      : 20,

                    insets.top +
                    8
                  ),

                right:
                  Math.max(
                    14,
                    insets.right +
                    12
                  ),

                width:
                  carouselWidth,

                transform: [
                  {
                    translateX:
                      chrome
                        .interpolate({
                          inputRange:
                            [0, 1],

                          outputRange:
                            [32, 0]
                        })
                  }
                ]
              }
            ]}
          >
            <SwipeCarousel
              label="STYLE"
              items={
                CLOCK_STYLES
              }
              index={
                clockStyle
              }
              onChange={
                changeStyle
              }
              onSelectSound={
                playSelect
              }
              color={
                clockColor
              }
              regular={
                regular
              }
              bold={
                bold
              }
            />

            <SwipeCarousel
              label="COLOR"
              items={
                CLOCK_COLORS
                  .map(
                    item =>
                      item.name
                  )
              }
              index={
                colorIndex
              }
              onChange={
                changeColor
              }
              onSelectSound={
                playSelect
              }
              color={
                clockColor
              }
              regular={
                regular
              }
              bold={
                bold
              }
            />

            <SwipeCarousel
              label="FONT"
              items={
                CLOCK_FONTS
              }
              index={
                Math.max(
                  0,

                  CLOCK_FONTS
                    .indexOf(
                      clockFont
                    )
                )
              }
              onChange={
                changeFont
              }
              onSelectSound={
                playSelect
              }
              color={
                clockColor
              }
              regular={
                regular
              }
              bold={
                bold
              }
            />
          </Animated.View>

          <View
            pointerEvents="none"
            style={[
              styles.styleInfo,

              landscape &&
                styles.styleInfoLandscape
            ]}
          >
            <Text
              style={[
                styles.infoCaption,

                {
                  fontFamily:
                    regular
                }
              ]}
            >
              CLOCK STYLE
            </Text>

            <Text
              style={[
                styles.infoValue,

                {
                  color:
                    withOpacity(
                      clockColor,
                      0.84
                    ),

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

          <View
            pointerEvents="none"
            style={[
              styles.lowerInfo,

              landscape &&
                styles.lowerInfoLandscape
            ]}
          >
            <View
              style={[
                styles.infoDot,

                {
                  backgroundColor:
                    clockColor
                }
              ]}
            />

            <Text
              style={[
                styles.lowerInfoText,

                {
                  color:
                    withOpacity(
                      clockColor,
                      0.78
                    ),

                  fontFamily:
                    regular
                }
              ]}
            >
              {selectedColor.name}
              {'  •  '}
              {clockFont}
            </Text>
          </View>

          <Animated.View
            style={[
              styles.bottomControls,

              {
                left:
                  Math.max(
                    12,
                    insets.left +
                    10
                  ),

                right:
                  Math.max(
                    12,
                    insets.right +
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
                      chrome
                        .interpolate({
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
                styles.bottomButton
              }
            >
              <RotateIcon
                size={18}
                color="#ffffff"
              />

              <Text
                style={[
                  styles.bottomButtonText,

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
                styles.bottomButton
              }
            >
              <WallpaperIcon
                size={18}
                color="#ffffff"
              />

              <Text
                style={[
                  styles.bottomButtonText,

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
                styles.bottomButton,
                styles.hideButton
              ]}
            >
              <View
                style={
                  styles.eye
                }
              >
                <View
                  style={
                    styles.eyeDot
                  }
                />
              </View>

              <Text
                style={[
                  styles.bottomButtonText,

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
                styles.bottomButton,
                styles.exitButton
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
                  styles.bottomButtonText,

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
            clockFont
          }
        />
      </View>
    </Modal>
  );
}

function SwipeCarousel({
  label,
  items,
  index,
  onChange,
  onSelectSound,
  color,
  regular,
  bold
}) {
  const drag =
    useRef(
      new Animated.Value(0)
    ).current;

  const changing =
    useRef(false);

  const count =
    items.length;

  const previous =
    items[
      wrapIndex(
        index - 1,
        count
      )
    ];

  const current =
    items[index];

  const next =
    items[
      wrapIndex(
        index + 1,
        count
      )
    ];

  function reset() {
    Animated.spring(
      drag,
      {
        toValue: 0,

        stiffness: 260,

        damping: 22,

        mass: 0.7,

        useNativeDriver:
          true
      }
    ).start();
  }

  function commit(
    direction
  ) {
    if (
      changing.current
    ) {
      return;
    }

    changing.current =
      true;

    const destination =
      direction > 0
        ? -66
        : 66;

    Animated.timing(
      drag,
      {
        toValue:
          destination,

        duration: 150,

        easing:
          Easing.out(
            Easing.quad
          ),

        useNativeDriver:
          true
      }
    ).start(
      () => {
        /*
         * Selection SFX only when an option
         * actually snaps/applies.
         */
        onSelectSound?.();

        onChange(
          direction
        );

        drag.setValue(
          -destination *
          0.28
        );

        Animated.spring(
          drag,
          {
            toValue: 0,

            stiffness: 230,

            damping: 19,

            mass: 0.72,

            useNativeDriver:
              true
          }
        ).start(
          () => {
            changing.current =
              false;
          }
        );
      }
    );
  }

  const responder =
    useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder:
          (
            _,
            gesture
          ) =>
            Math.abs(
              gesture.dx
            ) > 5 &&
            Math.abs(
              gesture.dx
            ) >
              Math.abs(
                gesture.dy
              ),

        onPanResponderGrant:
          () => {
            drag
              .stopAnimation();
          },

        onPanResponderMove:
          (
            _,
            gesture
          ) => {
            if (
              changing.current
            ) {
              return;
            }

            const value =
              Math.max(
                -70,

                Math.min(
                  70,

                  gesture.dx *
                  0.74
                )
              );

            drag.setValue(
              value
            );
          },

        onPanResponderRelease:
          (
            _,
            gesture
          ) => {
            if (
              changing.current
            ) {
              return;
            }

            const swipe =
              Math.abs(
                gesture.dx
              ) >
                32 ||
              Math.abs(
                gesture.vx
              ) >
                0.32;

            if (!swipe) {
              reset();

              return;
            }

            commit(
              gesture.dx <
              0
                ? 1
                : -1
            );
          },

        onPanResponderTerminate:
          reset
      })
    ).current;

  const centerScale =
    drag.interpolate({
      inputRange: [
        -70,
        0,
        70
      ],

      outputRange: [
        0.89,
        1,
        0.89
      ],

      extrapolate:
        'clamp'
    });

  const sideOpacity =
    drag.interpolate({
      inputRange: [
        -70,
        0,
        70
      ],

      outputRange: [
        0.48,
        0.32,
        0.48
      ],

      extrapolate:
        'clamp'
    });

  return (
    <View
      {...responder
        .panHandlers}

      style={[
        styles.carousel,

        {
          borderColor:
            withOpacity(
              color,
              0.24
            )
        }
      ]}
    >
      <Text
        pointerEvents="none"
        style={[
          styles.carouselLabel,

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
        {label}
      </Text>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.carouselValues,

          {
            transform: [
              {
                translateX:
                  drag
              }
            ]
          }
        ]}
      >
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.carouselSide,

            {
              color,
              opacity:
                sideOpacity,

              fontFamily:
                regular
            }
          ]}
        >
          {previous}
        </Animated.Text>

        <Animated.View
          style={[
            styles.carouselCurrentWrap,

            {
              transform: [
                {
                  scale:
                    centerScale
                }
              ]
            }
          ]}
        >
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.carouselCurrent,

              {
                color,

                fontFamily:
                  bold
              }
            ]}
          >
            {current}
          </Text>
        </Animated.View>

        <Animated.Text
          numberOfLines={1}
          style={[
            styles.carouselSide,

            {
              color,
              opacity:
                sideOpacity,

              fontFamily:
                regular
            }
          ]}
        >
          {next}
        </Animated.Text>
      </Animated.View>
    </View>
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
                    0.74
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
          text={
            date
          }
          font={
            regular
          }
          color={
            color
          }
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
          text={
            date
          }
          font={
            regular
          }
          color={
            color
          }
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
          text={
            date
          }
          font={
            regular
          }
          color={
            color
          }
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
          text={
            date
          }
          font={
            regular
          }
          color={
            color
          }
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
            font={
              bold
            }
            color={
              color
            }
          />

          <Text
            style={[
              styles.splitColon,

              {
                color:
                  withOpacity(
                    color,
                    0.58
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
            font={
              bold
            }
            color={
              color
            }
          />

          <Text
            style={[
              styles.splitColon,

              {
                color:
                  withOpacity(
                    color,
                    0.58
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
            font={
              bold
            }
            color={
              color
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
          color={
            color
          }
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
          text={
            date
          }
          font={
            regular
          }
          color={
            color
          }
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
            styles.cinemaTime,

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
          text={
            date
          }
          font={
            regular
          }
          color={
            color
          }
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
                    0.62
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
          text={
            date
          }
          font={
            regular
          }
          color={
            color
          }
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
          now={
            now
          }
          size={
            landscape
              ? 250
              : 274
          }
          color={
            color
          }
        />

        <DateText
          text={
            date
          }
          font={
            regular
          }
          color={
            color
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
            ? 210
            : 205
        }
        color={
          color
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
          text={
            date
          }
          font={
            regular
          }
          color={
            color
          }
        />
      </View>
    </View>
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
              0.72
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
              0.20
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

  return (
    <Svg
      width={
        size
      }
      height={
        size
      }
      viewBox={`0 0 ${size} ${size}`}
    >
      <Circle
        cx={
          center
        }
        cy={
          center
        }
        r={
          radius
        }
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
        center={
          center
        }
        radius={
          radius *
          0.50
        }
        angle={
          hours *
          30
        }
        width={
          5
        }
        color={
          color
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
          minutes *
          6
        }
        width={
          3.5
        }
        color={
          color
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
          seconds *
          6
        }
        width={
          1.8
        }
        color={
          withOpacity(
            color,
            0.72
          )
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
          color
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
              motion
                .interpolate({
                  inputRange:
                    [0, 1],

                  outputRange:
                    [0.10, 0.24]
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

function wrapIndex(
  value,
  length
) {
  return (
    (
      value %
      length
    ) +
    length
  ) %
  length;
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
      rawHour >=
      12
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

function withOpacity(
  hex,
  opacity
) {
  const clean =
    String(
      hex
    ).replace(
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
      overflow:
        'hidden',
      backgroundColor:
        '#030806'
    },

    restoreTouch: {
      zIndex: 100
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
      borderRadius:
        380
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
      position:
        'absolute',
      zIndex: 45,
      alignItems:
        'flex-start'
    },

    brandSub: {
      color:
        'rgba(245,247,246,.55)',
      fontSize: 7,
      lineHeight: 10,
      letterSpacing: 1.5
    },

    brandFix: {
      minWidth: 185,
      paddingRight: 28,
      overflow:
        'visible'
    },

    brandTitle: {
      color:
        '#F5F7F6',
      fontSize: 24,
      lineHeight: 37,
      letterSpacing: 4,
      paddingHorizontal:
        3,
      includeFontPadding:
        false
    },

    localTime: {
      marginTop: 1,
      color:
        'rgba(245,247,246,.48)',
      fontSize: 7.5,
      lineHeight: 11,
      letterSpacing: 1
    },

    carouselStack: {
      position:
        'absolute',
      zIndex: 75,
      gap: 7
    },

    /*
     * Compact height, long enough horizontally
     * for meaningful swipe travel.
     */
    carousel: {
      position:
        'relative',
      width: '100%',
      height: 49,
      overflow:
        'hidden',
      justifyContent:
        'flex-end',
      borderWidth: 1,
      borderRadius: 999,
      backgroundColor:
        'rgba(0,0,0,.35)'
    },

    carouselLabel: {
      position:
        'absolute',
      zIndex: 5,
      top: 4,
      left: 0,
      right: 0,
      fontSize: 6.8,
      lineHeight: 9,
      letterSpacing: 1.25,
      textAlign:
        'center'
    },

    carouselValues: {
      height: 34,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'center'
    },

    carouselSide: {
      width: '28%',
      fontSize: 7.5,
      lineHeight: 11,
      textAlign:
        'center'
    },

    carouselCurrentWrap: {
      width: '44%',
      alignItems:
        'center',
      justifyContent:
        'center'
    },

    carouselCurrent: {
      width: '100%',
      fontSize: 11.5,
      lineHeight: 15,
      textAlign:
        'center'
    },

    styleInfo: {
      position:
        'absolute',
      zIndex: 50,
      top: '25%',
      left: 70,
      right: 70,
      alignItems:
        'center'
    },

    styleInfoLandscape: {
      top: '14%'
    },

    infoCaption: {
      color:
        'rgba(255,255,255,.42)',
      fontSize: 8,
      lineHeight: 11,
      letterSpacing: 1.8
    },

    infoValue: {
      marginTop: 3,
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 1,
      textAlign:
        'center'
    },

    lowerInfo: {
      position:
        'absolute',
      zIndex: 50,
      left: 70,
      right: 70,
      bottom: '21%',
      flexDirection:
        'row',
      justifyContent:
        'center',
      alignItems:
        'center',
      gap: 7
    },

    lowerInfoLandscape: {
      bottom: '15%'
    },

    infoDot: {
      width: 7,
      height: 7,
      borderRadius: 4
    },

    lowerInfoText: {
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: 0.8
    },

    hiddenBrand: {
      position:
        'absolute',
      zIndex: 110,
      left: 0,
      right: 0,
      top: '67%',
      alignItems:
        'center'
    },

    hiddenBrandFix: {
      minWidth: 180,
      paddingHorizontal:
        24,
      overflow:
        'visible',
      alignItems:
        'center'
    },

    hiddenBrandText: {
      fontSize: 19,
      lineHeight: 32,
      letterSpacing: 4,
      textAlign:
        'center',
      includeFontPadding:
        false
    },

    styleCenter: {
      width: '100%',
      justifyContent:
        'center',
      alignItems:
        'center'
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
      textAlign:
        'center',
      textShadowColor:
        'rgba(0,0,0,.45)',
      textShadowRadius: 8
    },

    minimalTime: {
      fontSize: 92,
      lineHeight: 110,
      letterSpacing: 2,
      includeFontPadding:
        false
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
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'center',
      gap: 7
    },

    splitColon: {
      fontSize: 28
    },

    timeCard: {
      minWidth: 77,
      paddingHorizontal:
        12,
      paddingVertical:
        12,
      alignItems:
        'center',
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

    cinemaTime: {
      width: '100%',
      fontSize: 132,
      lineHeight: 150,
      textAlign:
        'center',
      includeFontPadding:
        false
    },

    cinemaSeconds: {
      marginTop: -10,
      fontSize: 23,
      letterSpacing: 8
    },

    stacked: {
      alignItems:
        'center'
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
      fontSize: 54,
      lineHeight: 65
    },

    hybridSeconds: {
      fontSize: 17,
      letterSpacing: 6
    },

    bottomControls: {
      position:
        'absolute',
      zIndex: 70,
      flexDirection:
        'row',
      flexWrap:
        'wrap',
      justifyContent:
        'flex-end',
      alignItems:
        'center',
      gap: 7
    },

    bottomButton: {
      minHeight: 40,
      paddingHorizontal:
        11,
      flexDirection:
        'row',
      justifyContent:
        'center',
      alignItems:
        'center',
      gap: 6,
      borderWidth: 1,
      borderColor:
        'rgba(255,255,255,.16)',
      borderRadius: 999,
      backgroundColor:
        'rgba(0,0,0,.34)'
    },

    hideButton: {
      borderColor:
        'rgba(255,255,255,.22)'
    },

    exitButton: {
      backgroundColor:
        'rgba(0,0,0,.43)'
    },

    bottomButtonText: {
      color:
        '#ffffff',
      fontSize: 9.5,
      lineHeight: 14
    },

    exitX: {
      color:
        '#ffffff',
      fontSize: 18,
      lineHeight: 20
    },

    eye: {
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

    eyeDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor:
        '#ffffff'
    }
  });
