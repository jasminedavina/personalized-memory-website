"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { EnvelopeIntro } from "@/components/EnvelopeIntro";
import { FloatingStickers } from "@/components/FloatingStickers";
import { MusicPlayer } from "@/components/MusicPlayer";
import type { MusicPlayerHandle } from "@/components/MusicPlayer";
import { PasscodeGate } from "@/components/PasscodeGate";
import { PhotoGrid } from "@/components/PhotoGrid";
import { SlideDeck } from "@/components/SlideDeck";
import type { SlideDefinition } from "@/components/SlideDeck";
import { Timeline } from "@/components/Timeline";
import { TypewriterLetter } from "@/components/TypewriterLetter";
import type { FriendData } from "@/data/friends";

type FriendExperienceProps = {
  friend: FriendData;
};

type OpenWhenNote = {
  title: string;
  message: string;
  icon: string;
};

function buildOpenWhenNotes(friend: FriendData): OpenWhenNote[] {
  const firstMemory = friend.timeline[0]?.text ?? "the day we met";
  const latestMemory =
    friend.timeline[friend.timeline.length - 1]?.text ?? "our last adventure";
  return [
    {
      title: "Open when you need a cheerleader",
      message: `I believe in you, ${friend.name}. You’ve already done so much, and there’s more to celebrate.`,
      icon: "🎀",
    },
    {
      title: "Open when you miss campus days",
      message: `Remember ${firstMemory}. That memory is still ours.`,
      icon: "📚",
    },
    {
      title: "Open when you need a warm hug",
      message: `Picture me sending you the biggest bouquet of hugs and pastel flowers.`,
      icon: "🌸",
    },
    {
      title: "Open when you want a new memory",
      message: `Let’s plan our next adventure after ${latestMemory}.`,
      icon: "✨",
    },
  ];
}

