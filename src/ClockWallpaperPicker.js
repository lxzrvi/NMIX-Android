import React, {
  useState
} from 'react';

import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';

import {
  LinearGradient
} from 'expo-linear-gradient';

import AsyncStorage
  from '@react-native-async-storage/async-storage';

import * as ImagePicker
  from 'expo-image-picker';

import * as FileSystem
  from 'expo-file-system/legacy';

import {
  GalleryIcon,
  WallpaperIcon
} from './icons';

import MotionPressable
  from './MotionPressable';

import {
  fontFamily
} from './useNMixFonts';

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
    const raw =
      await AsyncStorage.getItem(
        WALLPAPER_KEY
      );

    if (!raw) {
      return defaultWallpaper();
    }

    const saved =
      JSON.parse(raw);

    if (
      saved?.type ===
        'builtin' &&
      BUILTIN_WALLPAPERS[
        saved.id
      ]
    ) {
      return saved;
    }

    if (
      saved?.type ===
        'custom' &&
      saved?.uri
    ) {
      const info =
        await FileSystem
          .getInfoAsync(
            saved.uri
          );

      if (info.exists) {
        return saved;
      }
    }
  } catch {}

  return defaultWallpaper();
}

function defaultWallpaper() {
  return {
    type: 'builtin',
    id: 'midnight'
  };
}

