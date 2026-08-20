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

const MOTION_EASE =
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
   * Main open/close progress.
   *
   * 0 = closed square
   * 1 = opened circle
   *
   * This same value drives the opposite
   * rotations so reversing it automatically
   * gives a visible reverse animation.
   */
  const motion =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * Height progress is separate because
   * layout animation cannot use native driver.
   */
  const panel =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  const content =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  /*
   * Press feedback.
   *
   * This deliberately affects the whole label,
   * NOT the open/close rotation progress.
   */
  const pressScale =
    useRef(
      new Animated.Value(1)
    ).current;

  useEffect(() => {
    motion.stopAnimation();

    Animated.timing(
      motion,
      {
        toValue:
          active ? 1 : 0,

        /*
         * Slow enough for the clockwise /
         * counter-clockwise movement to be
         * clearly visible and soothing.
         */
        duration: 650,
        easing: MOTION_EASE,
        useNativeDriver: false
      }
    ).start();
  }, [active]);

  useEffect(() => {
    if (
      contentHeight <= 0
    ) {
      return;
    }

    panel.stopAnimation();
    content.stopAnimation();

    Animated.parallel([
      Animated.timing(
        panel,
        {
          toValue:
            active ? 1 : 0,

          duration:
            active
              ? 570
              : 530,

          easing:
            MOTION_EASE,

          useNativeDriver:
            false
        }
      ),

      Animated.timing(
        content,
        {
          toValue:
            active ? 1 : 0,

          duration:
            active
              ? 460
              : 300,

          delay:
            active
              ? 70
              : 0,

          easing:
            active
              ? MOTION_EASE
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
        useNativeDriver: true
      }
    ).start();
  }

  function pressOut() {
    pressScale.stopAnimation();

    Animated.spring(
      pressScale,
      {
        toValue: 1,
        stiffness: 250,
        damping: 15,
        mass: 0.75,
        useNativeDriver: true
      }
    ).start();
  }

  const Icon =
    ICONS[name] ||
    HelpIcon;

  /*
   * OUTER:
   * full clockwise rotation on open.
   * Interpolation reverses naturally on close.
   */
  const outerRotation =
    motion.interpolate({
      inputRange: [0, 1],
      outputRange: [
        '0deg',
        '360deg'
      ]
    });

  /*
   * INNER:
   * full counter-clockwise rotation.
   */
  const innerRotation =
    motion.interpolate({
      inputRange: [0, 1],
      outputRange: [
        '0deg',
        '-360deg'
      ]
    });

  /*
   * Arrow only needs half a turn.
   */
  const arrowRotation =
    motion.interpolate({
      inputRange: [0, 1],
      outputRange: [
        '0deg',
        '180deg'
      ]
    });

  /*
   * Rounded square -> true circle.
   */
  const outerRadius =
    motion.interpolate({
      inputRange: [0, 1],
      outputRange: [
        9,
        21
      ]
    });

  const innerRadius =
    motion.interpolate({
      inputRange: [0, 1],
      outputRange: [
        7,
        18
      ]
    });

  /*
   * A tiny scale change makes the layered
   * movement readable without moving the
   * stationary center SVG.
   */
  const outerScale =
    motion.interpolate({
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
    motion.interpolate({
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
      inputRange: [0, 1],
      outputRange: [
        0,
        contentHeight
      ]
    });

  const contentY =
    content.interpolate({
      inputRange: [0, 1],
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
          styles.barMotion,
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
             * Only this colored layer rotates.
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
             * Outline rotates independently
             * in the opposite direction.
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
             * IMPORTANT:
             * This SVG is deliberately outside
             * both rotating Animated.Views.
             * It never rotates.
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
       * It only measures the children.
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
             * If this section was already open
             * on first measurement, make sure
             * its panel does not briefly render
             * collapsed.
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
      position: 'relative',
      overflow: 'hidden',
      borderWidth: 1,
      borderRadius: 14
    },

    /*
     * Animated.View owns the press scale while
     * Pressable keeps normal Flexbox layout.
     */
    barMotion: {
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
      width: 44,
      height: 44,
      flexShrink: 0,
      justifyContent: 'center',
      alignItems: 'center'
    },

    outer: {
      position: 'absolute',
      width: 42,
      height: 42
    },

    /*
     * Outline stays close to the outer edge.
     * 38 inside 42 leaves only ~2px per side.
     */
    inner: {
      position: 'absolute',
      width: 38,
      height: 38,
      borderWidth: 1.35,
      borderColor:
        'rgba(255,255,255,.38)'
    },

    /*
     * Completely independent of rotating
     * layers, so the SVG remains stationary.
     */
    iconContent: {
      position: 'absolute',
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 5
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
