import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface SoundSettingsState {
  isMuted: boolean;
  volume: number;
  setMuted: (value: boolean) => void;
  setVolume: (value: number) => void;
}

const SoundSettingsContext = createContext<SoundSettingsState | undefined>(undefined);

export const SoundSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.35);

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const storedMuted = await AsyncStorage.getItem('mobility.sound.muted');
        const storedVolume = await AsyncStorage.getItem('mobility.sound.volume');
        if (storedMuted !== null) {
          setIsMuted(storedMuted === 'true');
        }
        if (storedVolume !== null) {
          const parsed = Number(storedVolume);
          if (!Number.isNaN(parsed)) {
            setVolume(parsed);
          }
        }
      } catch {
        // ignore persistence failures
      }
    };
    loadPrefs();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('mobility.sound.muted', String(isMuted));
  }, [isMuted]);

  useEffect(() => {
    AsyncStorage.setItem('mobility.sound.volume', String(volume));
  }, [volume]);

  const value = useMemo(
    () => ({
      isMuted,
      volume,
      setMuted: setIsMuted,
      setVolume,
    }),
    [isMuted, volume]
  );

  return <SoundSettingsContext.Provider value={value}>{children}</SoundSettingsContext.Provider>;
};

export const useSoundSettings = (): SoundSettingsState => {
  const context = useContext(SoundSettingsContext);
  if (!context) {
    throw new Error('useSoundSettings must be used within SoundSettingsProvider');
  }
  return context;
};
