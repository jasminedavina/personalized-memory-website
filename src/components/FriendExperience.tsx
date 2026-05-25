"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { EnvelopeIntro } from "@/components/EnvelopeIntro";
import { FloatingStickers } from "@/components/FloatingStickers";
import { MusicPlayer } from "@/components/MusicPlayer";
import type { MusicPlayerHandle } from "@/components/MusicPlayer";
import { PasscodeGate } from "@/components/PasscodeGate";
import { PhotoGrid } from "@/components/PhotoGrid";
import { ScrapbookSection } from "@/components/ScrapbookSection";
import { Timeline } from "@/components/Timeline";
import { TypewriterLetter } from "@/components/TypewriterLetter";
import type { FriendData } from "@/data/friends";

type FriendExperienceProps = {
  friend: FriendData;
};

export function FriendExperience({ friend }: FriendExperienceProps) {
  const router = useRouter();
  const musicRef = useRef<MusicPlayerHandle>(null);
  const closeTimerRef = useRef<number | null>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [musicRequested, setMusicRequested] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

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
    musicRef.current?.pause();
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      router.push("/");
    }, 1200);
  };

  const handleEnvelopeContinue = () => {
    setScrollEnabled(true);
    window.setTimeout(() => {
      photosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  return (
    <div className="relative min-h-screen">
      <PasscodeGate
        passcode={friend.passcode}
        friendName={friend.name}
        passcodeBackground={friend.passcodeBackground}
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
                showControls={false}
              />
            </div>
          ) : null}
          <div className={`scrapbook-scroll ${scrollEnabled ? "is-enabled" : "is-locked"}`}>
            <section className="snap-section envelope-snap">
              <EnvelopeIntro
                friendName={friend.name}
                onOpen={startMusic}
                onContinue={handleEnvelopeContinue}
              />
            </section>

            <ScrapbookSection id="photos" className="snap-section">
              <div ref={photosRef} className="space-y-6">
                <div className="space-y-2 text-left">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">
                    Photo memories
                  </p>
                  <h2 className="font-title text-3xl font-semibold">
                    The memories we made
                  </h2>
                </div>
                <PhotoGrid photos={friend.photos} friendName={friend.name} />
              </div>
            </ScrapbookSection>

            <ScrapbookSection className="snap-section">
              <div className="space-y-6">
                <div className="space-y-2 text-left">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">
                    Main letter
                  </p>
                  <h2 className="font-title text-3xl font-semibold">
                    A letter for you
                  </h2>
                </div>
                <div className="letter-card p-6 text-lg leading-relaxed sm:p-8">
                  <div className="font-letter">
                    <TypewriterLetter lines={friend.letter} />
                  </div>
                </div>
              </div>
            </ScrapbookSection>

            <ScrapbookSection className="snap-section">
              <div className="space-y-6">
                <div className="space-y-2 text-left">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">
                    Friendship wrapped
                  </p>
                  <h2 className="font-title text-3xl font-semibold">
                    Our year in playful stats
                  </h2>
                </div>
                <Timeline
                  items={friend.timeline}
                  wrapped={friend.wrapped}
                  friendName={friend.name}
                  photos={friend.photos}
                />
              </div>
            </ScrapbookSection>

            <ScrapbookSection className="snap-section">
              <div className="space-y-6 text-center">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">
                    Thanks & goodbye
                  </p>
                  <p className="font-title text-3xl font-semibold sm:text-4xl">
                    {friend.farewell}
                  </p>
                  <p className="text-sm text-muted">
                    Thank you for being part of my story, {friend.name}.
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
            </ScrapbookSection>

            <ScrapbookSection className="snap-section">
              <div className="space-y-4 text-center">
                <button
                  type="button"
                  className="ribbon-button"
                  onClick={handleCloseScrapbook}
                >
                  Return to scrapbook home
                </button>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">
                  Close scrapbook
                </p>
              </div>
            </ScrapbookSection>
          </div>
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
