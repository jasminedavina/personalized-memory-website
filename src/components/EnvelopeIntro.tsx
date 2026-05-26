"use client";

import { useEffect, useState } from "react";

type EnvelopeIntroProps = {
  friendName: string;
  previewLines?: [string, string, string];
  children?: React.ReactNode;
  onOpen?: () => void;
  onContinue?: () => void;
};

export function EnvelopeIntro({
  friendName,
  previewLines = [
    "A letter is waiting for you",
    "Open it to continue",
    "With love and gratitude",
  ],
  children,
  onOpen,
  onContinue,
}: EnvelopeIntroProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowContinue(true);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  if (showContent && children) {
    return <>{children}</>;
  }

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      onOpen?.();
    }
  };

  const handleContinue = () => {
    setShowContent(true);
    onContinue?.();
  };

  return (
    <section className="envelope-stage">
      <div className={`scrapbook-cover ${isOpen ? "open" : ""}`}>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          Memory scrapbook
        </p>
        <p className="font-title text-2xl text-foreground">A little book of us</p>
        <p className="text-sm text-muted">Tap to open the first page.</p>
      </div>
      <div
        className={`envelope ${isOpen ? "open" : "close"}`}
        onClick={() => {
          if (showContinue) {
            handleContinue();
            return;
          }
          handleOpen();
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            if (showContinue) {
              handleContinue();
              return;
            }
            handleOpen();
          }
        }}
        aria-label="Open the envelope"
      >
        <div className="front flap"></div>
        <div className="front pocket"></div>
        <div className="letter">
          <div className="letter-line line1">To: {friendName}</div>
          <div className="letter-line line2">{previewLines[0]}</div>
          <div className="letter-line line3">{previewLines[1]}</div>
          <div className="letter-line line4">{previewLines[2]}</div>
        </div>
        <div className="hearts">
          <div className="heart a1"></div>
          <div className="heart a2"></div>
          <div className="heart a3"></div>
        </div>
      </div>

      <div className="envelope-actions">
        <button
          type="button"
          onClick={() => {
            if (!isOpen) {
              handleOpen();
              return;
            }

            if (showContinue) {
              handleContinue();
            }
          }}
          className="theme-button rounded-full px-6 py-2 text-sm font-semibold transition hover:opacity-90 disabled:cursor-default disabled:opacity-60"
          disabled={isOpen && !showContinue}
        >
          {isOpen ? (showContinue ? "Tap to continue" : "Opening...") : "Open letter"}
        </button>
        <p className="envelope-hint">
          {showContinue
            ? "Tap to continue to the full letter."
            : "Tap the envelope or the button to open it."}
        </p>
      </div>
    </section>
  );
}
