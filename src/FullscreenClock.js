import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import {
  Animated,
  Easing,
  Image,
  Modal,
  PanResponder,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';

import Svg, { Circle, Line } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';

import { RotateIcon, WallpaperIcon } from './icons';
import MotionPressable from './MotionPressable';
import ClockWallpaperPicker, {
  BUILTIN_WALLPAPERS,
  loadClockWallpaper
} from './ClockWallpaperPicker';
import { fontFamily, logoFont } from './useNMixFonts';
import useNMixSounds from './useNMixSounds';

const STYLE_KEY = 'nmix-fullscreen-clock-style';
const COLOR_KEY = 'nmix-fullscreen-clock-color';
const FONT_KEY = 'nmix-fullscreen-clock-font';

const CLOCK_STYLES = [
  'Classic', 'Clean', 'Minimal', 'Seconds Focus',
  'Split', 'Elegant', 'Cinema', 'Stacked', 'Analog', 'Hybrid'
];

const CLOCK_COLORS = [
  { name: 'White', color: '#F5F7F6' },
  { name: 'Warm', color: '#FFE1AD' },
  { name: 'Mint', color: '#B9F3DA' },
  { name: 'Sky', color: '#B9E2FF' },
  { name: 'Violet', color: '#DAC8FF' },
  { name: 'Rose', color: '#FFC6D8' }
];

const CLOCK_FONTS = ['Poppins', 'Inter', 'Outfit', 'Nunito', 'Quicksand'];
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export default function FullscreenClock({
  visible,
  onClose,
  theme,
  themeName = 'green',
  font
}) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { select: playSelect } = useNMixSounds();
  const landscape = width > height;

  const [now, setNow] = useState(new Date());
  const [wallpaperPicker, setWallpaperPicker] = useState(false);
  const [wallpaper, setWallpaper] = useState({ type: 'builtin', id: 'midnight' });
  const [chromeVisible, setChromeVisible] = useState(true);

  const [clockStyle, setClockStyle] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [clockFont, setClockFont] = useState(font || 'Poppins');
  
  // Track currently active swipe control mode: 'style' | 'color' | 'font'
  const [activeMode, setActiveMode] = useState('style');

  const entrance = useRef(new Animated.Value(0)).current;
  const ambient = useRef(new Animated.Value(0)).current;
  const chrome = useRef(new Animated.Value(1)).current;
  const hiddenBrand = useRef(new Animated.Value(0)).current;
  const clockChange = useRef(new Animated.Value(1)).current;
  const swipeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function load() {
      try {
        const [savedWallpaper, savedStyle, savedColor, savedFont] = await Promise.all([
          loadClockWallpaper(),
          AsyncStorage.getItem(STYLE_KEY),
          AsyncStorage.getItem(COLOR_KEY),
          AsyncStorage.getItem(FONT_KEY)
        ]);

        setWallpaper(savedWallpaper);
        const style = Number(savedStyle);
        if (Number.isInteger(style) && style >= 0 && style < CLOCK_STYLES.length) {
          setClockStyle(style);
        }
        const color = Number(savedColor);
        if (Number.isInteger(color) && color >= 0 && color < CLOCK_COLORS.length) {
          setColorIndex(color);
        }
        if (savedFont && CLOCK_FONTS.includes(savedFont)) {
          setClockFont(savedFont);
        } else if (font && CLOCK_FONTS.includes(font)) {
          setClockFont(font);
        }
      } catch {}
    }
    load();
  }, []);

  useEffect(() => {
    if (!visible) return;
    setNow(new Date());
    setChromeVisible(true);
    chrome.setValue(1);
    hiddenBrand.setValue(0);
    entrance.setValue(0);

    Animated.timing(entrance, {
      toValue: 1,
      duration: 650,
      easing: EASE,
      useNativeDriver: true
    }).start();

    const ambientLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(ambient, {
          toValue: 1,
          duration: ambientDuration(themeName),
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(ambient, {
          toValue: 0,
          duration: ambientDuration(themeName),
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    );
    ambientLoop.start();

    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(timer);
      ambientLoop.stop();
    };
  }, [visible, themeName]);

  useEffect(() => {
    chrome.stopAnimation();
    hiddenBrand.stopAnimation();

    Animated.parallel([
      Animated.timing(chrome, {
        toValue: chromeVisible ? 1 : 0,
        duration: 460,
        easing: EASE,
        useNativeDriver: true
      }),
      Animated.timing(hiddenBrand, {
        toValue: chromeVisible ? 0 : 1,
        duration: chromeVisible ? 280 : 600,
        delay: chromeVisible ? 0 : 150,
        easing: EASE,
        useNativeDriver: true
      })
    ]).start();
  }, [chromeVisible]);

  const regular = fontFamily(clockFont);
  const bold = fontFamily(clockFont, true);
  const builtin = wallpaper.type === 'builtin'
    ? (BUILTIN_WALLPAPERS[wallpaper.id] || BUILTIN_WALLPAPERS.midnight)
    : null;

  const parts = useMemo(() => getTimeParts(now), [now]);
  const selectedColor = CLOCK_COLORS[colorIndex];
  const clockColor = selectedColor.color;

  function animateClockChange(callback) {
    clockChange.stopAnimation();
    Animated.timing(clockChange, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true
    }).start(() => {
      callback();
      clockChange.setValue(0);
      Animated.timing(clockChange, {
        toValue: 1,
        duration: 340,
        easing: EASE,
        useNativeDriver: true
      }).start();
    });
  }

  function handleSwipe(direction) {
    playSelect?.();
    if (activeMode === 'style') {
      const next = wrapIndex(clockStyle + direction, CLOCK_STYLES.length);
      animateClockChange(() => {
        setClockStyle(next);
        AsyncStorage.setItem(STYLE_KEY, String(next)).catch(() => {});
      });
    } else if (activeMode === 'color') {
      const next = wrapIndex(colorIndex + direction, CLOCK_COLORS.length);
      animateClockChange(() => {
        setColorIndex(next);
        AsyncStorage.setItem(COLOR_KEY, String(next)).catch(() => {});
      });
    } else if (activeMode === 'font') {
      const currentIdx = Math.max(0, CLOCK_FONTS.indexOf(clockFont));
      const nextIdx = wrapIndex(currentIdx + direction, CLOCK_FONTS.length);
      const next = CLOCK_FONTS[nextIdx];
      animateClockChange(() => {
        setClockFont(next);
        AsyncStorage.setItem(FONT_KEY, next).catch(() => {});
      });
    }
  }

  // Handle Full-Screen Swiping Gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 15 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderMove: (_, gesture) => {
        swipeAnim.setValue(gesture.dx * 0.4);
      },
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > 40 || Math.abs(gesture.vx) > 0.3) {
          handleSwipe(gesture.dx < 0 ? 1 : -1);
        }
        Animated.spring(swipeAnim, {
          toValue: 0,
          stiffness: 240,
          damping: 20,
          useNativeDriver: true
        }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(swipeAnim, {
          toValue: 0,
          useNativeDriver: true
        }).start();
      }
    })
  ).current;

  const currentFontIndex = Math.max(0, CLOCK_FONTS.indexOf(clockFont));

  return (
    <Modal
      visible={visible}
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      supportedOrientations={[
        'portrait',
        'portrait-upside-down',
        'landscape-left',
        'landscape-right'
      ]}
      onRequestClose={onClose}
    >
      <StatusBar hidden />

      <View style={styles.page} {...panResponder.panHandlers}>
        {wallpaper.type === 'custom' && wallpaper.uri ? (
          <Image
            key={wallpaper.uri}
            source={{ uri: wallpaper.uri }}
            resizeMode="cover"
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <LinearGradient
            colors={builtin.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}

        <LinearGradient
          pointerEvents="none"
          colors={
            wallpaper.type === 'custom'
              ? ['rgba(0,0,0,.22)', 'rgba(0,0,0,.28)', 'rgba(0,0,0,.52)']
              : ['rgba(0,0,0,.12)', 'rgba(0,0,0,.17)', 'rgba(0,0,0,.40)']
          }
          style={StyleSheet.absoluteFill}
        />

        <AmbientTheme motion={ambient} theme={theme} themeName={themeName} />

        {!chromeVisible && (
          <Pressable
            onPress={() => setChromeVisible(true)}
            style={[StyleSheet.absoluteFill, styles.restoreTouch]}
          />
        )}

        <Animated.View
          pointerEvents="none"
          style={[
            styles.clockArea,
            {
              paddingHorizontal: landscape ? 78 : 22,
              opacity: entrance,
              transform: [
                { translateX: swipeAnim },
                {
                  scale: entrance.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.97, 1]
                  })
                }
              ]
            }
          ]}
        >
          <Animated.View
            style={[
              styles.clockContent,
              {
                opacity: clockChange,
                transform: [
                  {
                    translateY: clockChange.interpolate({
                      inputRange: [0, 1],
                      outputRange: [5, 0]
                    })
                  },
                  {
                    scale: clockChange.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.98, 1]
                    })
                  }
                ]
              }
            ]}
          >
            <ClockStyle
              index={clockStyle}
              now={now}
              parts={parts}
              landscape={landscape}
              regular={regular}
              bold={bold}
              color={clockColor}
            />
          </Animated.View>
        </Animated.View>

        <Animated.View
          pointerEvents={chromeVisible ? 'box-none' : 'none'}
          style={[styles.chromeLayer, { opacity: chrome }]}
        >
          <View style={[styles.modeToggleStack, { top: Math.max(landscape ? 14 : 20, insets.top + 8) }]}>
            <ModeTab
              label="STYLE"
              active={activeMode === 'style'}
              onPress={() => setActiveMode('style')}
              color={clockColor}
              font={bold}
            />
            <ModeTab
              label="COLOR"
              active={activeMode === 'color'}
              onPress={() => setActiveMode('color')}
              color={clockColor}
              font={bold}
            />
            <ModeTab
              label="FONT"
              active={activeMode === 'font'}
              onPress={() => setActiveMode('font')}
              color={clockColor}
              font={bold}
            />
          </View>

          <View pointerEvents="none" style={[styles.styleInfo, landscape && styles.styleInfoLandscape]}>
            <Text style={[styles.infoCaption, { fontFamily: regular }]}>
              SWIPE TO CHANGE {activeMode.toUpperCase()}
            </Text>
            <Text style={[styles.infoValue, { color: withOpacity(clockColor, 0.84), fontFamily: bold }]}>
              {activeMode === 'style' && CLOCK_STYLES[clockStyle]}
              {activeMode === 'color' && selectedColor.name}
              {activeMode === 'font' && clockFont}
            </Text>
          </View>

          <Animated.View
            style={[
              styles.bottomControls,
              {
                left: Math.max(12, insets.left + 10),
                right: Math.max(12, insets.right + 10),
                bottom: Math.max(14, insets.bottom + 10)
              }
            ]}
          >
            <MotionPressable onPress={async () => {
              try {
                if (landscape) {
                  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                } else {
                  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
                }
              } catch {}
            }} style={styles.bottomButton}>
              <RotateIcon size={18} color="#ffffff" />
              <Text style={[styles.bottomButtonText, { fontFamily: regular }]}>Rotate</Text>
            </MotionPressable>

            <MotionPressable onPress={() => setWallpaperPicker(true)} style={styles.bottomButton}>
              <WallpaperIcon size={18} color="#ffffff" />
              <Text style={[styles.bottomButtonText, { fontFamily: regular }]}>Wallpaper</Text>
            </MotionPressable>

            <MotionPressable onPress={() => setChromeVisible(false)} style={[styles.bottomButton, styles.hideButton]}>
              <View style={styles.eye}><View style={styles.eyeDot} /></View>
              <Text style={[styles.bottomButtonText, { fontFamily: regular }]}>Hide</Text>
            </MotionPressable>

            <MotionPressable onPress={onClose} style={[styles.bottomButton, styles.exitButton]}>
              <Text style={[styles.exitX, { fontFamily: regular }]}>×</Text>
              <Text style={[styles.bottomButtonText, { fontFamily: regular }]}>Exit</Text>
            </MotionPressable>
          </Animated.View>
        </Animated.View>

        <ClockWallpaperPicker
          visible={wallpaperPicker}
          onClose={() => setWallpaperPicker(false)}
          current={wallpaper}
          onChange={setWallpaper}
          theme={theme}
          font={clockFont}
        />
      </View>
    </Modal>
  );
}

function ModeTab({ label, active, onPress, color, font }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.modeTab,
        active && { backgroundColor: withOpacity(color, 0.25), borderColor: color }
      ]}
    >
      <Text style={[styles.modeTabText, { color: active ? '#ffffff' : withOpacity(color, 0.6), fontFamily: font }]}>
        {label}
      </Text>
    </Pressable>
  );
}

// ... Additional helper sub-components (ClockStyle, DateText, TimeCard, AnalogClock, AmbientTheme, etc.) remain identical
