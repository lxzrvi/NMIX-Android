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

const { width, height } = Dimensions.get('window');

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
    // Smooth Fade-in on load
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800 * animSpeed,
      useNativeDriver: true,
    }).start();

    // Continuous floating ambient pulses (Fixed Easing functions)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: 1,
          duration: 7000 * animSpeed,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 7000 * animSpeed,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: 1,
          duration: 9000 * animSpeed,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 9000 * animSpeed,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animSpeed]);

  const handleStart = async () => {
    await AsyncStorage.setItem('nmix-welcome-seen', '1');
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400 * animSpeed,
      useNativeDriver: true,
    }).start(() => {
      router.replace('/main');
    });
  };

  const orb1TranslateY = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 40],
  });

  const orb2TranslateY = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [30, -50],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.bg, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Dynamic Ambient Background Blobs */}
      <Animated.View
        style={[
          styles.ambientOrb,
          {
            backgroundColor: theme.accent,
            opacity: isDarkMode ? 0.25 : 0.15,
            top: '10%',
            left: -50,
            transform: [{ translateY: orb1TranslateY }, { scale: 1.2 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ambientOrb,
          {
            backgroundColor: theme.accent,
            opacity: isDarkMode ? 0.2 : 0.12,
            bottom: '15%',
            right: -60,
            transform: [{ translateY: orb2TranslateY }, { scale: 1.4 }],
          },
        ]}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Title / Branding */}
        <View style={styles.headerArea}>
          <View style={styles.logoWrap}>
            <AppLogoIcon color={theme.accent} size={64} />
            <Text style={[styles.appTitle, { color: theme.text, fontFamily: 'CinzelDecorative-Bold' }]}>
              NMIX
            </Text>
          </View>
          <Text style={[styles.tagline, { color: theme.subText, fontFamily: `${selectedFont}-Bold` }]}>
            EVERYTHING WITH NUMBERS
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionArea}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.primaryBtn, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF', borderColor: theme.accent }]}
            onPress={handleStart}
          >
            <Text style={[styles.primaryBtnText, { color: theme.accent, fontFamily: `${selectedFont}-Bold` }]}>
              START
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.secondaryBtn, { backgroundColor: theme.cardBg }]}
            onPress={() => setShowMoreInfo(!showMoreInfo)}
          >
            <Text style={[styles.secondaryBtnText, { color: theme.text, fontFamily: `${selectedFont}-Regular` }]}>
              {showMoreInfo ? 'Hide Details' : 'More Info'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* More Info Section */}
        {showMoreInfo && (
          <ScrollView style={styles.moreInfoScroll} showsVerticalScrollIndicator={false}>
            <View style={[styles.infoCard, { backgroundColor: theme.cardBg }]}>
              <Text style={[styles.cardTitle, { color: theme.accent, fontFamily: `${selectedFont}-Bold` }]}>About NMIX</Text>
              <Text style={[styles.cardBody, { color: theme.text, fontFamily: `${selectedFont}-Regular` }]}>
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
              <Text style={[styles.cardTitle, { color: theme.accent, fontFamily: `${selectedFont}-Bold` }]}>App Details</Text>
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
                <Text style={[styles.githubBtnText, { color: theme.accent, fontFamily: `${selectedFont}-Bold` }]}>
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
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  headerArea: {
    alignItems: 'center',
    marginVertical: 40,
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appTitle: {
    fontSize: 48,
    includeFontPadding: false,
  },
  tagline: {
    fontSize: 12,
    letterSpacing: 3,
    marginTop: 10,
  },
  actionArea: {
    gap: 14,
    marginVertical: 20,
  },
  primaryBtn: {
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  primaryBtnText: {
    fontSize: 18,
    letterSpacing: 2,
  },
  secondaryBtn: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 15,
  },
  moreInfoScroll: {
    maxHeight: 260,
    marginTop: 10,
  },
  infoCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  githubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    alignSelf: 'flex-start',
  },
  githubBtnText: {
    fontSize: 13,
  },
});
