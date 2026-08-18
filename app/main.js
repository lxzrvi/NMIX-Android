import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable
} from 'react-native';
import { router } from 'expo-router';

export default function Main() {
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.screen}>
        <Text style={styles.logo}>NMIX</Text>

        <View style={styles.result}>
          <Text style={styles.label}>NMIX LIVE</Text>
          <Text style={styles.value}>Ready</Text>
          <Text style={styles.status}>Choose a tool below.</Text>
        </View>
      </View>

      <View style={styles.content}>
        {[
          ['÷', 'Calculator', 'Numbers and operations'],
          ['◷', 'Clock', 'Timer, clock and stopwatch'],
          ['+', 'Counters', 'Count and generate'],
          ['?', 'How to use NMIX', 'Instructions and controls']
        ].map(([icon, title, description]) => (
          <View style={styles.bar} key={title}>
            <View style={styles.icon}>
              <Text style={styles.iconText}>{icon}</Text>
            </View>

            <View style={styles.copy}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>

            <Text style={styles.arrow}>⌄</Text>
          </View>
        ))}

        <Pressable style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#dedede'
  },
  screen: {
    height: 280,
    padding: 10,
    backgroundColor: '#24775e',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22
  },
  logo: {
    height: 60,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '900',
    fontSize: 28,
    letterSpacing: 5
  },
  result: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#e6ebe8'
  },
  label: {
    color: '#216e56',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.5
  },
  value: {
    color: '#152c24',
    fontSize: 40,
    fontWeight: '700'
  },
  status: {
    position: 'absolute',
    bottom: 8,
    color: '#397c68',
    fontSize: 10
  },
  content: {
    flex: 1,
    padding: 14,
    gap: 12
  },
  bar: {
    minHeight: 67,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bec5c2',
    borderRadius: 14,
    backgroundColor: '#eeeeee'
  },
  icon: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#319b79'
  },
  iconText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700'
  },
  copy: {
    flex: 1,
    paddingHorizontal: 12
  },
  title: {
    color: '#202321',
    fontSize: 14,
    fontWeight: '700'
  },
  description: {
    color: '#66706c',
    fontSize: 10
  },
  arrow: {
    color: '#66706c',
    fontSize: 20
  },
  back: {
    alignSelf: 'center',
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    backgroundColor: '#319b79'
  },
  backText: {
    color: '#fff',
    fontSize: 28
  }
});
