import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNMixSettings } from './useNMixSettings';
import { getThemeColors, ACCENT_THEMES } from './theme';

export default function SettingsPanel({ visible, onClose }) {
  const insets = useSafeAreaInsets();
  const { accentTheme, changeAccentTheme, isDarkMode, toggleDarkMode, selectedFont, changeSelectedFont, animSpeed, changeAnimSpeed } = useNMixSettings();
  const theme = getThemeColors(accentTheme, isDarkMode);

  const FONTS = ['Poppins', 'Inter', 'Outfit', 'Nunito', 'Quicksand'];

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.panel, { backgroundColor: theme.bg, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
          <Text style={[styles.title, { color: theme.text, fontFamily: `${selectedFont}-Bold` }]}>Settings</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Theme Pickers */}
            <Text style={[styles.sectionTitle, { color: theme.subText }]}>ACCENT COLOR</Text>
            <View style={styles.themeRow}>
              {Object.keys(ACCENT_THEMES).map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.colorBubble, { backgroundColor: ACCENT_THEMES[key].accent }, accentTheme === key && styles.selectedBubble]}
                  onPress={() => changeAccentTheme(key)}
                />
              ))}
            </View>

            {/* Mode Toggle */}
            <TouchableOpacity style={[styles.toggleBtn, { backgroundColor: theme.cardBg }]} onPress={toggleDarkMode}>
              <Text style={{ color: theme.text }}>Dark Mode</Text>
              <Text style={{ color: theme.accent, fontWeight: 'bold' }}>{isDarkMode ? 'ON' : 'OFF'}</Text>
            </TouchableOpacity>

            {/* Font Picker */}
            <Text style={[styles.sectionTitle, { color: theme.subText, marginTop: 20 }]}>APP FONT</Text>
            {FONTS.map((font) => (
              <TouchableOpacity
                key={font}
                style={[styles.fontBtn, { backgroundColor: theme.cardBg }, selectedFont === font && { borderColor: theme.accent, borderWidth: 1 }]}
                onPress={() => changeSelectedFont(font)}
              >
                <Text style={{ color: theme.text, fontFamily: `${font}-Regular` }}>{font}</Text>
              </TouchableOpacity>
            ))}

            {/* Dynamic Animation Fluidity Multiplier */}
            <Text style={[styles.sectionTitle, { color: theme.subText, marginTop: 20 }]}>ANIMATION FLUIDITY / SPEED</Text>
            <View style={styles.animSpeedRow}>
              {[0.5, 1.0, 1.5, 2.0].map((spd) => (
                <TouchableOpacity
                  key={spd}
                  style={[styles.speedChip, { backgroundColor: theme.cardBg }, animSpeed === spd && { backgroundColor: theme.accent }]}
                  onPress={() => changeAnimSpeed(spd)}
                >
                  <Text style={{ color: animSpeed === spd ? '#FFF' : theme.text, fontWeight: 'bold' }}>
                    {spd}x
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity style={[styles.closeBtn, { backgroundColor: theme.accent }]} onPress={onClose}>
            <Text style={styles.closeBtnText}>DONE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  panel: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    maxHeight: '85%',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  colorBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  selectedBubble: {
    borderWidth: 3,
    borderColor: '#FFF',
  },
  toggleBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
  },
  fontBtn: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  animSpeedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  speedChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  closeBtn: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  closeBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
