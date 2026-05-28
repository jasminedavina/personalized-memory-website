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
          audio.muted = false;
          setIsPlaying(true);
          setHasStarted(true);
          fadeIn();
        })
        .catch(() => {
          audio.muted = true;
          audio.volume = 0;
          const mutedPlayPromise = audio.play();
          if (mutedPlayPromise) {
            mutedPlayPromise
              .then(() => {
                audio.muted = false;
                setIsPlaying(true);
                setHasStarted(true);
                fadeIn();
              })
              .catch(() => {
                setIsPlaying(false);
              });
            return;
          }
          setIsPlaying(false);
        });
      return;
    }
    setIsPlaying(true);
    setHasStarted(true);
    fadeIn();
  }, [fadeIn, hasStarted]);

  // On mount, create or reuse a single global audio element so playback survives route changes
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    let audio: HTMLAudioElement | null = null;

    if (win.__GLOBAL_AUDIO_ELEMENT) {
      audio = win.__GLOBAL_AUDIO_ELEMENT as HTMLAudioElement;
      // update src if different
      try {
        const currentSrc = new URL(audio.src).pathname;
        if (currentSrc !== src) {
          audio.src = src;
        }
      } catch (e) {
        audio.src = src;
      }
    } else {
      audio = document.createElement("audio");
      audio.src = src;
      audio.preload = "auto";
      audio.loop = true;
      // make it non-displayed and lightweight
      audio.style.display = "none";
      document.body.appendChild(audio);
      win.__GLOBAL_AUDIO_ELEMENT = audio;
    }

    audioRef.current = audio;

    return () => {
      // Intentionally do not remove the global audio element on unmount so it persists
    };
  }, [src]);

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
    // Try to start immediately on mount. Browsers may block autoplay if no user gesture;
    // in that case, fall back to starting on the first pointerdown/keydown.
    start();
    const handleStart = () => start();
    window.addEventListener("pointerdown", handleStart, { once: true });
    window.addEventListener("keydown", handleStart, { once: true });
    return () => {
      window.removeEventListener("pointerdown", handleStart);
      window.removeEventListener("keydown", handleStart);
    };
  }, [autoStart, start]);

  // No JSX audio element: create/reuse a single global <audio> element so it persists
  return (
    <GlobalAudioContext.Provider value={{ start, stop, isPlaying }}>
      {children}
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
