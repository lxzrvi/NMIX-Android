import React, {
  useEffect,
  useState
} from 'react';

import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

import {
  GalleryIcon,
  WallpaperIcon
} from './icons';

import MotionPressable from './MotionPressable';
import { fontFamily } from './useNMixFonts';

export const WALLPAPER_KEY =
  'nmix-clock-wallpaper';

export const BUILTIN_WALLPAPERS = {
  midnight: {
    name: 'Midnight',
    colors: [
      '#020706',
      '#071511',
      '#10251e',
      '#030806'
    ]
  },

  emerald: {
    name: 'Emerald',
    colors: [
      '#020806',
      '#0a241b',
      '#174c3a',
      '#06120e'
    ]
  },

  ocean: {
    name: 'Ocean',
    colors: [
      '#02070b',
      '#082236',
      '#104766',
      '#030b10'
    ]
  },

  violet: {
    name: 'Violet',
    colors: [
      '#08050d',
      '#241538',
      '#49306c',
      '#090610'
    ]
  },

  sunset: {
    name: 'Sunset',
    colors: [
      '#110705',
      '#3c1c12',
      '#774124',
      '#100806'
    ]
  },

  rose: {
    name: 'Rose',
    colors: [
      '#0f0509',
      '#351320',
      '#682d42',
      '#10060a'
    ]
  }
};

export async function loadClockWallpaper() {
  try {
    const raw = await AsyncStorage.getItem(
      WALLPAPER_KEY
    );

    if (!raw) {
      return {
        type: 'builtin',
        id: 'midnight'
      };
    }

    const value = JSON.parse(raw);

    if (
      value?.type === 'custom' &&
      value?.uri
    ) {
      const info =
        await FileSystem.getInfoAsync(
          value.uri
        );

      if (info.exists) {
        return value;
      }
    }

    if (
      value?.type === 'builtin' &&
      BUILTIN_WALLPAPERS[value.id]
    ) {
      return value;
    }
  } catch {}

  return {
    type: 'builtin',
    id: 'midnight'
  };
}

async function saveWallpaper(value) {
  try {
    await AsyncStorage.setItem(
      WALLPAPER_KEY,
      JSON.stringify(value)
    );
  } catch {}
}

