import React, {
  useRef
} from 'react';

import {
  Animated,
  Pressable
} from 'react-native';

import useNMixSounds
  from './useNMixSounds';

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
  onPressOut,

  /*
   * Special controls can disable the
   * automatic global tap sound and play
   * their own select/open/result sound.
   */
  sound = true
}) {
  const scale =
    useRef(
      new Animated.Value(1)
    ).current;

  const opacity =
    useRef(
      new Animated.Value(1)
    ).current;

  const {
    tap
  } = useNMixSounds();

  function pressIn(
    event
  ) {
    Animated.parallel([
      Animated.timing(
        scale,
        {
          toValue: 0.955,

          duration: 150,

          useNativeDriver:
            true
        }
      ),

      Animated.timing(
        opacity,
        {
          toValue: 0.86,

          duration: 150,

          useNativeDriver:
            true
        }
      )
    ]).start();

    onPressIn?.(
      event
    );
  }

  function pressOut(
    event
  ) {
    Animated.parallel([
      Animated.spring(
        scale,
        {
          toValue: 1,

          friction: 7,

          tension: 85,

          useNativeDriver:
            true
        }
      ),

      Animated.timing(
        opacity,
        {
          toValue: 1,

          duration: 220,

          useNativeDriver:
            true
        }
      )
    ]).start();

    onPressOut?.(
      event
    );
  }

  function handlePress(
    event
  ) {
    if (
      disabled
    ) {
      return;
    }

    if (sound) {
      tap();
    }

    onPress?.(
      event
    );
  }

  return (
    <AnimatedPressable
      disabled={
        disabled
      }

      hitSlop={
        hitSlop
      }

      delayLongPress={
        delayLongPress
      }

      onPress={
        handlePress
      }

      onLongPress={
        onLongPress
      }

      onPressIn={
        pressIn
      }

      onPressOut={
        pressOut
      }

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
