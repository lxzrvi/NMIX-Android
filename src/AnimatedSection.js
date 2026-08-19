import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View
} from 'react-native';

import {
  CalculatorIcon,
  ClockIcon,
  CounterIcon,
  HelpIcon
} from './icons';

if (
  Platform.OS ===
    'android' &&
  UIManager
    .setLayoutAnimationEnabledExperimental
) {
  UIManager
    .setLayoutAnimationEnabledExperimental(
      true
    );
}

const iconMap = {
  calculator:
    CalculatorIcon,

  clock:
    ClockIcon,

  counter:
    CounterIcon,

  instructions:
    HelpIcon
};

const smoothLayout = {
  duration: 500,

  create: {
    type:
      LayoutAnimation
        .Types
        .easeInEaseOut,

    property:
      LayoutAnimation
        .Properties
        .opacity
  },

  update: {
    type:
      LayoutAnimation
        .Types
        .easeInEaseOut
  },

  delete: {
    type:
      LayoutAnimation
        .Types
        .easeInEaseOut,

    property:
      LayoutAnimation
        .Properties
        .opacity
  }
};

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
    bodyVisible,
    setBodyVisible
  ] = useState(
    active
  );

  const iconMotion =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  const bodyMotion =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  useEffect(() => {
    /*
     * OPEN:
     * mount body first, then animate.
     */
    if (active) {
      LayoutAnimation
        .configureNext(
          smoothLayout
        );

      setBodyVisible(
        true
      );

      Animated.parallel([
        Animated.timing(
          iconMotion,
          {
            toValue: 1,

            duration: 620,

            easing:
              Easing.bezier(
                0.22,
                1,
                0.36,
                1
              ),

            useNativeDriver:
              true
          }
        ),

        Animated.timing(
          bodyMotion,
          {
            toValue: 1,

            duration: 470,

            easing:
              Easing.bezier(
                0.22,
                1,
                0.36,
                1
              ),

            useNativeDriver:
              true
          }
        )
      ]).start();

      return;
    }

    /*
     * CLOSE:
     * animate icon and body first.
     * Remove body only after motion,
     * so closing animation is visible.
     */
    Animated.parallel([
      Animated.timing(
        iconMotion,
        {
          toValue: 0,

          duration: 620,

          easing:
            Easing.bezier(
              0.22,
              1,
              0.36,
              1
            ),

          useNativeDriver:
            true
        }
      ),

      Animated.timing(
        bodyMotion,
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
    ]).start(
      ({ finished }) => {
        if (
          finished
        ) {
          LayoutAnimation
            .configureNext(
              smoothLayout
            );

          setBodyVisible(
            false
          );
        }
      }
    );
  }, [active]);

  const outerSpin =
    iconMotion.interpolate({
      inputRange: [0, 1],

      outputRange: [
        '0deg',
        '180deg'
      ]
    });

  const innerSpin =
    iconMotion.interpolate({
      inputRange: [0, 1],

      outputRange: [
        '0deg',
        '-180deg'
      ]
    });

  const arrowSpin =
    iconMotion.interpolate({
      inputRange: [0, 1],

      outputRange: [
        '0deg',
        '180deg'
      ]
    });

  const outerScale =
    iconMotion.interpolate({
      inputRange: [
        0,
        0.52,
        1
      ],

      outputRange: [
        1,
        1.08,
        1.03
      ]
    });

  const innerScale =
    iconMotion.interpolate({
      inputRange: [
        0,
        0.5,
        1
      ],

      outputRange: [
        1,
        0.91,
        1
      ]
    });

  const bodyTranslate =
    bodyMotion.interpolate({
      inputRange: [0, 1],

      outputRange: [
        -9,
        0
      ]
    });

  const bodyScale =
    bodyMotion.interpolate({
      inputRange: [0, 1],

      outputRange: [
        0.985,
        1
      ]
    });

  const Icon =
    iconMap[name] ||
    HelpIcon;

  function handlePress() {
    /*
     * Tell parent to change the open
     * section. Animation is handled
     * from the resulting active state.
     */
    toggle(name);
  }

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
      <Pressable
        onPress={
          handlePress
        }
        style={({ pressed }) => [
          styles.bar,

          pressed && {
            opacity: 0.84
          }
        ]}
      >
        <View
          style={
            styles.iconStage
          }
        >
          <Animated.View
            style={[
              styles.outer,

              {
                backgroundColor:
                  accent,

                /*
                 * Animated borderRadius
                 * isn't native-driver
                 * compatible, so the
                 * scale/spin supplies
                 * the fluid motion while
                 * active state switches
                 * the final shape.
                 */
                borderRadius:
                  active
                    ? 21
                    : 9,

                transform: [
                  {
                    rotate:
                      outerSpin
                  },

                  {
                    scale:
                      outerScale
                  }
                ]
              }
            ]}
          />

          <Animated.View
            style={[
              styles.inner,

              {
                borderRadius:
                  active
                    ? 17
                    : 6,

                transform: [
                  {
                    rotate:
                      innerSpin
                  },

                  {
                    scale:
                      innerScale
                  }
                ]
              }
            ]}
          />

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
          style={[
            styles.arrowStage,

            {
              transform: [
                {
                  rotate:
                    arrowSpin
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

      {bodyVisible && (
        <Animated.View
          style={[
            styles.body,

            {
              borderTopColor:
                colors.border,

              opacity:
                bodyMotion,

              transform: [
                {
                  translateY:
                    bodyTranslate
                },

                {
                  scale:
                    bodyScale
                }
              ]
            }
          ]}
        >
          {children}
        </Animated.View>
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    section: {
      overflow:
        'hidden',

      borderWidth: 1,

      borderRadius: 14
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
     * Close to outer edge, as in
     * your website's ::after layer.
     */
    inner: {
      position:
        'absolute',

      width: 35,

      height: 35,

      borderWidth: 1.3,

      borderColor:
        'rgba(255,255,255,.28)'
    },

    /*
     * Actual SVG is completely
     * independent of both spinning
     * layers, so it stays still.
     */
    iconContent: {
      position:
        'absolute',

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

    body: {
      borderTopWidth: 1
    }
  });
