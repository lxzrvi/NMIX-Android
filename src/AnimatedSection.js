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
   * Native transforms only.
   */
  const spin =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * JS border radius only.
   */
  const morph =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * JS height only.
   */
  const panel =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * Native content motion.
   */
  const reveal =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * Native press response.
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
            active ? 1 : 0,

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
            active ? 1 : 0,

          duration: 620,

          easing: EASE,

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

            easing: EASE,

            useNativeDriver:
              false
          }
        ),

        Animated.timing(
          reveal,
          {
            toValue: 1,

            duration: 470,

            delay: 65,

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

            duration: 520,

            easing: EASE,

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
   * 450 degrees instead of a perfect 360.
   *
   * This matters visually:
   * at 360 a square ends in exactly the same
   * orientation, which made the spin look
   * almost invisible.
   */
  const outerRotation =
    spin.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        '0deg',
        '450deg'
      ]
    });

  const innerRotation =
    spin.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        '0deg',
        '-450deg'
      ]
    });

  const arrowRotation =
    spin.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        '0deg',
        '180deg'
      ]
    });

  /*
   * Slight asymmetric scale during travel
   * makes opposite rotations readable.
   */
  const outerScale =
    spin.interpolate({
      inputRange: [
        0,
        0.38,
        0.72,
        1
      ],

      outputRange: [
        1,
        1.075,
        0.975,
        1
      ]
    });

  const innerScale =
    spin.interpolate({
      inputRange: [
        0,
        0.4,
        0.75,
        1
      ],

      outputRange: [
        1,
        0.92,
        1.045,
        1
      ]
    });

  const outerRadius =
    morph.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        9,
        22
      ]
    });

  const innerRadius =
    morph.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        7,
        19
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

  const contentY =
    reveal.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        -12,
        0
      ]
    });

  const contentScale =
    reveal.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        0.985,
        1
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
                scale: press
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
             * JS morph wrapper.
             */}
            <Animated.View
              pointerEvents="none"
              style={[
                styles.outerClip,

                {
                  borderRadius:
                    outerRadius
                }
              ]}
            >
              {/*
               * Native rotating surface.
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
                <View
                  style={
                    styles.outerAccentA
                  }
                />

                <View
                  style={
                    styles.outerAccentB
                  }
                />
              </Animated.View>
            </Animated.View>

            {/*
             * Independent JS morph wrapper
             * for inner outline.
             */}
            <Animated.View
              pointerEvents="none"
              style={[
                styles.innerClip,

                {
                  borderRadius:
                    innerRadius
                }
              ]}
            >
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
                    styles.innerTop
                  }
                />

                <View
                  style={
                    styles.innerRight
                  }
                />

                <View
                  style={
                    styles.innerBottom
                  }
                />

                <View
                  style={
                    styles.innerLeft
                  }
                />
              </Animated.View>
            </Animated.View>

            {/*
             * SVG is outside every rotating
             * component and never moves.
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

              reveal.setValue(
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
                reveal,

              transform: [
                {
                  translateY:
                    contentY
                },

                {
                  scale:
                    contentScale
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

    outerClip: {
      position: 'absolute',
      width: 42,
      height: 42,
      overflow: 'hidden'
    },

    /*
     * Larger rotating surface lets its
     * asymmetric highlights visibly travel
     * inside the clipping shape.
     */
    outerSpin: {
      position: 'absolute',
      left: -10,
      top: -10,
      width: 62,
      height: 62
    },

    outerAccentA: {
      position: 'absolute',
      top: 7,
      left: 14,
      width: 24,
      height: 5,
      borderRadius: 99,
      backgroundColor:
        'rgba(255,255,255,.27)'
    },

    outerAccentB: {
      position: 'absolute',
      right: 9,
      bottom: 12,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor:
        'rgba(255,255,255,.14)'
    },

    innerClip: {
      position: 'absolute',
      width: 38,
      height: 38,
      overflow: 'hidden',
      borderRadius: 7
    },

    /*
     * The outline itself rotates here.
     * Border pieces are deliberately not
     * symmetrical, making direction visible.
     */
    innerSpin: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: 38,
      height: 38
    },

    innerTop: {
      position: 'absolute',
      left: 2,
      top: 1,
      width: 24,
      height: 1.5,
      borderRadius: 99,
      backgroundColor:
        'rgba(255,255,255,.62)'
    },

    innerRight: {
      position: 'absolute',
      right: 1,
      top: 7,
      width: 1.5,
      height: 26,
      borderRadius: 99,
      backgroundColor:
        'rgba(255,255,255,.34)'
    },

    innerBottom: {
      position: 'absolute',
      right: 4,
      bottom: 1,
      width: 19,
      height: 1.5,
      borderRadius: 99,
      backgroundColor:
        'rgba(255,255,255,.48)'
    },

    innerLeft: {
      position: 'absolute',
      left: 1,
      bottom: 4,
      width: 1.5,
      height: 17,
      borderRadius: 99,
      backgroundColor:
        'rgba(255,255,255,.27)'
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
