import React, { useEffect, useRef } from 'react';

import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function AnimatedSection({
  icon,
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
  const active = open === name;

  const motion = useRef(
    new Animated.Value(active ? 1 : 0)
  ).current;

  useEffect(() => {
    Animated.timing(motion, {
      toValue: active ? 1 : 0,
      duration: 620,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true
    }).start();
  }, [active]);

  const outerSpin = motion.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const innerSpin = motion.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg']
  });

  const arrowSpin = motion.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const outerScale = motion.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [1, 1.1, 1.04]
  });

  const innerScale = motion.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.84, 1]
  });

  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border
        }
      ]}
    >
      <Pressable
        onPress={() => toggle(name)}
        style={({ pressed }) => [
          styles.bar,
          pressed && styles.pressed
        ]}
      >
        <View style={styles.iconStage}>
          <Animated.View
            style={[
              styles.outerShape,
              {
                backgroundColor: accent,
                borderRadius: active ? 21 : 9,
                transform: [
                  { rotate: outerSpin },
                  { scale: outerScale }
                ]
              }
            ]}
          />

          <Animated.View
            style={[
              styles.innerShape,
              {
                borderRadius: active ? 16 : 6,
                transform: [
                  { rotate: innerSpin },
                  { scale: innerScale }
                ]
              }
            ]}
          />

          <View style={styles.symbolLayer}>
            <Text
              style={[
                styles.iconText,
                { fontFamily: bold }
              ]}
            >
              {icon}
            </Text>
          </View>
        </View>

        <View style={styles.copy}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontFamily: bold
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
                color: colors.muted,
                fontFamily: regular
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
              transform: [{ rotate: arrowSpin }]
            }
          ]}
        >
          <View
            style={[
              styles.arrow,
              { borderColor: colors.muted }
            ]}
          />
        </Animated.View>
      </Pressable>

      {active && (
        <View
          style={[
            styles.body,
            { borderTopColor: colors.border }
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
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

  iconStage: {
    width: 44,
    height: 44,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },

  outerShape: {
    position: 'absolute',
    width: 42,
    height: 42
  },

  innerShape: {
    position: 'absolute',
    width: 31,
    height: 31,
    borderWidth: 1.3,
    borderColor: 'rgba(255,255,255,.25)'
  },

  symbolLayer: {
    position: 'absolute',
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },

  iconText: {
    width: 44,
    height: 44,
    color: '#fff',
    fontSize: 18,
    lineHeight: 44,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false
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
    transform: [{ rotate: '45deg' }]
  },

  body: {
    borderTopWidth: 1
  },

  pressed: {
    opacity: 0.78
  }
});