async function saveWallpaper(
  value
) {
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
  const { width } =
    useWindowDimensions();

  const [busy, setBusy] =
    useState(false);

  const regular =
    fontFamily(font);

  const bold =
    fontFamily(
      font,
      true
    );

  /*
   * 2 columns on a normal phone.
   * This avoids percentage-width
   * collapsing into thin strips.
   */
  const sheetWidth =
    Math.min(
      width - 24,
      500
    );

  const tileWidth =
    Math.max(
      125,
      (
        sheetWidth -
        52
      ) / 2
    );

  async function chooseBuiltin(
    id
  ) {
    const value = {
      type: 'builtin',
      id
    };

    await saveWallpaper(
      value
    );

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
        await ImagePicker
          .requestMediaLibraryPermissionsAsync();

      if (
        !permission.granted
      ) {
        return;
      }

      const result =
        await ImagePicker
          .launchImageLibraryAsync({
            mediaTypes:
              ImagePicker
                .MediaTypeOptions
                .Images,

            allowsEditing:
              false,

            quality: 1,

            exif: false
          });

      if (
        result.canceled ||
        !result.assets ||
        !result.assets[0]
      ) {
        return;
      }

      const asset =
        result.assets[0];

      if (!asset.uri) {
        return;
      }

      const folder =
        `${FileSystem.documentDirectory}nmix-wallpapers/`;

      const folderInfo =
        await FileSystem
          .getInfoAsync(
            folder
          );

      if (
        !folderInfo.exists
      ) {
        await FileSystem
          .makeDirectoryAsync(
            folder,
            {
              intermediates: true
            }
          );
      }

      /*
       * We create a new filename each
       * time. React Native otherwise
       * may continue displaying a
       * cached old image when the URI
       * stays identical.
       */
      const extension =
        extensionFromAsset(
          asset
        );

      const destination =
        `${folder}clock-${Date.now()}.${extension}`;

      await FileSystem
        .copyAsync({
          from:
            asset.uri,

          to:
            destination
        });

      const value = {
        type: 'custom',

        uri:
          destination
      };

      await saveWallpaper(
        value
      );

      onChange(value);

      onClose();
    } catch (error) {
      console.warn(
        'NMIX wallpaper:',
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
      onRequestClose={
        onClose
      }
    >
      <Pressable
        style={
          styles.backdrop
        }
        onPress={
          onClose
        }
      />

      <View
        style={[
          styles.sheet,

          {
            width:
              sheetWidth
          }
        ]}
      >
        <LinearGradient
          colors={[
            'rgba(24,31,28,.99)',
            'rgba(8,13,11,.995)'
          ]}
          style={
            StyleSheet.absoluteFill
          }
        />

        <View
          style={
            styles.header
          }
        >
          <View
            style={
              styles.headerIcon
            }
          >
            <WallpaperIcon
              size={21}
              color={
                theme.accentLight
              }
            />
          </View>

          <View
            style={
              styles.headerCopy
            }
          >
            <Text
              style={[
                styles.heading,

                {
                  fontFamily:
                    bold
                }
              ]}
            >
              Clock Wallpaper
            </Text>

            <Text
              style={[
                styles.subheading,

                {
                  fontFamily:
                    regular
                }
              ]}
            >
              Choose a fullscreen background
            </Text>
          </View>

          <MotionPressable
            onPress={
              onClose
            }
            style={
              styles.close
            }
          >
            <Text
              style={[
                styles.closeText,

                {
                  fontFamily:
                    regular
                }
              ]}
            >
              ×
            </Text>
          </MotionPressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.scroll
          }
        >
          <Text
            style={[
              styles.sectionTitle,

              {
                fontFamily:
                  bold
              }
            ]}
          >
            Built-in
          </Text>

          <View
            style={
              styles.grid
            }
          >
            {Object.entries(
              BUILTIN_WALLPAPERS
            ).map(
              ([
                id,
                item
              ]) => {
                const selected =
                  current
                    ?.type ===
                    'builtin' &&
                  current
                    ?.id === id;

                return (
                  <MotionPressable
                    key={id}

                    onPress={() =>
                      chooseBuiltin(
                        id
                      )
                    }

                    style={[
                      styles.tile,

                      {
                        width:
                          tileWidth,

                        borderColor:
                          selected
                            ? theme.accentLight
                            : 'rgba(255,255,255,.10)'
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
                              `${theme.accent}28`
                          }
                        ]}
                      />

                      <Text
                        style={[
                          styles.previewTime,

                          {
                            fontFamily:
                              bold
                          }
                        ]}
                      >
                        10:28
                      </Text>

                      {selected && (
                        <View
                          style={[
                            styles.selected,

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
                        styles.tileName,

                        {
                          color:
                            selected
                              ? theme.accentLight
                              : '#eaf2ef',

                          fontFamily:
                            regular
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
                fontFamily:
                  bold
              }
            ]}
          >
            Your Wallpaper
          </Text>

          <MotionPressable
            onPress={
              chooseCustom
            }
            disabled={
              busy
            }
            style={[
              styles.custom,

              {
                borderColor:
                  current?.type ===
                    'custom'
                    ? theme.accentLight
                    : 'rgba(255,255,255,.12)'
              }
            ]}
          >
            {current?.type ===
              'custom' &&
            current?.uri ? (
              <Image
                key={
                  current.uri
                }
                source={{
                  uri:
                    current.uri
                }}
                resizeMode="cover"
                style={
                  StyleSheet.absoluteFill
                }
              />
            ) : (
              <LinearGradient
                colors={[
                  `${theme.accent}38`,
                  '#101613'
                ]}
                style={
                  StyleSheet.absoluteFill
                }
              />
            )}

            <View
              style={
                styles.customShade
              }
            />

            <View
              style={
                styles.gallery
              }
            >
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
                    fontFamily:
                      bold
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
                    fontFamily:
                      regular
                  }
                ]}
              >
                Choose any image from your phone
              </Text>
            </View>
          </MotionPressable>

          <Text
            style={[
              styles.note,

              {
                fontFamily:
                  regular
              }
            ]}
          >
            Custom wallpaper is copied into NMIX storage and remains available until app data is cleared or NMIX is uninstalled.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

function extensionFromAsset(
  asset
) {
  const mime =
    String(
      asset.mimeType ||
      ''
    ).toLowerCase();

  if (
    mime.includes(
      'png'
    )
  ) {
    return 'png';
  }

  if (
    mime.includes(
      'webp'
    )
  ) {
    return 'webp';
  }

  if (
    mime.includes(
      'heic'
    ) ||
    mime.includes(
      'heif'
    )
  ) {
    /*
     * Image component may display
     * HEIC on supported Android
     * devices, so preserve it.
     */
    return 'heic';
  }

  const name =
    String(
      asset.fileName ||
      asset.uri ||
      ''
    )
      .split('?')[0]
      .toLowerCase();

  const match =
    name.match(
      /\.([a-z0-9]+)$/
    );

  if (match?.[1]) {
    return match[1];
  }

  return 'jpg';
}

const styles =
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        'rgba(0,0,0,.60)'
    },

    sheet: {
      position:
        'absolute',

      alignSelf:
        'center',

      bottom: 12,

      maxWidth: 500,

      maxHeight:
        '82%',

      overflow:
        'hidden',

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,.12)',

      borderRadius: 24,

      elevation: 25
    },

    header: {
      minHeight: 78,

      paddingHorizontal: 16,

      flexDirection:
        'row',

      alignItems:
        'center',

      borderBottomWidth: 1,

      borderBottomColor:
        'rgba(255,255,255,.08)'
    },

    headerIcon: {
      width: 40,

      height: 40,

      justifyContent:
        'center',

      alignItems:
        'center',

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

      justifyContent:
        'center',

      alignItems:
        'center',

      borderRadius: 18,

      backgroundColor:
        'rgba(255,255,255,.07)'
    },

    closeText: {
      color: '#fff',

      fontSize: 21,

      lineHeight: 24
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

      flexDirection:
        'row',

      flexWrap:
        'wrap',

      justifyContent:
        'space-between',

      gap: 10
    },

    tile: {
      overflow:
        'hidden',

      borderWidth: 1,

      borderRadius: 14,

      backgroundColor:
        'rgba(255,255,255,.04)'
    },

    preview: {
      width: '100%',

      height: 92,

      overflow:
        'hidden',

      justifyContent:
        'center',

      alignItems:
        'center'
    },

    previewGlow: {
      position:
        'absolute',

      width: 100,

      height: 100,

      right: -32,

      top: -35,

      borderRadius: 50
    },

    previewTime: {
      color:
        'rgba(255,255,255,.88)',

      fontSize: 19
    },

    selected: {
      position:
        'absolute',

      top: 8,

      right: 8,

      width: 9,

      height: 9,

      borderWidth: 2,

      borderColor:
        '#ffffff',

      borderRadius: 5
    },

    tileName: {
      paddingVertical: 9,

      paddingHorizontal: 7,

      fontSize: 9,

      textAlign:
        'center'
    },

    customTitle: {
      marginTop: 20
    },

    custom: {
      position:
        'relative',

      height: 105,

      marginTop: 10,

      overflow:
        'hidden',

      flexDirection:
        'row',

      alignItems:
        'center',

      borderWidth: 1,

      borderRadius: 16
    },

    customShade: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        'rgba(0,0,0,.38)'
    },

    gallery: {
      width: 48,

      height: 48,

      marginLeft: 15,

      justifyContent:
        'center',

      alignItems:
        'center',

      borderRadius: 14,

      backgroundColor:
        'rgba(255,255,255,.13)'
    },

    customCopy: {
      flex: 1,

      paddingHorizontal: 12
    },

    customHeading: {
      color: '#ffffff',

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
