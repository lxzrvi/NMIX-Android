import { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  themes,
  lightColors,
  darkColors
} from './theme';

const THEME_KEY = 'nmix-theme';
const DARK_KEY = 'nmix-dark';
const FONT_KEY = 'nmix-font';

export default function useNMixSettings() {
  const [loaded, setLoaded] = useState(false);
  const [themeName, setThemeState] = useState('green');
  const [dark, setDarkState] = useState(false);
  const [font, setFontState] = useState('Poppins');

  useEffect(() => {
    async function load() {
      try {
        const values = await AsyncStorage.multiGet([
          THEME_KEY,
          DARK_KEY,
          FONT_KEY
        ]);

        const saved = Object.fromEntries(values);

        if (saved[THEME_KEY] && themes[saved[THEME_KEY]]) {
          setThemeState(saved[THEME_KEY]);
        }

        if (saved[DARK_KEY] !== null) {
          setDarkState(saved[DARK_KEY] === '1');
        }

        if (saved[FONT_KEY]) {
          setFontState(saved[FONT_KEY]);
        }
      } catch {
      } finally {
        setLoaded(true);
      }
    }

    load();
  }, []);

  async function setThemeName(value) {
    if (!themes[value]) return;

    setThemeState(value);

    try {
      await AsyncStorage.setItem(THEME_KEY, value);
    } catch {}
  }

  async function setDark(value) {
    setDarkState(value);

    try {
      await AsyncStorage.setItem(
        DARK_KEY,
        value ? '1' : '0'
      );
    } catch {}
  }

  async function setFont(value) {
    setFontState(value);

    try {
      await AsyncStorage.setItem(FONT_KEY, value);
    } catch {}
  }

  const theme = useMemo(
    () => themes[themeName] || themes.green,
    [themeName]
  );

  const colors = useMemo(
    () => (dark ? darkColors : lightColors),
    [dark]
  );

  return {
    loaded,
    themeName,
    setThemeName,
    dark,
    setDark,
    font,
    setFont,
    theme,
    colors
  };
}
