"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type GlobalAudioContextValue = {
  start: () => void;
  stop: () => void;
  isPlaying: boolean;
};

const GlobalAudioContext = createContext<GlobalAudioContextValue | null>(null);

type GlobalAudioProviderProps = {
  src: string;
  children: React.ReactNode;
  autoStart?: boolean;
};

export function GlobalAudioProvider({
  src,
  children,
  autoStart = true,
}: GlobalAudioProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const targetVolume = 0.35;
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const clearFade = useCallback(() => {
    if (fadeTimerRef.current) {
      window.clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  const fadeIn = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    clearFade();
    audio.volume = 0;
    fadeTimerRef.current = window.setInterval(() => {
      if (!audioRef.current) {
        return;
      }
      const nextVolume = Math.min(
        targetVolume,
        audioRef.current.volume + 0.04
      );
      audioRef.current.volume = nextVolume;
      if (nextVolume >= targetVolume) {
        clearFade();
      }
    }, 120);
  }, [clearFade, targetVolume]);

  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (hasStarted && !audio.paused) {
      return;
    }
    const playPromise = audio.play();
    if (playPromise) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
          fadeIn();
        })
        .catch(() => {
          setIsPlaying(false);
        });
      return;
    }
    setIsPlaying(true);
    setHasStarted(true);
    fadeIn();
  }, [fadeIn, hasStarted]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    clearFade();
    audio.pause();
    setIsPlaying(false);
  }, [clearFade]);

  useEffect(() => {
    if (!autoStart) {
      return;
    }
    const handleStart = () => start();
    window.addEventListener("pointerdown", handleStart, { once: true });
    window.addEventListener("keydown", handleStart, { once: true });
    return () => {
      window.removeEventListener("pointerdown", handleStart);
      window.removeEventListener("keydown", handleStart);
    };
  }, [autoStart, start]);

  return (
    <GlobalAudioContext.Provider value={{ start, stop, isPlaying }}>
      {children}
      <audio ref={audioRef} src={src} preload="auto" loop />
    </GlobalAudioContext.Provider>
  );
}

export function useGlobalAudio() {
  const context = useContext(GlobalAudioContext);
  if (!context) {
    throw new Error("useGlobalAudio must be used within GlobalAudioProvider");
  }
  return context;
}
