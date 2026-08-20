import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

const SoundContext =
  createContext(null);

export function NMixSoundProvider({
  children
}) {
  const [
    loaded,
    setLoaded
  ] = useState(false);

  const [
    uiSounds,
    setUiSoundsState
  ] = useState(true);

  const [
    timerAlarm,
    setTimerAlarmState
  ] = useState(true);

  /*
   * IMPORTANT:
   * These six players exist ONCE for the
   * whole app because Provider lives in
   * app/_layout.js.
   */
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

  const uiSoundsRef =
    useRef(true);

  const timerAlarmRef =
    useRef(true);

  const lastPlayed =
    useRef({
      tap: 0,
      open: 0,
      close: 0,
      select: 0,
      result: 0,
      alarm: 0
    });

  useEffect(() => {
    async function load() {
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

        const nextUi =
          saved[
            UI_SOUND_KEY
          ] === null
            ? true
            : saved[
                UI_SOUND_KEY
              ] !== '0';

        const nextAlarm =
          saved[
            TIMER_ALARM_KEY
          ] === null
            ? true
            : saved[
                TIMER_ALARM_KEY
              ] !== '0';

        uiSoundsRef.current =
          nextUi;

        timerAlarmRef.current =
          nextAlarm;

        setUiSoundsState(
          nextUi
        );

        setTimerAlarmState(
          nextAlarm
        );
      } catch {
        uiSoundsRef.current =
          true;

        timerAlarmRef.current =
          true;
      } finally {
        setLoaded(true);
      }
    }

    load();
  }, []);

  const restart =
    useCallback(
      player => {
        try {
          player.pause();
        } catch {}

        try {
          player.seekTo(
            0
          );
        } catch {}

        try {
          player.play();
        } catch {}
      },
      []
    );

  const playUi =
    useCallback(
      (
        key,
        player,
        minimumGap
      ) => {
        if (
          !uiSoundsRef.current
        ) {
          return;
        }

        const now =
          Date.now();

        if (
          now -
            lastPlayed
              .current[
                key
              ] <
          minimumGap
        ) {
          return;
        }

        lastPlayed
          .current[
            key
          ] = now;

        restart(
          player
        );
      },
      [
        restart
      ]
    );

  const tap =
    useCallback(
      () =>
        playUi(
          'tap',
          tapPlayer,
          25
        ),
      [
        playUi,
        tapPlayer
      ]
    );

  const open =
    useCallback(
      () =>
        playUi(
          'open',
          openPlayer,
          80
        ),
      [
        playUi,
        openPlayer
      ]
    );

  const close =
    useCallback(
      () =>
        playUi(
          'close',
          closePlayer,
          80
        ),
      [
        playUi,
        closePlayer
      ]
    );

  const select =
    useCallback(
      () =>
        playUi(
          'select',
          selectPlayer,
          45
        ),
      [
        playUi,
        selectPlayer
      ]
    );

  const result =
    useCallback(
      () =>
        playUi(
          'result',
          resultPlayer,
          110
        ),
      [
        playUi,
        resultPlayer
      ]
    );

  const timerFinished =
    useCallback(
      () => {
        if (
          !timerAlarmRef.current
        ) {
          return;
        }

        const now =
          Date.now();

        if (
          now -
            lastPlayed
              .current
              .alarm <
          800
        ) {
          return;
        }

        lastPlayed
          .current
          .alarm = now;

        restart(
          alarmPlayer
        );
      },
      [
        alarmPlayer,
        restart
      ]
    );

  const setUiSounds =
    useCallback(
      value => {
        const next =
          Boolean(
            value
          );

        uiSoundsRef.current =
          next;

        setUiSoundsState(
          next
        );

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
      },
      []
    );

  const setTimerAlarm =
    useCallback(
      value => {
        const next =
          Boolean(
            value
          );

        timerAlarmRef.current =
          next;

        setTimerAlarmState(
          next
        );

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
      },
      []
    );

  const value =
    useMemo(
      () => ({
        loaded,

        uiSounds,
        setUiSounds,

        timerAlarm,
        setTimerAlarm,

        tap,
        open,
        close,
        select,
        result,
        timerFinished
      }),
      [
        loaded,
        uiSounds,
        setUiSounds,
        timerAlarm,
        setTimerAlarm,
        tap,
        open,
        close,
        select,
        result,
        timerFinished
      ]
    );

  return (
    <SoundContext.Provider
      value={
        value
      }
    >
      {children}
    </SoundContext.Provider>
  );
}

export default function useNMixSounds() {
  const context =
    useContext(
      SoundContext
    );

  /*
   * Catch incorrect usage immediately
   * during development instead of creating
   * extra audio players.
   */
  if (!context) {
    throw new Error(
      'useNMixSounds must be used inside NMixSoundProvider'
    );
  }

  return context;
}
