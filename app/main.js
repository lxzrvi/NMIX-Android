import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable
} from 'react-native';
import { router } from 'expo-router';

const ACCENT = '#319b79';

export default function Main() {
  const [open, setOpen] = useState(null);

  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operator, setOperator] = useState('');
  const [target, setTarget] = useState(1);

  const [display, setDisplay] = useState('Ready');
  const [displayLabel, setDisplayLabel] = useState('NMIX LIVE');
  const [status, setStatus] = useState('Choose a tool below.');

  const [count, setCount] = useState(0);

  function toggle(name) {
    setOpen(current => current === name ? null : name);
  }

  function calculatorKey(value) {
    setDisplayLabel('CALCULATOR');

    if (/^\d$/.test(value)) {
      if (target === 1) {
        if (num1.length >= 18) {
          setStatus('Maximum number length reached.');
          return;
        }

        const next = num1 + value;
        setNum1(next);
        setDisplay(next);
        setStatus('Choose an operator.');
      } else {
        if (num2.length >= 18) {
          setStatus('Maximum number length reached.');
          return;
        }

        const next = num2 + value;
        setNum2(next);
        setDisplay(next);
        setStatus('Enter the second number.');
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
      setDisplayLabel('OPERATOR');
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

      if (target === 1) setNum1(next);
      else setNum2(next);

      setDisplay(next);
      setDisplayLabel('DECIMAL');
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
      setDisplayLabel('SIGN CHANGED');
      return;
    }

    if (value === '⌫') {
      if (target === 2 && !num2 && operator) {
        setOperator('');
        setTarget(1);
        setDisplay(num1 || 'Ready');
        return;
      }

      const current = target === 1 ? num1 : num2;
      const next = current.slice(0, -1);

      if (target === 1) setNum1(next);
      else setNum2(next);

      setDisplay(next || '0');
      setDisplayLabel('EDITING');
      return;
    }

    if (value === 'AC') {
      setNum1('');
      setNum2('');
      setOperator('');
      setTarget(1);
      setDisplay('Ready');
      setDisplayLabel('CALCULATOR');
      setStatus('Calculator cleared.');
      return;
    }

    if (value === '=') calculate();
  }

  function calculate() {
    if (!num1 || !num2 || !operator) {
      setDisplay('Incomplete');
      setDisplayLabel('CALCULATOR');
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
        return;
    }

    if (!Number.isFinite(result)) {
      setDisplay('Overflow');
      setStatus('Result is too large.');
      return;
    }

    setDisplay(String(Number(result.toPrecision(12))));
    setDisplayLabel('RESULT');
    setStatus('Calculation complete.');
  }

  function counter(action) {
    let next = count;

    if (action === 'add') next = count + 1;
    if (action === 'minus') next = Math.max(0, count - 1);
    if (action === 'reset') next = 0;
    if (action === 'random') {
      next = Math.floor(Math.random() * 1000) + 1;
    }

    setCount(next);
    setDisplay(String(next));
    setDisplayLabel('COUNTER');

    if (action === 'random') setStatus('Random number generated.');
    else if (action === 'reset') setStatus('Counter reset to zero.');
    else if (action === 'add') setStatus('Counter increased.');
    else setStatus('Counter decreased.');
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.topScreen}>
        <Text style={styles.logoSub}>ANYTHING WITH NUMBERS</Text>
        <Text style={styles.logo}>NMIX</Text>

        {open === 'calculator' && (
          <View style={styles.expression}>
            <View style={styles.expressionBox}>
              <Text style={styles.expressionText}>{num1 || '_'}</Text>
            </View>

            <View style={styles.operatorBox}>
              <Text style={styles.expressionText}>{operator || 'sign'}</Text>
            </View>

            <View style={styles.expressionBox}>
              <Text style={styles.expressionText}>{num2 || '_'}</Text>
            </View>
          </View>
        )}

        <Pressable
          style={styles.result}
          onPress={() => {
            if (open === 'calculator') calculate();
          }}
        >
          <Text style={styles.displayLabel}>{displayLabel}</Text>
          <Text
            style={styles.display}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {display}
          </Text>

          <Text style={styles.status} numberOfLines={1}>
            {status}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Section
          icon="÷"
          title="Calculator"
          subtitle="Numbers and operations"
          isOpen={open === 'calculator'}
          onPress={() => toggle('calculator')}
        >
          <View style={styles.calculator}>
            {[
              '1','2','3','4','5',
              '6','7','8','9','0',
              '+','−','×','÷','%',
              '.','±','⌫','AC','='
            ].map(key => {
              const operatorKey = ['+','−','×','÷','%','='].includes(key);
              const danger = key === 'AC';

              return (
                <Pressable
                  key={key}
                  onPress={() => calculatorKey(key)}
                  style={({ pressed }) => [
                    styles.calcKey,
                    operatorKey && styles.operatorKey,
                    danger && styles.dangerKey,
                    pressed && styles.pressed
                  ]}
                >
                  <Text
                    style={[
                      styles.calcKeyText,
                      operatorKey && styles.whiteText,
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
          icon="◷"
          title="Clock"
          subtitle="Timer, clock and stopwatch"
          isOpen={open === 'clock'}
          onPress={() => toggle('clock')}
        >
          <View style={styles.clockGrid}>
            <ToolButton title="Timer" subtitle="Countdown" icon="◴" />
            <ToolButton title="Clock" subtitle="Local time" icon="◷" />
            <ToolButton title="Stopwatch" subtitle="Track time" icon="◉" />
          </View>
        </Section>

        <Section
          icon="+"
          title="Counters"
          subtitle="Count and generate"
          isOpen={open === 'counter'}
          onPress={() => toggle('counter')}
        >
          <View style={styles.counterGrid}>
            <CounterButton
              title="Add"
              subtitle="Increase"
              onPress={() => counter('add')}
            />
            <CounterButton
              title="Reset"
              subtitle="Back to zero"
              onPress={() => counter('reset')}
            />
            <CounterButton
              title="Random"
              subtitle="1 – 1000"
              onPress={() => counter('random')}
            />
            <CounterButton
              title="Minus"
              subtitle="Decrease"
              onPress={() => counter('minus')}
            />
          </View>
        </Section>

        <Section
          icon="?"
          title="How to use NMIX"
          subtitle="Instructions and controls"
          isOpen={open === 'instructions'}
          onPress={() => toggle('instructions')}
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
              text="Use Timer for countdowns and adjust the time in five second steps."
            />
            <Instruction
              title="Clock"
              text="Clock displays your local time."
            />
            <Instruction
              title="Stopwatch"
              text="Use Stopwatch to track elapsed time."
            />
            <Instruction
              title="Counters"
              text="Add and Minus change the counter by one."
            />
            <Instruction
              title="Random"
              text="Random generates a number from 1 to 1000."
            />
          </View>
        </Section>

        <View style={styles.contributor}>
          <Text style={styles.contributorTitle}>Contributor</Text>
          <Text style={styles.name}>Alex Ravi</Text>
          <Text style={styles.bio}>
            I'm currently doing a diploma in web development and building
            my skills step by step.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.back,
            pressed && styles.pressed
          ]}
          onPress={() => router.back()}
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

function Section({
  icon,
  title,
  subtitle,
  isOpen,
  onPress,
  children
}) {
  return (
    <View style={styles.section}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.sectionBar,
          pressed && { opacity: 0.75 }
        ]}
      >
        <View style={styles.barIcon}>
          <Text style={styles.barIconText}>{icon}</Text>
        </View>

        <View style={styles.barCopy}>
          <Text style={styles.barTitle}>{title}</Text>
          <Text style={styles.barSubtitle}>{subtitle}</Text>
        </View>

        <Text style={styles.arrow}>
          {isOpen ? '⌃' : '⌄'}
        </Text>
      </Pressable>

      {isOpen && (
        <View style={styles.sectionContent}>
          {children}
        </View>
      )}
    </View>
  );
}

function ToolButton({ icon, title, subtitle }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.toolButton,
        pressed && styles.pressed
      ]}
    >
      <View style={styles.toolIcon}>
        <Text style={styles.whiteText}>{icon}</Text>
      </View>

      <View>
        <Text style={styles.toolTitle}>{title}</Text>
        <Text style={styles.toolSubtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

function CounterButton({ title, subtitle, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.counterButton,
        pressed && styles.pressed
      ]}
    >
      <Text style={styles.counterTitle}>{title}</Text>
      <Text style={styles.toolSubtitle}>{subtitle}</Text>
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

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#dedede'
  },

  topScreen: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
    minHeight: 280,
    backgroundColor: '#277e63',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22
  },

  logoSub: {
    textAlign: 'center',
    color: '#ddf8ef',
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 2
  },

  logo: {
    marginBottom: 8,
    textAlign: 'center',
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 5
  },

  expression: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 0,
    padding: 9,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#eeeeee'
  },

  expressionBox: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bec5c2',
    borderRadius: 8,
    backgroundColor: '#dedede'
  },

  operatorBox: {
    width: 60,
    height: 52,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bec5c2',
    borderRadius: 8,
    backgroundColor: '#dedede'
  },

  expressionText: {
    textAlign: 'center',
    color: '#202321',
    fontWeight: '600',
    fontSize: 18
  },

  result: {
    flex: 1,
    minHeight: 175,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 15,
    backgroundColor: '#e6ebe8'
  },

  displayLabel: {
    color: '#216e56',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.5
  },

  display: {
    width: '90%',
    color: '#152c24',
    textAlign: 'center',
    fontSize: 40,
    fontWeight: '700'
  },

  status: {
    position: 'absolute',
    bottom: 7,
    width: '94%',
    color: '#397c68',
    textAlign: 'center',
    fontSize: 10
  },

  scroll: {
    flex: 1
  },

  content: {
    gap: 13,
    paddingHorizontal: 10,
    paddingTop: 18,
    paddingBottom: 30
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

  barIconText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700'
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
    fontSize: 20
  },

  sectionContent: {
    borderTopWidth: 1,
    borderTopColor: '#bec5c2'
  },

  calculator: {
    paddingHorizontal: 10,
    paddingVertical: 17,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
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

  calcKeyText: {
    color: '#202321',
    fontSize: 17,
    fontWeight: '600'
  },

  operatorKey: {
    backgroundColor: ACCENT
  },

  dangerKey: {
    backgroundColor: 'rgba(216,57,57,0.13)'
  },

  dangerText: {
    color: '#d83939'
  },

  whiteText: {
    color: '#fff',
    fontWeight: '600'
  },

  pressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.82
  },

  clockGrid: {
    padding: 14,
    gap: 10
  },

  toolButton: {
    minHeight: 76,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 13,
    backgroundColor: '#dedede'
  },

  toolIcon: {
    width: 39,
    height: 39,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: ACCENT
  },

  toolTitle: {
    color: '#202321',
    fontWeight: '700'
  },

  toolSubtitle: {
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
    minHeight: 130,
    borderWidth: 1,
    borderColor: '#bec5c2',
    borderRadius: 16,
    backgroundColor: '#eeeeee'
  },

  contributorTitle: {
    color: '#202321',
    fontWeight: '700'
  },

  name: {
    marginTop: 12,
    color: ACCENT,
    fontSize: 16,
    fontWeight: '800'
  },

  bio: {
    marginTop: 8,
    color: '#66706c',
    fontSize: 11,
    lineHeight: 17
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
