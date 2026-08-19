import React, { useEffect, useRef, useState } from 'react';

import {
  Animated,
  AppState,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SettingsPanel from '../src/SettingsPanel';
import AnimatedSection from '../src/AnimatedSection';
import FullscreenClock from '../src/FullscreenClock';

import useNMixSettings from '../src/useNMixSettings';

import useNMixFonts, {
  fontFamily,
  logoFont
} from '../src/useNMixFonts';

const HOLD = 520;

const instructions = [
  ['Calculator', 'Open Calculator and use the NMIX keypad.'],
  ['Operators', 'Choose +, −, ×, ÷ or %. Then enter the second number.'],
  ['Editing', 'Use decimal, ±, ⌫ and AC to edit or clear calculations.'],
  ['Result', 'Press = or tap the large NMIX display when the expression is ready.'],
  ['Timer', 'Tap Timer to open it. Use − / + for five seconds and hold Timer to start or pause.'],
  ['Clock', 'Tap Clock for local time. Use ⛶ for full screen.'],
  ['Stopwatch', 'Tap to start or pause. Hold Stopwatch to reset.'],
  ['Counters', 'Add and Minus change the value by one.'],
  ['Random', 'Random generates a number from 1 to 1000.'],
  ['Top Screen', 'Use the top-left arrow to hide or show the NMIX screen.'],
  ['Settings', 'Use the hamburger for dark mode, five colors and five fonts.']
];

export default function Main() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const fontsLoaded = useNMixFonts();

  const {
    loaded,
    themeName,
    setThemeName,
    dark,
    setDark,
    font,
    setFont,
    theme,
    colors
  } = useNMixSettings();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [screenClosed, setScreenClosed] = useState(false);
  const [fullscreenClock, setFullscreenClock] = useState(false);
  const [open, setOpen] = useState(null);

  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operator, setOperator] = useState('');
  const [target, setTarget] = useState(1);

  const [mode, setMode] = useState('idle');
  const [display, setDisplayState] = useState('Ready');
  const [label, setLabel] = useState('NMIX LIVE');
  const [status, setStatus] = useState('Choose a tool below.');

  const [timerSec, setTimerSec] = useState(10);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerEnd = useRef(null);

  const [stopwatchMs, setStopwatchMs] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const stopwatchStart = useRef(null);

  const [count, setCount] = useState(0);

  const glow = useRef(new Animated.Value(0)).current;
  const scan = useRef(new Animated.Value(0)).current;
  const timerControls = useRef(new Animated.Value(0)).current;
  const displayMotion = useRef(new Animated.Value(1)).current;

  const accent = theme.accent;
  const regular = fontFamily(font);
  const bold = fontFamily(font, true);

  const contentWidth = Math.min(width, 1100) - 20;
  const availableKeysWidth = contentWidth - 16;
  const keySize = Math.max(
    42,
    Math.min(60, (availableKeysWidth - 44) / 5)
  );

  function setDisplay(value, animate = true) {
    setDisplayState(String(value));

    if (!animate) return;

    displayMotion.stopAnimation();
    displayMotion.setValue(0);

    Animated.timing(displayMotion, {
      toValue: 1,
      duration: 280,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true
    }).start();
  }

  useEffect(() => {
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 6500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 6500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    );

    const scanLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scan, {
          toValue: 1,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(scan, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true
        })
      ])
    );

    glowLoop.start();
    scanLoop.start();

    return () => {
      glowLoop.stop();
      scanLoop.stop();
    };
  }, []);

  useEffect(() => {
    Animated.spring(timerControls, {
      toValue: mode === 'timer' ? 1 : 0,
      friction: 7,
      tension: 70,
      useNativeDriver: true
    }).start();
  }, [mode]);

  useEffect(() => {
    const id = setInterval(() => {
      if (mode === 'clock') {
        setDisplayState(formatClock(new Date()));
      }

      if (timerRunning && timerEnd.current) {
        const remaining = Math.max(
          0,
          Math.ceil((timerEnd.current - Date.now()) / 1000)
        );

        setTimerSec(remaining);
        setDisplayState(formatTimer(remaining));

        if (remaining <= 0) {
          setTimerRunning(false);
          timerEnd.current = null;
          setStatus("Time's up!");
        }
      }

      if (stopwatchRunning && stopwatchStart.current) {
        const elapsed = Date.now() - stopwatchStart.current;

        setStopwatchMs(elapsed);
        setDisplayState(formatStopwatch(elapsed));
      }
    }, 50);

    return () => clearInterval(id);
  }, [mode, timerRunning, stopwatchRunning]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active') return;

      if (mode === 'clock') {
        setDisplayState(formatClock(new Date()));
      }

      if (timerRunning && timerEnd.current) {
        const remaining = Math.max(
          0,
          Math.ceil((timerEnd.current - Date.now()) / 1000)
        );

        setTimerSec(remaining);
        setDisplayState(formatTimer(remaining));
      }

      if (stopwatchRunning && stopwatchStart.current) {
        const elapsed = Date.now() - stopwatchStart.current;

        setStopwatchMs(elapsed);
        setDisplayState(formatStopwatch(elapsed));
      }
    });

    return () => subscription.remove();
  }, [mode, timerRunning, stopwatchRunning]);

  function ensureScreenOpen() {
    setScreenClosed(false);
  }

  function toggleSection(name) {
    ensureScreenOpen();
    setOpen(current => current === name ? null : name);
  }

  function stopOtherTools(except) {
    if (except !== 'timer') {
      setTimerRunning(false);
      timerEnd.current = null;
    }

    if (except !== 'stopwatch') {
      setStopwatchRunning(false);
    }
  }

  function calculatorKey(value) {
    ensureScreenOpen();
    stopOtherTools();
    setMode('calculator');

    if (/^\d$/.test(value)) {
      if (target === 1) {
        if (num1.length >= 18) {
          setStatus('Maximum number length reached.');
          return;
        }

        const next = num1 + value;
        setNum1(next);
        setDisplay(next);
        setLabel('FIRST NUMBER');
        setStatus('Choose an operator.');
      } else {
        if (num2.length >= 18) {
          setStatus('Maximum number length reached.');
          return;
        }

        const next = num2 + value;
        setNum2(next);
        setDisplay(next);
        setLabel('SECOND NUMBER');

        setStatus(
          operator && next
            ? 'Ready — tap = or the result screen.'
            : 'Enter the second number.'
        );
      }

      return;
    }

    if (['+', '−', '×', '÷', '%'].includes(value)) {
      if (!num1) {
        setStatus('Enter the first number before selecting an operator.');
        return;
      }

      setOperator(value);
      setTarget(2);
      setDisplay(value);
      setLabel('OPERATOR');
      setStatus(`${value} selected. Enter the second number.`);
      return;
    }

    if (value === '.') {
      const current = target === 1 ? num1 : num2;

      if (current.includes('.')) {
        setStatus('This number already contains a decimal.');
        return;
      }

      const next = current ? `${current}.` : '0.';

      if (target === 1) setNum1(next);
      else setNum2(next);

      setDisplay(next);
      setLabel('DECIMAL');
      return;
    }

    if (value === '±') {
      const current = target === 1 ? num1 : num2;

      if (!current) {
        setStatus('Enter a number before using ±.');
        return;
      }

      const next = String(-Number(current));

      if (target === 1) setNum1(next);
      else setNum2(next);

      setDisplay(next);
      setLabel('SIGN CHANGED');
      return;
    }

    if (value === '⌫') {
      if (target === 2 && !num2 && operator) {
        setOperator('');
        setTarget(1);
        setDisplay(num1 || 'Ready');
        setLabel('EDITING');
        return;
      }

      const current = target === 1 ? num1 : num2;
      const next = current.slice(0, -1);

      if (target === 1) setNum1(next);
      else setNum2(next);

      setDisplay(next || '0');
      setLabel('EDITING');
      return;
    }

    if (value === 'AC') {
      setNum1('');
      setNum2('');
      setOperator('');
      setTarget(1);
      setDisplay('Ready');
      setLabel('CALCULATOR');
      setStatus('Calculator cleared.');
      return;
    }

    if (value === '=') calculate();
  }

  function calculate() {
    ensureScreenOpen();
    setMode('calculator');

    if (!num1 || !num2 || !operator) {
      setDisplay('Incomplete');
      setLabel('CALCULATOR');
      setStatus('Enter both numbers and select an operator.');
      return;
    }

    const a = Number(num1);
    const b = Number(num2);
    let result;

    switch (operator) {
      case '+':
        result = a + b;
        break;

      case '−':
        result = a - b;
        break;

      case '×':
        result = a * b;
        break;

      case '÷':
        if (b === 0) {
          setDisplay('Error');
          setLabel('CALCULATOR');
          setStatus('Division by zero is not allowed.');
          return;
        }

        result = a / b;
        break;

      case '%':
        if (b === 0) {
          setDisplay('Error');
          setStatus('Remainder by zero is not allowed.');
          return;
        }

        result = a % b;
        break;

      default:
        setDisplay('No sign');
        setStatus('Choose an operator.');
        return;
    }

    if (!Number.isFinite(result)) {
      setDisplay('Overflow');
      setStatus('Result is too large.');
      return;
    }

    setDisplay(String(Number(result.toPrecision(12))));
    setLabel('RESULT');
    setStatus('Calculation complete.');
  }

  function openTimer() {
    ensureScreenOpen();
    stopOtherTools('timer');

    setMode('timer');
    setLabel('TIMER');
    setDisplay(formatTimer(timerSec));
    setStatus('Use − / + for five seconds. Hold Timer to start.');
  }

  function toggleTimer() {
    ensureScreenOpen();
    stopOtherTools('timer');

    setMode('timer');
    setLabel('TIMER');

    if (timerRunning) {
      const remaining = timerEnd.current
        ? Math.max(
            0,
            Math.ceil((timerEnd.current - Date.now()) / 1000)
          )
        : timerSec;

      setTimerSec(remaining);
      setDisplay(formatTimer(remaining));
      setTimerRunning(false);
      timerEnd.current = null;
      setStatus('Timer paused. Hold Timer to continue.');
      return;
    }

    if (timerSec <= 0) {
      setStatus('Add five seconds before starting.');
      return;
    }

    timerEnd.current = Date.now() + timerSec * 1000;

    setTimerRunning(true);
    setDisplay(formatTimer(timerSec));
    setStatus('Timer running. Hold Timer to pause.');
  }

  function changeTimer(amount) {
    ensureScreenOpen();

    let current = timerSec;

    if (timerRunning && timerEnd.current) {
      current = Math.max(
        0,
        Math.ceil((timerEnd.current - Date.now()) / 1000)
      );
    }

    const next = Math.max(0, current + amount);

    setTimerSec(next);
    setMode('timer');
    setLabel('TIMER');
    setDisplay(formatTimer(next));

    if (timerRunning) {
      if (next === 0) {
        setTimerRunning(false);
        timerEnd.current = null;
      } else {
        timerEnd.current = Date.now() + next * 1000;
      }
    }

    setStatus(
      amount > 0
        ? 'Five seconds added.'
        : next === 0
          ? 'Timer is at zero.'
          : 'Five seconds removed.'
    );
  }

  function openClock() {
    ensureScreenOpen();
    stopOtherTools();

    setMode('clock');
    setLabel('LIVE CLOCK');
    setDisplay(formatClock(new Date()));
    setStatus('Live clock is active.');
  }

  function openFullscreenClock() {
    ensureScreenOpen();
    stopOtherTools();

    setMode('clock');
    setLabel('LIVE CLOCK');
    setDisplay(formatClock(new Date()));

    setSettingsOpen(false);
    setFullscreenClock(true);
  }

  function tapStopwatch() {
    ensureScreenOpen();

    setTimerRunning(false);
    timerEnd.current = null;

    setMode('stopwatch');
    setLabel('STOPWATCH');

    if (stopwatchRunning) {
      const elapsed = stopwatchStart.current
        ? Date.now() - stopwatchStart.current
        : stopwatchMs;

      setStopwatchMs(elapsed);
      setStopwatchRunning(false);
      setDisplay(formatStopwatch(elapsed));
      setStatus('Stopwatch paused. Tap again to continue.');
      return;
    }

    stopwatchStart.current = Date.now() - stopwatchMs;
    setStopwatchRunning(true);
    setDisplay(formatStopwatch(stopwatchMs));
    setStatus('Stopwatch running.');
  }

  function resetStopwatch() {
    ensureScreenOpen();

    setTimerRunning(false);
    timerEnd.current = null;

    setStopwatchRunning(false);
    stopwatchStart.current = null;
    setStopwatchMs(0);

    setMode('stopwatch');
    setLabel('STOPWATCH');
    setDisplay('00:00.00');
    setStatus('Stopwatch reset.');
  }

  function counter(action) {
    ensureScreenOpen();
    stopOtherTools();

    let next = count;

    if (action === 'add') next += 1;
    if (action === 'minus') next = Math.max(0, next - 1);
    if (action === 'reset') next = 0;

    if (action === 'random') {
      next = Math.floor(Math.random() * 1000) + 1;
    }

    setCount(next);
    setMode('counter');
    setLabel('COUNTER');
    setDisplay(String(next));

    if (action === 'add') setStatus('Counter increased.');
    if (action === 'minus') setStatus('Counter decreased.');
    if (action === 'reset') setStatus('Counter reset to zero.');
    if (action === 'random') setStatus('Random number generated.');
  }

  function resultPress() {
    if (mode === 'calculator') {
      calculate();
      return;
    }

    if (mode === 'timer') {
      setStatus(
        timerRunning
          ? 'Timer is running.'
          : 'Hold Timer to start or resume.'
      );
      return;
    }

    if (mode === 'stopwatch') {
      setStatus(
        stopwatchRunning
          ? 'Stopwatch is running.'
          : 'Tap Stopwatch to start.'
      );
      return;
    }

    setStatus('Choose a tool below.');
  }

  if (!fontsLoaded || !loaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.body
        }}
      />
    );
  }

  const calcOpen = open === 'calculator';

  return (
    <View
      style={[
        styles.page,
        {
          backgroundColor: colors.body
        }
      ]}
    >
      {!screenClosed && (
        <LinearGradient
          colors={[
            theme.topOne,
            theme.topTwo,
            theme.topThree
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.top,
            {
              paddingTop: insets.top + 8
            },
            calcOpen && styles.topCalculator
          ]}
        >
          <View style={styles.logoArea}>
            <Text
              style={[
                styles.logoSub,
                { fontFamily: bold }
              ]}
            >
              ANYTHING WITH NUMBERS
            </Text>

            <Text
              style={[
                styles.logo,
                { fontFamily: logoFont }
              ]}
            >
              NMIX
            </Text>
          </View>

          {calcOpen && (
            <View
              style={[
                styles.expression,
                {
                  backgroundColor: colors.surface
                }
              ]}
            >
              <ExpressionBox
                value={num1 || '_'}
                colors={colors}
                font={bold}
              />

              <View
                style={[
                  styles.operatorBox,
                  {
                    backgroundColor: colors.surface2,
                    borderColor: colors.border
                  }
                ]}
              >
                <Text
                  style={[
                    styles.expressionText,
                    {
                      color: colors.text,
                      fontFamily: bold
                    }
                  ]}
                >
                  {operator || 'sign'}
                </Text>
              </View>

              <ExpressionBox
                value={num2 || '_'}
                colors={colors}
                font={bold}
              />
            </View>
          )}

          <View
            style={[
              styles.result,
              {
                backgroundColor: dark
                  ? '#121916'
                  : '#e6ebe8'
              }
            ]}
          >
            <Animated.View
              pointerEvents="none"
              style={[
                styles.softGlowA,
                {
                  opacity: glow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.35, 0.8]
                  }),
                  transform: [
                    {
                      translateX: glow.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-90, 80]
                      })
                    },
                    {
                      translateY: glow.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-40, 35]
                      })
                    },
                    {
                      scale: glow.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.18]
                      })
                    }
                  ]
                }
              ]}
            >
              <LinearGradient
                colors={[
                  'transparent',
                  `${theme.accentLight}08`,
                  `${theme.accentLight}32`,
                  `${theme.accentLight}08`,
                  'transparent'
                ]}
                style={styles.glowGradient}
              />
            </Animated.View>

            <Animated.View
              pointerEvents="none"
              style={[
                styles.softGlowB,
                {
                  opacity: glow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.65, 0.25]
                  }),
                  transform: [
                    {
                      translateX: glow.interpolate({
                        inputRange: [0, 1],
                        outputRange: [70, -90]
                      })
                    },
                    {
                      translateY: glow.interpolate({
                        inputRange: [0, 1],
                        outputRange: [35, -25]
                      })
                    }
                  ]
                }
              ]}
            >
              <LinearGradient
                colors={[
                  'transparent',
                  `${accent}08`,
                  `${accent}28`,
                  `${accent}06`,
                  'transparent'
                ]}
                style={styles.glowGradient}
              />
            </Animated.View>

            <Animated.View
              pointerEvents="none"
              style={[
                styles.scan,
                {
                  transform: [
                    {
                      translateX: scan.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-320, 650]
                      })
                    },
                    { rotate: '-18deg' }
                  ]
                }
              ]}
            />

            <View style={styles.resultRow}>
              {mode === 'timer' && (
                <Animated.View
                  style={{
                    opacity: timerControls,
                    transform: [
                      {
                        scale: timerControls.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.25, 1]
                        })
                      },
                      {
                        translateX: timerControls.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0]
                        })
                      }
                    ]
                  }}
                >
                  <Pressable
                    onPress={() => changeTimer(-5)}
                    style={({ pressed }) => [
                      styles.timerAdjust,
                      { backgroundColor: accent },
                      pressed && styles.pressed
                    ]}
                  >
                    <Text
                      style={[
                        styles.timerAdjustText,
                        { fontFamily: regular }
                      ]}
                    >
                      −
                    </Text>
                  </Pressable>
                </Animated.View>
              )}

              <Pressable
                onPress={resultPress}
                style={styles.mainDisplay}
              >
                <Text
                  style={[
                    styles.displayLabel,
                    {
                      color: dark
                        ? theme.accentLight
                        : theme.accentDark,
                      fontFamily: bold
                    }
                  ]}
                >
                  {label}
                </Text>

                <Animated.Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.3}
                  style={[
                    styles.display,
                    {
                      color: dark ? '#fff' : '#152c24',
                      fontFamily: bold,
                      opacity: displayMotion,
                      transform: [
                        {
                          translateY: displayMotion.interpolate({
                            inputRange: [0, 1],
                            outputRange: [7, 0]
                          })
                        }
                      ]
                    }
                  ]}
                >
                  {display}
                </Animated.Text>
              </Pressable>

              {mode === 'timer' && (
                <Animated.View
                  style={{
                    opacity: timerControls,
                    transform: [
                      {
                        scale: timerControls.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.25, 1]
                        })
                      },
                      {
                        translateX: timerControls.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-20, 0]
                        })
                      }
                    ]
                  }}
                >
                  <Pressable
                    onPress={() => changeTimer(5)}
                    style={({ pressed }) => [
                      styles.timerAdjust,
                      { backgroundColor: accent },
                      pressed && styles.pressed
                    ]}
                  >
                    <Text
                      style={[
                        styles.timerAdjustText,
                        { fontFamily: regular }
                      ]}
                    >
                      +
                    </Text>
                  </Pressable>
                </Animated.View>
              )}
            </View>

            <Text
              numberOfLines={1}
              style={[
                styles.status,
                {
                  color: dark
                    ? theme.accentLight
                    : theme.accentDark,
                  fontFamily: regular
                }
              ]}
            >
              {status}
            </Text>
          </View>
        </LinearGradient>
      )}

      <View
        style={[
          styles.controls,
          {
            top: insets.top + 10
          }
        ]}
      >
        <Pressable
          onPress={() => {
            setSettingsOpen(false);
            setScreenClosed(value => !value);
          }}
          style={({ pressed }) => [
            styles.controlButton,
            { backgroundColor: accent },
            pressed && styles.pressed
          ]}
        >
          <View
            style={[
              styles.chevron,
              screenClosed && styles.chevronClosed
            ]}
          />
        </Pressable>

        <Pressable
          onPress={() => setSettingsOpen(true)}
          style={({ pressed }) => [
            styles.controlButton,
            { backgroundColor: accent },
            pressed && styles.pressed
          ]}
        >
          <View style={styles.hamburger}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </View>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          screenClosed && [
            styles.contentCollapsed,
            {
              paddingTop: insets.top + 70
            }
          ]
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedSection
          icon="÷"
          title="Calculator"
          subtitle="Numbers and operations"
          name="calculator"
          open={open}
          toggle={toggleSection}
          colors={colors}
          accent={accent}
          regular={regular}
          bold={bold}
        >
          <View style={styles.calculatorGrid}>
            {[
              '1','2','3','4','5',
              '6','7','8','9','0',
              '+','−','×','÷','%',
              '.','±','⌫','AC','='
            ].map(key => {
              const isAccent =
                ['+','−','×','÷','%','='].includes(key);

              const danger = key === 'AC';

              return (
                <Pressable
                  key={key}
                  onPress={() => calculatorKey(key)}
                  style={({ pressed }) => [
                    styles.calcKey,
                    {
                      width: keySize,
                      height: keySize,
                      borderRadius: keySize / 2,
                      backgroundColor: colors.surface2
                    },
                    isAccent && {
                      backgroundColor: accent
                    },
                    danger && {
                      backgroundColor: dark
                        ? '#472225'
                        : '#f1d5d5'
                    },
                    pressed && styles.pressed
                  ]}
                >
                  <Text
                    style={[
                      styles.calcText,
                      {
                        color: colors.text,
                        fontFamily: bold
                      },
                      isAccent && { color: '#fff' },
                      danger && { color: '#d83939' }
                    ]}
                  >
                    {key}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </AnimatedSection>

        <AnimatedSection
          icon="◷"
          title="Clock"
          subtitle="Timer, clock and stopwatch"
          name="clock"
          open={open}
          toggle={toggleSection}
          colors={colors}
          accent={accent}
          regular={regular}
          bold={bold}
        >
          <View style={styles.clockGrid}>
            <ModeButton
              icon="◴"
              title="Timer"
              subtitle="Countdown"
              active={mode === 'timer'}
              onPress={openTimer}
              onLongPress={toggleTimer}
              colors={colors}
              accent={accent}
              regular={regular}
              bold={bold}
            />

            <ModeButton
              icon="◷"
              title="Clock"
              subtitle="Local time"
              active={mode === 'clock'}
              onPress={openClock}
              colors={colors}
              accent={accent}
              regular={regular}
              bold={bold}
              extra={
                <Pressable
                  onPress={openFullscreenClock}
                  hitSlop={10}
                  style={({ pressed }) => [
                    styles.fullscreenButton,
                    {
                      backgroundColor: mode === 'clock'
                        ? '#fff'
                        : accent
                    },
                    pressed && styles.pressed
                  ]}
                >
                  <Text
                    style={[
                      styles.fullscreenText,
                      {
                        color: mode === 'clock'
                          ? accent
                          : '#fff'
                      }
                    ]}
                  >
                    ⛶
                  </Text>
                </Pressable>
              }
            />

            <ModeButton
              icon="◉"
              title="Stopwatch"
              subtitle="Track time"
              active={mode === 'stopwatch'}
              onPress={tapStopwatch}
              onLongPress={resetStopwatch}
              colors={colors}
              accent={accent}
              regular={regular}
              bold={bold}
            />
          </View>
        </AnimatedSection>

        <AnimatedSection
          icon="+"
          title="Counters"
          subtitle="Count and generate"
          name="counter"
          open={open}
          toggle={toggleSection}
          colors={colors}
          accent={accent}
          regular={regular}
          bold={bold}
        >
          <View style={styles.counterGrid}>
            <CounterButton
              title="Add"
              subtitle="Increase"
              onPress={() => counter('add')}
              colors={colors}
              regular={regular}
              bold={bold}
            />

            <CounterButton
              title="Reset"
              subtitle="Back to zero"
              onPress={() => counter('reset')}
              colors={colors}
              regular={regular}
              bold={bold}
            />

            <CounterButton
              title="Random"
              subtitle="1 – 1000"
              onPress={() => counter('random')}
              colors={colors}
              regular={regular}
              bold={bold}
            />

            <CounterButton
              title="Minus"
              subtitle="Decrease"
              onPress={() => counter('minus')}
              colors={colors}
              regular={regular}
              bold={bold}
            />
          </View>
        </AnimatedSection>

        <AnimatedSection
          icon="?"
          title="How to use NMIX"
          subtitle="Instructions and controls"
          name="instructions"
          open={open}
          toggle={toggleSection}
          colors={colors}
          accent={accent}
          regular={regular}
          bold={bold}
        >
          <View style={styles.instructions}>
            {instructions.map(([title, text]) => (
              <View
                key={title}
                style={[
                  styles.instruction,
                  {
                    backgroundColor: colors.surface2
                  }
                ]}
              >
                <Text
                  style={[
                    styles.instructionTitle,
                    {
                      color: accent,
                      fontFamily: bold
                    }
                  ]}
                >
                  {title}
                </Text>

                <Text
                  style={[
                    styles.instructionText,
                    {
                      color: colors.muted,
                      fontFamily: regular
                    }
                  ]}
                >
                  {text}
                </Text>
              </View>
            ))}
          </View>
        </AnimatedSection>

        <View
          style={[
            styles.contributor,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border
            }
          ]}
        >
          <Text
            style={[
              styles.contributorHeading,
              {
                color: colors.text,
                fontFamily: bold
              }
            ]}
          >
            Contributor
          </Text>

          <Text
            style={[
              styles.contributorName,
              {
                color: accent,
                fontFamily: logoFont
              }
            ]}
          >
            Alex Ravi
          </Text>

          <Text
            style={[
              styles.bio,
              {
                color: colors.muted,
                fontFamily: regular
              }
            ]}
          >
            I'm currently doing a diploma in web development and building
            my skills step by step.
          </Text>

          <Text
            style={[
              styles.learning,
              {
                color: colors.muted,
                fontFamily: bold
              }
            ]}
          >
            Skills
          </Text>

          <View style={styles.chips}>
            {['HTML', 'CSS', 'JavaScript'].map(item => (
              <SkillChip
                key={item}
                item={item}
                accent={accent}
                color={
                  dark
                    ? theme.accentLight
                    : theme.accentDark
                }
                bold={bold}
              />
            ))}
          </View>

          <Text
            style={[
              styles.learning,
              {
                color: colors.muted,
                fontFamily: bold
              }
            ]}
          >
            Learning More
          </Text>

          <View style={styles.chips}>
            {[
              'Responsive Design',
              'UI / UX',
              'Web APIs'
            ].map(item => (
              <SkillChip
                key={item}
                item={item}
                accent={accent}
                color={
                  dark
                    ? theme.accentLight
                    : theme.accentDark
                }
                bold={bold}
              />
            ))}
          </View>
        </View>

        <Pressable
          onPress={() => {
            setSettingsOpen(false);
            stopOtherTools();
            router.push('/welcome');
          }}
          style={({ pressed }) => [
            styles.back,
            {
              backgroundColor: accent
            },
            pressed && styles.pressed
          ]}
        >
          <View style={styles.backArrow} />
        </Pressable>

        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              {
                color: colors.muted,
                fontFamily: regular
              }
            ]}
          >
            © {new Date().getFullYear()} Alex Ravi
          </Text>

          <Text
            style={[
              styles.footerSmall,
              {
                color: colors.muted,
                fontFamily: regular
              }
            ]}
          >
            All Rights Reserved · NMIX · anything with numbers
          </Text>
        </View>
      </ScrollView>

      <SettingsPanel
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        dark={dark}
        setDark={setDark}
        themeName={themeName}
        setThemeName={setThemeName}
        font={font}
        setFont={setFont}
        colors={colors}
        accent={accent}
      />

      <FullscreenClock
        visible={fullscreenClock}
        onClose={() => {
          setFullscreenClock(false);
          setStatus('Returned to NMIX clock.');
        }}
        theme={theme}
        font={font}
      />
    </View>
  );
}

