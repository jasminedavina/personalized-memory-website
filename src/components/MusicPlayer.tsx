"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type MusicPlayerHandle = {
  start: () => void;
  pause: () => void;
};

type MusicPlayerProps = {
  src: string;
  title?: string;
  autoPlay?: boolean;
  variant?: "panel" | "floating";
  className?: string;
  onPlayingChange?: (isPlaying: boolean) => void;
  showControls?: boolean;
};

export const MusicPlayer = forwardRef<MusicPlayerHandle, MusicPlayerProps>(
  function MusicPlayer(
    {
      src,
      title = "Background music",
      autoPlay = false,
      variant = "panel",
      className,
      onPlayingChange,
      showControls = true,
    },
    ref
  ) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayError, setAutoPlayError] = useState("");

  const updatePlaying = useCallback(
    (next: boolean) => {
      setIsPlaying(next);
      onPlayingChange?.(next);
    },
    [onPlayingChange]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handleEnded = () => updatePlaying(false);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [updatePlaying]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) {
        window.clearInterval(fadeTimerRef.current);
      }
    };
  }, []);

  const fadeIn = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (fadeTimerRef.current) {
      window.clearInterval(fadeTimerRef.current);
    }

    audio.volume = 0;
    fadeTimerRef.current = window.setInterval(() => {
      if (!audioRef.current) {
        return;
      }
      const nextVolume = Math.min(1, audioRef.current.volume + 0.08);
      audioRef.current.volume = nextVolume;
      if (nextVolume >= 1 && fadeTimerRef.current) {
        window.clearInterval(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }
    }, 120);
  }, []);

  const startPlayback = useCallback(
    (source: "auto" | "user") => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const playPromise = audio.play();
    if (playPromise) {
      playPromise
        .then(() => {
          updatePlaying(true);
          setAutoPlayError("");
          fadeIn();
        })
        .catch(() => {
          if (source === "auto") {
            setAutoPlayError("Tap play to start the music.");
            return;
          }
          setAutoPlayError("Unable to play audio right now.");
          updatePlaying(false);
        });
      return;
    }

    updatePlaying(true);
    setAutoPlayError("");
    fadeIn();
    },
    [fadeIn, updatePlaying]
  );

  const pausePlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (fadeTimerRef.current) {
    window.clearInterval(fadeTimerRef.current);
    fadeTimerRef.current = null;
    }
    audio.pause();
    updatePlaying(false);
  }, [updatePlaying]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) {
    return;
    }

    if (audio.paused) {
      startPlayback("user");
      return;
    }

    pausePlayback();
  };

  useEffect(() => {
    if (!autoPlay) {
      return;
    }

    startPlayback("auto");
  }, [autoPlay, startPlayback]);

  useImperativeHandle(
    ref,
    () => ({
      start: () => startPlayback("user"),
      pause: pausePlayback,
    }),
    [pausePlayback, startPlayback]
  );

  const isFloating = variant === "floating";

  return (
    <div
      className={`music-player ${isPlaying ? "is-playing" : ""} ${
        isFloating ? "is-floating" : ""
      } ${showControls ? "" : "no-controls"} ${className ?? ""}`}
    >
      <div className="music-header">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">{title}</p>
        {!isFloating ? (
          <p className="text-sm text-muted">Turn on your sound.</p>
        ) : null}
      </div>
      <div className="music-controls">
        <div className="flex items-center gap-3">
          <div className="music-bars" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <p className="text-sm font-semibold text-foreground">
            {isPlaying ? "Now playing" : "Ready to play"}
          </p>
        </div>
        {showControls ? (
          <button
            type="button"
            onClick={togglePlayback}
            className="music-toggle"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        ) : null}
      </div>
      <div className="cassette">
        <div className="cassette-reel" />
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          Side A · Memories
        </p>
        <div className="cassette-reel" />
      </div>
      {showControls && autoPlayError ? (
        <p className="text-xs text-muted">{autoPlayError}</p>
      ) : null}
      <audio ref={audioRef} src={src} preload="none" loop />
    </div>
  );
}
);