export function FriendExperience({ friend }: FriendExperienceProps) {
  const router = useRouter();
  const musicRef = useRef<MusicPlayerHandle>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicRequested, setMusicRequested] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [openNoteIndex, setOpenNoteIndex] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const openWhenNotes = useMemo(() => buildOpenWhenNotes(friend), [friend]);

  const startMusic = () => {
    if (!musicRequested) {
      setMusicRequested(true);
    }
    musicRef.current?.start();
  };

  const handleCloseScrapbook = () => {
    if (isClosing) {
      return;
    }
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      router.push("/");
    }, 1200);
  };

  const musicSlides: SlideDefinition[] = friend.music
    ? [
        {
          id: "soundtrack",
          transition: "bouquet-bloom",
          render: () => (
            <div className="scrapbook-page">
              <span className="tape tape-left" aria-hidden="true" />
              <span className="tape tape-right" aria-hidden="true" />
              <div className="space-y-6">
                <div className="space-y-2 text-left">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">
                    Soundtrack
                  </p>
                  <h2 className="font-title text-3xl font-semibold">
                    The music that plays with our memories
                  </h2>
                </div>
                <div className="soundtrack-card" data-slide-interactive="true">
                  <div className="space-y-2">
                    <p className="text-sm text-muted">
                      {musicPlaying
                        ? "Now playing across every slide."
                        : "Tap play to keep the soundtrack going."}
                    </p>
                    <button
                      type="button"
                      className="ribbon-button"
                      onClick={() =>
                        musicPlaying
                          ? musicRef.current?.pause()
                          : musicRef.current?.start()
                      }
                    >
                      {musicPlaying ? "Pause soundtrack" : "Play soundtrack"}
                    </button>
                  </div>
                  <div className="soundtrack-hint">
                    The cassette player floats with you as you flip pages.
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ]
    : [];

  const slides: SlideDefinition[] = [
    {
      id: "intro",
      transition: "paper-swipe",
      render: ({ goNext }) => (
        <div className="scrapbook-page scrapbook-hero">
          <span className="tape tape-left" aria-hidden="true" />
          <span className="tape tape-right" aria-hidden="true" />
          <div className="space-y-5 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-muted">
              For {friend.name}
            </p>
            <h1 className="font-title text-4xl font-semibold sm:text-5xl">
              Congratulations, {friend.name}!
            </h1>
            <p className="text-base text-muted sm:text-lg">
              A handmade graduation scrapbook, animated just for you.
            </p>
            <button
              type="button"
              onClick={goNext}
              className="sticker-button"
              data-slide-interactive="true"
            >
              Start the story →
            </button>
            <p className="text-xs text-muted">Tap anywhere to turn the page.</p>
          </div>
          <div className="flower-spray" aria-hidden="true">
            <span className="flower flower-1" />
            <span className="flower flower-2" />
            <span className="flower flower-3" />
            <span className="flower flower-4" />
          </div>
        </div>
      ),
    },
    {
      id: "letter",
      transition: "page-flip",
      render: () => (
        <div className="scrapbook-page">
          <span className="tape tape-left" aria-hidden="true" />
          <span className="tape tape-right" aria-hidden="true" />
          <div className="space-y-6">
            <div className="space-y-2 text-left">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                Opening letter
              </p>
              <h2 className="font-title text-3xl font-semibold">
                A letter for you
              </h2>
            </div>
            <div
              className="letter-card p-6 text-lg leading-relaxed sm:p-8"
              data-slide-interactive="true"
            >
              <div className="font-letter">
                <TypewriterLetter lines={friend.letter} />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "gallery",
      transition: "polaroid",
      render: () => (
        <div className="scrapbook-page">
          <span className="tape tape-left" aria-hidden="true" />
          <span className="tape tape-right" aria-hidden="true" />
          <div className="space-y-6">
            <div className="space-y-2 text-left">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                Photo memories
              </p>
              <h2 className="font-title text-3xl font-semibold">
                The memories we made
              </h2>
            </div>
            <div data-slide-interactive="true">
              <PhotoGrid photos={friend.photos} friendName={friend.name} />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "wrapped",
      transition: "sticker-pop",
      render: () => (
        <div className="scrapbook-page">
          <span className="tape tape-left" aria-hidden="true" />
          <span className="tape tape-right" aria-hidden="true" />
          <div className="space-y-6">
            <div className="space-y-2 text-left">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                Friendship wrapped
              </p>
              <h2 className="font-title text-3xl font-semibold">
                Our year in playful stats
              </h2>
            </div>
            <div data-slide-interactive="true">
              <Timeline
                items={friend.timeline}
                wrapped={friend.wrapped}
                friendName={friend.name}
                photos={friend.photos}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "open-when",
      transition: "paper-swipe",
      render: () => (
        <div className="scrapbook-page">
          <span className="tape tape-left" aria-hidden="true" />
          <span className="tape tape-right" aria-hidden="true" />
          <div className="space-y-6">
            <div className="space-y-2 text-left">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                Open when
              </p>
              <h2 className="font-title text-3xl font-semibold">
                Mini envelopes with soft reminders
              </h2>
            </div>
            <div
              className="open-when-grid"
              data-slide-interactive="true"
            >
              {openWhenNotes.map((note, index) => {
                const isOpen = openNoteIndex === index;
                return (
                  <button
                    key={note.title}
                    type="button"
                    className={`open-when-card ${isOpen ? "is-open" : ""}`}
                    onClick={() =>
                      setOpenNoteIndex(isOpen ? null : index)
                    }
                  >
                    <span className="open-when-icon" aria-hidden="true">
                      {note.icon}
                    </span>
                    <span className="open-when-title">{note.title}</span>
                    <span className="open-when-message">
                      {isOpen ? note.message : "Tap to open this note."}
                    </span>
                    <span className="open-when-seal" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ),
    },
    ...musicSlides,
    {
      id: "bouquet",
      transition: "bouquet-bloom",
      render: () => (
        <div className="scrapbook-page bouquet-scene">
          <div className="space-y-5 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Graduation bouquet
            </p>
            <h2 className="font-title text-3xl font-semibold sm:text-4xl">
              A bouquet just for you
            </h2>
            <p className="text-base text-muted">
              May your next chapter bloom with joy, courage, and pastel
              sunshine.
            </p>
          </div>
          <div className="bouquet" aria-hidden="true">
            <span className="bouquet-flower flower-a" />
            <span className="bouquet-flower flower-b" />
            <span className="bouquet-flower flower-c" />
            <span className="bouquet-flower flower-d" />
            <span className="bouquet-ribbon" />
          </div>
        </div>
      ),
    },
    {
      id: "goodbye",
      transition: "page-flip",
      render: () => (
        <div className="scrapbook-page final-scene">
          <div className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Final goodbye
            </p>
            <p className="font-title text-3xl font-semibold sm:text-4xl">
              {friend.farewell}
            </p>
            <p className="text-sm text-muted">
              Thank you for being part of my story, {friend.name}.
            </p>
            <button
              type="button"
              className="ribbon-button"
              onClick={handleCloseScrapbook}
              data-slide-interactive="true"
            >
              Close scrapbook
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen">
      <PasscodeGate
        passcode={friend.passcode}
        friendName={friend.name}
        onUnlock={startMusic}
      >
        <div className="scrapbook-stage">
          <FloatingStickers />
          {friend.music ? (
            <div className="music-dock" data-slide-interactive="true">
              <MusicPlayer
                ref={musicRef}
                src={friend.music}
                title="Soundtrack"
                autoPlay={musicRequested}
                variant="floating"
                onPlayingChange={setMusicPlaying}
              />
            </div>
          ) : null}
          <EnvelopeIntro friendName={friend.name} onOpen={startMusic}>
            <SlideDeck
              slides={slides}
              renderNavigation={({ goNext, goPrev, isFirst, isLast, index, total }) => (
                <div className="scrapbook-nav floating" data-slide-interactive="true">
                  {!isFirst ? (
                    <button type="button" className="corner-peel left" onClick={goPrev}>
                      ←
                    </button>
                  ) : (
                    <span />
                  )}
                  <span className="page-indicator">
                    {index + 1} / {total}
                  </span>
                  {!isLast ? (
                    <button type="button" className="corner-peel" onClick={goNext}>
                      Turn page →
                    </button>
                  ) : (
                    <span />
                  )}
                </div>
              )}
            />
          </EnvelopeIntro>
          <AnimatePresence>
            {isClosing ? (
              <motion.div
                className="scrapbook-close-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                aria-hidden="true"
              >
                <motion.div
                  className="scrapbook-close-panel"
                  initial={{ scale: 0.8, rotate: -2 }}
                  animate={{ scale: 1.02, rotate: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </PasscodeGate>
    </div>
  );
}
