import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  AppState,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const ACCENT = '#319b79';
const HOLD = 520;

const sections = [
  ['calculator', '÷', 'Calculator', 'Numbers and operations'],
  ['clock', '◷', 'Clock', 'Timer, clock and stopwatch'],
  ['counter', '+', 'Counters', 'Count and generate'],
  ['instructions', '?', 'How to use NMIX', 'Instructions and controls']
];

export default function Main() {
  const [open, setOpen] = useState(null);

  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operator, setOperator] = useState('');
  const [target, setTarget] = useState(1);

  const [mode, setMode] = useState('idle');
  const [display, setDisplay] = useState('Ready');
  const [label, setLabel] = useState('NMIX LIVE');
  const [status, setStatus] = useState('Choose a tool below.');

  const [timerSec, setTimerSec] = useState(10);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerEnd = useRef(null);

  const [stopwatchMs, setStopwatchMs] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const stopwatchStart = useRef(null);

  const [count, setCount] = useState(0);

  const pulse = useRef(new Animated.Value(0)).current;
  const scan = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 3500,
          useNativeDriver: true
        })
      ])
    );

    const scanAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scan, {
          toValue: 1,
          duration: 3800,
          useNativeDriver: true
        }),
        Animated.timing(scan, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true
        })
      ])
    );

    pulseAnimation.start();
    scanAnimation.start();

    return () => {
      pulseAnimation.stop();
      scanAnimation.stop();
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (mode === 'clock') {
        setDisplay(formatClock(new Date()));
      }

      if (timerRunning && timerEnd.current) {
        const remaining = Math.max(
          0,
          Math.ceil((timerEnd.current - Date.now()) / 1000)
        );

        setTimerSec(remaining);
        setDisplay(formatTimer(remaining));

        if (remaining <= 0) {
          setTimerRunning(false);
          timerEnd.current = null;
          setStatus("Time's up!");
        }
      }

      if (stopwatchRunning && stopwatchStart.current) {
        const elapsed = Date.now() - stopwatchStart.current;
        setStopwatchMs(elapsed);
        setDisplay(formatStopwatch(elapsed));
      }
    }, 50);

    return () => clearInterval(id);
  }, [mode, timerRunning, stopwatchRunning]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        if (mode === 'clock') {
          setDisplay(formatClock(new Date()));
        }

        if (timerRunning && timerEnd.current) {
          const remaining = Math.max(
            0,
            Math.ceil((timerEnd.current - Date.now()) / 1000)
          );
          setTimerSec(remaining);
          setDisplay(formatTimer(remaining));
        }

        if (stopwatchRunning && stopwatchStart.current) {
          const elapsed = Date.now() - stopwatchStart.current;
          setStopwatchMs(elapsed);
          setDisplay(formatStopwatch(elapsed));
        }
      }
    });

    return () => subscription.remove();
  }, [mode, timerRunning, stopwatchRunning]);

  function stopOtherTools(except) {
    if (except !== 'timer') {
      setTimerRunning(false);
      timerEnd.current = null;
    }

    if (except !== 'stopwatch') {
      setStopwatchRunning(false);
    }
  }

  function toggleSection(name) {
    setOpen(current => (current === name ? null : name));
  }

  function calculatorKey(value) {
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

      const next = current ? current + '.' : '0.';

      target === 1 ? setNum1(next) : setNum2(next);
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

      target === 1 ? setNum1(next) : setNum2(next);
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

      target === 1 ? setNum1(next) : setNum2(next);
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

    if (operator === '+') result = a + b;
    if (operator === '−') result = a - b;
    if (operator === '×') result = a * b;

    if (operator === '÷') {
      if (b === 0) {
        setDisplay('Error');
        setLabel('CALCULATOR');
        setStatus('Division by zero is not allowed.');
        return;
      }
      result = a / b;
    }

    if (operator === '%') {
      if (b === 0) {
        setDisplay('Error');
        setStatus('Remainder by zero is not allowed.');
        return;
      }
      result = a % b;
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
    stopOtherTools('timer');
    setMode('timer');
    setLabel('TIMER');
    setDisplay(formatTimer(timerSec));
    setStatus('Use − / + for five seconds. Hold Timer to start.');
  }

  function toggleTimer() {
    stopOtherTools('timer');
    setMode('timer');
    setLabel('TIMER');

    if (timerRunning) {
      if (timerEnd.current) {
        const remaining = Math.max(
          0,
          Math.ceil((timerEnd.current - Date.now()) / 1000)
        );
        setTimerSec(remaining);
      }

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
    if (mode !== 'timer') openTimer();

    let current = timerSec;

    if (timerRunning && timerEnd.current) {
      current = Math.max(
        0,
        Math.ceil((timerEnd.current - Date.now()) / 1000)
      );
    }

    const next = Math.max(0, current + amount);
    setTimerSec(next);

    if (timerRunning) {
      timerEnd.current = Date.now() + next * 1000;
    }

    if (next === 0) {
      setTimerRunning(false);
      timerEnd.current = null;
    }

    setMode('timer');
    setLabel('TIMER');
    setDisplay(formatTimer(next));
    setStatus(
      amount > 0 ? 'Five seconds added.' : 'Five seconds removed.'
    );
  }

  function openClock() {
    stopOtherTools();
    setMode('clock');
    setLabel('LIVE CLOCK');
    setDisplay(formatClock(new Date()));
    setStatus('Live clock is active.');
  }

  function tapStopwatch() {
    setMode('stopwatch');
    setLabel('STOPWATCH');
    setTimerRunning(false);
    timerEnd.current = null;

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
    setMode('stopwatch');
    setTimerRunning(false);
    timerEnd.current = null;
    setStopwatchRunning(false);
    stopwatchStart.current = null;
    setStopwatchMs(0);
    setLabel('STOPWATCH');
    setDisplay('00:00.00');
    setStatus('Stopwatch reset.');
  }

  function counter(action) {
    stopOtherTools();
    setMode('counter');

    let next = count;

    if (action === 'add') next++;
    if (action === 'minus') next = Math.max(0, next - 1);
    if (action === 'reset') next = 0;
    if (action === 'random') {
      next = Math.floor(Math.random() * 1000) + 1;
    }

    setCount(next);
    setLabel('COUNTER');
    setDisplay(String(next));

    if (action === 'add') setStatus('Counter increased.');
    if (action === 'minus') setStatus('Counter decreased.');
    if (action === 'reset') setStatus('Counter reset to zero.');
    if (action === 'random') setStatus('Random number generated.');
  }

  function resultPress() {
    if (mode === 'calculator') calculate();
    else if (mode === 'timer') {
      setStatus(
        timerRunning
          ? 'Timer is running.'
          : 'Hold Timer to start or resume.'
      );
    } else if (mode === 'stopwatch') {
      setStatus(
        stopwatchRunning
          ? 'Stopwatch is running.'
          : 'Tap Stopwatch to start.'
      );
    } else {
      setStatus('Choose a tool below.');
    }
  }

  const calcOpen = open === 'calculator';

  return (
    <SafeAreaView style={styles.page}>
      <LinearGradient
        colors={['#19493a', '#319b79', '#173e33']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.top,
          calcOpen && styles.topCalculator
        ]}
      >
        <Text style={styles.logoSub}>ANYTHING WITH NUMBERS</Text>
        <Text style={styles.logo}>NMIX</Text>

        {calcOpen && (
          <View style={styles.expression}>
            <ExpressionBox value={num1 || '_'} />
            <View style={styles.operatorBox}>
              <Text style={styles.expressionText}>
                {operator || 'sign'}
              </Text>
            </View>
            <ExpressionBox value={num2 || '_'} />
          </View>
        )}

        <View style={styles.result}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.resultOrbOne,
              {
                transform: [
                  {
                    translateX: pulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-40, 100]
                    })
                  },
                  {
                    scale: pulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.15]
                    })
                  }
                ]
              }
            ]}
          />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.resultOrbTwo,
              {
                transform: [
                  {
                    translateX: pulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, -100]
                    })
                  }
                ]
              }
            ]}
          />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.scan,
              {
                transform: [
                  {
                    translateX: scan.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-250, 500]
                    })
                  },
                  { rotate: '-18deg' }
                ]
              }
            ]}
          />

          <View style={styles.resultRow}>
            {mode === 'timer' && (
              <Pressable
                onPress={() => changeTimer(-5)}
                style={({ pressed }) => [
                  styles.timerAdjust,
                  pressed && styles.pressed
                ]}
              >
                <Text style={styles.timerAdjustText}>−</Text>
              </Pressable>
            )}

            <Pressable
              onPress={resultPress}
              style={styles.mainDisplay}
            >
              <Text style={styles.displayLabel}>{label}</Text>

              <Text
                style={styles.display}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {display}
              </Text>
            </Pressable>

            {mode === 'timer' && (
              <Pressable
                onPress={() => changeTimer(5)}
                style={({ pressed }) => [
                  styles.timerAdjust,
                  pressed && styles.pressed
                ]}
              >
                <Text style={styles.timerAdjustText}>+</Text>
              </Pressable>
            )}
          </View>

          <Text style={styles.status} numberOfLines={1}>
            {status}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Section
          info={sections[0]}
          open={open}
          setOpen={toggleSection}
        >
          <View style={styles.calculatorGrid}>
            {[
              '1','2','3','4','5',
              '6','7','8','9','0',
              '+','−','×','÷','%',
              '.','±','⌫','AC','='
            ].map(key => {
              const accent = ['+','−','×','÷','%','='].includes(key);
              const danger = key === 'AC';

              return (
                <Pressable
                  key={key}
                  onPress={() => calculatorKey(key)}
                  style={({ pressed }) => [
                    styles.calcKey,
                    accent && styles.accentKey,
                    danger && styles.dangerKey,
                    pressed && styles.pressed
                  ]}
                >
                  <Text
                    style={[
                      styles.calcText,
                      accent && styles.white,
                      danger && styles.dangerText
                    ]}
                  >
                    {key}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section
          info={sections[1]}
          open={open}
          setOpen={toggleSection}
        >
          <View style={styles.clockGrid}>
            <HoldButton
              icon="◴"
              title="Timer"
              subtitle="Countdown"
              active={mode === 'timer'}
              onPress={openTimer}
              onLongPress={toggleTimer}
            />

            <HoldButton
              icon="◷"
              title="Clock"
              subtitle="Local time"
              active={mode === 'clock'}
              onPress={openClock}
            />

            <HoldButton
              icon="◉"
              title="Stopwatch"
              subtitle="Track time"
              active={mode === 'stopwatch'}
              onPress={tapStopwatch}
              onLongPress={resetStopwatch}
            />
          </View>
        </Section>

        <Section
          info={sections[2]}
          open={open}
          setOpen={toggleSection}
        >
          <View style={styles.counterGrid}>
            <CounterButton
              title="Add"
              subtitle="Increase"
              action={() => counter('add')}
            />
            <CounterButton
              title="Reset"
              subtitle="Back to zero"
              action={() => counter('reset')}
            />
            <CounterButton
              title="Random"
              subtitle="1 – 1000"
              action={() => counter('random')}
            />
            <CounterButton
              title="Minus"
              subtitle="Decrease"
              action={() => counter('minus')}
            />
          </View>
        </Section>

        <Section
          info={sections[3]}
          open={open}
          setOpen={toggleSection}
        >
          <View style={styles.instructions}>
            <Instruction
              title="Calculator"
              text="Open Calculator and use the NMIX keypad."
            />
            <Instruction
              title="Operators"
              text="Choose +, −, ×, ÷ or %. Then enter the second number."
            />
            <Instruction
              title="Editing"
              text="Use decimal, ±, ⌫ and AC to edit or clear calculations."
            />
            <Instruction
              title="Result"
              text="Press = or tap the large NMIX display when the expression is ready."
            />
            <Instruction
              title="Timer"
              text="Tap Timer to open it. Use − / + for five seconds and hold Timer to start or pause."
            />
            <Instruction
              title="Clock"
              text="Tap Clock to display your local time."
            />
            <Instruction
              title="Stopwatch"
              text="Tap to start or pause. Hold Stopwatch to reset."
            />
            <Instruction
              title="Counters"
              text="Add and Minus change the counter."
            />
            <Instruction
              title="Random"
              text="Generates a value from 1 to 1000."
            />
          </View>
        </Section>

        <View style={styles.contributor}>
          <Text style={styles.contributorHeading}>Contributor</Text>
          <Text style={styles.contributorName}>Alex Ravi</Text>
          <Text style={styles.bio}>
            I'm currently doing a diploma in web development and
            building my skills step by step.
          </Text>

          <View style={styles.chips}>
            {['HTML', 'CSS', 'JavaScript', 'UI / UX'].map(item => (
              <View style={styles.chip} key={item}>
                <Text style={styles.chipText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.back,
            pressed && styles.pressed
          ]}
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Alex Ravi
          </Text>
          <Text style={styles.footerSmall}>
            All Rights Reserved · NMIX · anything with numbers
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ExpressionBox({ value }) {
  return (
    <View style={styles.expressionBox}>
      <Text
        style={styles.expressionText}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
    </View>
  );
}

function Section({ info, open, setOpen, children }) {
  const [name, icon, title, subtitle] = info;
  const active = open === name;

  return (
    <View style={styles.section}>
      <Pressable
        onPress={() => setOpen(name)}
        style={({ pressed }) => [
          styles.sectionBar,
          pressed && { opacity: 0.75 }
        ]}
      >
        <View
          style={[
            styles.barIcon,
            active && styles.barIconActive
          ]}
        >
          <Text style={styles.white}>{icon}</Text>
        </View>

        <View style={styles.barCopy}>
          <Text style={styles.barTitle}>{title}</Text>
          <Text style={styles.barSubtitle}>{subtitle}</Text>
        </View>

        <Text style={styles.arrow}>
          {active ? '⌃' : '⌄'}
        </Text>
      </Pressable>

      {active && (
        <View style={styles.sectionBody}>
          {children}
        </View>
      )}
    </View>
  );
}

function HoldButton({
  icon,
  title,
  subtitle,
  active,
  onPress,
  onLongPress
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={HOLD}
      style={({ pressed }) => [
        styles.modeButton,
        active && styles.modeActive,
        pressed && styles.pressed
      ]}
    >
      <View
        style={[
          styles.modeIcon,
          active && styles.modeIconActive
        ]}
      >
        <Text
          style={[
            styles.white,
            active && { color: ACCENT }
          ]}
        >
          {icon}
        </Text>
      </View>

      <View>
        <Text
          style={[
            styles.modeTitle,
            active && styles.white
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.modeSubtitle,
            active && { color: 'rgba(255,255,255,0.8)' }
          ]}
        >
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

function CounterButton({ title, subtitle, action }) {
  return (
    <Pressable
      onPress={action}
      style={({ pressed }) => [
        styles.counterButton,
        pressed && styles.pressed
      ]}
    >
      <Text style={styles.counterTitle}>{title}</Text>
      <Text style={styles.modeSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

function Instruction({ title, text }) {
  return (
    <View style={styles.instruction}>
      <Text style={styles.instructionTitle}>{title}</Text>
      <Text style={styles.instructionText}>{text}</Text>
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
    flex: 1,
    backgroundColor: '#dedede'
  },

  top: {
    height: 280,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22
  },

  topCalculator: {
    height: 346
  },

  logoSub: {
    textAlign: 'center',
    color: '#ddf8ef',
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 2
  },

  logo: {
    height: 46,
    textAlign: 'center',
    color: '#fff',
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 5
  },

  expression: {
    height: 76,
    padding: 9,
    flexDirection: 'row',
    gap: 7,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#eeeeee'
  },

  expressionBox: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bec5c2',
    borderRadius: 8,
    backgroundColor: '#dedede'
  },

  operatorBox: {
    width: 60,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bec5c2',
    borderRadius: 8,
    backgroundColor: '#dedede'
  },

  expressionText: {
    paddingHorizontal: 5,
    color: '#202321',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600'
  },

  result: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#e5eae8'
  },

  resultOrbOne: {
    position: 'absolute',
    width: 190,
    height: 190,
    left: -100,
    top: -100,
    borderRadius: 999,
    backgroundColor: 'rgba(105,214,178,0.27)'
  },

  resultOrbTwo: {
    position: 'absolute',
    width: 220,
    height: 220,
    right: -120,
    bottom: -140,
    borderRadius: 999,
    backgroundColor: 'rgba(49,155,121,0.22)'
  },

  scan: {
    position: 'absolute',
    top: -40,
    bottom: -40,
    width: 55,
    backgroundColor: 'rgba(255,255,255,0.18)'
  },

  resultRow: {
    flex: 1,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center'
  },

  mainDisplay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  displayLabel: {
    color: '#216e56',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.5
  },

  display: {
    width: '95%',
    color: '#152c24',
    textAlign: 'center',
    fontSize: 40,
    fontWeight: '700'
  },

  status: {
    position: 'absolute',
    left: '3%',
    right: '3%',
    bottom: 7,
    color: '#397c68',
    textAlign: 'center',
    fontSize: 10
  },

  timerAdjust: {
    width: 48,
    height: 48,
    marginHorizontal: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: ACCENT
  },

  timerAdjustText: {
    color: '#fff',
    fontSize: 26
  },

  scroll: {
    flex: 1
  },

  content: {
    padding: 10,
    paddingTop: 18,
    paddingBottom: 30,
    gap: 13
  },

  section: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#bec5c2',
    borderRadius: 14,
    backgroundColor: '#eeeeee'
  },

  sectionBar: {
    minHeight: 67,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },

  barIcon: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: ACCENT
  },

  barIconActive: {
    borderRadius: 21
  },

  barCopy: {
    flex: 1
  },

  barTitle: {
    color: '#202321',
    fontSize: 14,
    fontWeight: '700'
  },

  barSubtitle: {
    color: '#66706c',
    fontSize: 10
  },

  arrow: {
    color: '#66706c',
    fontSize: 19
  },

  sectionBody: {
    borderTopWidth: 1,
    borderTopColor: '#bec5c2'
  },

  calculatorGrid: {
    paddingVertical: 17,
    paddingHorizontal: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    gap: 10
  },

  calcKey: {
    width: '16.5%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: '#dedede'
  },

  accentKey: {
    backgroundColor: ACCENT
  },

  dangerKey: {
    backgroundColor: 'rgba(216,57,57,0.13)'
  },

  calcText: {
    color: '#202321',
    fontSize: 17,
    fontWeight: '600'
  },

  dangerText: {
    color: '#d83939'
  },

  white: {
    color: '#fff',
    fontWeight: '700'
  },

  pressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.82
  },

  clockGrid: {
    padding: 14,
    gap: 10
  },

  modeButton: {
    minHeight: 76,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 13,
    backgroundColor: '#dedede'
  },

  modeActive: {
    backgroundColor: ACCENT
  },

  modeIcon: {
    width: 39,
    height: 39,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: ACCENT
  },

  modeIconActive: {
    borderRadius: 20,
    backgroundColor: '#fff'
  },

  modeTitle: {
    color: '#202321',
    fontWeight: '700'
  },

  modeSubtitle: {
    marginTop: 2,
    color: '#66706c',
    fontSize: 10
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
    borderRadius: 12,
    backgroundColor: '#dedede'
  },

  counterTitle: {
    color: '#202321',
    fontWeight: '700'
  },

  instructions: {
    padding: 13,
    gap: 9
  },

  instruction: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#dedede'
  },

  instructionTitle: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: '700'
  },

  instructionText: {
    marginTop: 5,
    color: '#66706c',
    fontSize: 11,
    lineHeight: 17
  },

  contributor: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#bec5c2',
    borderRadius: 16,
    backgroundColor: '#eeeeee'
  },

  contributorHeading: {
    color: '#202321',
    fontWeight: '700'
  },

  contributorName: {
    marginTop: 10,
    color: ACCENT,
    fontSize: 16,
    fontWeight: '800'
  },

  bio: {
    marginTop: 7,
    color: '#66706c',
    fontSize: 11,
    lineHeight: 17
  },

  chips: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },

  chip: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(49,155,121,0.12)'
  },

  chipText: {
    color: '#216e56',
    fontSize: 9,
    fontWeight: '600'
  },

  back: {
    alignSelf: 'center',
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    backgroundColor: ACCENT
  },

  backText: {
    color: '#fff',
    fontSize: 28
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 10
  },

  footerText: {
    color: '#66706c',
    fontSize: 10
  },

  footerSmall: {
    marginTop: 2,
    color: '#66706c',
    fontSize: 8
  }
});
