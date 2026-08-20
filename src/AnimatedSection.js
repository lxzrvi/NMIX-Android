import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Easing, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useNMixSettings } from './useNMixSettings';
import { ChevronIcon } from './icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AnimatedSection({ title, IconComponent, isOpen, onToggle, theme, selectedFont, children }) {
  const { animSpeed } = useNMixSettings();

  const spinOuter = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  const spinInner = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  const arrowRot = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const duration = 500 * animSpeed;
    Animated.parallel([
      Animated.timing(spinOuter, {
        toValue: isOpen ? 1 : 0,
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(spinInner, {
        toValue: isOpen ? 1 : 0,
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(arrowRot, {
        toValue: isOpen ? 1 : 0,
        duration,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen, animSpeed]);

  const outerSpinInterpolate = spinOuter.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const innerSpinInterpolate = spinInner.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const outerBorderRadius = spinOuter.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 22],
  });

  const arrowInterpolate = arrowRot.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
      <Pressable style={styles.header} onPress={onToggle}>
        <View style={styles.iconContainer}>
          {/* Outer Rotating Square Layer */}
          <Animated.View
            style={[
              styles.outerLayer,
              {
                borderColor: theme.accent,
                borderRadius: outerBorderRadius,
                transform: [{ rotate: outerSpinInterpolate }],
              },
            ]}
          />
          {/* Inner Outlined Layer */}
          <Animated.View
            style={[
              styles.innerLayer,
              {
                borderColor: theme.accent + '88',
                borderRadius: outerBorderRadius,
                transform: [{ rotate: innerSpinInterpolate }],
              },
            ]}
          />
          {/* Central Stationary Icon */}
          <View style={styles.stationaryIcon}>
            <IconComponent color={theme.accent} size={22} />
          </View>
        </View>

        <Text style={[styles.title, { color: theme.text, fontFamily: `${selectedFont}-Bold` }]}>
          {title}
        </Text>

        <Animated.View style={{ transform: [{ rotate: arrowInterpolate }] }}>
          <ChevronIcon color={theme.subText} size={20} />
        </Animated.View>
      </Pressable>

      {isOpen && <View style={styles.body}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginVertical: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  outerLayer: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderWidth: 2,
  },
  innerLayer: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderWidth: 1.5,
  },
  stationaryIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
