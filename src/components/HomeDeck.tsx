"use client";

import Link from "next/link";

import { FloatingStickers } from "@/components/FloatingStickers";
import { SlideDeck } from "@/components/SlideDeck";
import type { SlideDefinition } from "@/components/SlideDeck";
import type { FriendData } from "@/data/friends";

type HomeDeckProps = {
  friends: FriendData[];
};

export function HomeDeck({ friends }: HomeDeckProps) {
  const slides: SlideDefinition[] = [
    {
      id: "cover",
      transition: "bouquet-bloom",
      render: ({ goNext }) => (
        <div className="scrapbook-page scrapbook-cover-page">
          <span className="tape tape-left" aria-hidden="true" />
          <span className="tape tape-right" aria-hidden="true" />
          <div className="space-y-6 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-muted">
              Graduation scrapbook
            </p>
            <h1 className="font-title text-4xl font-semibold sm:text-5xl">
              A cinematic scrapbook made for the people I love.
            </h1>
            <p className="text-base text-muted sm:text-lg">
              Tap through each page to unlock letters, photos, and surprise
              moments.
            </p>
            <button
              type="button"
              onClick={goNext}
              className="sticker-button"
              data-slide-interactive="true"
            >
              Turn the first page →
            </button>
            <p className="text-xs text-muted">Tap anywhere to begin.</p>
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
      id: "friends",
      transition: "paper-swipe",
      render: () => (
        <div
          className="scrapbook-page scrapbook-selection"
          data-slide-interactive="true"
        >
          <div className="space-y-4 text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Choose a scrapbook
            </p>
            <h2 className="font-title text-3xl font-semibold sm:text-4xl">
              Pick a friend to open their gift.
            </h2>
            <p className="text-sm text-muted">
              Each polaroid hides a private letter, memory gallery, and
              graduation surprise.
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {friends.map((friend) => (
              <Link
                key={friend.slug}
                href={`/${friend.slug}`}
                className="friend-polaroid"
                data-slide-interactive="true"
              >
                <span className="polaroid-tape" aria-hidden="true" />
                <span className="polaroid-sticker" aria-hidden="true">
                  ✨
                </span>
                <div className="friend-polaroid-body">
                  <h3 className="font-title text-2xl font-semibold text-foreground">
                    {friend.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    Passcode protected · letter + gallery
                  </p>
                  <span className="friend-polaroid-cta">Open scrapbook</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="ambient-bg relative flex min-h-screen flex-col bg-background text-foreground">
      <FloatingStickers />
      <SlideDeck
        slides={slides}
        renderNavigation={({ index, total, goPrev, goNext, isFirst, isLast }) => (
          <div className="scrapbook-nav" data-slide-interactive="true">
            {!isFirst ? (
              <button type="button" className="paper-tab" onClick={goPrev}>
                ← Back to cover
              </button>
            ) : (
              <span />
            )}
            <span className="page-indicator">
              Page {index + 1} · {total}
            </span>
            {!isLast ? (
              <button type="button" className="paper-tab" onClick={goNext}>
                Turn page →
              </button>
            ) : (
              <span />
            )}
          </div>
        )}
      />
    </div>
  );
}
