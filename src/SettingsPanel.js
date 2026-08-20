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
   * Transform-only/native value.
   */
  const spin =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * Radius-only/JS value.
   */
  const morph =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * Accordion height/JS.
   */
  const panel =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * Content opacity + translation/native.
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

          duration: 720,

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

          duration: 620,

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
        toValue:
          0.972,

        duration:
          145,

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

        stiffness:
          240,

        damping:
          13,

        mass:
          0.7,

        useNativeDriver:
          true
      }
    ).start();
  }

  const Icon =
    ICONS[name] ||
    HelpIcon;

  /*
   * Ends at 405° rather than a visually
   * identical 360° square orientation.
   *
   * This leaves the opening spin obvious.
   * Closing naturally runs 405 -> 0.
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

  const outerScale =
    spin.interpolate({
      inputRange: [
        0,
        0.5,
        1
      ],

      outputRange: [
        1,
        1.06,
        1
      ]
    });

  const innerScale =
    spin.interpolate({
      inputRange: [
        0,
        0.5,
        1
      ],

      outputRange: [
        1,
        0.94,
        1
      ]
    });

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
            toggle(
              name
            )
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
             * OUTER:
             *
             * JS wrapper only changes
             * clipping radius.
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
               * Native child only rotates/scales.
               *
               * Shape is slightly oversized to
               * keep the morph wrapper fully
               * filled during rotation.
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
                {/*
                 * Subtle corner shading is part
                 * of the surface, not broken
                 * decorative line segments.
                 */}
                <View
                  style={
                    styles.outerShade
                  }
                />
              </Animated.View>
            </Animated.View>

            {/*
             * INNER morph wrapper.
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
               * A complete continuous outline.
               */}
              <Animated.View
                style={[
                  styles.innerSpin,

                  {
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
             * Stationary SVG.
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

              if (
                active
              ) {
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
      position:
        'relative',

      overflow:
        'hidden',

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

      flexDirection:
        'row',

      alignItems:
        'center'
    },

    iconStage: {
      position:
        'relative',

      width: 46,

      height: 46,

      flexShrink: 0,

      justifyContent:
        'center',

      alignItems:
        'center'
    },

    outerMorph: {
      position:
        'absolute',

      width: 42,

      height: 42,

      overflow:
        'hidden'
    },

    /*
     * Oversized rotating square.
     */
    outerSpin: {
      position:
        'absolute',

      width: 58,

      height: 58,

      left: -8,

      top: -8
    },

    /*
     * Soft complete area detail rather than
     * disconnected spinning line fragments.
     */
    outerShade: {
      position:
        'absolute',

      width: 30,

      height: 30,

      right: -5,

      top: -5,

      borderRadius: 15,

      backgroundColor:
        'rgba(255,255,255,.10)'
    },

    /*
     * Close to outer edge.
     */
    innerMorph: {
      position:
        'absolute',

      width: 37,

      height: 37,

      overflow:
        'visible'
    },

    /*
     * Full continuous rounded-square outline.
     * This whole shape rotates as one object.
     */
    innerSpin: {
      width: 37,

      height: 37,

      borderWidth: 1.5,

      borderColor:
        'rgba(255,255,255,.48)',

      borderRadius: 7
    },

    iconContent: {
      position:
        'absolute',

      zIndex: 20,

      width: 46,

      height: 46,

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
