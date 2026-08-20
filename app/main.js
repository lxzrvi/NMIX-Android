import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  Animated,
  AppState,
  Easing,
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
import AnimatedMenuIcon from '../src/AnimatedMenuIcon';
import FullscreenClock from '../src/FullscreenClock';
import MotionPressable from '../src/MotionPressable';
import TimeDisplay from '../src/TimeDisplay';

import useNMixSettings from '../src/useNMixSettings';

import useNMixFonts, {
  fontFamily,
  logoFont
} from '../src/useNMixFonts';

import {
  BackIcon,
  ChevronIcon,
  ClockIcon,
  FullscreenIcon,
  StopwatchIcon,
  TimerIcon
} from '../src/icons';

const HOLD = 520;

const EASE =
  Easing.bezier(
    0.22,
    1,
    0.36,
    1
  );

const ENTRANCE_EASE =
  Easing.bezier(
    0.16,
    1,
    0.3,
    1
  );

const instructions = [
  [
    'Calculator',
    'Open Calculator and use the NMIX keypad.'
  ],
  [
    'Operators',
    'Choose +, −, ×, ÷ or %. Then enter the second number.'
  ],
  [
    'Editing',
    'Use decimal, ±, ⌫ and AC to edit or clear calculations.'
  ],
  [
    'Result',
    'Press = or tap the large NMIX display when the expression is ready.'
  ],
  [
    'Timer',
    'Tap Timer to open it. Use − / + for five seconds and hold Timer to start or pause.'
  ],
  [
    'Clock',
    'Tap Clock for local time. Use the fullscreen button on the right for full screen.'
  ],
  [
    'Stopwatch',
    'Tap to start or pause. Hold Stopwatch to reset.'
  ],
  [
    'Counters',
    'Add and Minus change the counter by one.'
  ],
  [
    'Random',
    'Random generates a number from 1 to 1000.'
  ],
  [
    'Top Screen',
    'Use the top-left control to hide or show the NMIX screen.'
  ],
  [
    'Settings',
    'Use the top-right control for dark mode, themes and fonts.'
  ],
  [
    'Fullscreen Clock',
    'Use Style, Color and Font controls to personalize the fullscreen clock.'
  ]
];

