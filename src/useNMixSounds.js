import {
  useCallback,
  useEffect,
  useState
} from 'react';

import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  useAudioPlayer
} from 'expo-audio';

const UI_SOUND_KEY =
  'nmix-ui-sounds';

const TIMER_ALARM_KEY =
  'nmix-timer-alarm';

let state = {
  loaded: false,

  uiSounds: true,

  timerAlarm: true
};

const listeners =
  new Set();

let loadingPromise =
  null;

function snapshot() {
  return {
    loaded:
      state.loaded,

    uiSounds:
      state.uiSounds,

    timerAlarm:
      state.timerAlarm
  };
}

function emit() {
  listeners.forEach(
    listener => {
      try {
        listener(
          snapshot()
        );
      } catch {}
    }
  );
}

function subscribe(
  listener
) {
  listeners.add(
    listener
  );

  return () =>
    listeners.delete(
      listener
    );
}

async function loadSettings() {
  if (
    state.loaded
  ) {
    return;
  }

  if (
    loadingPromise
  ) {
    return loadingPromise;
  }

  loadingPromise =
    (async () => {
      try {
        const values =
          await AsyncStorage
            .multiGet([
              UI_SOUND_KEY,
              TIMER_ALARM_KEY
            ]);

        const saved =
          Object.fromEntries(
            values
          );

        if (
          saved[
            UI_SOUND_KEY
          ] !== null
        ) {
          state.uiSounds =
            saved[
              UI_SOUND_KEY
            ] !== '0';
        }

        if (
          saved[
            TIMER_ALARM_KEY
          ] !== null
        ) {
          state.timerAlarm =
            saved[
              TIMER_ALARM_KEY
            ] !== '0';
        }
      } catch {
        /*
         * Defaults remain enabled.
         */
      } finally {
        state.loaded =
          true;

        loadingPromise =
          null;

        emit();
      }
    })();

  return loadingPromise;
}

function setUiSounds(
  value
) {
  const next =
    Boolean(
      value
    );

  state.uiSounds =
    next;

  emit();

  AsyncStorage
    .setItem(
      UI_SOUND_KEY,
      next
        ? '1'
        : '0'
    )
    .catch(
      () => {}
    );
}

function setTimerAlarm(
  value
) {
  const next =
    Boolean(
      value
    );

  state.timerAlarm =
    next;

  emit();

  AsyncStorage
    .setItem(
      TIMER_ALARM_KEY,
      next
        ? '1'
        : '0'
    )
    .catch(
      () => {}
    );
}

/*
 * Avoid replaying the same ultra-short
 * UI sound too aggressively.
 */
const lastPlayed = {
  tap: 0,
  open: 0,
  close: 0,
  select: 0,
  result: 0
};

export default function useNMixSounds() {
  const [
    settings,
    setSettings
  ] = useState(
    snapshot
  );

  const tapPlayer =
    useAudioPlayer(
      require(
        '../assets/sfx/tap.wav'
      )
    );

  const openPlayer =
    useAudioPlayer(
      require(
        '../assets/sfx/open.wav'
      )
    );

  const closePlayer =
    useAudioPlayer(
      require(
        '../assets/sfx/close.wav'
      )
    );

  const selectPlayer =
    useAudioPlayer(
      require(
        '../assets/sfx/select.wav'
      )
    );

  const resultPlayer =
    useAudioPlayer(
      require(
        '../assets/sfx/result.wav'
      )
    );

  const alarmPlayer =
    useAudioPlayer(
      require(
        '../assets/sfx/timer-alarm.wav'
      )
    );

  useEffect(() => {
    const unsubscribe =
      subscribe(
        setSettings
      );

    setSettings(
      snapshot()
    );

    loadSettings();

    return unsubscribe;
  }, []);

  const playUi =
    useCallback(
      (
        key,
        player,
        minimumGap = 35
      ) => {
        if (
          !state.uiSounds
        ) {
          return;
        }

        const now =
          Date.now();

        if (
          now -
            lastPlayed[
              key
            ] <
          minimumGap
        ) {
          return;
        }

        lastPlayed[
          key
        ] = now;

        try {
          player.seekTo(
            0
          );

          player.play();
        } catch {}
      },
      []
    );

  const tap =
    useCallback(
      () =>
        playUi(
          'tap',
          tapPlayer,
          28
        ),

      [
        tapPlayer,
        playUi
      ]
    );

  const open =
    useCallback(
      () =>
        playUi(
          'open',
          openPlayer,
          90
        ),

      [
        openPlayer,
        playUi
      ]
    );

  const close =
    useCallback(
      () =>
        playUi(
          'close',
          closePlayer,
          90
        ),

      [
        closePlayer,
        playUi
      ]
    );

  const select =
    useCallback(
      () =>
        playUi(
          'select',
          selectPlayer,
          55
        ),

      [
        selectPlayer,
        playUi
      ]
    );

  const result =
    useCallback(
      () =>
        playUi(
          'result',
          resultPlayer,
          120
        ),

      [
        resultPlayer,
        playUi
      ]
    );

  const timerFinished =
    useCallback(
      () => {
        if (
          !state.timerAlarm
        ) {
          return;
        }

        try {
          alarmPlayer
            .seekTo(
              0
            );

          alarmPlayer
            .play();
        } catch {}
      },

      [
        alarmPlayer
      ]
    );

  return {
    loaded:
      settings.loaded,

    uiSounds:
      settings.uiSounds,

    setUiSounds,

    timerAlarm:
      settings.timerAlarm,

    setTimerAlarm,

    tap,
    open,
    close,
    select,
    result,

    timerFinished
  };
}
