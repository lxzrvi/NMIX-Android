import React, {
  useEffect,
  useRef
} from 'react';

import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';

import {
  useSafeAreaInsets
} from 'react-native-safe-area-context';

import {
  themes,
  fontChoices
} from './theme';

import {
  fontFamily
} from './useNMixFonts';

import MotionPressable
  from './MotionPressable';

const THEME_META = {
  green: {
    label: 'Emerald'
  },

  blue: {
    label: 'Ocean'
  },

  purple: {
    label: 'Violet'
  },

  orange: {
    label: 'Sunset'
  },

  rose: {
    label: 'Rose'
  }
};

const EASE =
  Easing.bezier(
    0.22,
    1,
    0.36,
    1
  );

export default function SettingsPanel({
  visible,
  onClose,
  dark,
  setDark,
  themeName,
  setThemeName,
  font,
  setFont,
  colors,
  accent
}) {
  const insets =
    useSafeAreaInsets();

  const {
    width,
    height
  } = useWindowDimensions();

  const panelWidth =
    Math.min(
      350,
      width - 20
    );

  /*
   * 0 = completely outside right edge
   * 1 = final visible position
   *
   * No opacity is applied to the panel.
   */
  const motion =
    useRef(
      new Animated.Value(
        visible ? 1 : 0
      )
    ).current;

  useEffect(() => {
    motion.stopAnimation();

    Animated.timing(
      motion,
      {
        toValue:
          visible
            ? 1
            : 0,

        duration:
          visible
            ? 540
            : 460,

        easing:
          visible
            ? EASE
            : Easing.bezier(
                0.4,
                0,
                0.6,
                1
              ),

        useNativeDriver:
          true
      }
    ).start();
  }, [visible]);

  const regular =
    fontFamily(font);

  const bold =
    fontFamily(
      font,
      true
    );

  /*
   * Add extra distance so the whole panel,
   * including its border/shadow, is beyond
   * the physical right edge.
   */
  const translateX =
    motion.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        panelWidth + 28,
        0
      ]
    });

  /*
   * Backdrop may softly appear, but the
   * Settings PANEL itself never fades.
   */
  const backdropOpacity =
    motion.interpolate({
      inputRange:
        [0, 1],

      outputRange:
        [0, 1]
    });

  return (
    <View
      pointerEvents={
        visible
          ? 'box-none'
          : 'none'
      }
      style={
        styles.root
      }
    >
      <Animated.View
        pointerEvents={
          visible
            ? 'auto'
            : 'none'
        }
        style={[
          styles.backdrop,

          {
            opacity:
              backdropOpacity
          }
        ]}
      >
        <Pressable
          style={
            StyleSheet.absoluteFill
          }
          onPress={
            onClose
          }
        />
      </Animated.View>

      <Animated.View
        pointerEvents={
          visible
            ? 'auto'
            : 'none'
        }
        style={[
          styles.panel,

          {
            top:
              insets.top +
              62,

            /*
             * Final position is flush with
             * physical right edge.
             */
            right: 0,

            width:
              panelWidth,

            maxHeight:
              height -
              insets.top -
              insets.bottom -
              82,

            backgroundColor:
              colors.surface,

            borderColor:
              colors.border,

            transform: [
              {
                translateX
              }
            ]
          }
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.scroll
          }
        >
          <View
            style={[
              styles.header,

              {
                borderBottomColor:
                  colors.border
              }
            ]}
          >
            <View
              style={
                styles.headerCopy
              }
            >
              <Text
                style={[
                  styles.headerTitle,

                  {
                    color:
                      colors.text,

                    fontFamily:
                      bold
                  }
                ]}
              >
                NMIX Settings
              </Text>

              <Text
                style={[
                  styles.headerSub,

                  {
                    color:
                      colors.muted,

                    fontFamily:
                      regular
                  }
                ]}
              >
                Personalize your interface
              </Text>
            </View>

            <View
              style={[
                styles.live,

                {
                  backgroundColor:
                    `${accent}18`
                }
              ]}
            >
              <View
                style={[
                  styles.liveDot,

                  {
                    backgroundColor:
                      accent
                  }
                ]}
              />

              <Text
                style={[
                  styles.liveText,

                  {
                    color:
                      accent,

                    fontFamily:
                      bold
                  }
                ]}
              >
                Live
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.appearanceRow,

              {
                borderBottomColor:
                  colors.border
              }
            ]}
          >
            <View
              style={
                styles.rowCopy
              }
            >
              <Text
                style={[
                  styles.title,

                  {
                    color:
                      colors.text,

                    fontFamily:
                      bold
                  }
                ]}
              >
                Appearance
              </Text>

              <Text
                style={[
                  styles.small,

                  {
                    color:
                      colors.muted,

                    fontFamily:
                      regular
                  }
                ]}
              >
                Light or dark interface
              </Text>
            </View>

            <AnimatedSwitch
              value={
                dark
              }
              onChange={
                setDark
              }
              accent={
                accent
              }
              inactive={
                colors.surface3
              }
            />
          </View>

          <View
            style={[
              styles.block,

              {
                borderBottomColor:
                  colors.border
              }
            ]}
          >
            <Text
              style={[
                styles.title,

                {
                  color:
                    colors.text,

                  fontFamily:
                    bold
                }
              ]}
            >
              Color Theme
            </Text>

            <Text
              style={[
                styles.small,

                {
                  color:
                    colors.muted,

                  fontFamily:
                    regular
                }
              ]}
            >
              Selected · {
                THEME_META[
                  themeName
                ]?.label ||
                'Emerald'
              }
            </Text>

            <View
              style={
                styles.themeGrid
              }
            >
              {Object.keys(
                themes
              ).map(
                name => (
                  <ThemeChoice
                    key={
                      name
                    }

                    label={
                      THEME_META[
                        name
                      ]?.label ||
                      name
                    }

                    selected={
                      themeName ===
                      name
                    }

                    color={
                      themes[
                        name
                      ].accent
                    }

                    textColor={
                      colors.text
                    }

                    muted={
                      colors.muted
                    }

                    surface={
                      colors.surface2
                    }

                    border={
                      colors.border
                    }

                    font={
                      regular
                    }

                    bold={
                      bold
                    }

                    onPress={() =>
                      setThemeName(
                        name
                      )
                    }
                  />
                )
              )}
            </View>
          </View>

          <View
            style={
              styles.fontBlock
            }
          >
            <Text
              style={[
                styles.title,

                {
                  color:
                    colors.text,

                  fontFamily:
                    bold
                }
              ]}
            >
              Font Style
            </Text>

            <Text
              style={[
                styles.small,

                {
                  color:
                    colors.muted,

                  fontFamily:
                    regular
                }
              ]}
            >
              Selected · {font}
            </Text>

            <View
              style={
                styles.fontGrid
              }
            >
              {fontChoices.map(
                name => (
                  <MotionPressable
                    key={
                      name
                    }

                    onPress={() =>
                      setFont(
                        name
                      )
                    }

                    style={[
                      styles.fontButton,

                      {
                        borderColor:
                          font ===
                          name
                            ? accent
                            : colors.border,

                        backgroundColor:
                          colors.surface2
                      }
                    ]}
                  >
                    <View
                      style={[
                        styles.aa,

                        {
                          backgroundColor:
                            font ===
                            name
                              ? `${accent}18`
                              : colors.surface
                        }
                      ]}
                    >
                      <Text
                        style={{
                          color:
                            accent,

                          fontFamily:
                            fontFamily(
                              name,
                              true
                            ),

                          fontSize:
                            14
                        }}
                      >
                        Aa
                      </Text>
                    </View>

                    <Text
                      numberOfLines={1}
                      style={{
                        flex: 1,

                        color:
                          font ===
                          name
                            ? accent
                            : colors.text,

                        fontFamily:
                          fontFamily(
                            name
                          ),

                        fontSize:
                          10.5
                      }}
                    >
                      {name}
                    </Text>
                  </MotionPressable>
                )
              )}
            </View>
          </View>

          <Text
            style={[
              styles.note,

              {
                color:
                  colors.muted,

                fontFamily:
                  regular
              }
            ]}
          >
            Theme, dark mode and font are saved automatically on this device. Use the top-right X to close Settings.
          </Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

