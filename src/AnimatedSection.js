import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  CalculatorIcon,
  ClockIcon,
  CounterIcon,
  HelpIcon
} from './icons';

const ICONS = {
  calculator:
    CalculatorIcon,

  clock:
    ClockIcon,

  counter:
    CounterIcon,

  instructions:
    HelpIcon
};

const EASE =
  Easing.bezier(
    0.22,
    1,
    0.36,
    1
  );

export default function AnimatedSection({
  title,
  subtitle,
  name,
  open,
  toggle,
  colors,
  accent,
  regular,
  bold,
  children
}) {
  const active =
    open === name;

  const [
    contentHeight,
    setContentHeight
  ] = useState(0);

  /*
   * Native transforms only.
   */
  const spin =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * JS geometry only.
   */
  const morph =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * JS accordion height.
   */
  const panel =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * Native content reveal.
   */
  const reveal =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  const press =
    useRef(
      new Animated.Value(1)
    ).current;

  useEffect(() => {
    spin.stopAnimation();
    morph.stopAnimation();

    Animated.parallel([
      Animated.timing(
        spin,
        {
          toValue:
            active
              ? 1
              : 0,

          duration: 760,

          easing:
            Easing.inOut(
              Easing.cubic
            ),

          useNativeDriver:
            true
        }
      ),

      Animated.timing(
        morph,
        {
          toValue:
            active
              ? 1
              : 0,

          duration: 650,

          easing:
            EASE,

          useNativeDriver:
            false
        }
      )
    ]).start();
  }, [active]);

  useEffect(() => {
    if (
      contentHeight <=
      0
    ) {
      return;
    }

    panel.stopAnimation();
    reveal.stopAnimation();

    Animated.parallel([
      Animated.timing(
        panel,
        {
          toValue:
            active
              ? 1
              : 0,

          duration:
            active
              ? 580
              : 520,

          easing:
            EASE,

          useNativeDriver:
            false
        }
      ),

      Animated.timing(
        reveal,
        {
          toValue:
            active
              ? 1
              : 0,

          duration:
            active
              ? 460
              : 300,

          delay:
            active
              ? 55
              : 0,

          easing:
            active
              ? EASE
              : Easing.inOut(
                  Easing.ease
                ),

          useNativeDriver:
            true
        }
      )
    ]).start();
  }, [
    active,
    contentHeight
  ]);

  function pressIn() {
    press.stopAnimation();

    Animated.timing(
      press,
      {
        toValue: 0.972,

        duration: 145,

        easing:
          Easing.out(
            Easing.quad
          ),

        useNativeDriver:
          true
      }
    ).start();
  }

  function pressOut() {
    press.stopAnimation();

    Animated.spring(
      press,
      {
        toValue: 1,

        stiffness: 240,
        damping: 13,
        mass: 0.7,

        useNativeDriver:
          true
      }
    ).start();
  }

  const Icon =
    ICONS[name] ||
    HelpIcon;

  /*
   * Clearly visible rotations.
   * Close automatically reverses.
   */
  const outerRotate =
    spin.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        '0deg',
        '405deg'
      ]
    });

  const innerRotate =
    spin.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        '0deg',
        '-405deg'
      ]
    });

  const arrowRotate =
    spin.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        '0deg',
        '180deg'
      ]
    });

  /*
   * Actual outer and inner geometry
   * both morph into circles.
   */
  const outerRadius =
    morph.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        9,
        21
      ]
    });

  const innerRadius =
    morph.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        6,
        18.5
      ]
    });

  const panelHeight =
    panel.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        0,
        contentHeight
      ]
    });

  const revealY =
    reveal.interpolate({
      inputRange:
        [0, 1],

      outputRange:
        [-10, 0]
    });

  return (
    <View
      style={[
        styles.section,

        {
          backgroundColor:
            colors.surface,

          borderColor:
            colors.border
        }
      ]}
    >
      <Animated.View
        style={[
          styles.pressLayer,

          {
            transform: [
              {
                scale:
                  press
              }
            ]
          }
        ]}
      >
        <Pressable
          onPress={() =>
            toggle(name)
          }

          onPressIn={
            pressIn
          }

          onPressOut={
            pressOut
          }

          style={
            styles.bar
          }
        >
          <View
            style={
              styles.iconStage
            }
          >
            {/*
             * Native clockwise rotator.
             *
             * It rotates a JS-morphing shape
             * nested inside it.
             */}
            <Animated.View
              pointerEvents="none"

              style={[
                styles.outerRotator,

                {
                  transform: [
                    {
                      rotate:
                        outerRotate
                    }
                  ]
                }
              ]}
            >
              <Animated.View
                style={[
                  styles.outerShape,

                  {
                    backgroundColor:
                      accent,

                    borderRadius:
                      outerRadius
                  }
                ]}
              >
                <View
                  style={
                    styles.outerHighlight
                  }
                />
              </Animated.View>
            </Animated.View>

            {/*
             * Counter-clockwise rotator.
             */}
            <Animated.View
              pointerEvents="none"

              style={[
                styles.innerRotator,

                {
                  transform: [
                    {
                      rotate:
                        innerRotate
                    }
                  ]
                }
              ]}
            >
              {/*
               * THIS actual outline now morphs
               * from rounded square -> circle.
               */}
              <Animated.View
                style={[
                  styles.innerShape,

                  {
                    borderRadius:
                      innerRadius
                  }
                ]}
              >
                <View
                  style={
                    styles.innerMarker
                  }
                />
              </Animated.View>
            </Animated.View>

            {/*
             * Stationary center icon.
             */}
            <View
              pointerEvents="none"

              style={
                styles.iconContent
              }
            >
              <Icon
                size={21}

                color="#ffffff"
              />
            </View>
          </View>

          <View
            style={
              styles.copy
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
              {title}
            </Text>

            <Text
              numberOfLines={1}

              style={[
                styles.subtitle,

                {
                  color:
                    colors.muted,

                  fontFamily:
                    regular
                }
              ]}
            >
              {subtitle}
            </Text>
          </View>

          <Animated.View
            pointerEvents="none"

            style={[
              styles.arrowStage,

              {
                transform: [
                  {
                    rotate:
                      arrowRotate
                  }
                ]
              }
            ]}
          >
            <View
              style={[
                styles.arrow,

                {
                  borderColor:
                    colors.muted
                }
              ]}
            />
          </Animated.View>
        </Pressable>
      </Animated.View>

      <View
        pointerEvents="none"

        style={
          styles.measure
        }

        onLayout={
          event => {
            const height =
              event
                .nativeEvent
                .layout
                .height;

            if (
              height >
                0 &&
              height !==
                contentHeight
            ) {
              setContentHeight(
                height
              );

              if (active) {
                panel.setValue(
                  1
                );

                reveal.setValue(
                  1
                );
              }
            }
          }
        }
      >
        <View
          style={[
            styles.measureBody,

            {
              borderTopColor:
                colors.border
            }
          ]}
        >
          {children}
        </View>
      </View>

      <Animated.View
        pointerEvents={
          active
            ? 'auto'
            : 'none'
        }

        style={[
          styles.panel,

          {
            height:
              panelHeight
          }
        ]}
      >
        <Animated.View
          style={[
            styles.body,

            {
              borderTopColor:
                colors.border,

              opacity:
                reveal,

              transform: [
                {
                  translateY:
                    revealY
                }
              ]
            }
          ]}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    section: {
      position: 'relative',

      overflow: 'hidden',

      borderWidth: 1,

      borderRadius: 14
    },

    pressLayer: {
      width: '100%'
    },

    bar: {
      minHeight: 67,

      paddingHorizontal: 14,

      paddingVertical: 11,

      flexDirection: 'row',

      alignItems: 'center'
    },

    iconStage: {
      position: 'relative',

      width: 46,

      height: 46,

      flexShrink: 0,

      justifyContent: 'center',

      alignItems: 'center'
    },

    /*
     * These wrappers contain ONLY native
     * transform animation.
     */
    outerRotator: {
      position: 'absolute',

      width: 42,

      height: 42,

      justifyContent: 'center',

      alignItems: 'center'
    },

    outerShape: {
      width: 42,

      height: 42,

      overflow: 'hidden'
    },

    /*
     * Asymmetric highlight travels with
     * the shape so clockwise spin is visible.
     */
    outerHighlight: {
      position: 'absolute',

      width: 18,

      height: 5,

      right: 4,

      top: 4,

      borderRadius: 99,

      backgroundColor:
        'rgba(255,255,255,.22)'
    },

    innerRotator: {
      position: 'absolute',

      width: 37,

      height: 37,

      justifyContent: 'center',

      alignItems: 'center'
    },

    innerShape: {
      position: 'relative',

      width: 37,

      height: 37,

      borderWidth: 1.5,

      borderColor:
        'rgba(255,255,255,.52)'
    },

    /*
     * Marker stays attached to the complete
     * outline, making counter-spin readable.
     */
    innerMarker: {
      position: 'absolute',

      width: 9,

      height: 3,

      top: -2.2,

      left: 14,

      borderRadius: 99,

      backgroundColor:
        'rgba(255,255,255,.95)'
    },

    iconContent: {
      position: 'absolute',

      zIndex: 20,

      width: 46,

      height: 46,

      justifyContent: 'center',

      alignItems: 'center'
    },

    copy: {
      flex: 1,

      minWidth: 0,

      paddingHorizontal: 12,

      justifyContent: 'center'
    },

    title: {
      fontSize: 14,

      lineHeight: 19
    },

    subtitle: {
      marginTop: 1,

      fontSize: 10,

      lineHeight: 14
    },

    arrowStage: {
      width: 28,

      height: 28,

      flexShrink: 0,

      justifyContent: 'center',

      alignItems: 'center'
    },

    arrow: {
      width: 10,

      height: 10,

      borderRightWidth: 2,

      borderBottomWidth: 2,

      transform: [
        {
          rotate: '45deg'
        }
      ]
    },

    measure: {
      position: 'absolute',

      left: 0,

      right: 0,

      top: 67,

      zIndex: -50,

      opacity: 0
    },

    measureBody: {
      width: '100%',

      borderTopWidth: 1
    },

    panel: {
      width: '100%',

      overflow: 'hidden'
    },

    body: {
      width: '100%',

      borderTopWidth: 1
    }
  });
