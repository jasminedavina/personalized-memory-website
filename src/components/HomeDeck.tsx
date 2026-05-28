"use client";

import Link from "next/link";

import { SlideDeck } from "@/components/SlideDeck";
import type { SlideDefinition } from "@/components/SlideDeck";
import { TypewriterLetter } from "@/components/TypewriterLetter";
import type { FriendData } from "@/data/friends";

type HomeDeckProps = {
  friends: FriendData[];
};

export function HomeDeck({ friends }: HomeDeckProps) {
  const friendsBySlug = friends.reduce<Record<string, FriendData>>(
    (acc, friend) => {
      acc[friend.slug] = friend;
      return acc;
    },
    {}
  );

  const choiceRows: Array<Array<string>> = [
    ["angie", "hillary"],
    ["gaby", "valerie", "arman"],
    ["nadya", "cleo", "jesslyne"],
    ["charlene", "une", "me"],
  ];

  const slides: SlideDefinition[] = [
    {
      id: "cover",
      transition: "bouquet-bloom",
      render: () => (
        <div className="home-fullscreen home-cover-bg">
          <div className="home-frame">
            <div className="home-image-wrap">
              <img
                src="/photos/main page.png"
                alt=""
                className="home-image"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "friends",
      transition: "paper-swipe",
      render: () => (
        <div
          className="home-fullscreen home-choice-bg"
          data-slide-interactive="true"
        >
          <div className="home-frame">
            <div className="home-image-wrap">
              <img
                src="/photos/choice.png"
                alt=""
                className="home-image"
                aria-hidden="true"
              />
              <div className="choice-typing text-center">
                <div className="font-letter text-sm text-foreground sm:text-base">
                  <TypewriterLetter
                    lines={["click your picture to open 💛"]}
                  />
                </div>
              </div>
              <div className="choice-click-map" data-slide-interactive="true">
                <div className="choice-row choice-row-spacer" />
                {choiceRows.map((row, rowIndex) => (
                  <div
                    key={`row-${rowIndex}`}
                    className={`choice-row ${
                      rowIndex === 0 ? "choice-row-two" : "choice-row-three"
                    }`}
                  >
                    {row.map((slug) => {
                      if (slug === "me" || !friendsBySlug[slug]) {
                        return (
                          <span
                            key={`placeholder-${slug}`}
                            className="choice-cell placeholder"
                            aria-hidden="true"
                          />
                        );
                      }
                      const friend = friendsBySlug[slug];
                      return (
                        <Link
                          key={friend.slug}
                          href={`/${friend.slug}`}
                          className="choice-cell"
                          aria-label={`Open ${friend.name}'s scrapbook`}
                          data-slide-interactive="true"
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="ambient-bg relative flex min-h-screen flex-col bg-background text-foreground">
      <SlideDeck
        slides={slides}
      />
    </div>
  );
}
