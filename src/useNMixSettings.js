import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_THEME = 'nmix-theme-accent';
const STORAGE_KEY_DARK = 'nmix-theme-dark';
const STORAGE_KEY_FONT = 'nmix-app-font';
const STORAGE_KEY_ANIM_SPEED = 'nmix-anim-speed';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [accentTheme, setAccentTheme] = useState('green');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedFont, setSelectedFont] = useState('Poppins');
  const [animSpeed, setAnimSpeed] = useState(1.0); // 0.5x to 2.0x multiplier
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEY_THEME);
        const savedDark = await AsyncStorage.getItem(STORAGE_KEY_DARK);
        const savedFont = await AsyncStorage.getItem(STORAGE_KEY_FONT);
        const savedSpeed = await AsyncStorage.getItem(STORAGE_KEY_ANIM_SPEED);

        if (savedTheme) setAccentTheme(savedTheme);
        if (savedDark !== null) setIsDarkMode(savedDark === 'true');
        if (savedFont) setSelectedFont(savedFont);
        if (savedSpeed !== null) setAnimSpeed(parseFloat(savedSpeed));
      } catch (e) {
        console.error('Failed to load settings from storage', e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const changeAccentTheme = async (theme) => {
    setAccentTheme(theme);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch (e) {}
  };

  const toggleDarkMode = async () => {
    const nextVal = !isDarkMode;
    setIsDarkMode(nextVal);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_DARK, String(nextVal));
    } catch (e) {}
  };

  const changeSelectedFont = async (font) => {
    setSelectedFont(font);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_FONT, font);
    } catch (e) {}
  };

  const changeAnimSpeed = async (speed) => {
    setAnimSpeed(speed);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_ANIM_SPEED, String(speed));
    } catch (e) {}
  };

  return (
    <SettingsContext.Provider
      value={{
        accentTheme,
        changeAccentTheme,
        isDarkMode,
        toggleDarkMode,
        selectedFont,
        changeSelectedFont,
        animSpeed,
        changeAnimSpeed,
        isLoaded,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useNMixSettings() {
  return useContext(SettingsContext);
}