export default function ClockWallpaperPicker({
  visible,
  onClose,
  current,
  onChange,
  theme,
  font
}) {
  const [busy, setBusy] =
    useState(false);

  const regular =
    fontFamily(font);

  const bold =
    fontFamily(font, true);

  useEffect(() => {
    if (!visible) {
      setBusy(false);
    }
  }, [visible]);

  async function chooseBuiltin(id) {
    const value = {
      type: 'builtin',
      id
    };

    await saveWallpaper(value);

    onChange(value);
    onClose();
  }

  async function chooseCustom() {
    if (busy) {
      return;
    }

    setBusy(true);

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        setBusy(false);
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 1
        });

      if (
        result.canceled ||
        !result.assets?.[0]?.uri
      ) {
        setBusy(false);
        return;
      }

      const source =
        result.assets[0].uri;

      /*
       * This lives inside Android's
       * app-private document storage.
       * It survives app restarts and
       * disappears when app data is
       * cleared / app is uninstalled.
       */
      const folder =
        `${FileSystem.documentDirectory}nmix/`;

      const folderInfo =
        await FileSystem.getInfoAsync(
          folder
        );

      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(
          folder,
          {
            intermediates: true
          }
        );
      }

      const extension =
        getExtension(
          result.assets[0].fileName ||
          source
        );

      const destination =
        `${folder}clock-wallpaper.${extension}`;

      const oldInfo =
        await FileSystem.getInfoAsync(
          destination
        );

      if (oldInfo.exists) {
        await FileSystem.deleteAsync(
          destination,
          {
            idempotent: true
          }
        );
      }

      await FileSystem.copyAsync({
        from: source,
        to: destination
      });

      const value = {
        type: 'custom',
        uri: destination
      };

      await saveWallpaper(value);

      onChange(value);
      onClose();
    } catch (error) {
      console.warn(
        'NMIX wallpaper error:',
        error
      );
    } finally {
      setBusy(false);
    }
  }

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
          styles.sheet,
          {
            borderColor:
              'rgba(255,255,255,.14)'
          }
        ]}
      >
        <LinearGradient
          colors={[
            'rgba(24,31,28,.98)',
            'rgba(10,15,13,.99)'
          ]}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <WallpaperIcon
              size={21}
              color={
                theme.accentLight
              }
            />
          </View>

          <View style={styles.headerCopy}>
            <Text
              style={[
                styles.heading,
                {
                  fontFamily: bold
                }
              ]}
            >
              Clock Wallpaper
            </Text>

            <Text
              style={[
                styles.subheading,
                {
                  fontFamily: regular
                }
              ]}
            >
              Choose a background for fullscreen clock
            </Text>
          </View>

          <MotionPressable
            onPress={onClose}
            style={styles.close}
          >
            <Text
              style={[
                styles.closeText,
                {
                  fontFamily: regular
                }
              ]}
            >
              ×
            </Text>
          </MotionPressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                fontFamily: bold
              }
            ]}
          >
            Built-in
          </Text>

          <View style={styles.grid}>
            {Object.entries(
              BUILTIN_WALLPAPERS
            ).map(
              ([id, item]) => {
                const active =
                  current?.type ===
                    'builtin' &&
                  current?.id === id;

                return (
                  <MotionPressable
                    key={id}
                    onPress={() =>
                      chooseBuiltin(id)
                    }
                    style={[
                      styles.option,
                      active && {
                        borderColor:
                          theme.accentLight
                      }
                    ]}
                  >
                    <LinearGradient
                      colors={
                        item.colors
                      }
                      start={{
                        x: 0,
                        y: 0
                      }}
                      end={{
                        x: 1,
                        y: 1
                      }}
                      style={
                        styles.preview
                      }
                    >
                      <View
                        style={[
                          styles.previewGlow,
                          {
                            backgroundColor:
                              `${theme.accent}30`
                          }
                        ]}
                      />

                      {active && (
                        <View
                          style={[
                            styles.activeDot,
                            {
                              backgroundColor:
                                theme.accentLight
                            }
                          ]}
                        />
                      )}
                    </LinearGradient>

                    <Text
                      style={[
                        styles.optionName,
                        {
                          color:
                            active
                              ? theme.accentLight
                              : '#eaf2ef',
                          fontFamily: regular
                        }
                      ]}
                    >
                      {item.name}
                    </Text>
                  </MotionPressable>
                );
              }
            )}
          </View>

          <Text
            style={[
              styles.sectionTitle,
              styles.customTitle,
              {
                fontFamily: bold
              }
            ]}
          >
            Your Wallpaper
          </Text>

          <MotionPressable
            onPress={chooseCustom}
            disabled={busy}
            style={[
              styles.customButton,
              {
                borderColor:
                  current?.type ===
                  'custom'
                    ? theme.accentLight
                    : 'rgba(255,255,255,.14)'
              }
            ]}
          >
            {current?.type ===
              'custom' &&
            current?.uri ? (
              <Image
                source={{
                  uri: current.uri
                }}
                resizeMode="cover"
                style={styles.customImage}
              />
            ) : (
              <LinearGradient
                colors={[
                  `${theme.accent}35`,
                  'rgba(255,255,255,.04)'
                ]}
                style={styles.customImage}
              />
            )}

            <View
              style={
                styles.customOverlay
              }
            />

            <View style={styles.galleryIcon}>
              <GalleryIcon
                size={24}
                color="#ffffff"
              />
            </View>

            <View
              style={
                styles.customCopy
              }
            >
              <Text
                style={[
                  styles.customHeading,
                  {
                    fontFamily: bold
                  }
                ]}
              >
                {busy
                  ? 'Opening Gallery…'
                  : 'Custom Photo'}
              </Text>

              <Text
                style={[
                  styles.customSub,
                  {
                    fontFamily: regular
                  }
                ]}
              >
                Choose a photo from your phone
              </Text>
            </View>
          </MotionPressable>

          <Text
            style={[
              styles.note,
              {
                fontFamily: regular
              }
            ]}
          >
            Your selection stays saved on this device until NMIX data is cleared or the app is uninstalled.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

