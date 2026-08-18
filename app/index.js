import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function Welcome() {
  return (
    <LinearGradient
      colors={['#03140f', '#0d3b2d', '#319b79', '#0a3528']}
      locations={[0, 0.3, 0.6, 1]}
      style={styles.background}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <View style={styles.brand}>
            <Text style={styles.subtitle}>ANYTHING WITH NUMBERS</Text>
            <Text style={styles.title}>NMIX</Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed
              ]}
              onPress={() => router.push('/main')}
            >
              <Text style={styles.buttonText}>Start</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed
              ]}
            >
              <Text style={styles.buttonText}>Share</Text>
            </Pressable>
          </View>

          <View style={styles.contributor}>
            <Text style={styles.heading}>Contributor</Text>

            <View style={styles.columns}>
              <View style={styles.about}>
                <Text style={styles.name}>Alex Ravi</Text>
                <Text style={styles.bio}>
                  I'm currently doing a diploma in web development and
                  building my skills step by step.
                </Text>
              </View>

              <View style={styles.skills}>
                <Text style={styles.skillHeading}>Skills</Text>

                <View style={styles.chips}>
                  {['HTML', 'CSS', 'JavaScript'].map(item => (
                    <View style={styles.chip} key={item}>
                      <Text style={styles.chipText}>{item}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.learning}>Learning More</Text>

                <View style={styles.chips}>
                  {['Responsive Design', 'UI / UX', 'Web APIs'].map(item => (
                    <View style={styles.chip} key={item}>
                      <Text style={styles.chipText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.contactRow}>
              <View style={styles.contact}>
                <Text style={styles.contactText}>Contact</Text>
              </View>

              <View style={styles.contact}>
                <Text style={styles.contactText}>Go to Mail</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Alex Ravi
          </Text>
          <Text style={styles.footerSmall}>All Rights Reserved</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1
  },
  safe: {
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  brand: {
    alignItems: 'center',
    marginBottom: 22
  },
  subtitle: {
    color: '#ddf8ef',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 3
  },
  title: {
    marginTop: 3,
    color: '#ffffff',
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: 6
  },
  actions: {
    width: '72%',
    maxWidth: 280,
    gap: 10,
    marginBottom: 18
  },
  button: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: '#ffffff'
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9
  },
  buttonText: {
    color: '#174c3b',
    fontWeight: '600'
  },
  contributor: {
    width: '100%',
    maxWidth: 460,
    padding: 12,
    paddingBottom: 52,
    borderRadius: 16,
    backgroundColor: '#eeeeee'
  },
  heading: {
    marginBottom: 10,
    color: '#202321',
    fontWeight: '700'
  },
  columns: {
    flexDirection: 'row',
    gap: 8
  },
  about: {
    flex: 1,
    minHeight: 125,
    padding: 12,
    borderRadius: 11,
    backgroundColor: '#dedede'
  },
  name: {
    color: '#319b79',
    fontWeight: '800',
    fontSize: 16
  },
  bio: {
    marginTop: 9,
    color: '#66706c',
    fontSize: 11,
    lineHeight: 17
  },
  skills: {
    flex: 1,
    padding: 8
  },
  skillHeading: {
    color: '#202321',
    fontWeight: '700',
    fontSize: 12
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 7
  },
  chip: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(49,155,121,0.12)'
  },
  chipText: {
    color: '#216e56',
    fontWeight: '600',
    fontSize: 9
  },
  learning: {
    marginTop: 10,
    color: '#66706c',
    fontSize: 10
  },
  contactRow: {
    position: 'absolute',
    right: 12,
    bottom: 10,
    flexDirection: 'row',
    gap: 7
  },
  contact: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#319b79'
  },
  contactText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600'
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 10
  },
  footerText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 10
  },
  footerSmall: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 8
  }
});
