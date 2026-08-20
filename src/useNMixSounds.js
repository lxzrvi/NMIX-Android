import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Audio } from 'expo-av';

const SoundContext = createContext({
  playSound: (type) => {},
  isSoundEnabled: true,
  toggleSound: () => {},
});

export function NMixSoundProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const clickSoundRef = useRef(null);
  const timerSoundRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function initAudio() {
      try {
        // Configure audio mode without blocking main thread
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        }).catch(() => {});

        // Load Click Sound with Safe Fallback
        try {
          const { sound: clickObj } = await Audio.Sound.createAsync(
            require('../assets/sounds/click.wav'),
            { shouldPlay: false }
          );
          if (isMounted) clickSoundRef.current = clickObj;
        } catch (err) {
          console.warn('Click audio asset missing or failed to load:', err);
        }

        // Load Timer Sound with Safe Fallback
        try {
          const { sound: timerObj } = await Audio.Sound.createAsync(
            require('../assets/sounds/timer_end.wav'),
            { shouldPlay: false }
          );
          if (isMounted) timerSoundRef.current = timerObj;
        } catch (err) {
          console.warn('Timer audio asset missing or failed to load:', err);
        }
      } catch (e) {
        console.warn('Audio Initialization Error:', e);
      }
    }

    initAudio();

    return () => {
      isMounted = false;
      // Safely unload sound drivers
      if (clickSoundRef.current) {
        clickSoundRef.current.unloadAsync().catch(() => {});
      }
      if (timerSoundRef.current) {
        timerSoundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const playSound = async (type = 'click') => {
    if (!soundEnabled) return;

    try {
      if (type === 'click' && clickSoundRef.current) {
        await clickSoundRef.current.replayAsync().catch(() => {});
      } else if (type === 'timer' && timerSoundRef.current) {
        await timerSoundRef.current.replayAsync().catch(() => {});
      }
    } catch (e) {
      // Catch any unexpected sound trigger crashes
    }
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  return (
    <SoundContext.Provider
      value={{
        playSound,
        isSoundEnabled: soundEnabled,
        toggleSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useNMixSound() {
  return useContext(SoundContext);
}
