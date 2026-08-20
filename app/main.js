import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNMixSettings } from '../src/useNMixSettings';
import { getThemeColors } from '../src/theme';
import AnimatedSection from '../src/AnimatedSection';
import AnimatedMenuIcon from '../src/AnimatedMenuIcon';
import SettingsPanel from '../src/SettingsPanel';
import FullscreenClock from '../src/FullscreenClock';
import ClockWallpaperPicker from '../src/ClockWallpaperPicker';
import {
  CalculatorIcon,
  ClockIcon,
  CounterIcon,
  HelpIcon,
  TimerIcon,
  StopwatchIcon,
  FullscreenIcon,
  BackIcon,
} from '../src/icons';

export default function MainPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { accentTheme, isDarkMode, selectedFont, animSpeed } = useNMixSettings();
  const theme = getThemeColors(accentTheme, isDarkMode);

  // Sections State
  const [calcOpen, setCalcOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [clockOpen, setClockOpen] = useState(false);
  const [counterOpen, setCounterOpen] = useState(false);

  // Calculator State & Dropdown Animation
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcNum1, setCalcNum1] = useState('');
  const [calcOp, setCalcOp] = useState('');
  const calcBoxAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(calcBoxAnim, {
      toValue: calcOpen ? 1 : 0,
      duration: 350 * animSpeed,
      easing: Easing.out(Easing.back(1.5)),
      useNativeDriver: true,
    }).start();
  }, [calcOpen, animSpeed]);

  // Counters Continuous Press Interval Loop
  const [counterVal, setCounterVal] = useState(0);
  const counterIntervalRef = useRef(null);

  const startCounterLoop = (delta) => {
    stopCounterLoop();
    setCounterVal((prev) => prev + delta);
    counterIntervalRef.current = setInterval(() => {
      setCounterVal((prev) => prev + delta);
    }, 120);
  };

  const stopCounterLoop = () => {
    if (counterIntervalRef.current) {
      clearInterval(counterIntervalRef.current);
      counterIntervalRef.current = null;
    }
  };

  // Timer State
  const [timerSecs, setTimerSecs] = useState(10);
  const [timerRunning, setTimerRunning] = useState(false);

  // Fullscreen Clock Modal & Wallpaper Picker State
  const [fullscreenClockVisible, setFullscreenClockVisible] = useState(false);
  const [wallpaperPickerVisible, setWallpaperPickerVisible] = useState(false);
  const [customWallpaperUri, setCustomWallpaperUri] = useState(null);

  // Settings Panel State
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.branding}>
          <Text style={[styles.title, { color: theme.text, fontFamily: 'CinzelDecorative-Bold' }]}>NMIX</Text>
          <Text style={[styles.tagline, { color: theme.subText, fontFamily: `${selectedFont}-Regular` }]}>EVERYTHING WITH NUMBERS</Text>
        </View>
        <TouchableOpacity onPress={() => setSettingsOpen(true)}>
          <AnimatedMenuIcon open={settingsOpen} theme={theme} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* CALCULATOR SECTION */}
        <AnimatedSection
          title="Calculator"
          IconComponent={CalculatorIcon}
          isOpen={calcOpen}
          onToggle={() => setCalcOpen(!calcOpen)}
          theme={theme}
          selectedFont={selectedFont}
        >
          <Animated.View
            style={[
              styles.calcBoxes,
              {
                backgroundColor: theme.bg,
                opacity: calcBoxAnim,
                transform: [
                  {
                    translateY: calcBoxAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-15, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={[styles.calcBoxText, { color: theme.subText }]}>{calcNum1 || '0'}</Text>
            <Text style={[styles.calcBoxText, { color: theme.accent }]}>{calcOp || ' '}</Text>
          </Animated.View>

          <View style={[styles.calcDisplay, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.calcDisplayText, { color: theme.text, fontFamily: `${selectedFont}-Bold` }]}>
              {calcDisplay}
            </Text>
          </View>
        </AnimatedSection>

        {/* TIMER SECTION */}
        <AnimatedSection
          title="Timer"
          IconComponent={TimerIcon}
          isOpen={timerOpen}
          onToggle={() => setTimerOpen(!timerOpen)}
          theme={theme}
          selectedFont={selectedFont}
        >
          <View style={styles.timerRow}>
            <TouchableOpacity style={[styles.timerControlBtn, { backgroundColor: theme.accent }]} onPress={() => setTimerSecs(Math.max(0, timerSecs - 5))}>
              <Text style={styles.timerBtnText}>-</Text>
            </TouchableOpacity>

            <Text style={[styles.timerText, { color: theme.text, fontFamily: `${selectedFont}-Bold` }]}>
              {timerSecs}s
            </Text>

            <View style={styles.timerRightCol}>
              <TouchableOpacity style={[styles.timerControlBtn, { backgroundColor: theme.accent }]} onPress={() => setTimerSecs(timerSecs + 5)}>
                <Text style={styles.timerBtnText}>+</Text>
              </TouchableOpacity>

              {/* Symmetric Start / Pause Button aligned directly under Plus Icon */}
              <TouchableOpacity
                style={[styles.timerStartBtn, { backgroundColor: theme.accent }]}
                onPress={() => setTimerRunning(!timerRunning)}
              >
                <Text style={styles.timerStartBtnText}>{timerRunning ? 'PAUSE' : 'START'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </AnimatedSection>

        {/* CLOCK SECTION */}
        <AnimatedSection
          title="Clock"
          IconComponent={ClockIcon}
          isOpen={clockOpen}
          onToggle={() => setClockOpen(!clockOpen)}
          theme={theme}
          selectedFont={selectedFont}
        >
          <View style={styles.clockRow}>
            <Text style={[styles.clockDisplay, { color: theme.text, fontFamily: `${selectedFont}-Bold` }]}>
              {new Date().toLocaleTimeString()}
            </Text>

            {/* Fullscreen Button aligned at Corner */}
            <TouchableOpacity
              style={[styles.cornerFsBtn, { backgroundColor: theme.accent }]}
              onPress={() => setFullscreenClockVisible(true)}
            >
              <FullscreenIcon color="#FFF" size={20} />
            </TouchableOpacity>
          </View>
        </AnimatedSection>

        {/* COUNTERS SECTION (With Rapid Continuous Loop) */}
        <AnimatedSection
          title="Counters"
          IconComponent={CounterIcon}
          isOpen={counterOpen}
          onToggle={() => setCounterOpen(!counterOpen)}
          theme={theme}
          selectedFont={selectedFont}
        >
          <Text style={[styles.counterDisplay, { color: theme.text, fontFamily: `${selectedFont}-Bold` }]}>
            {counterVal}
          </Text>

          <View style={styles.counterGrid}>
            <TouchableOpacity
              style={[styles.counterBtn, { backgroundColor: theme.accent }]}
              onPressIn={() => startCounterLoop(1)}
              onPressOut={stopCounterLoop}
            >
              <Text style={styles.counterBtnText}>+ Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.counterBtn, { backgroundColor: theme.accent }]}
              onPressIn={() => startCounterLoop(-1)}
              onPressOut={stopCounterLoop}
            >
              <Text style={styles.counterBtnText}>- Minus</Text>
            </TouchableOpacity>
          </View>
        </AnimatedSection>

        {/* Back To Welcome Button */}
        <TouchableOpacity style={styles.backWelcomeBtn} onPress={() => router.push('/welcome')}>
          <BackIcon color={theme.accent} size={20} />
          <Text style={[styles.backWelcomeText, { color: theme.accent, fontFamily: `${selectedFont}-Bold` }]}>
            Back to starting page
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modals */}
      <SettingsPanel visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <FullscreenClock
        visible={fullscreenClockVisible}
        onClose={() => setFullscreenClockVisible(false)}
        wallpaperUri={customWallpaperUri}
        onOpenWallpaperPicker={() => setWallpaperPickerVisible(true)}
      />
      <ClockWallpaperPicker
        visible={wallpaperPickerVisible}
        onClose={() => setWallpaperPickerVisible(false)}
        onSelectWallpaper={(uri) => setCustomWallpaperUri(uri)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  branding: {},
  title: {
    fontSize: 28,
  },
  tagline: {
    fontSize: 10,
    letterSpacing: 2,
  },
  calcBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  calcBoxText: {
    fontSize: 16,
  },
  calcDisplay: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'flex-end',
  },
  calcDisplayText: {
    fontSize: 28,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerControlBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerBtnText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 32,
  },
  timerRightCol: {
    alignItems: 'center',
    gap: 8,
  },
  timerStartBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerStartBtnText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  clockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clockDisplay: {
    fontSize: 26,
  },
  cornerFsBtn: {
    padding: 10,
    borderRadius: 12,
  },
  counterDisplay: {
    fontSize: 36,
    textAlign: 'center',
    marginVertical: 10,
  },
  counterGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  counterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  counterBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  backWelcomeBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 30,
  },
  backWelcomeText: {
    fontSize: 14,
  },
});
