import {
  useEffect,
  useMemo,
  useState
} from 'react';

import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  themes,
  lightColors,
  darkColors,
  fontChoices
} from './theme';

const THEME_KEY =
  'nmix-theme';

const DARK_KEY =
  'nmix-dark';

const FONT_KEY =
  'nmix-font';

/*
 * Shared module-level store.
 *
 * Every screen now reads the SAME values.
 * Navigating Welcome <-> Main no longer creates
 * independent settings state that can temporarily
 * overwrite/revert another screen.
 */
let store = {
  loaded: false,
  loading: false,

  themeName:
    'green',

  dark:
    false,

  font:
    'Poppins'
};

const listeners =
  new Set();

let loadPromise =
  null;

function emit() {
  listeners.forEach(
    listener => {
      try {
        listener();
      } catch {}
    }
  );
}

function snapshot() {
  return {
    loaded:
      store.loaded,

    themeName:
      store.themeName,

    dark:
      store.dark,

    font:
      store.font
  };
}

async function loadSettings() {
  if (
    store.loaded
  ) {
    return;
  }

  /*
   * All hook instances share one hydration
   * request instead of racing each other.
   */
  if (
    loadPromise
  ) {
    return loadPromise;
  }

  store.loading =
    true;

  loadPromise =
    (async () => {
      try {
        const values =
          await AsyncStorage
            .multiGet([
              THEME_KEY,
              DARK_KEY,
              FONT_KEY
            ]);

        const saved =
          Object.fromEntries(
            values
          );

        const savedTheme =
          saved[
            THEME_KEY
          ];

        const savedDark =
          saved[
            DARK_KEY
          ];

        const savedFont =
          saved[
            FONT_KEY
          ];

        if (
          savedTheme &&
          themes[
            savedTheme
          ]
        ) {
          store.themeName =
            savedTheme;
        }

        if (
          savedDark ===
            '1' ||
          savedDark ===
            '0'
        ) {
          store.dark =
            savedDark ===
            '1';
        }

        if (
          savedFont &&
          (
            !Array.isArray(
              fontChoices
            ) ||
            fontChoices.includes(
              savedFont
            )
          )
        ) {
          store.font =
            savedFont;
        }
      } catch {
        /*
         * Keep safe defaults if device storage
         * cannot be read.
         */
      } finally {
        store.loaded =
          true;

        store.loading =
          false;

        loadPromise =
          null;

        emit();
      }
    })();

  return loadPromise;
}

function subscribe(
  listener
) {
  listeners.add(
    listener
  );

  return () => {
    listeners.delete(
      listener
    );
  };
}

function setThemeName(
  value
) {
  if (
    !themes[
      value
    ]
  ) {
    return;
  }

  if (
    store.themeName ===
    value
  ) {
    return;
  }

  /*
   * Update the shared UI state immediately.
   * Storage happens in the background.
   */
  store.themeName =
    value;

  emit();

  AsyncStorage
    .setItem(
      THEME_KEY,
      value
    )
    .catch(
      () => {}
    );
}

function setDark(
  value
) {
  const next =
    Boolean(
      value
    );

  if (
    store.dark ===
    next
  ) {
    return;
  }

  store.dark =
    next;

  emit();

  AsyncStorage
    .setItem(
      DARK_KEY,
      next
        ? '1'
        : '0'
    )
    .catch(
      () => {}
    );
}

function setFont(
  value
) {
  if (
    !value
  ) {
    return;
  }

  if (
    Array.isArray(
      fontChoices
    ) &&
    !fontChoices.includes(
      value
    )
  ) {
    return;
  }

  if (
    store.font ===
    value
  ) {
    return;
  }

  store.font =
    value;

  emit();

  AsyncStorage
    .setItem(
      FONT_KEY,
      value
    )
    .catch(
      () => {}
    );
}

export default function useNMixSettings() {
  const [
    state,
    setState
  ] = useState(
    snapshot
  );

  useEffect(() => {
    const unsubscribe =
      subscribe(
        () => {
          setState(
            snapshot()
          );
        }
      );

    /*
     * Synchronize immediately in case another
     * screen changed settings between render
     * and effect subscription.
     */
    setState(
      snapshot()
    );

    loadSettings();

    return unsubscribe;
  }, []);

  const theme =
    useMemo(
      () =>
        themes[
          state.themeName
        ] ||
        themes.green,

      [
        state.themeName
      ]
    );

  const colors =
    useMemo(
      () =>
        state.dark
          ? darkColors
          : lightColors,

      [
        state.dark
      ]
    );

  return {
    loaded:
      state.loaded,

    themeName:
      state.themeName,

    setThemeName,

    dark:
      state.dark,

    setDark,

    font:
      state.font,

    setFont,

    theme,

    colors
  };
}
