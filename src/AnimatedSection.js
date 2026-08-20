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
  calculator: CalculatorIcon,
  clock: ClockIcon,
  counter: CounterIcon,
  instructions: HelpIcon
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
   * NATIVE DRIVER ONLY:
   * rotate / scale / arrow.
   */
  const spin =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * JS DRIVER ONLY:
   * square -> circle radius.
   */
  const morph =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * JS DRIVER ONLY:
   * accordion height.
   */
  const panel =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * NATIVE DRIVER ONLY:
   * content fade + slide.
   */
  const contentMotion =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * NATIVE DRIVER ONLY:
   * section press bounce.
   */
  const pressScale =
    useRef(
      new Animated.Value(1)
    ).current;

  /*
   * Icon animation.
   */
  useEffect(() => {
    spin.stopAnimation();
    morph.stopAnimation();

    Animated.parallel([
      Animated.timing(
        spin,
        {
          toValue:
            active ? 1 : 0,

          duration: 680,

          easing: EASE,

          useNativeDriver:
            true
        }
      ),

      Animated.timing(
        morph,
        {
          toValue:
            active ? 1 : 0,

          duration: 610,

          easing: EASE,

          useNativeDriver:
            false
        }
      )
    ]).start();
  }, [active]);

  /*
   * Accordion.
   */
  useEffect(() => {
    if (
      contentHeight <= 0
    ) {
      return;
    }

    panel.stopAnimation();
    contentMotion.stopAnimation();

    if (active) {
      Animated.parallel([
        Animated.timing(
          panel,
          {
            toValue: 1,

            duration: 570,

            easing: EASE,

            useNativeDriver:
              false
          }
        ),

        Animated.timing(
          contentMotion,
          {
            toValue: 1,

            duration: 460,

            delay: 55,

            easing: EASE,

            useNativeDriver:
              true
          }
        )
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(
          panel,
          {
            toValue: 0,

            duration: 530,

            easing: EASE,

            useNativeDriver:
              false
          }
        ),

        Animated.timing(
          contentMotion,
          {
            toValue: 0,

            duration: 320,

            easing:
              Easing.inOut(
                Easing.ease
              ),

            useNativeDriver:
              true
          }
        )
      ]).start();
    }
  }, [
    active,
    contentHeight
  ]);

  function handlePressIn() {
    pressScale.stopAnimation();

    Animated.timing(
      pressScale,
      {
        toValue: 0.97,

        duration: 150,

        easing:
          Easing.out(
            Easing.quad
          ),

        useNativeDriver:
          true
      }
    ).start();
  }

  function handlePressOut() {
    pressScale.stopAnimation();

    Animated.spring(
      pressScale,
      {
        toValue: 1,

        stiffness: 250,
        damping: 14,
        mass: 0.72,

        useNativeDriver:
          true
      }
    ).start();
  }

  const Icon =
    ICONS[name] ||
    HelpIcon;

  /*
   * Full turn.
   *
   * Open:
   * outer  0 -> +360
   * inner  0 -> -360
   *
   * Close automatically reverses.
   */
  const outerRotation =
    spin.interpolate({
      inputRange: [
        0,
        1
      ],

      outputRange: [
        '0deg',
        '360deg'
      ]
    });

  const innerRotation =
    spin.interpolate({
      inputRange: [
        0,
        1
      ],

      outputRange: [
        '0deg',
        '-360deg'
      ]
    });

  const arrowRotation =
    spin.interpolate({
      inputRange: [
        0,
        1
      ],

      outputRange: [
        '0deg',
        '180deg'
      ]
    });

  /*
   * Native-only transform values.
   */
  const outerScale =
    spin.interpolate({
      inputRange: [
        0,
        0.48,
        1
      ],

      outputRange: [
        1,
        1.055,
        1
      ]
    });

  const innerScale =
    spin.interpolate({
      inputRange: [
        0,
        0.52,
        1
      ],

      outputRange: [
        1,
        0.945,
        1
      ]
    });

  /*
   * JS-only radius values.
   */
  const outerRadius =
    morph.interpolate({
      inputRange: [
        0,
        1
      ],

      outputRange: [
        9,
        21
      ]
    });

  const innerRadius =
    morph.interpolate({
      inputRange: [
        0,
        1
      ],

      outputRange: [
        7,
        19
      ]
    });

  const panelHeight =
    panel.interpolate({
      inputRange: [
        0,
        1
      ],

      outputRange: [
        0,
        contentHeight
      ]
    });

  const contentY =
    contentMotion.interpolate({
      inputRange: [
        0,
        1
      ],

      outputRange: [
        -11,
        0
      ]
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
          styles.pressMotion,

          {
            transform: [
              {
                scale:
                  pressScale
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
            handlePressIn
          }

          onPressOut={
            handlePressOut
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
             * OUTER MORPH WRAPPER
             *
             * JS driver only.
             * It never rotates.
             */}
            <Animated.View
              pointerEvents="none"

              style={[
                styles.outerMorph,

                {
                  borderRadius:
                    outerRadius
                }
              ]}
            >
              {/*
               * Native transform layer.
               *
               * Its parent clips it into the
               * current rounded-square/circle.
               */}
              <Animated.View
                style={[
                  styles.outerSpin,

                  {
                    backgroundColor:
                      accent,

                    transform: [
                      {
                        rotate:
                          outerRotation
                      },

                      {
                        scale:
                          outerScale
                      }
                    ]
                  }
                ]}
              >
                {/*
                 * Small asymmetric visual marks
                 * make clockwise rotation visible
                 * even while the shape approaches
                 * a perfect circle.
                 */}
                <View
                  style={
                    styles.outerMarkOne
                  }
                />

                <View
                  style={
                    styles.outerMarkTwo
                  }
                />
              </Animated.View>
            </Animated.View>

            {/*
             * INNER MORPH WRAPPER
             *
             * Again: JS driver only.
             */}
            <Animated.View
              pointerEvents="none"

              style={[
                styles.innerMorph,

                {
                  borderRadius:
                    innerRadius
                }
              ]}
            >
              {/*
               * Native counter-clockwise layer.
               */}
              <Animated.View
                style={[
                  styles.innerSpin,

                  {
                    transform: [
                      {
                        rotate:
                          innerRotation
                      },

                      {
                        scale:
                          innerScale
                      }
                    ]
                  }
                ]}
              >
                <View
                  style={
                    styles.innerMarkOne
                  }
                />

                <View
                  style={
                    styles.innerMarkTwo
                  }
                />
              </Animated.View>
            </Animated.View>

            {/*
             * CENTER ICON:
             *
             * No Animated transform.
             * Not inside a rotating view.
             * Completely stationary.
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
                      arrowRotation
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

      {/*
       * Invisible measurement copy.
       */}
      <View
        pointerEvents="none"

        style={
          styles.measure
        }

        onLayout={event => {
          const height =
            event
              .nativeEvent
              .layout
              .height;

          if (
            height > 0 &&
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

              contentMotion
                .setValue(
                  1
                );
            }
          }
        }}
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
                contentMotion,

              transform: [
                {
                  translateY:
                    contentY
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
      position:
        'relative',

      overflow:
        'hidden',

      borderWidth: 1,

      borderRadius: 14
    },

    pressMotion: {
      width: '100%'
    },

    bar: {
      minHeight: 67,

      paddingHorizontal: 14,

      paddingVertical: 11,

      flexDirection:
        'row',

      alignItems:
        'center'
    },

    iconStage: {
      position:
        'relative',

      width: 44,

      height: 44,

      flexShrink: 0,

      justifyContent:
        'center',

      alignItems:
        'center'
    },

    /*
     * JS-driven morph layer.
     */
    outerMorph: {
      position:
        'absolute',

      width: 42,

      height: 42,

      overflow:
        'hidden'
    },

    /*
     * Native-driven transform layer.
     * Slightly larger than its clipping
     * wrapper so rotation doesn't expose
     * empty corners.
     */
    outerSpin: {
      position:
        'absolute',

      left: -9,

      top: -9,

      width: 60,

      height: 60
    },

    /*
     * Very subtle asymmetric details.
     * The center SVG remains untouched.
     */
    outerMarkOne: {
      position:
        'absolute',

      width: 13,

      height: 3,

      top: 10,

      right: 10,

      borderRadius: 99,

      backgroundColor:
        'rgba(255,255,255,.24)'
    },

    outerMarkTwo: {
      position:
        'absolute',

      width: 5,

      height: 5,

      left: 12,

      bottom: 11,

      borderRadius: 3,

      backgroundColor:
        'rgba(255,255,255,.13)'
    },

    /*
     * Inner shape is close to the
     * outer edge as requested.
     */
    innerMorph: {
      position:
        'absolute',

      width: 38,

      height: 38,

      overflow:
        'hidden',

      borderWidth: 1.35,

      borderColor:
        'rgba(255,255,255,.38)'
    },

    innerSpin: {
      position:
        'absolute',

      left: -7,

      top: -7,

      width: 50,

      height: 50
    },

    innerMarkOne: {
      position:
        'absolute',

      width: 10,

      height: 2,

      left: 8,

      top: 8,

      borderRadius: 99,

      backgroundColor:
        'rgba(255,255,255,.52)'
    },

    innerMarkTwo: {
      position:
        'absolute',

      width: 4,

      height: 4,

      right: 8,

      bottom: 8,

      borderRadius: 2,

      backgroundColor:
        'rgba(255,255,255,.30)'
    },

    /*
     * Stationary SVG layer.
     */
    iconContent: {
      position:
        'absolute',

      zIndex: 10,

      width: 44,

      height: 44,

      justifyContent:
        'center',

      alignItems:
        'center'
    },

    copy: {
      flex: 1,

      minWidth: 0,

      paddingHorizontal: 12,

      justifyContent:
        'center'
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

      justifyContent:
        'center',

      alignItems:
        'center'
    },

    arrow: {
      width: 10,

      height: 10,

      borderRightWidth: 2,

      borderBottomWidth: 2,

      transform: [
        {
          rotate:
            '45deg'
        }
      ]
    },

    measure: {
      position:
        'absolute',

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

      overflow:
        'hidden'
    },

    body: {
      width: '100%',

      borderTopWidth: 1
    }
  });
