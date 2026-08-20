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

/*
 * CSS-transition-like easing.
 */
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
   * IMPORTANT:
   *
   * Website behavior:
   * before = +180deg
   * after  = -180deg
   *
   * Rotation stays on native driver.
   */
  const rotation =
    useRef(
      new Animated.Value(
        active
          ? 1
          : 0
      )
    ).current;

  /*
   * Border radius cannot use native driver.
   * Separate value avoids the previous
   * native/JS Animated node crash.
   */
  const morph =
    useRef(
      new Animated.Value(
        active
          ? 1
          : 0
      )
    ).current;

  /*
   * Accordion height.
   */
  const panel =
    useRef(
      new Animated.Value(
        active
          ? 1
          : 0
      )
    ).current;

  /*
   * Content fade/slide.
   */
  const reveal =
    useRef(
      new Animated.Value(
        active
          ? 1
          : 0
      )
    ).current;

  /*
   * Tap feedback.
   */
  const pressScale =
    useRef(
      new Animated.Value(1)
    ).current;

  useEffect(() => {
    rotation.stopAnimation();
    morph.stopAnimation();

    Animated.parallel([
      Animated.timing(
        rotation,
        {
          toValue:
            active
              ? 1
              : 0,

          /*
           * Long enough to actually see the
           * same soothing website transition.
           */
          duration: 580,

          easing:
            EASE,

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

          duration: 580,

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
              ? 520
              : 470,

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
              ? 420
              : 280,

          delay:
            active
              ? 45
              : 0,

          easing:
            EASE,

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
    pressScale
      .stopAnimation();

    Animated.timing(
      pressScale,
      {
        toValue: 0.975,

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
    pressScale
      .stopAnimation();

    Animated.spring(
      pressScale,
      {
        toValue: 1,

        stiffness: 245,

        damping: 15,

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
   * Exact website directions.
   */
  const outerRotate =
    rotation.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        '0deg',
        '180deg'
      ]
    });

  const innerRotate =
    rotation.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        '0deg',
        '-180deg'
      ]
    });

  /*
   * Website:
   * scale(1.04)
   */
  const outerScale =
    rotation.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        1,
        1.04
      ]
    });

  const arrowRotate =
    rotation.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        '0deg',
        '180deg'
      ]
    });

  /*
   * Rounded square -> circle.
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
        7,
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

      outputRange: [
        -9,
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
                  pressScale
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
             * Website ::before equivalent.
             *
             * Native rotating parent.
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
               * JS-driven shape morph.
               *
               * The shape itself changes to circle.
               */}
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
              />
            </Animated.View>

            {/*
             * Website ::after equivalent.
             *
             * Counter-clockwise.
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
              <Animated.View
                style={[
                  styles.innerShape,

                  {
                    borderRadius:
                      innerRadius
                  }
                ]}
              />
            </Animated.View>

            {/*
             * Center SVG remains stationary.
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

    outerRotator: {
      position: 'absolute',

      width: 42,

      height: 42,

      justifyContent: 'center',

      alignItems: 'center'
    },

    outerShape: {
      width: 42,

      height: 42
    },

    /*
     * Close to the outer shape just like
     * the website ::after layer.
     */
    innerRotator: {
      position: 'absolute',

      width: 37,

      height: 37,

      justifyContent: 'center',

      alignItems: 'center'
    },

    innerShape: {
      width: 37,

      height: 37,

      borderWidth: 1.4,

      borderColor:
        'rgba(255,255,255,.44)'
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
          rotate:
            '45deg'
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