function AnimatedSwitch({
  value,
  onChange,
  accent,
  inactive
}) {
  const motion =
    useRef(
      new Animated.Value(
        value ? 1 : 0
      )
    ).current;

  useEffect(() => {
    Animated.spring(
      motion,
      {
        toValue:
          value
            ? 1
            : 0,

        friction: 8,

        tension: 80,

        useNativeDriver:
          false
      }
    ).start();
  }, [value]);

  const left =
    motion.interpolate({
      inputRange:
        [0, 1],

      outputRange:
        [4, 25]
    });

  const backgroundColor =
    motion.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        inactive,
        accent
      ]
    });

  return (
    <MotionPressable
      onPress={() =>
        onChange(
          !value
        )
      }
      style={
        styles.switchTouch
      }
    >
      <Animated.View
        style={[
          styles.switchTrack,

          {
            backgroundColor
          }
        ]}
      >
        <Animated.View
          style={[
            styles.switchKnob,

            {
              left
            }
          ]}
        />
      </Animated.View>
    </MotionPressable>
  );
}

function ThemeChoice({
  label,
  selected,
  color,
  textColor,
  muted,
  surface,
  border,
  font,
  bold,
  onPress
}) {
  const selection =
    useRef(
      new Animated.Value(
        selected ? 1 : 0
      )
    ).current;

  useEffect(() => {
    Animated.spring(
      selection,
      {
        toValue:
          selected
            ? 1
            : 0,

        friction: 7,

        tension: 80,

        useNativeDriver:
          true
      }
    ).start();
  }, [selected]);

  const scale =
    selection.interpolate({
      inputRange:
        [0, 1],

      outputRange:
        [1, 1.035]
    });

  return (
    <MotionPressable
      onPress={
        onPress
      }
      style={[
        styles.themeChoice,

        {
          backgroundColor:
            surface,

          borderColor:
            selected
              ? color
              : border
        }
      ]}
    >
      <Animated.View
        style={[
          styles.themePreview,

          {
            backgroundColor:
              color,

            transform: [
              {
                scale
              }
            ]
          }
        ]}
      >
        <Animated.View
          style={[
            styles.themeCheck,

            {
              opacity:
                selection,

              transform: [
                {
                  scale:
                    selection
                }
              ]
            }
          ]}
        />
      </Animated.View>

      <View
        style={
          styles.themeCopy
        }
      >
        <Text
          style={[
            styles.themeName,

            {
              color:
                selected
                  ? color
                  : textColor,

              fontFamily:
                bold
            }
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.themeStatus,

            {
              color:
                muted,

              fontFamily:
                font
            }
          ]}
        >
          {selected
            ? 'Active'
            : 'Tap to apply'}
        </Text>
      </View>
    </MotionPressable>
  );
}