function ExpressionBox({
  value,
  colors,
  font
}) {
  return (
    <View
      style={[
        styles.expressionBox,
        {
          backgroundColor: colors.surface2,
          borderColor: colors.border
        }
      ]}
    >
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[
          styles.expressionText,
          {
            color: colors.text,
            fontFamily: font
          }
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function ModeButton({
  icon,
  title,
  subtitle,
  active,
  onPress,
  onLongPress,
  colors,
  accent,
  regular,
  bold,
  extra
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={HOLD}
      style={({ pressed }) => [
        styles.modeButton,
        {
          backgroundColor: active
            ? accent
            : colors.surface2
        },
        pressed && styles.pressed
      ]}
    >
      <View
        style={[
          styles.modeIcon,
          {
            backgroundColor: active
              ? '#fff'
              : accent
          }
        ]}
      >
        <Text
          style={[
            styles.modeIconText,
            {
              color: active
                ? accent
                : '#fff',
              fontFamily: bold
            }
          ]}
        >
          {icon}
        </Text>
      </View>

      <View style={styles.modeCopy}>
        <Text
          style={[
            styles.modeTitle,
            {
              color: active
                ? '#fff'
                : colors.text,
              fontFamily: bold
            }
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.modeSubtitle,
            {
              color: active
                ? 'rgba(255,255,255,.8)'
                : colors.muted,
              fontFamily: regular
            }
          ]}
        >
          {subtitle}
        </Text>
      </View>

      {extra}
    </Pressable>
  );
}

function CounterButton({
  title,
  subtitle,
  onPress,
  colors,
  regular,
  bold
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.counterButton,
        {
          backgroundColor: colors.surface2
        },
        pressed && styles.pressed
      ]}
    >
      <Text
        style={[
          styles.counterTitle,
          {
            color: colors.text,
            fontFamily: bold
          }
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.modeSubtitle,
          {
            color: colors.muted,
            fontFamily: regular
          }
        ]}
      >
        {subtitle}
      </Text>
    </Pressable>
  );
}

function SkillChip({
  item,
  accent,
  color,
  bold
}) {
  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: `${accent}20`,
          borderColor: `${accent}45`
        }
      ]}
    >
      <Text
        style={[
          styles.chipText,
          {
            color,
            fontFamily: bold
          }
        ]}
      >
        {item}
      </Text>
    </View>
  );
}

