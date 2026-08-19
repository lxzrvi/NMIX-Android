import React, {
  useEffect,
  useRef
} from 'react';

import {
  Animated,
  Easing,
  StyleSheet,
  View
} from 'react-native';

export default function AnimatedMenuIcon({
  open = false,
  color = '#ffffff'
}) {
  const motion = useRef(
    new Animated.Value(
      open ? 1 : 0
    )
  ).current;

  useEffect(() => {
    Animated.timing(
      motion,
      {
        toValue:
          open ? 1 : 0,

        duration: 380,

        easing:
          Easing.bezier(
            0.22,
            1,
            0.36,
            1
          ),

        useNativeDriver: true
      }
    ).start();
  }, [open]);

  const topRotate =
    motion.interpolate({
      inputRange: [0, 1],

      outputRange: [
        '0deg',
        '45deg'
      ]
    });

  const bottomRotate =
    motion.interpolate({
      inputRange: [0, 1],

      outputRange: [
        '0deg',
        '-45deg'
      ]
    });

  const topY =
    motion.interpolate({
      inputRange: [0, 1],

      outputRange: [
        -5,
        0
      ]
    });

  const bottomY =
    motion.interpolate({
      inputRange: [0, 1],

      outputRange: [
        5,
        0
      ]
    });

  const middleScale =
    motion.interpolate({
      inputRange: [0, 1],

      outputRange: [
        1,
        0
      ]
    });

  const middleOpacity =
    motion.interpolate({
      inputRange: [0, 0.45, 1],

      outputRange: [
        1,
        0,
        0
      ]
    });

  return (
    <View style={styles.stage}>
      <Animated.View
        style={[
          styles.line,

          {
            backgroundColor:
              color,

            transform: [
              {
                translateY:
                  topY
              },

              {
                rotate:
                  topRotate
              }
            ]
          }
        ]}
      />

      <Animated.View
        style={[
          styles.line,

          {
            backgroundColor:
              color,

            opacity:
              middleOpacity,

            transform: [
              {
                scaleX:
                  middleScale
              }
            ]
          }
        ]}
      />

      <Animated.View
        style={[
          styles.line,

          {
            backgroundColor:
              color,

            transform: [
              {
                translateY:
                  bottomY
              },

              {
                rotate:
                  bottomRotate
              }
            ]
          }
        ]}
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    stage: {
      width: 22,
      height: 22,

      justifyContent:
        'center',

      alignItems:
        'center'
    },

    line: {
      position:
        'absolute',

      width: 18,

      height: 2.2,

      borderRadius: 99
    }
  });