export default function Main() {
  const insets =
    useSafeAreaInsets();

  const {
    width
  } = useWindowDimensions();

  const fontsLoaded =
    useNMixFonts();

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

  const [
    settingsOpen,
    setSettingsOpen
  ] = useState(false);

  const [
    screenClosed,
    setScreenClosed
  ] = useState(false);

  const [
    fullscreenClock,
    setFullscreenClock
  ] = useState(false);

  const [
    open,
    setOpen
  ] = useState(null);

  const [
    num1,
    setNum1
  ] = useState('');

  const [
    num2,
    setNum2
  ] = useState('');

  const [
    operator,
    setOperator
  ] = useState('');

  const [
    target,
    setTarget
  ] = useState(1);

  const [
    mode,
    setMode
  ] = useState('idle');

  const [
    display,
    setDisplayState
  ] = useState('Ready');

  const [
    label,
    setLabel
  ] = useState('NMIX LIVE');

  const [
    status,
    setStatus
  ] = useState(
    'Choose a tool below.'
  );

  const [
    timerSec,
    setTimerSec
  ] = useState(10);

  const [
    timerRunning,
    setTimerRunning
  ] = useState(false);

  const timerEnd =
    useRef(null);

  const [
    stopwatchMs,
    setStopwatchMs
  ] = useState(0);

  const [
    stopwatchRunning,
    setStopwatchRunning
  ] = useState(false);

  const stopwatchStart =
    useRef(null);

  const [
    count,
    setCount
  ] = useState(0);

  const ambient =
    useRef(
      new Animated.Value(0)
    ).current;

  const timerMotion =
    useRef(
      new Animated.Value(0)
    ).current;

  const displayMotion =
    useRef(
      new Animated.Value(1)
    ).current;

  const mainEntrance =
    useRef(
      new Animated.Value(0)
    ).current;

  const expressionMotion =
    useRef(
      new Animated.Value(0)
    ).current;

  const sectionMotions =
    useRef(
      Array.from(
        {
          length: 7
        },
        () =>
          new Animated.Value(0)
      )
    ).current;

  const accent =
    theme.accent;

  const regular =
    fontFamily(font);

  const bold =
    fontFamily(
      font,
      true
    );

  const appWidth =
    Math.min(
      width,
      1100
    );

  const keySize =
    Math.max(
      42,
      Math.min(
        60,
        (
          appWidth -
          88
        ) / 5
      )
    );

  function updateDisplay(
    value,
    animate = true
  ) {
    setDisplayState(
      String(value)
    );

    if (!animate) {
      return;
    }

    displayMotion
      .stopAnimation();

    displayMotion
      .setValue(0.72);

    Animated.timing(
      displayMotion,
      {
        toValue: 1,

        duration: 135,

        easing:
          Easing.out(
            Easing.quad
          ),

        useNativeDriver:
          true
      }
    ).start();
  }

  /*
   * Stronger Main entrance:
   *
   * top screen comes from above;
   * cards rise from below with stagger.
   */
  useEffect(() => {
    mainEntrance
      .setValue(0);

    sectionMotions
      .forEach(
        value =>
          value.setValue(
            0
          )
      );

    Animated.timing(
      mainEntrance,
      {
        toValue: 1,

        duration: 780,

        easing:
          ENTRANCE_EASE,

        useNativeDriver:
          true
      }
    ).start();

    Animated.sequence([
      Animated.delay(
        160
      ),

      Animated.stagger(
        105,

        sectionMotions.map(
          value =>
            Animated.timing(
              value,
              {
                toValue: 1,

                duration: 650,

                easing:
                  ENTRANCE_EASE,

                useNativeDriver:
                  true
              }
            )
        )
      )
    ]).start();
  }, []);

  useEffect(() => {
    const loop =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            ambient,
            {
              toValue: 1,

              duration: 7500,

              easing:
                Easing.inOut(
                  Easing.ease
                ),

              useNativeDriver:
                true
            }
          ),

          Animated.timing(
            ambient,
            {
              toValue: 0,

              duration: 7500,

              easing:
                Easing.inOut(
                  Easing.ease
                ),

              useNativeDriver:
                true
            }
          )
        ])
      );

    loop.start();

    return () =>
      loop.stop();
  }, []);

  useEffect(() => {
    Animated.spring(
      timerMotion,
      {
        toValue:
          mode === 'timer'
            ? 1
            : 0,

        friction: 8,

        tension: 65,

        useNativeDriver:
          true
      }
    ).start();
  }, [mode]);

  useEffect(() => {
    expressionMotion
      .stopAnimation();

    Animated.timing(
      expressionMotion,
      {
        toValue:
          open ===
          'calculator'
            ? 1
            : 0,

        duration:
          open ===
          'calculator'
            ? 460
            : 300,

        easing: EASE,

        useNativeDriver:
          true
      }
    ).start();
  }, [open]);

  useEffect(() => {
    const id =
      setInterval(
        () => {
          if (
            mode ===
            'clock'
          ) {
            setDisplayState(
              formatClock(
                new Date()
              )
            );
          }

          if (
            timerRunning &&
            timerEnd.current
          ) {
            const remaining =
              Math.max(
                0,
                Math.ceil(
                  (
                    timerEnd.current -
                    Date.now()
                  ) /
                    1000
                )
              );

            setTimerSec(
              remaining
            );

            setDisplayState(
              formatTimer(
                remaining
              )
            );

            if (
              remaining <= 0
            ) {
              setTimerRunning(
                false
              );

              timerEnd.current =
                null;

              setStatus(
                "Time's up!"
              );
            }
          }

          if (
            stopwatchRunning &&
            stopwatchStart.current
          ) {
            const elapsed =
              Date.now() -
              stopwatchStart.current;

            setStopwatchMs(
              elapsed
            );

            setDisplayState(
              formatStopwatch(
                elapsed
              )
            );
          }
        },
        50
      );

    return () =>
      clearInterval(
        id
      );
  }, [
    mode,
    timerRunning,
    stopwatchRunning
  ]);

  useEffect(() => {
    const subscription =
      AppState.addEventListener(
        'change',
        state => {
          if (
            state !==
            'active'
          ) {
            return;
          }

          if (
            mode ===
            'clock'
          ) {
            setDisplayState(
              formatClock(
                new Date()
              )
            );
          }

          if (
            timerRunning &&
            timerEnd.current
          ) {
            const remaining =
              Math.max(
                0,
                Math.ceil(
                  (
                    timerEnd.current -
                    Date.now()
                  ) /
                    1000
                )
              );

            setTimerSec(
              remaining
            );

            setDisplayState(
              formatTimer(
                remaining
              )
            );
          }

          if (
            stopwatchRunning &&
            stopwatchStart.current
          ) {
            const elapsed =
              Date.now() -
              stopwatchStart.current;

            setStopwatchMs(
              elapsed
            );

            setDisplayState(
              formatStopwatch(
                elapsed
              )
            );
          }
        }
      );

    return () =>
      subscription.remove();
  }, [
    mode,
    timerRunning,
    stopwatchRunning
  ]);

  function ensureScreenOpen() {
    setScreenClosed(
      false
    );
  }

  function toggleSection(
    name
  ) {
    ensureScreenOpen();

    setOpen(
      current =>
        current === name
          ? null
          : name
    );
  }

  function stopOtherTools(
    except
  ) {
    if (
      except !==
      'timer'
    ) {
      setTimerRunning(
        false
      );

      timerEnd.current =
        null;
    }

    if (
      except !==
      'stopwatch'
    ) {
      setStopwatchRunning(
        false
      );
    }
  }

  function calculatorKey(
    value
  ) {
    ensureScreenOpen();

    stopOtherTools();

    setMode(
      'calculator'
    );

    if (
      /^\d$/.test(
        value
      )
    ) {
      if (
        target === 1
      ) {
        if (
          num1.length >=
          18
        ) {
          setStatus(
            'Maximum number length reached.'
          );

          return;
        }

        const next =
          num1 + value;

        setNum1(
          next
        );

        updateDisplay(
          next
        );

        setLabel(
          'FIRST NUMBER'
        );

        setStatus(
          'Choose an operator.'
        );
      } else {
        if (
          num2.length >=
          18
        ) {
          setStatus(
            'Maximum number length reached.'
          );

          return;
        }

        const next =
          num2 + value;

        setNum2(
          next
        );

        updateDisplay(
          next
        );

        setLabel(
          'SECOND NUMBER'
        );

        setStatus(
          operator &&
          next
            ? 'Ready — tap = or the result screen.'
            : 'Enter the second number.'
        );
      }

      return;
    }

    if (
      [
        '+',
        '−',
        '×',
        '÷',
        '%'
      ].includes(
        value
      )
    ) {
      if (!num1) {
        setStatus(
          'Enter the first number before selecting an operator.'
        );

        return;
      }

      setOperator(
        value
      );

      setTarget(
        2
      );

      updateDisplay(
        value
      );

      setLabel(
        'OPERATOR'
      );

      setStatus(
        `${value} selected. Enter the second number.`
      );

      return;
    }

    if (
      value === '.'
    ) {
      const current =
        target === 1
          ? num1
          : num2;

      if (
        current.includes(
          '.'
        )
      ) {
        setStatus(
          'This number already contains a decimal.'
        );

        return;
      }

      const next =
        current
          ? `${current}.`
          : '0.';

      if (
        target === 1
      ) {
        setNum1(
          next
        );
      } else {
        setNum2(
          next
        );
      }

      updateDisplay(
        next
      );

      setLabel(
        'DECIMAL'
      );

      return;
    }

    if (
      value === '±'
    ) {
      const current =
        target === 1
          ? num1
          : num2;

      if (!current) {
        setStatus(
          'Enter a number before using ±.'
        );

        return;
      }

      const next =
        String(
          -Number(
            current
          )
        );

      if (
        target === 1
      ) {
        setNum1(
          next
        );
      } else {
        setNum2(
          next
        );
      }

      updateDisplay(
        next
      );

      setLabel(
        'SIGN CHANGED'
      );

      return;
    }

    if (
      value === '⌫'
    ) {
      if (
        target === 2 &&
        !num2 &&
        operator
      ) {
        setOperator(
          ''
        );

        setTarget(
          1
        );

        updateDisplay(
          num1 ||
          'Ready'
        );

        setLabel(
          'EDITING'
        );

        return;
      }

      const current =
        target === 1
          ? num1
          : num2;

      const next =
        current.slice(
          0,
          -1
        );

      if (
        target === 1
      ) {
        setNum1(
          next
        );
      } else {
        setNum2(
          next
        );
      }

      updateDisplay(
        next ||
        '0'
      );

      setLabel(
        'EDITING'
      );

      return;
    }

    if (
      value === 'AC'
    ) {
      setNum1('');
      setNum2('');
      setOperator('');
      setTarget(1);

      updateDisplay(
        'Ready'
      );

      setLabel(
        'CALCULATOR'
      );

      setStatus(
        'Calculator cleared.'
      );

      return;
    }

    if (
      value === '='
    ) {
      calculate();
    }
  }

  function calculate() {
    ensureScreenOpen();

    setMode(
      'calculator'
    );

    if (
      !num1 ||
      !num2 ||
      !operator
    ) {
      updateDisplay(
        'Incomplete'
      );

      setLabel(
        'CALCULATOR'
      );

      setStatus(
        'Enter both numbers and select an operator.'
      );

      return;
    }

    const a =
      Number(num1);

    const b =
      Number(num2);

    let result;

    switch (
      operator
    ) {
      case '+':
        result =
          a + b;
        break;

      case '−':
        result =
          a - b;
        break;

      case '×':
        result =
          a * b;
        break;

      case '÷':
        if (
          b === 0
        ) {
          updateDisplay(
            'Error'
          );

          setLabel(
            'CALCULATOR'
          );

          setStatus(
            'Division by zero is not allowed.'
          );

          return;
        }

        result =
          a / b;

        break;

      case '%':
        if (
          b === 0
        ) {
          updateDisplay(
            'Error'
          );

          setStatus(
            'Remainder by zero is not allowed.'
          );

          return;
        }

        result =
          a % b;

        break;

      default:
        updateDisplay(
          'No sign'
        );

        setStatus(
          'Choose an operator.'
        );

        return;
    }

    if (
      !Number.isFinite(
        result
      )
    ) {
      updateDisplay(
        'Overflow'
      );

      setStatus(
        'Result is too large.'
      );

      return;
    }

    updateDisplay(
      String(
        Number(
          result
            .toPrecision(
              12
            )
        )
      )
    );

    setLabel(
      'RESULT'
    );

    setStatus(
      'Calculation complete.'
    );
  }

  function openTimer() {
    ensureScreenOpen();

    stopOtherTools(
      'timer'
    );

    setMode(
      'timer'
    );

    setLabel(
      'TIMER'
    );

    updateDisplay(
      formatTimer(
        timerSec
      )
    );

    setStatus(
      'Use − / + for five seconds. Hold Timer to start.'
    );
  }

  function toggleTimer() {
    ensureScreenOpen();

    stopOtherTools(
      'timer'
    );

    setMode(
      'timer'
    );

    setLabel(
      'TIMER'
    );

    if (
      timerRunning
    ) {
      const remaining =
        timerEnd.current
          ? Math.max(
              0,
              Math.ceil(
                (
                  timerEnd.current -
                  Date.now()
                ) /
                  1000
              )
            )
          : timerSec;

      setTimerSec(
        remaining
      );

      updateDisplay(
        formatTimer(
          remaining
        )
      );

      setTimerRunning(
        false
      );

      timerEnd.current =
        null;

      setStatus(
        'Timer paused. Hold Timer to continue.'
      );

      return;
    }

    if (
      timerSec <=
      0
    ) {
      setStatus(
        'Add five seconds before starting.'
      );

      return;
    }

    timerEnd.current =
      Date.now() +
      timerSec *
        1000;

    setTimerRunning(
      true
    );

    updateDisplay(
      formatTimer(
        timerSec
      )
    );

    setStatus(
      'Timer running. Hold Timer to pause.'
    );
  }

  function changeTimer(
    amount
  ) {
    ensureScreenOpen();

    let current =
      timerSec;

    if (
      timerRunning &&
      timerEnd.current
    ) {
      current =
        Math.max(
          0,
          Math.ceil(
            (
              timerEnd.current -
              Date.now()
            ) /
              1000
          )
        );
    }

    const next =
      Math.max(
        0,
        current +
          amount
      );

    setTimerSec(
      next
    );

    setMode(
      'timer'
    );

    setLabel(
      'TIMER'
    );

    updateDisplay(
      formatTimer(
        next
      )
    );

    if (
      timerRunning
    ) {
      if (
        next === 0
      ) {
        setTimerRunning(
          false
        );

        timerEnd.current =
          null;
      } else {
        timerEnd.current =
          Date.now() +
          next *
            1000;
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

    setMode(
      'clock'
    );

    setLabel(
      'LIVE CLOCK'
    );

    updateDisplay(
      formatClock(
        new Date()
      )
    );

    setStatus(
      'Live clock is active.'
    );
  }

  function openFullscreenClock() {
    ensureScreenOpen();

    stopOtherTools();

    setMode(
      'clock'
    );

    setLabel(
      'LIVE CLOCK'
    );

    updateDisplay(
      formatClock(
        new Date()
      )
    );

    setSettingsOpen(
      false
    );

    setFullscreenClock(
      true
    );
  }

  function tapStopwatch() {
    ensureScreenOpen();

    setTimerRunning(
      false
    );

    timerEnd.current =
      null;

    setMode(
      'stopwatch'
    );

    setLabel(
      'STOPWATCH'
    );

    if (
      stopwatchRunning
    ) {
      const elapsed =
        stopwatchStart.current
          ? Date.now() -
            stopwatchStart.current
          : stopwatchMs;

      setStopwatchMs(
        elapsed
      );

      setStopwatchRunning(
        false
      );

      updateDisplay(
        formatStopwatch(
          elapsed
        )
      );

      setStatus(
        'Stopwatch paused. Tap again to continue.'
      );

      return;
    }

    stopwatchStart.current =
      Date.now() -
      stopwatchMs;

    setStopwatchRunning(
      true
    );

    updateDisplay(
      formatStopwatch(
        stopwatchMs
      )
    );

    setStatus(
      'Stopwatch running.'
    );
  }

  function resetStopwatch() {
    ensureScreenOpen();

    setTimerRunning(
      false
    );

    timerEnd.current =
      null;

    setStopwatchRunning(
      false
    );

    stopwatchStart.current =
      null;

    setStopwatchMs(
      0
    );

    setMode(
      'stopwatch'
    );

    setLabel(
      'STOPWATCH'
    );

    updateDisplay(
      '00:00.00'
    );

    setStatus(
      'Stopwatch reset.'
    );
  }

  function counter(
    action
  ) {
    ensureScreenOpen();

    stopOtherTools();

    let next =
      count;

    if (
      action ===
      'add'
    ) {
      next += 1;
    }

    if (
      action ===
      'minus'
    ) {
      next =
        Math.max(
          0,
          next - 1
        );
    }

    if (
      action ===
      'reset'
    ) {
      next = 0;
    }

    if (
      action ===
      'random'
    ) {
      next =
        Math.floor(
          Math.random() *
            1000
        ) + 1;
    }

    setCount(
      next
    );

    setMode(
      'counter'
    );

    setLabel(
      'COUNTER'
    );

    updateDisplay(
      String(next)
    );

    if (
      action ===
      'add'
    ) {
      setStatus(
        'Counter increased.'
      );
    }

    if (
      action ===
      'minus'
    ) {
      setStatus(
        'Counter decreased.'
      );
    }

    if (
      action ===
      'reset'
    ) {
      setStatus(
        'Counter reset to zero.'
      );
    }

    if (
      action ===
      'random'
    ) {
      setStatus(
        'Random number generated.'
      );
    }
  }

  function resultPress() {
    if (
      mode ===
      'calculator'
    ) {
      calculate();

      return;
    }

    if (
      mode ===
      'timer'
    ) {
      setStatus(
        timerRunning
          ? 'Timer is running.'
          : 'Hold Timer to start or resume.'
      );

      return;
    }

    if (
      mode ===
      'stopwatch'
    ) {
      setStatus(
        stopwatchRunning
          ? 'Stopwatch is running.'
          : 'Tap Stopwatch to start.'
      );

      return;
    }

    setStatus(
      'Choose a tool below.'
    );
  }

  if (
    !fontsLoaded ||
    !loaded
  ) {
    return (
      <View
        style={{
          flex: 1,

          backgroundColor:
            colors.body
        }}
      />
    );
  }

  const calcOpen =
    open ===
    'calculator';

  return (
    <View
      style={[
        styles.page,

        {
          backgroundColor:
            colors.body
        }
      ]}
    >
      {!screenClosed && (
        <Animated.View
          style={[
            styles.topMotion,

            {
              height:
                calcOpen
                  ? 415
                  : 330,

              opacity:
                mainEntrance,

              transform: [
                {
                  translateY:
                    mainEntrance
                      .interpolate({
                        inputRange:
                          [0, 1],

                        outputRange:
                          [-90, 0]
                      })
                }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={[
              theme.topOne,
              theme.topTwo,
              theme.topThree
            ]}
            start={{
              x: 0,
              y: 0
            }}
            end={{
              x: 1,
              y: 1
            }}
            style={[
              styles.top,

              {
                paddingTop:
                  insets.top +
                  8
              }
            ]}
          >
            <View
              style={
                styles.logoArea
              }
            >
              <Text
                style={[
                  styles.logoSub,

                  {
                    fontFamily:
                      bold
                  }
                ]}
              >
                EVERYTHING WITH NUMBERS
              </Text>

              <View
                style={
                  styles.logoFix
                }
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.logo,

                    {
                      fontFamily:
                        logoFont
                    }
                  ]}
                >
                  NMIX
                </Text>
              </View>
            </View>

            {calcOpen && (
              <Animated.View
                style={[
                  styles.expression,

                  {
                    backgroundColor:
                      colors.surface,

                    opacity:
                      expressionMotion,

                    transform: [
                      {
                        translateY:
                          expressionMotion
                            .interpolate({
                              inputRange:
                                [0, 1],

                              outputRange:
                                [12, 0]
                            })
                      },

                      {
                        scale:
                          expressionMotion
                            .interpolate({
                              inputRange:
                                [0, 1],

                              outputRange:
                                [0.985, 1]
                            })
                      }
                    ]
                  }
                ]}
              >
                <ExpressionBox
                  value={
                    num1 ||
                    '_'
                  }
                  colors={
                    colors
                  }
                  font={
                    bold
                  }
                />

                <View
                  style={[
                    styles.operatorBox,

                    {
                      backgroundColor:
                        colors.surface2,

                      borderColor:
                        colors.border
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.expressionText,

                      {
                        color:
                          colors.text,

                        fontFamily:
                          bold
                      }
                    ]}
                  >
                    {operator ||
                      'sign'}
                  </Text>
                </View>

                <ExpressionBox
                  value={
                    num2 ||
                    '_'
                  }
                  colors={
                    colors
                  }
                  font={
                    bold
                  }
                />
              </Animated.View>
            )}

            <View
              style={[
                styles.result,

                {
                  backgroundColor:
                    dark
                      ? '#121916'
                      : '#e6ebe8'
                }
              ]}
            >
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.glowA,

                  {
                    opacity:
                      ambient
                        .interpolate({
                          inputRange:
                            [0, 1],

                          outputRange:
                            [0.28, 0.72]
                        }),

                    transform: [
                      {
                        translateX:
                          ambient
                            .interpolate({
                              inputRange:
                                [0, 1],

                              outputRange:
                                [-100, 90]
                            })
                      },

                      {
                        translateY:
                          ambient
                            .interpolate({
                              inputRange:
                                [0, 1],

                              outputRange:
                                [-45, 35]
                            })
                      }
                    ]
                  }
                ]}
              >
                <LinearGradient
                  colors={[
                    'transparent',
                    `${theme.accentLight}05`,
                    `${theme.accentLight}2C`,
                    `${theme.accentLight}06`,
                    'transparent'
                  ]}
                  style={
                    styles.glowFill
                  }
                />
              </Animated.View>

              <Animated.View
                pointerEvents="none"
                style={[
                  styles.glowB,

                  {
                    opacity:
                      ambient
                        .interpolate({
                          inputRange:
                            [0, 1],

                          outputRange:
                            [0.58, 0.20]
                        }),

                    transform: [
                      {
                        translateX:
                          ambient
                            .interpolate({
                              inputRange:
                                [0, 1],

                              outputRange:
                                [80, -95]
                            })
                      },

                      {
                        translateY:
                          ambient
                            .interpolate({
                              inputRange:
                                [0, 1],

                              outputRange:
                                [35, -30]
                            })
                      }
                    ]
                  }
                ]}
              >
                <LinearGradient
                  colors={[
                    'transparent',
                    `${accent}05`,
                    `${accent}26`,
                    `${accent}05`,
                    'transparent'
                  ]}
                  style={
                    styles.glowFill
                  }
                />
              </Animated.View>

              <View
                style={
                  styles.resultRow
                }
              >
                {mode ===
                  'timer' && (
                  <Animated.View
                    style={[
                      styles.timerLeft,

                      {
                        opacity:
                          timerMotion,

                        transform: [
                          {
                            translateX:
                              timerMotion
                                .interpolate({
                                  inputRange:
                                    [0, 1],

                                  outputRange:
                                    [-18, 0]
                                })
                          },

                          {
                            scale:
                              timerMotion
                                .interpolate({
                                  inputRange:
                                    [0, 1],

                                  outputRange:
                                    [0.5, 1]
                                })
                          }
                        ]
                      }
                    ]}
                  >
                    <MotionPressable
                      onPress={() =>
                        changeTimer(
                          -5
                        )
                      }
                      style={[
                        styles.timerAdjust,

                        {
                          backgroundColor:
                            accent
                        }
                      ]}
                    >
                      <Text
                        style={[
                          styles.timerText,

                          {
                            fontFamily:
                              regular
                          }
                        ]}
                      >
                        −
                      </Text>
                    </MotionPressable>
                  </Animated.View>
                )}

                <MotionPressable
                  onPress={
                    resultPress
                  }
                  style={
                    styles.mainDisplay
                  }
                >
                  <Text
                    style={[
                      styles.displayLabel,

                      {
                        color:
                          dark
                            ? theme.accentLight
                            : theme.accentDark,

                        fontFamily:
                          bold
                      }
                    ]}
                  >
                    {label}
                  </Text>

                  <Animated.View
                    style={[
                      styles.displayMotion,

                      {
                        opacity:
                          displayMotion,

                        transform: [
                          {
                            translateY:
                              displayMotion
                                .interpolate({
                                  inputRange:
                                    [0, 1],

                                  outputRange:
                                    [2, 0]
                                })
                          }
                        ]
                      }
                    ]}
                  >
                    {mode ===
                    'clock' ? (
                      <TimeDisplay
                        value={
                          display
                        }
                        color={
                          dark
                            ? '#ffffff'
                            : '#152c24'
                        }
                        fontFamily={
                          bold
                        }
                        periodFontFamily={
                          regular
                        }
                      />
                    ) : (
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={
                          0.3
                        }
                        style={[
                          styles.display,

                          {
                            color:
                              dark
                                ? '#ffffff'
                                : '#152c24',

                            fontFamily:
                              bold
                          }
                        ]}
                      >
                        {display}
                      </Text>
                    )}
                  </Animated.View>
                </MotionPressable>

                {mode ===
                  'timer' && (
                  <Animated.View
                    style={[
                      styles.timerRight,

                      {
                        opacity:
                          timerMotion,

                        transform: [
                          {
                            translateX:
                              timerMotion
                                .interpolate({
                                  inputRange:
                                    [0, 1],

                                  outputRange:
                                    [18, 0]
                                })
                          },

                          {
                            scale:
                              timerMotion
                                .interpolate({
                                  inputRange:
                                    [0, 1],

                                  outputRange:
                                    [0.5, 1]
                                })
                          }
                        ]
                      }
                    ]}
                  >
                    <MotionPressable
                      onPress={() =>
                        changeTimer(
                          5
                        )
                      }
                      style={[
                        styles.timerAdjust,

                        {
                          backgroundColor:
                            accent
                        }
                      ]}
                    >
                      <Text
                        style={[
                          styles.timerText,

                          {
                            fontFamily:
                              regular
                          }
                        ]}
                      >
                        +
                      </Text>
                    </MotionPressable>
                  </Animated.View>
                )}
              </View>

              <Text
                numberOfLines={1}
                style={[
                  styles.status,

                  {
                    color:
                      dark
                        ? theme.accentLight
                        : theme.accentDark,

                    fontFamily:
                      regular
                  }
                ]}
              >
                {status}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      )}

      <View
        style={[
          styles.controls,

          {
            top:
              insets.top +
              10
          }
        ]}
      >
        <MotionPressable
          onPress={() => {
            setSettingsOpen(
              false
            );

            setScreenClosed(
              value =>
                !value
            );
          }}
          style={[
            styles.controlButton,

            {
              backgroundColor:
                accent
            }
          ]}
        >
          <ChevronIcon
            size={21}
            color="#ffffff"
            direction={
              screenClosed
                ? 'down'
                : 'up'
            }
          />
        </MotionPressable>

        <MotionPressable
          onPress={() =>
            setSettingsOpen(
              value =>
                !value
            )
          }
          style={[
            styles.controlButton,
            styles.settingsControl,

            {
              backgroundColor:
                accent,

              borderColor:
                `${theme.accentLight}45`
            }
          ]}
        >
          <AnimatedMenuIcon
            open={
              settingsOpen
            }
            color="#ffffff"
          />
        </MotionPressable>
      </View>

      <ScrollView
        style={
          styles.scroll
        }
        contentContainerStyle={[
          styles.content,

          screenClosed && {
            paddingTop:
              insets.top +
              70
          }
        ]}
        showsVerticalScrollIndicator={
          false
        }
      >
        <EntranceItem
          motion={
            sectionMotions[0]
          }
        >
          <AnimatedSection
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
            <View
              style={
                styles.calculatorGrid
              }
            >
              {[
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '0',
                '+',
                '−',
                '×',
                '÷',
                '%',
                '.',
                '±',
                '⌫',
                'AC',
                '='
              ].map(
                key => {
                  const operatorKey =
                    [
                      '+',
                      '−',
                      '×',
                      '÷',
                      '%',
                      '='
                    ].includes(
                      key
                    );

                  const danger =
                    key ===
                    'AC';

                  return (
                    <MotionPressable
                      key={key}
                      onPress={() =>
                        calculatorKey(
                          key
                        )
                      }
                      style={[
                        styles.calcKey,

                        {
                          width:
                            keySize,

                          height:
                            keySize,

                          borderRadius:
                            keySize /
                            2,

                          backgroundColor:
                            colors.surface2
                        },

                        operatorKey && {
                          backgroundColor:
                            accent
                        },

                        danger && {
                          backgroundColor:
                            dark
                              ? '#472225'
                              : '#f1d5d5'
                        }
                      ]}
                    >
                      <Text
                        style={[
                          styles.calcText,

                          {
                            color:
                              colors.text,

                            fontFamily:
                              bold
                          },

                          operatorKey && {
                            color:
                              '#ffffff'
                          },

                          danger && {
                            color:
                              '#d83939'
                          }
                        ]}
                      >
                        {key}
                      </Text>
                    </MotionPressable>
                  );
                }
              )}
            </View>
          </AnimatedSection>
        </EntranceItem>

        <EntranceItem
          motion={
            sectionMotions[1]
          }
        >
          <AnimatedSection
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
            <View
              style={
                styles.clockGrid
              }
            >
              <ModeButton
                Icon={
                  TimerIcon
                }
                title="Timer"
                subtitle="Countdown"
                active={
                  mode ===
                  'timer'
                }
                onPress={
                  openTimer
                }
                onLongPress={
                  toggleTimer
                }
                colors={
                  colors
                }
                accent={
                  accent
                }
                regular={
                  regular
                }
                bold={
                  bold
                }
              />

              <ModeButton
                Icon={
                  ClockIcon
                }
                title="Clock"
                subtitle="Local time"
                active={
                  mode ===
                  'clock'
                }
                onPress={
                  openClock
                }
                colors={
                  colors
                }
                accent={
                  accent
                }
                regular={
                  regular
                }
                bold={
                  bold
                }
                extra={
                  <MotionPressable
                    onPress={
                      openFullscreenClock
                    }
                    hitSlop={10}
                    style={[
                      styles.fullscreen,

                      {
                        backgroundColor:
                          mode ===
                          'clock'
                            ? '#ffffff'
                            : accent
                      }
                    ]}
                  >
                    <FullscreenIcon
                      size={20}
                      color={
                        mode ===
                        'clock'
                          ? accent
                          : '#ffffff'
                      }
                    />
                  </MotionPressable>
                }
              />

              <ModeButton
                Icon={
                  StopwatchIcon
                }
                title="Stopwatch"
                subtitle="Track time"
                active={
                  mode ===
                  'stopwatch'
                }
                onPress={
                  tapStopwatch
                }
                onLongPress={
                  resetStopwatch
                }
                colors={
                  colors
                }
                accent={
                  accent
                }
                regular={
                  regular
                }
                bold={
                  bold
                }
              />
            </View>
          </AnimatedSection>
        </EntranceItem>

        <EntranceItem
          motion={
            sectionMotions[2]
          }
        >
          <AnimatedSection
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
            <View
              style={
                styles.counterGrid
              }
            >
              <CounterButton
                title="Add"
                subtitle="Increase"
                onPress={() =>
                  counter(
                    'add'
                  )
                }
                colors={colors}
                regular={regular}
                bold={bold}
              />

              <CounterButton
                title="Reset"
                subtitle="Back to zero"
                onPress={() =>
                  counter(
                    'reset'
                  )
                }
                colors={colors}
                regular={regular}
                bold={bold}
              />

              <CounterButton
                title="Random"
                subtitle="1 – 1000"
                onPress={() =>
                  counter(
                    'random'
                  )
                }
                colors={colors}
                regular={regular}
                bold={bold}
              />

              <CounterButton
                title="Minus"
                subtitle="Decrease"
                onPress={() =>
                  counter(
                    'minus'
                  )
                }
                colors={colors}
                regular={regular}
                bold={bold}
              />
            </View>
          </AnimatedSection>
        </EntranceItem>

        <EntranceItem
          motion={
            sectionMotions[3]
          }
        >
          <AnimatedSection
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
            <View
              style={
                styles.instructions
              }
            >
              {instructions.map(
                ([
                  itemTitle,
                  itemText
                ]) => (
                  <View
                    key={
                      itemTitle
                    }
                    style={[
                      styles.instruction,

                      {
                        backgroundColor:
                          colors.surface2
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.instructionTitle,

                        {
                          color:
                            accent,

                          fontFamily:
                            bold
                        }
                      ]}
                    >
                      {itemTitle}
                    </Text>

                    <Text
                      style={[
                        styles.instructionText,

                        {
                          color:
                            colors.muted,

                          fontFamily:
                            regular
                        }
                      ]}
                    >
                      {itemText}
                    </Text>
                  </View>
                )
              )}
            </View>
          </AnimatedSection>
        </EntranceItem>

        <EntranceItem
          motion={
            sectionMotions[4]
          }
        >
          <View
            style={[
              styles.contributor,

              {
                backgroundColor:
                  colors.surface,

                borderColor:
                  colors.border
              }
            ]}
          >
            <Text
              style={[
                styles.contributorHeading,

                {
                  color:
                    colors.text,

                  fontFamily:
                    bold
                }
              ]}
            >
              Contributor
            </Text>

            <View
              style={
                styles.contributorNameFix
              }
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.contributorName,

                  {
                    color:
                      accent,

                    fontFamily:
                      logoFont
                  }
                ]}
              >
                Alex Ravi
              </Text>
            </View>

            <Text
              style={[
                styles.bio,

                {
                  color:
                    colors.muted,

                  fontFamily:
                    regular
                }
              ]}
            >
              I'm currently doing a diploma in web development and building my skills step by step.
            </Text>

            <Text
              style={[
                styles.learning,

                {
                  color:
                    colors.muted,

                  fontFamily:
                    bold
                }
              ]}
            >
              Skills
            </Text>

            <View
              style={
                styles.chips
              }
            >
              {[
                'HTML',
                'CSS',
                'JavaScript',
                'React Native',
                'Expo'
              ].map(
                item => (
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
                )
              )}
            </View>

            <Text
              style={[
                styles.learning,

                {
                  color:
                    colors.muted,

                  fontFamily:
                    bold
                }
              ]}
            >
              Learning More
            </Text>

            <View
              style={
                styles.chips
              }
            >
              {[
                'Responsive Design',
                'UI / UX',
                'Web APIs',
                'Native Apps',
                'GitHub Actions'
              ].map(
                item => (
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
                )
              )}
            </View>
          </View>
        </EntranceItem>

        <EntranceItem
          motion={
            sectionMotions[5]
          }
        >
          <MotionPressable
            onPress={() => {
              setSettingsOpen(
                false
              );

              stopOtherTools();

              router.push(
                '/welcome'
              );
            }}
            style={[
              styles.back,

              {
                backgroundColor:
                  accent
              }
            ]}
          >
            <View
              style={
                styles.backIcon
              }
            >
              <BackIcon
                size={20}
                color="#ffffff"
              />
            </View>

            <Text
              style={[
                styles.backText,

                {
                  fontFamily:
                    bold
                }
              ]}
            >
              Back to starting page
            </Text>
          </MotionPressable>
        </EntranceItem>

        <EntranceItem
          motion={
            sectionMotions[6]
          }
        >
          <View
            style={
              styles.footer
            }
          >
            <Text
              style={[
                styles.footerMain,

                {
                  color:
                    colors.muted,

                  fontFamily:
                    regular
                }
              ]}
            >
              © {new Date().getFullYear()} Alex Ravi
            </Text>

            <Text
              style={[
                styles.footerSub,

                {
                  color:
                    colors.muted,

                  fontFamily:
                    regular
                }
              ]}
            >
              All Rights Reserved · NMIX · everything with numbers
            </Text>
          </View>
        </EntranceItem>
      </ScrollView>

      <SettingsPanel
        visible={
          settingsOpen
        }
        onClose={() =>
          setSettingsOpen(
            false
          )
        }
        dark={dark}
        setDark={setDark}
        themeName={
          themeName
        }
        setThemeName={
          setThemeName
        }
        font={font}
        setFont={setFont}
        colors={colors}
        accent={accent}
      />

      <FullscreenClock
        visible={
          fullscreenClock
        }
        onClose={() => {
          setFullscreenClock(
            false
          );

          setStatus(
            'Returned to NMIX clock.'
          );
        }}
        theme={theme}
        themeName={
          themeName
        }
        font={font}
      />
    </View>
  );
}

function EntranceItem({
  motion,
  children
}) {
  const translateY =
    motion.interpolate({
      inputRange:
        [0, 1],

      outputRange:
        [54, 0]
    });

  const scale =
    motion.interpolate({
      inputRange:
        [0, 1],

      outputRange:
        [0.975, 1]
    });

  return (
    <Animated.View
      style={{
        width: '100%',

        opacity:
          motion,

        transform: [
          {
            translateY
          },

          {
            scale
          }
        ]
      }}
    >
      {children}
    </Animated.View>
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
          backgroundColor:
            colors.surface2,

          borderColor:
            colors.border
        }
      ]}
    >
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[
          styles.expressionText,

          {
            color:
              colors.text,

            fontFamily:
              font
          }
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function ModeButton({
  Icon,
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
    <View
      style={[
        styles.modeShell,

        {
          backgroundColor:
            active
              ? accent
              : colors.surface2
        }
      ]}
    >
      <MotionPressable
        onPress={
          onPress
        }
        onLongPress={
          onLongPress
        }
        delayLongPress={
          HOLD
        }
        style={
          styles.modeButton
        }
      >
        <View
          style={[
            styles.modeIcon,

            {
              backgroundColor:
                active
                  ? '#ffffff'
                  : accent
            }
          ]}
        >
          <Icon
            size={21}
            color={
              active
                ? accent
                : '#ffffff'
            }
          />
        </View>

        <View
          style={
            styles.modeCopy
          }
        >
          <Text
            style={[
              styles.modeTitle,

              {
                color:
                  active
                    ? '#ffffff'
                    : colors.text,

                fontFamily:
                  bold
              }
            ]}
          >
            {title}
          </Text>

          <Text
            style={[
              styles.modeSubtitle,

              {
                color:
                  active
                    ? 'rgba(255,255,255,.8)'
                    : colors.muted,

                fontFamily:
                  regular
              }
            ]}
          >
            {subtitle}
          </Text>
        </View>
      </MotionPressable>

      {extra && (
        <View
          style={
            styles.modeExtra
          }
        >
          {extra}
        </View>
      )}
    </View>
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
    <MotionPressable
      onPress={
        onPress
      }
      style={[
        styles.counterButton,

        {
          backgroundColor:
            colors.surface2
        }
      ]}
    >
      <Text
        style={[
          styles.counterTitle,

          {
            color:
              colors.text,

            fontFamily:
              bold
          }
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.modeSubtitle,

          {
            color:
              colors.muted,

            fontFamily:
              regular
          }
        ]}
      >
        {subtitle}
      </Text>
    </MotionPressable>
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
          backgroundColor:
            `${accent}20`,

          borderColor:
            `${accent}45`
        }
      ]}
    >
      <Text
        style={[
          styles.chipText,

          {
            color,

            fontFamily:
              bold
          }
        ]}
      >
        {item}
      </Text>
    </View>
  );
}

