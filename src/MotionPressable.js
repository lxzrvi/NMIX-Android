import React, {
  useRef
} from 'react';

import {
  Animated,
  Pressable
} from 'react-native';

const AnimatedPressable =
  Animated.createAnimatedComponent(
    Pressable
  );

export default function MotionPressable({
  children,
  style,
  onPress,
  onLongPress,
  delayLongPress,
  disabled = false,
  hitSlop,
  onPressIn,
  onPressOut
}) {
  const scale = useRef(
    new Animated.Value(1)
  ).current;

  const opacity = useRef(
    new Animated.Value(1)
  ).current;

  function pressIn(event) {
    Animated.parallel([
      Animated.timing(
        scale,
        {
          toValue: 0.955,
          duration: 150,
          useNativeDriver: true
        }
      ),

      Animated.timing(
        opacity,
        {
          toValue: 0.86,
          duration: 150,
          useNativeDriver: true
        }
      )
    ]).start();

    onPressIn?.(event);
  }

  function pressOut(event) {
    Animated.parallel([
      Animated.spring(
        scale,
        {
          toValue: 1,
          friction: 7,
          tension: 85,
          useNativeDriver: true
        }
      ),

      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 220,
          useNativeDriver: true
        }
      )
    ]).start();

    onPressOut?.(event);
  }

  return (
    <AnimatedPressable
      disabled={disabled}
      hitSlop={hitSlop}
      delayLongPress={delayLongPress}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={[
        style,
        {
          opacity,
          transform: [
            {
              scale
            }
          ]
        }
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}
