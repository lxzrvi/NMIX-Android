import React, {
  useRef
} from 'react';

import {
  Animated,
  Pressable
} from 'react-native';

export default function MotionPressable({
  children,
  style,
  onPress,
  onLongPress,
  delayLongPress,
  disabled,
  hitSlop
}) {
  const scale = useRef(
    new Animated.Value(1)
  ).current;

  const opacity = useRef(
    new Animated.Value(1)
  ).current;

  function animate(
    toScale,
    toOpacity
  ) {
    Animated.parallel([
      Animated.spring(
        scale,
        {
          toValue: toScale,
          friction: 7,
          tension: 120,
          useNativeDriver: true
        }
      ),

      Animated.timing(
        opacity,
        {
          toValue:
            toOpacity,
          duration: 190,
          useNativeDriver: true
        }
      )
    ]).start();
  }

  return (
    <Pressable
      disabled={disabled}
      hitSlop={hitSlop}
      delayLongPress={
        delayLongPress
      }
      onPress={onPress}
      onLongPress={
        onLongPress
      }
      onPressIn={() =>
        animate(
          0.94,
          0.82
        )
      }
      onPressOut={() =>
        animate(
          1,
          1
        )
      }
    >
      <Animated.View
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
      </Animated.View>
    </Pressable>
  );
}
