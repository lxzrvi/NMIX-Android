import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  TouchableOpacity,
  ScrollView,
  Linking,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNMixSettings } from '../src/useNMixSettings';
import { getThemeColors } from '../src/theme';
import { GithubIcon, AppLogoIcon } from '../src/icons';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { accentTheme, isDarkMode, selectedFont, animSpeed } = useNMixSettings();
  const theme = getThemeColors(accentTheme, isDarkMode);

  const [showMoreInfo, setShowMoreInfo] = useState(false);

  // Background ambient animation values
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Fade-in Screen Animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600 * (animSpeed || 1),
      useNativeDriver: true,
    }).start();

    // 2. Loop 1 with explicit cleanup reference
    const loop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: 1,
          duration: 6000 * (animSpeed || 1),
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 6000 * (animSpeed || 1),
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );

    // 3. Loop 2 with explicit cleanup reference
    const loop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: 1,
          duration: 8000 * (animSpeed || 1),
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 8000 * (animSpeed || 1),
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );

    loop1.start();
    loop2.start();

    // Cleanup animations on unmount to PREVENT APP AUTO-CLOSE/CRASH
    return () => {
      loop1.stop();
      loop2.stop();
    };
  }, [animSpeed]);

  const handleStart = async () => {
    try {
      await AsyncStorage.setItem('nmix-welcome-seen', '1');
    } catch (e) {}

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300 * (animSpeed || 1),
      useNativeDriver: true,
    }).start(() => {
      router.replace('/main');
    });
  };

  const orb1TranslateY = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [-25, 35],
  });

  const orb2TranslateY = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [25, -40],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.bg, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Background Blobs */}
      <Animated.View
        style={[
          styles.ambientOrb,
          {
            backgroundColor: theme.accent,
            opacity: isDarkMode ? 0.22 : 0.12,
            top: '12%',
            left: -40,
            transform: [{ translateY: orb1TranslateY }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ambientOrb,
          {
            backgroundColor: theme.accent,
            opacity: isDarkMode ? 0.18 : 0.1,
            bottom: '15%',
            right: -50,
            transform: [{ translateY: orb2TranslateY }],
          },
        ]}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Branding Area */}
        <View style={styles.headerArea}>
          <View style={styles.logoWrap}>
            <AppLogoIcon color={theme.accent} size={60} />
            <Text style={[styles.appTitle, { color: theme.text, fontFamily: 'CinzelDecorative-Bold' }]}>
              NMIX
            </Text>
          </View>
          <Text style={[styles.tagline, { color: theme.subText, fontFamily: `${selectedFont || 'Poppins'}-Bold` }]}>
            EVERYTHING WITH NUMBERS
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.actionArea}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.primaryBtn, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF', borderColor: theme.accent }]}
            onPress={handleStart}
          >
            <Text style={[styles.primaryBtnText, { color: theme.accent, fontFamily: `${selectedFont || 'Poppins'}-Bold` }]}>
              START
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.secondaryBtn, { backgroundColor: theme.cardBg }]}
            onPress={() => setShowMoreInfo(!showMoreInfo)}
          >
            <Text style={[styles.secondaryBtnText, { color: theme.text, fontFamily: `${selectedFont || 'Poppins'}-Regular` }]}>
              {showMoreInfo ? 'Hide Details' : 'More Info'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* More Info Section */}
        {showMoreInfo && (
          <ScrollView style={styles.moreInfoScroll} showsVerticalScrollIndicator={false}>
            <View style={[styles.infoCard, { backgroundColor: theme.cardBg }]}>
              <Text style={[styles.cardTitle, { color: theme.accent, fontFamily: `${selectedFont || 'Poppins'}-Bold` }]}>About NMIX</Text>
              <Text style={[styles.cardBody, { color: theme.text, fontFamily: `${selectedFont || 'Poppins'}-Regular` }]}>
                NMIX is an all-in-one suite designed to offer effortless numerical utility tools right at your fingertips with zero webview wrappers or delay.
              </Text>
              <View style={styles.chipRow}>
                {['React Native', 'Expo', 'JavaScript'].map((tech) => (
                  <View key={tech} style={[styles.chip, { backgroundColor: theme.accent + '22' }]}>
                    <Text style={[styles.chipText, { color: theme.accent }]}>{tech}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.infoCard, { backgroundColor: theme.cardBg, marginBottom: 15 }]}>
              <Text style={[styles.cardTitle, { color: theme.accent, fontFamily: `${selectedFont || 'Poppins'}-Bold` }]}>App Details</Text>
              <View style={styles.chipRow}>
                {['Android', 'Offline Tools', 'Native UI'].map((feat) => (
                  <View key={feat} style={[styles.chip, { backgroundColor: theme.accent + '22' }]}>
                    <Text style={[styles.chipText, { color: theme.accent }]}>{feat}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.githubBtn}
                onPress={() => Linking.openURL('https://github.com/lxzrvi')}
              >
                <GithubIcon color={theme.accent} size={20} />
                <Text style={[styles.githubBtnText, { color: theme.accent, fontFamily: `${selectedFont || 'Poppins'}-Bold` }]}>
                  GitHub Repository
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  ambientOrb: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  headerArea: {
    alignItems: 'center',
    marginVertical: 30,
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appTitle: {
    fontSize: 44,
    includeFontPadding: false,
  },
  tagline: {
    fontSize: 11,
    letterSpacing: 2.5,
    marginTop: 8,
  },
  actionArea: {
    gap: 12,
    marginVertical: 16,
  },
  primaryBtn: {
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  primaryBtnText: {
    fontSize: 17,
    letterSpacing: 2,
  },
  secondaryBtn: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
  },
  moreInfoScroll: {
    maxHeight: 240,
    marginTop: 8,
  },
  infoCard: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  githubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  githubBtnText: {
    fontSize: 12,
  },
});
