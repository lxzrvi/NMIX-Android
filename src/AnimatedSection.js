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

  const rotation =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

  const morph =
    useRef(
      new Animated.Value(
        active ? 1 : 0
      )
    ).current;

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

  useEffect(() => {
    if (
      contentHeight <= 0
    ) {
      return;
    }

    rotation.stopAnimation();
    morph.stopAnimation();
    panel.stopAnimation();
    content.stopAnimation();

    if (active) {
      /*
       * Everything starts together.
       * No bounce / no delayed box.
       */
      Animated.parallel([
        Animated.timing(
          rotation,
          {
            toValue: 1,
            duration: 620,
            easing: EASE,
            useNativeDriver: true
          }
        ),

        Animated.timing(
          morph,
          {
            toValue: 1,
            duration: 560,
            easing: EASE,
            useNativeDriver: false
          }
        ),

        Animated.timing(
          panel,
          {
            toValue: 1,
            duration: 520,
            easing: EASE,
            useNativeDriver: false
          }
        ),

        Animated.timing(
          content,
          {
            toValue: 1,
            duration: 440,
            delay: 55,
            easing: EASE,
            useNativeDriver: true
          }
        )
      ]).start();
    } else {
      /*
       * Close gets a full visible
       * reverse spin as requested.
       */
      Animated.parallel([
        Animated.timing(
          rotation,
          {
            toValue: 0,
            duration: 620,
            easing: EASE,
            useNativeDriver: true
          }
        ),

        Animated.timing(
          morph,
          {
            toValue: 0,
            duration: 560,
            easing: EASE,
            useNativeDriver: false
          }
        ),

        Animated.timing(
          panel,
          {
            toValue: 0,
            duration: 520,
            easing: EASE,
            useNativeDriver: false
          }
        ),

        Animated.timing(
          content,
          {
            toValue: 0,
            duration: 300,
            easing:
              Easing.inOut(
                Easing.ease
              ),
            useNativeDriver: true
          }
        )
      ]).start();
    }
  }, [
    active,
    contentHeight
  ]);

  const Icon =
    ICONS[name] ||
    HelpIcon;

  const outerRotation =
    rotation.interpolate({
      inputRange: [0, 1],
      outputRange: [
        '0deg',
        '180deg'
      ]
    });

  const innerRotation =
    rotation.interpolate({
      inputRange: [0, 1],
      outputRange: [
        '0deg',
        '-180deg'
      ]
    });

  const arrowRotation =
    rotation.interpolate({
      inputRange: [0, 1],
      outputRange: [
        '0deg',
        '180deg'
      ]
    });

  /*
   * Actual smooth square -> circle.
   */
  const outerRadius =
    morph.interpolate({
      inputRange: [0, 1],
      outputRange: [
        9,
        21
      ]
    });

  const innerRadius =
    morph.interpolate({
      inputRange: [0, 1],
      outputRange: [
        6,
        17.5
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
        -12,
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
      <Pressable
        onPress={() =>
          toggle(name)
        }
        style={({ pressed }) => [
          styles.bar,

          pressed &&
            styles.pressed
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
                  outerRadius,

                transform: [
                  {
                    rotate:
                      outerRotation
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
                  innerRadius,

                transform: [
                  {
                    rotate:
                      innerRotation
                  }
                ]
              }
            ]}
          />

          {/*
            This never rotates.
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

      {/*
        Invisible measurement copy.
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
              panel.setValue(1);
              content.setValue(1);
              rotation.setValue(1);
              morph.setValue(1);
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

    bar: {
      minHeight: 67,
      paddingHorizontal: 14,
      paddingVertical: 11,
      flexDirection: 'row',
      alignItems: 'center'
    },

    pressed: {
      opacity: 0.87
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
     * Kept close to the outer
     * layer as requested.
     */
    inner: {
      position: 'absolute',
      width: 35,
      height: 35,
      borderWidth: 1.3,
      borderColor:
        'rgba(255,255,255,.30)'
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
