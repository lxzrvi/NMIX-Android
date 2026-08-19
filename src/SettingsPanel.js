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

import {
  fontFamily
} from './useNMixFonts';

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
      statusBarTranslucent
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View
            style={[
              styles.header,
              {
                borderBottomColor: colors.border
              }
            ]}
          >
            <View style={styles.headerCopy}>
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color: colors.text,
                    fontFamily: fontFamily(font, true)
                  }
                ]}
              >
                NMIX Settings
              </Text>

              <Text
                style={[
                  styles.small,
                  {
                    color: colors.muted,
                    fontFamily: fontFamily(font)
                  }
                ]}
              >
                Personalize your interface
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.close,
                {
                  backgroundColor: colors.surface2
                },
                pressed && styles.pressed
              ]}
            >
              <Text
                style={[
                  styles.closeText,
                  {
                    color: colors.text,
                    fontFamily: fontFamily(font)
                  }
                ]}
              >
                ×
              </Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.row,
              {
                borderBottomColor: colors.border
              }
            ]}
          >
            <View style={styles.rowCopy}>
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.text,
                    fontFamily: fontFamily(font, true)
                  }
                ]}
              >
                Appearance
              </Text>

              <Text
                style={[
                  styles.small,
                  {
                    color: colors.muted,
                    fontFamily: fontFamily(font)
                  }
                ]}
              >
                Light or dark interface
              </Text>
            </View>

            <Pressable
              onPress={() => setDark(!dark)}
              accessibilityRole="switch"
              accessibilityState={{
                checked: dark
              }}
              style={[
                styles.switch,
                {
                  backgroundColor:
                    dark
                      ? accent
                      : colors.surface3
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
              {
                borderBottomColor: colors.border
              }
            ]}
          >
            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                  fontFamily: fontFamily(font, true)
                }
              ]}
            >
              Color Theme
            </Text>

            <Text
              style={[
                styles.small,
                {
                  color: colors.muted,
                  fontFamily: fontFamily(font)
                }
              ]}
            >
              Choose your NMIX color
            </Text>

            <View style={styles.themeRow}>
              {Object.keys(themes).map(name => {
                const selected = themeName === name;

                return (
                  <Pressable
                    key={name}
                    onPress={() => setThemeName(name)}
                    accessibilityLabel={`${name} theme`}
                    style={({ pressed }) => [
                      styles.themeOuter,
                      {
                        borderColor:
                          selected
                            ? colors.text
                            : 'transparent'
                      },
                      pressed && styles.pressed
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
                    >
                      {selected && (
                        <View style={styles.themeSelected} />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.blockLast}>
            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                  fontFamily: fontFamily(font, true)
                }
              ]}
            >
              Font Style
            </Text>

            <Text
              style={[
                styles.small,
                {
                  color: colors.muted,
                  fontFamily: fontFamily(font)
                }
              ]}
            >
              Choose how NMIX feels
            </Text>

            <View style={styles.fontGrid}>
              {fontChoices.map(name => {
                const selected = font === name;

                return (
                  <Pressable
                    key={name}
                    onPress={() => setFont(name)}
                    style={({ pressed }) => [
                      styles.fontButton,
                      {
                        borderColor:
                          selected
                            ? accent
                            : colors.border,
                        backgroundColor:
                          colors.surface2
                      },
                      pressed && styles.pressed
                    ]}
                  >
                    <View
                      style={[
                        styles.aaBox,
                        {
                          backgroundColor:
                            selected
                              ? `${accent}18`
                              : colors.surface
                        }
                      ]}
                    >
                      <Text
                        style={{
                          color: accent,
                          fontFamily: fontFamily(
                            name,
                            true
                          ),
                          fontSize: 14
                        }}
                      >
                        Aa
                      </Text>
                    </View>

                    <Text
                      numberOfLines={1}
                      style={{
                        flex: 1,
                        color:
                          selected
                            ? accent
                            : colors.text,
                        fontFamily: fontFamily(name),
                        fontSize: 11
                      }}
                    >
                      {name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Text
            style={[
              styles.note,
              {
                color: colors.muted,
                fontFamily: fontFamily(font)
              }
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
    backgroundColor: 'rgba(0,0,0,0.38)'
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
    elevation: 24
  },

  scrollContent: {
    paddingBottom: 2
  },

  header: {
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15,
    borderBottomWidth: 1
  },

  headerCopy: {
    flex: 1
  },

  headerTitle: {
    fontSize: 15
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
    marginTop: -2,
    fontSize: 23
  },

  row: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomWidth: 1
  },

  rowCopy: {
    flex: 1
  },

  title: {
    fontSize: 13
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
    backgroundColor: '#ffffff',
    elevation: 2
  },

  knobOn: {
    transform: [
      {
        translateX: 21
      }
    ]
  },

  block: {
    paddingVertical: 16,
    borderBottomWidth: 1
  },

  blockLast: {
    paddingTop: 16,
    paddingBottom: 4
  },

  themeRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },

  themeOuter: {
    width: 42,
    height: 42,
    padding: 3,
    borderWidth: 3,
    borderRadius: 21
  },

  themeCircle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },

  themeSelected: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 7
  },

  fontGrid: {
    marginTop: 11,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },

  fontButton: {
    width: '48%',
    minHeight: 50,
    paddingHorizontal: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderRadius: 10
  },

  aaBox: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7
  },

  note: {
    marginTop: 13,
    fontSize: 9,
    lineHeight: 14
  },

  pressed: {
    opacity: 0.72,
    transform: [
      {
        scale: 0.96
      }
    ]
  }
});
