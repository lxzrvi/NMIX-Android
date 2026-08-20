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
   * Rotation is separate so it can
   * stay on the native animation driver.
   */
  const rotation =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * Morph controls square -> circle.
   * Border radius requires JS driver.
   */
  const morph =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * Accordion height.
   */
  const panel =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * Inner content fade/slide.
   */
  const content =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * Independent tap response.
   */
  const pressScale =
    useRef(
      new Animated.Value(1)
    ).current;

  /*
   * Icon animation must NOT depend on
   * content measurement. This fixes the
   * first-tap animation sometimes being
   * skipped.
   */
  useEffect(() => {
    rotation.stopAnimation();
    morph.stopAnimation();

    Animated.parallel([
      Animated.timing(
        rotation,
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
   * Content opening / closing is kept
   * independent from the spinning icon.
   */
  useEffect(() => {
    if (
      contentHeight <= 0
    ) {
      return;
    }

    panel.stopAnimation();
    content.stopAnimation();

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
          content,
          {
            toValue: 1,

            duration: 470,

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
          content,
          {
            toValue: 0,

            duration: 330,

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
        toValue: 0.975,

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
   * Full clockwise turn.
   *
   * On close the Animated.Value goes
   * from 1 -> 0, therefore this visibly
   * spins backwards automatically.
   */
  const outerRotation =
    rotation.interpolate({
      inputRange: [
        0,
        1
      ],

      outputRange: [
        '0deg',
        '360deg'
      ]
    });

  /*
   * Opposite rotation.
   */
  const innerRotation =
    rotation.interpolate({
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
    rotation.interpolate({
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
   * Rounded-square -> circle.
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

  /*
   * Very subtle breathing of the layers
   * makes the counter-rotation easier to
   * perceive without moving the SVG.
   */
  const outerScale =
    rotation.interpolate({
      inputRange: [
        0,
        0.46,
        1
      ],

      outputRange: [
        1,
        1.055,
        1
      ]
    });

  const innerScale =
    rotation.interpolate({
      inputRange: [
        0,
        0.52,
        1
      ],

      outputRange: [
        1,
        0.94,
        1
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
    content.interpolate({
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
             * OUTER:
             * clockwise rotating color layer.
             */}
            <Animated.View
              pointerEvents="none"

              style={[
                styles.outer,

                {
                  backgroundColor:
                    accent,

                  borderRadius:
                    outerRadius,

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
            />

            {/*
             * INNER:
             * counter-clockwise outline.
             */}
            <Animated.View
              pointerEvents="none"

              style={[
                styles.inner,

                {
                  borderRadius:
                    innerRadius,

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
            />

            {/*
             * SVG deliberately has NO animated
             * transform and is not inside either
             * rotating layer.
             *
             * It remains completely stationary.
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
       * Invisible natural-height copy.
       * This exists only to measure children.
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

            /*
             * Important when a section is
             * already open during measurement.
             */
            if (active) {
              panel.setValue(1);
              content.setValue(1);
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
                content,

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

    outer: {
      position:
        'absolute',

      width: 42,

      height: 42
    },

    /*
     * Only 2px inset from the outer layer.
     */
    inner: {
      position:
        'absolute',

      width: 38,

      height: 38,

      borderWidth: 1.35,

      borderColor:
        'rgba(255,255,255,.38)'
    },

    iconContent: {
      position:
        'absolute',

      zIndex: 5,

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
          rotate: '45deg'
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