function formatTimer(
  seconds
) {
  const min =
    Math.floor(
      seconds /
      60
    );

  const sec =
    seconds %
    60;

  return `${String(
    min
  ).padStart(
    2,
    '0'
  )}:${String(
    sec
  ).padStart(
    2,
    '0'
  )}`;
}

function formatClock(
  date
) {
  return date
    .toLocaleTimeString(
      [],
      {
        hour:
          '2-digit',

        minute:
          '2-digit',

        second:
          '2-digit',

        hour12:
          true
      }
    );
}

function formatStopwatch(
  ms
) {
  const total =
    Math.floor(
      ms /
      1000
    );

  const min =
    Math.floor(
      total /
      60
    );

  const sec =
    total %
    60;

  const hundredths =
    Math.floor(
      (
        ms %
        1000
      ) /
      10
    );

  return `${String(
    min
  ).padStart(
    2,
    '0'
  )}:${String(
    sec
  ).padStart(
    2,
    '0'
  )}.${String(
    hundredths
  ).padStart(
    2,
    '0'
  )}`;
}

const styles =
  StyleSheet.create({
    page: {
      flex: 1
    },

    topMotion: {
      width: '100%'
    },

    top: {
      flex: 1,

      paddingHorizontal: 10,

      paddingBottom: 10,

      borderBottomLeftRadius: 22,

      borderBottomRightRadius: 22
    },

    logoArea: {
      height: 66,

      justifyContent:
        'center',

      alignItems:
        'center',

      overflow:
        'visible'
    },

    logoSub: {
      color:
        '#ddf8ef',

      fontSize: 8,

      lineHeight: 12,

      letterSpacing: 2,

      textAlign:
        'center',

      includeFontPadding:
        false
    },

    logoFix: {
      width: 250,

      minHeight: 47,

      paddingHorizontal: 32,

      overflow:
        'visible',

      justifyContent:
        'center',

      alignItems:
        'center'
    },

    logo: {
      width: '100%',

      color:
        '#ffffff',

      fontSize: 27,

      lineHeight: 40,

      letterSpacing: 4,

      paddingHorizontal: 10,

      textAlign:
        'center',

      includeFontPadding:
        false
    },

    expression: {
      height: 76,

      marginBottom: 8,

      padding: 9,

      flexDirection:
        'row',

      gap: 7,

      borderRadius: 12
    },

    expressionBox: {
      flex: 1,

      justifyContent:
        'center',

      borderWidth: 1,

      borderRadius: 8
    },

    operatorBox: {
      width: 60,

      justifyContent:
        'center',

      borderWidth: 1,

      borderRadius: 8
    },

    expressionText: {
      paddingHorizontal: 5,

      fontSize: 18,

      lineHeight: 24,

      textAlign:
        'center',

      textAlignVertical:
        'center',

      includeFontPadding:
        false
    },

    result: {
      flex: 1,

      position:
        'relative',

      overflow:
        'hidden',

      justifyContent:
        'center',

      borderRadius: 15
    },

    glowA: {
      position:
        'absolute',

      width: 370,

      height: 330,

      left: -170,

      top: -145
    },

    glowB: {
      position:
        'absolute',

      width: 420,

      height: 370,

      right: -200,

      bottom: -190
    },

    glowFill: {
      flex: 1,

      borderRadius: 240
    },

    resultRow: {
      flex: 1,

      position:
        'relative',

      justifyContent:
        'center',

      alignItems:
        'center'
    },

    timerLeft: {
      position:
        'absolute',

      zIndex: 10,

      left: 9,

      top: '50%',

      marginTop: -24
    },

    timerRight: {
      position:
        'absolute',

      zIndex: 10,

      right: 9,

      top: '50%',

      marginTop: -24
    },

    timerAdjust: {
      width: 48,

      height: 48,

      justifyContent:
        'center',

      alignItems:
        'center',

      borderRadius: 24
    },

    timerText: {
      width: 48,

      height: 48,

      color:
        '#ffffff',

      fontSize: 27,

      lineHeight: 48,

      textAlign:
        'center',

      textAlignVertical:
        'center',

      includeFontPadding:
        false
    },

    mainDisplay: {
      width: '78%',

      alignSelf:
        'center',

      justifyContent:
        'center',

      alignItems:
        'center'
    },

    displayLabel: {
      fontSize: 9,

      lineHeight: 14,

      letterSpacing: 2.5,

      textAlign:
        'center'
    },

    displayMotion: {
      width: '100%',

      alignItems:
        'center'
    },

    display: {
      width: '100%',

      fontSize: 40,

      lineHeight: 50,

      textAlign:
        'center',

      textAlignVertical:
        'center',

      includeFontPadding:
        false
    },

    status: {
      position:
        'absolute',

      zIndex: 20,

      left: '3%',

      right: '3%',

      bottom: 7,

      fontSize: 10,

      lineHeight: 14,

      textAlign:
        'center'
    },

    controls: {
      position:
        'absolute',

      zIndex: 1000,

      left: 14,

      right: 14,

      flexDirection:
        'row',

      justifyContent:
        'space-between',

      pointerEvents:
        'box-none'
    },

    controlButton: {
      width: 43,

      height: 43,

      justifyContent:
        'center',

      alignItems:
        'center',

      borderRadius: 22,

      elevation: 8
    },

    settingsControl: {
      width: 54,

      height: 43,

      marginRight: -14,

      paddingRight: 8,

      borderWidth: 1,

      borderRightWidth: 0,

      borderTopRightRadius: 0,

      borderBottomRightRadius: 0,

      borderTopLeftRadius: 22,

      borderBottomLeftRadius: 22
    },

    scroll: {
      flex: 1
    },

    content: {
      width: '100%',

      maxWidth: 1100,

      alignSelf:
        'center',

      padding: 10,

      paddingTop: 18,

      paddingBottom: 0,

      gap: 13
    },

    calculatorGrid: {
      paddingHorizontal: 8,

      paddingVertical: 17,

      flexDirection:
        'row',

      flexWrap:
        'wrap',

      justifyContent:
        'space-evenly',

      gap: 10
    },

    calcKey: {
      justifyContent:
        'center',

      alignItems:
        'center'
    },

    calcText: {
      width: '100%',

      fontSize: 17,

      lineHeight: 22,

      textAlign:
        'center',

      textAlignVertical:
        'center',

      includeFontPadding:
        false
    },

    clockGrid: {
      padding: 14,

      gap: 10
    },

    modeShell: {
      position:
        'relative',

      width: '100%',

      minHeight: 76,

      overflow:
        'hidden',

      borderRadius: 13
    },

    modeButton: {
      width: '100%',

      minHeight: 76,

      padding: 12,

      paddingRight: 64,

      flexDirection:
        'row',

      alignItems:
        'center',

      gap: 10
    },

    modeIcon: {
      width: 40,

      height: 40,

      flexShrink: 0,

      justifyContent:
        'center',

      alignItems:
        'center',

      borderRadius: 20
    },

    modeCopy: {
      flex: 1,

      justifyContent:
        'center'
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

    modeExtra: {
      position:
        'absolute',

      zIndex: 30,

      right: 10,

      top: 0,

      bottom: 0,

      width: 40,

      justifyContent:
        'center',

      alignItems:
        'center'
    },

    fullscreen: {
      width: 38,

      height: 38,

      justifyContent:
        'center',

      alignItems:
        'center',

      borderRadius: 11,

      elevation: 3
    },

    counterGrid: {
      padding: 14,

      flexDirection:
        'row',

      flexWrap:
        'wrap',

      justifyContent:
        'space-between',

      rowGap: 10
    },

    counterButton: {
      width: '48.5%',

      minHeight: 73,

      justifyContent:
        'center',

      alignItems:
        'center',

      borderRadius: 12
    },

    counterTitle: {
      fontSize: 13,

      lineHeight: 18,

      textAlign:
        'center'
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
      fontSize: 12,

      lineHeight: 17
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

    contributorNameFix: {
      minWidth: 150,

      paddingHorizontal: 4,

      overflow:
        'visible'
    },

    contributorName: {
      marginTop: 10,

      fontSize: 16,

      lineHeight: 27,

      paddingHorizontal: 2,

      includeFontPadding:
        false
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

      flexDirection:
        'row',

      flexWrap:
        'wrap',

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
      alignSelf:
        'center',

      minHeight: 52,

      paddingLeft: 9,

      paddingRight: 18,

      flexDirection:
        'row',

      justifyContent:
        'center',

      alignItems:
        'center',

      gap: 8,

      borderRadius: 999
    },

    backIcon: {
      width: 35,

      height: 35,

      justifyContent:
        'center',

      alignItems:
        'center'
    },

    backText: {
      color:
        '#ffffff',

      fontSize: 11,

      lineHeight: 16
    },

    footer: {
      minHeight: 90,

      paddingTop: 18,

      paddingBottom: 10,

      justifyContent:
        'flex-end',

      alignItems:
        'center'
    },

    footerMain: {
      fontSize: 10
    },

    footerSub: {
      marginTop: 2,

      fontSize: 8,

      textAlign:
        'center'
    }
  });
