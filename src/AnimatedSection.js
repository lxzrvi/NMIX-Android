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

const EASE = Easing.bezier(
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

  const [measuredHeight, setMeasuredHeight] =
    useState(0);

  const measured =
    useRef(false);

  const iconMotion =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  const panelMotion =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  const contentMotion =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  useEffect(() => {
    if (
      !measured.current ||
      measuredHeight <= 0
    ) {
      return;
    }

    iconMotion.stopAnimation();
    panelMotion.stopAnimation();
    contentMotion.stopAnimation();

    if (active) {
      Animated.parallel([
        Animated.timing(
          iconMotion,
          {
            toValue: 1,
            duration: 600,
            easing: EASE,
            useNativeDriver: true
          }
        ),

        Animated.timing(
          panelMotion,
          {
            toValue: 1,
            duration: 500,
            easing: EASE,
            useNativeDriver: false
          }
        ),

        Animated.sequence([
          Animated.delay(75),

          Animated.timing(
            contentMotion,
            {
              toValue: 1,
              duration: 390,
              easing: EASE,
              useNativeDriver: true
            }
          )
        ])
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(
          iconMotion,
          {
            toValue: 0,
            duration: 600,
            easing: EASE,
            useNativeDriver: true
          }
        ),

        Animated.sequence([
          Animated.timing(
            contentMotion,
            {
              toValue: 0,
              duration: 210,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver: true
            }
          )
        ]),

        Animated.timing(
          panelMotion,
          {
            toValue: 0,
            duration: 470,
            easing: EASE,
            useNativeDriver: false
          }
        )
      ]).start();
    }
  }, [
    active,
    measuredHeight
  ]);

  const Icon =
    ICONS[name] ||
    HelpIcon;

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
        1.09,
        1.03
      ]
    });

  const innerScale =
    iconMotion.interpolate({
      inputRange: [
        0,
        0.48,
        1
      ],
      outputRange: [
        1,
        0.91,
        1
      ]
    });

  const panelHeight =
    panelMotion.interpolate({
      inputRange: [0, 1],
      outputRange: [
        0,
        measuredHeight
      ]
    });

  const contentY =
    contentMotion.interpolate({
      inputRange: [0, 1],
      outputRange: [
        -14,
        0
      ]
    });

  const contentScale =
    contentMotion.interpolate({
      inputRange: [0, 1],
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
      <Pressable
        onPress={() =>
          toggle(name)
        }
        style={({ pressed }) => [
          styles.bar,
          pressed &&
            styles.barPressed
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

      {/*
        Hidden measurement copy.
        It does not participate in
        visible layout or interaction.
      */}
      <View
        pointerEvents="none"
        style={
          styles.measure
        }
        onLayout={event => {
          const height =
            event.nativeEvent.layout.height;

          if (
            height > 0 &&
            height !== measuredHeight
          ) {
            measured.current =
              true;

            setMeasuredHeight(
              height
            );

            if (active) {
              panelMotion.setValue(1);
              contentMotion.setValue(1);
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
              width: '100%',

              borderTopColor:
                colors.border,

              opacity:
                contentMotion,

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

    bar: {
      minHeight: 67,
      paddingHorizontal: 14,
      paddingVertical: 11,
      flexDirection: 'row',
      alignItems: 'center'
    },

    barPressed: {
      opacity: 0.86
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

    inner: {
      position: 'absolute',
      width: 35,
      height: 35,
      borderWidth: 1.3,
      borderColor:
        'rgba(255,255,255,.28)'
    },

    iconContent: {
      position: 'absolute',
      width: 44,
      height: 44,
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

    panel: {
      width: '100%',
      overflow: 'hidden'
    },

    body: {
      borderTopWidth: 1
    },

    /*
     * Measure children without ever
     * showing them to the user.
     */
    measure: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 67,
      opacity: 0,
      zIndex: -10
    },

    measureBody: {
      width: '100%',
      borderTopWidth: 1
    }
  });
