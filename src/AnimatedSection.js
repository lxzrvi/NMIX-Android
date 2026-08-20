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
   * Native-driver transforms only.
   */
  const spin =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * JS-driver radius only.
   */
  const morph =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * JS-driver accordion height only.
   */
  const panel =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * Native-driver content reveal only.
   */
  const reveal =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * Native-driver press response.
   */
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

          duration: 740,

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
      contentHeight <= 0
    ) {
      return;
    }

    panel.stopAnimation();
    reveal.stopAnimation();

    if (active) {
      Animated.parallel([
        Animated.timing(
          panel,
          {
            toValue: 1,

            duration: 580,

            easing:
              EASE,

            useNativeDriver:
              false
          }
        ),

        Animated.timing(
          reveal,
          {
            toValue: 1,

            duration: 460,

            delay: 55,

            easing:
              EASE,

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

            duration: 520,

            easing:
              EASE,

            useNativeDriver:
              false
          }
        ),

        Animated.timing(
          reveal,
          {
            toValue: 0,

            duration: 300,

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
   * OUTER:
   * Clockwise.
   *
   * CLOSE:
   * Same animated value travels 1 -> 0,
   * therefore motion visibly reverses.
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

  /*
   * INNER:
   * Counter-clockwise.
   */
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
   * Slight breathing while rotating.
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
   * Square -> circle.
   */
  const outerRadius =
    morph.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        8,
        21
      ]
    });

  const innerRadius =
    morph.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        6,
        18
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

      outputRange: [
        -10,
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
             * OUTER MORPH WRAPPER
             *
             * JS driver only.
             * No transforms here.
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
               * OUTER ROTATION LAYER
               *
               * Native transforms only.
               */}
              <Animated.View
                style={[
                  styles.outerSpin,

                  {
                    transform: [
                      {
                        rotate:
                          outerRotate
                      },

                      {
                        scale:
                          outerScale
                      }
                    ]
                  }
                ]}
              >
                <View
                  style={[
                    styles.outerSurface,

                    {
                      backgroundColor:
                        accent
                    }
                  ]}
                />

                {/*
                 * Soft directional shading makes
                 * the rotation visible without
                 * broken decorative lines.
                 */}
                <View
                  style={
                    styles.outerShade
                  }
                />
              </Animated.View>
            </Animated.View>

            {/*
             * INNER MORPH WRAPPER
             *
             * JS radius only.
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
               * Complete continuous outline
               * rotates counter-clockwise.
               */}
              <Animated.View
                style={[
                  styles.innerSpin,

                  {
                    borderColor:
                      'rgba(255,255,255,.52)',

                    transform: [
                      {
                        rotate:
                          innerRotate
                      },

                      {
                        scale:
                          innerScale
                      }
                    ]
                  }
                ]}
              />
            </Animated.View>

            {/*
             * Completely stationary SVG.
             * It never enters a rotating parent.
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

      {/*
       * Invisible content copy used only
       * to measure natural panel height.
       */}
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
     * OUTER square/circle clipping shape.
     */
    outerMorph: {
      position: 'absolute',

      width: 42,

      height: 42,

      overflow: 'hidden'
    },

    /*
     * Oversized rotating layer prevents empty
     * corners from appearing while square.
     */
    outerSpin: {
      position: 'absolute',

      left: -10,

      top: -10,

      width: 62,

      height: 62
    },

    outerSurface: {
      ...StyleSheet.absoluteFillObject
    },

    /*
     * A soft asymmetric area instead of broken
     * line fragments. Because this is attached
     * to outerSpin, rotation direction is visible.
     */
    outerShade: {
      position: 'absolute',

      top: 4,

      right: 4,

      width: 31,

      height: 31,

      borderRadius: 16,

      backgroundColor:
        'rgba(255,255,255,.13)'
    },

    /*
     * Inner layer remains close to outer edge.
     */
    innerMorph: {
      position: 'absolute',

      width: 37,

      height: 37,

      overflow: 'visible',

      justifyContent: 'center',

      alignItems: 'center'
    },

    /*
     * One continuous outline.
     * No disconnected top/right/bottom pieces.
     */
    innerSpin: {
      width: 37,

      height: 37,

      borderWidth: 1.5,

      borderRadius: 7
    },

    /*
     * SVG is totally independent of
     * both rotating layers.
     */
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