function getExtension(value) {
  const clean =
    String(value)
      .split('?')[0]
      .toLowerCase();

  const match =
    clean.match(
      /\.([a-z0-9]+)$/
    );

  const extension =
    match?.[1];

  if (
    extension === 'jpg' ||
    extension === 'jpeg' ||
    extension === 'png' ||
    extension === 'webp'
  ) {
    return extension;
  }

  return 'jpg';
}

const styles =
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        'rgba(0,0,0,.58)'
    },

    sheet: {
      position: 'absolute',
      left: 12,
      right: 12,
      bottom: 12,
      maxHeight: '78%',
      overflow: 'hidden',
      borderWidth: 1,
      borderRadius: 24,
      elevation: 25
    },

    header: {
      minHeight: 78,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor:
        'rgba(255,255,255,.08)'
    },

    headerIcon: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      backgroundColor:
        'rgba(255,255,255,.06)'
    },

    headerCopy: {
      flex: 1,
      paddingHorizontal: 11
    },

    heading: {
      color: '#ffffff',
      fontSize: 14
    },

    subheading: {
      marginTop: 2,
      color:
        'rgba(255,255,255,.52)',
      fontSize: 9.5
    },

    close: {
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 18,
      backgroundColor:
        'rgba(255,255,255,.07)'
    },

    closeText: {
      color: '#ffffff',
      fontSize: 21,
      lineHeight: 25
    },

    scroll: {
      padding: 16,
      paddingBottom: 22
    },

    sectionTitle: {
      color:
        'rgba(255,255,255,.72)',
      fontSize: 11
    },

    grid: {
      marginTop: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10
    },

    option: {
      width: '31%',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor:
        'rgba(255,255,255,.09)',
      borderRadius: 13,
      backgroundColor:
        'rgba(255,255,255,.04)'
    },

    preview: {
      height: 70,
      overflow: 'hidden'
    },

    previewGlow: {
      position: 'absolute',
      width: 65,
      height: 65,
      right: -20,
      top: -20,
      borderRadius: 40
    },

    activeDot: {
      position: 'absolute',
      right: 7,
      top: 7,
      width: 8,
      height: 8,
      borderWidth: 2,
      borderColor:
        'rgba(255,255,255,.8)',
      borderRadius: 4
    },

    optionName: {
      paddingVertical: 8,
      paddingHorizontal: 7,
      fontSize: 9,
      textAlign: 'center'
    },

    customTitle: {
      marginTop: 20
    },

    customButton: {
      position: 'relative',
      height: 92,
      marginTop: 10,
      overflow: 'hidden',
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 15
    },

    customImage: {
      ...StyleSheet.absoluteFillObject
    },

    customOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        'rgba(0,0,0,.34)'
    },

    galleryIcon: {
      width: 46,
      height: 46,
      marginLeft: 14,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 14,
      backgroundColor:
        'rgba(255,255,255,.12)'
    },

    customCopy: {
      flex: 1,
      paddingHorizontal: 12
    },

    customHeading: {
      color: '#fff',
      fontSize: 12
    },

    customSub: {
      marginTop: 3,
      color:
        'rgba(255,255,255,.62)',
      fontSize: 9
    },

    note: {
      marginTop: 15,
      color:
        'rgba(255,255,255,.42)',
      fontSize: 8.5,
      lineHeight: 13
    }
  });
