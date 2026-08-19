import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  themes,
  fontChoices
} from './theme';

export default function SettingsPanel({
  visible,
  onClose,
  dark,
  setDark,
  themeName,
  setThemeName,
  font,
  setFont,
  colors,
  accent
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
      />

      <View
        style={[
          styles.panel,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border
          }
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.header,
              { borderBottomColor: colors.border }
            ]}
          >
            <View>
              <Text
                style={[
                  styles.headerTitle,
                  { color: colors.text }
                ]}
              >
                NMIX Settings
              </Text>

              <Text
                style={[
                  styles.small,
                  { color: colors.muted }
                ]}
              >
                Personalize your interface
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={[
                styles.close,
                { backgroundColor: colors.surface2 }
              ]}
            >
              <Text
                style={[
                  styles.closeText,
                  { color: colors.text }
                ]}
              >
                ×
              </Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.row,
              { borderBottomColor: colors.border }
            ]}
          >
            <View>
              <Text
                style={[
                  styles.title,
                  { color: colors.text }
                ]}
              >
                Appearance
              </Text>

              <Text
                style={[
                  styles.small,
                  { color: colors.muted }
                ]}
              >
                Light or dark interface
              </Text>
            </View>

            <Pressable
              onPress={() => setDark(!dark)}
              style={[
                styles.switch,
                {
                  backgroundColor:
                    dark ? accent : colors.surface3
                }
              ]}
            >
              <View
                style={[
                  styles.knob,
                  dark && styles.knobOn
                ]}
              />
            </Pressable>
          </View>

          <View
            style={[
              styles.block,
              { borderBottomColor: colors.border }
            ]}
          >
            <Text
              style={[
                styles.title,
                { color: colors.text }
              ]}
            >
              Color Theme
            </Text>

            <Text
              style={[
                styles.small,
                { color: colors.muted }
              ]}
            >
              Choose your NMIX color
            </Text>

            <View style={styles.themeRow}>
              {Object.keys(themes).map(name => (
                <Pressable
                  key={name}
                  onPress={() => setThemeName(name)}
                  style={[
                    styles.themeOuter,
                    {
                      borderColor:
                        themeName === name
                          ? colors.text
                          : 'transparent'
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.themeCircle,
                      {
                        backgroundColor:
                          themes[name].accent
                      }
                    ]}
                  />
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.block}>
            <Text
              style={[
                styles.title,
                { color: colors.text }
              ]}
            >
              Font Style
            </Text>

            <Text
              style={[
                styles.small,
                { color: colors.muted }
              ]}
            >
              Choose how NMIX feels
            </Text>

            <View style={styles.fontGrid}>
              {fontChoices.map(name => (
                <Pressable
                  key={name}
                  onPress={() => setFont(name)}
                  style={[
                    styles.fontButton,
                    {
                      borderColor:
                        font === name
                          ? accent
                          : colors.border,
                      backgroundColor: colors.surface2
                    }
                  ]}
                >
                  <Text
                    style={{
                      color:
                        font === name
                          ? accent
                          : colors.text,
                      fontWeight: '600'
                    }}
                  >
                    Aa  {name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Text
            style={[
              styles.note,
              { color: colors.muted }
            ]}
          >
            Theme, dark mode and font settings are saved on this device.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.34)'
  },

  panel: {
    position: 'absolute',
    top: 45,
    right: 12,
    width: '91%',
    maxWidth: 350,
    maxHeight: '88%',
    padding: 17,
    borderWidth: 1,
    borderRadius: 20,
    elevation: 20
  },

  header: {
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1
  },

  headerTitle: {
    fontSize: 15,
    fontWeight: '700'
  },

  small: {
    marginTop: 2,
    fontSize: 10
  },

  close: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17
  },

  closeText: {
    fontSize: 23
  },

  row: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1
  },

  title: {
    fontSize: 13,
    fontWeight: '700'
  },

  switch: {
    width: 49,
    height: 28,
    padding: 4,
    borderRadius: 999
  },

  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff'
  },

  knobOn: {
    transform: [{ translateX: 21 }]
  },

  block: {
    paddingVertical: 16,
    borderBottomWidth: 1
  },

  themeRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },

  themeOuter: {
    width: 40,
    height: 40,
    padding: 3,
    borderWidth: 3,
    borderRadius: 20
  },

  themeCircle: {
    flex: 1,
    borderRadius: 20
  },

  fontGrid: {
    marginTop: 11,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },

  fontButton: {
    width: '48%',
    minHeight: 48,
    paddingHorizontal: 9,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10
  },

  note: {
    marginTop: 12,
    fontSize: 9
  }
});