const styles =
  StyleSheet.create({
    root: {
      ...StyleSheet.absoluteFillObject,

      zIndex: 900,

      overflow: 'hidden'
    },

    backdrop: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        'rgba(0,0,0,.34)'
    },

    panel: {
      position: 'absolute',

      /*
       * No connector/pill behind hamburger.
       */
      overflow: 'hidden',

      borderWidth: 1,

      borderRightWidth: 0,

      borderTopLeftRadius: 22,

      borderBottomLeftRadius: 22,

      borderTopRightRadius: 0,

      borderBottomRightRadius: 0,

      elevation: 20
    },

    scroll: {
      padding: 17,

      paddingBottom: 18
    },

    header: {
      paddingBottom: 14,

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      gap: 12,

      borderBottomWidth: 1
    },

    headerCopy: {
      flex: 1
    },

    headerTitle: {
      fontSize: 15
    },

    headerSub: {
      marginTop: 2,

      fontSize: 10
    },

    live: {
      height: 28,

      paddingHorizontal: 9,

      flexDirection: 'row',

      alignItems: 'center',

      gap: 5,

      borderRadius: 999
    },

    liveDot: {
      width: 6,

      height: 6,

      borderRadius: 3
    },

    liveText: {
      fontSize: 8
    },

    appearanceRow: {
      paddingVertical: 16,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',

      gap: 12,

      borderBottomWidth: 1
    },

    rowCopy: {
      flex: 1
    },

    title: {
      fontSize: 13
    },

    small: {
      marginTop: 2,

      fontSize: 10
    },

    switchTouch: {
      width: 53,

      height: 32,

      justifyContent:
        'center'
    },

    switchTrack: {
      position: 'relative',

      width: 53,

      height: 28,

      borderRadius: 999
    },

    switchKnob: {
      position: 'absolute',

      top: 4,

      width: 20,

      height: 20,

      borderRadius: 10,

      backgroundColor:
        '#ffffff',

      elevation: 2
    },

    block: {
      paddingVertical: 16,

      borderBottomWidth: 1
    },

    themeGrid: {
      marginTop: 12,

      gap: 8
    },

    themeChoice: {
      minHeight: 54,

      paddingHorizontal: 10,

      flexDirection: 'row',

      alignItems: 'center',

      gap: 10,

      borderWidth: 1,

      borderRadius: 12
    },

    themePreview: {
      width: 34,

      height: 34,

      justifyContent:
        'center',

      alignItems:
        'center',

      borderRadius: 17
    },

    themeCheck: {
      width: 13,

      height: 13,

      borderWidth: 2,

      borderColor:
        '#ffffff',

      borderRadius: 7
    },

    themeCopy: {
      flex: 1
    },

    themeName: {
      fontSize: 11.5
    },

    themeStatus: {
      marginTop: 1,

      fontSize: 8.5
    },

    fontBlock: {
      paddingTop: 16
    },

    fontGrid: {
      marginTop: 11,

      flexDirection: 'row',

      flexWrap: 'wrap',

      justifyContent:
        'space-between',

      rowGap: 8
    },

    fontButton: {
      width: '48.5%',

      minHeight: 50,

      paddingHorizontal: 7,

      flexDirection: 'row',

      alignItems: 'center',

      gap: 7,

      borderWidth: 1,

      borderRadius: 10
    },

    aa: {
      width: 30,

      height: 30,

      justifyContent:
        'center',

      alignItems:
        'center',

      borderRadius: 7
    },

    note: {
      marginTop: 14,

      fontSize: 8.5,

      lineHeight: 13
    }
  });
