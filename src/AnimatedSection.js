import React, {
  useEffect,
  useRef
} from 'react';

import {
  Animated,
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

  const animation = useRef(
    new Animated.Value(active ? 1 : 0)
  ).current;

  useEffect(() => {
    Animated.spring(animation, {
      toValue: active ? 1 : 0,
      friction: 7,
      tension: 70,
      useNativeDriver: true
    }).start();
  }, [active]);

  const iconSpin = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const arrowSpin = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const iconScale = animation.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [1, 1.12, 1.04]
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
        <Animated.View
          style={[
            styles.iconOuter,
            {
              backgroundColor: accent,
              transform: [
                {
                  rotate: iconSpin
                },
                {
                  scale: iconScale
                }
              ]
            }
          ]}
        >
          <View
            style={[
              styles.iconInner,
              active && styles.iconInnerOpen
            ]}
          >
            <Text
              style={[
                styles.iconText,
                {
                  fontFamily: bold
                }
              ]}
            >
              {icon}
            </Text>
          </View>
        </Animated.View>

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
          style={{
            transform: [
              {
                rotate: arrowSpin
              }
            ]
          }}
        >
          <View
            style={[
              styles.arrow,
              {
                borderColor: colors.muted
              }
            ]}
          />
        </Animated.View>
      </Pressable>

      {active && (
        <View
          style={[
            styles.body,
            {
              borderTopColor: colors.border
            }
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

  iconOuter: {
    width: 42,
    height: 42,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },

  iconInner: {
    width: 31,
    height: 31,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.20)',
    borderRadius: 7
  },

  iconInnerOpen: {
    borderRadius: 16
  },

  iconText: {
    width: '100%',
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    fontSize: 18,
    lineHeight: 22
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

  arrow: {
    width: 10,
    height: 10,
    marginRight: 3,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    transform: [
      {
        rotate: '45deg'
      }
    ]
  },

  body: {
    borderTopWidth: 1
  },

  pressed: {
    opacity: 0.76
  }
});