function formatTimer(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function formatClock(date) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function formatStopwatch(ms) {
  const total = Math.floor(ms / 1000);
  const min = Math.floor(total / 60);
  const sec = total % 60;
  const hundredths = Math.floor((ms % 1000) / 10);

  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },

  top: {
    height: 330,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22
  },

  topCalculator: {
    height: 405
  },

  logoArea: {
    height: 66,
    justifyContent: 'center',
    alignItems: 'center'
  },

  logoSub: {
    color: '#ddf8ef',
    fontSize: 8,
    letterSpacing: 2,
    textAlign: 'center'
  },

  logo: {
    color: '#fff',
    fontSize: 27,
    lineHeight: 36,
    letterSpacing: 5,
    textAlign: 'center'
  },

  expression: {
    height: 76,
    padding: 9,
    flexDirection: 'row',
    gap: 7,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },

  expressionBox: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8
  },

  operatorBox: {
    width: 60,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8
  },

  expressionText: {
    paddingHorizontal: 5,
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false
  },

  result: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    borderRadius: 15
  },

  softGlowA: {
    position: 'absolute',
    width: 370,
    height: 330,
    left: -170,
    top: -145
  },

  softGlowB: {
    position: 'absolute',
    width: 420,
    height: 370,
    right: -200,
    bottom: -190
  },

  glowGradient: {
    flex: 1,
    borderRadius: 240
  },

  scan: {
    position: 'absolute',
    top: -50,
    bottom: -50,
    width: 55,
    backgroundColor: 'rgba(255,255,255,.1)'
  },

  resultRow: {
    flex: 1,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  mainDisplay: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },

  displayLabel: {
    fontSize: 9,
    letterSpacing: 2.5,
    textAlign: 'center'
  },

  display: {
    width: '94%',
    fontSize: 40,
    lineHeight: 50,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false
  },

  status: {
    position: 'absolute',
    left: '3%',
    right: '3%',
    bottom: 7,
    fontSize: 10,
    textAlign: 'center'
  },

  controls: {
    position: 'absolute',
    zIndex: 1000,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    pointerEvents: 'box-none'
  },

  controlButton: {
    width: 43,
    height: 43,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    elevation: 8
  },

  chevron: {
    width: 13,
    height: 13,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#fff',
    borderRadius: 2,
    transform: [
      { translateY: 3 },
      { rotate: '45deg' }
    ]
  },

  chevronClosed: {
    transform: [
      { translateY: -3 },
      { rotate: '225deg' }
    ]
  },

  hamburger: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4
  },

  hamburgerLine: {
    width: 17,
    height: 2,
    borderRadius: 5,
    backgroundColor: '#fff'
  },

  timerAdjust: {
    width: 48,
    height: 48,
    marginHorizontal: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24
  },

  timerAdjustText: {
    width: 48,
    height: 48,
    color: '#fff',
    fontSize: 27,
    lineHeight: 48,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false
  },

  scroll: {
    flex: 1
  },

  content: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    padding: 10,
    paddingTop: 18,
    paddingBottom: 30,
    gap: 13
  },

  contentCollapsed: {
    paddingTop: 76
  },

  calculatorGrid: {
    paddingHorizontal: 8,
    paddingVertical: 17,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    gap: 10
  },

  calcKey: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  calcText: {
    width: '100%',
    fontSize: 17,
    lineHeight: 22,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false
  },

  clockGrid: {
    padding: 14,
    gap: 10
  },

  modeButton: {
    position: 'relative',
    minHeight: 76,
    padding: 12,
    paddingRight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 13
  },

  modeIcon: {
    width: 40,
    height: 40,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },

  modeIconText: {
    width: 40,
    height: 40,
    fontSize: 17,
    lineHeight: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false
  },

  modeCopy: {
    flex: 1,
    justifyContent: 'center'
  },

  modeTitle: {
    fontSize: 13,
    lineHeight: 18
  },

  modeSubtitle: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 14
  },

  fullscreenButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    width: 35,
    height: 35,
    marginTop: -17.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9
  },

  fullscreenText: {
    fontSize: 18,
    lineHeight: 24,
    includeFontPadding: false
  },

  counterGrid: {
    padding: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },

  counterButton: {
    width: '48%',
    minHeight: 73,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12
  },

  counterTitle: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center'
  },

  instructions: {
    padding: 13,
    gap: 9
  },

  instruction: {
    padding: 12,
    borderRadius: 10
  },

  instructionTitle: {
    fontSize: 12
  },

  instructionText: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 17
  },

  contributor: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 16
  },

  contributorHeading: {
    fontSize: 14
  },

  contributorName: {
    marginTop: 10,
    fontSize: 16
  },

  bio: {
    marginTop: 7,
    fontSize: 11,
    lineHeight: 17
  },

  learning: {
    marginTop: 12,
    fontSize: 10
  },

  chips: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },

  chip: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 999
  },

  chipText: {
    fontSize: 9
  },

  back: {
    alignSelf: 'center',
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28
  },

  backArrow: {
    width: 18,
    height: 18,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#fff',
    transform: [
      { rotate: '45deg' }
    ]
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 10
  },

  footerText: {
    fontSize: 10
  },

  footerSmall: {
    marginTop: 2,
    fontSize: 8,
    textAlign: 'center'
  },

  pressed: {
    opacity: 0.8,
    transform: [
      { scale: 0.92 }
    ]
  }
});
