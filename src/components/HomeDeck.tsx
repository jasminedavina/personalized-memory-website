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
  const topRow = friends.slice(0, 2);
  const rest = friends.slice(2);
  const rows: FriendData[][] = [];
  for (let i = 0; i < rest.length; i += 3) {
    rows.push(rest.slice(i, i + 3));
  }

  const slides: SlideDefinition[] = [
    {
      id: "cover",
      transition: "bouquet-bloom",
      render: () => <div className="home-fullscreen home-cover-bg" />,
    },
    {
      id: "friends",
      transition: "paper-swipe",
      render: () => (
        <div
          className="home-fullscreen home-choice-bg"
          data-slide-interactive="true"
        >
          <div className="choice-typing text-center">
            <div className="font-letter text-sm text-foreground sm:text-base">
              <TypewriterLetter
                lines={["click your picture to open your scrapbook 💛"]}
              />
            </div>
          </div>
          <div className="choice-click-map" data-slide-interactive="true">
            <div className="choice-row choice-row-two">
              {topRow.map((friend) => (
                <Link
                  key={friend.slug}
                  href={`/${friend.slug}`}
                  className="choice-cell"
                  aria-label={`Open ${friend.name}'s scrapbook`}
                  data-slide-interactive="true"
                />
              ))}
            </div>
            {rows.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="choice-row choice-row-three">
                {row.map((friend) => (
                  <Link
                    key={friend.slug}
                    href={`/${friend.slug}`}
                    className="choice-cell"
                    aria-label={`Open ${friend.name}'s scrapbook`}
                    data-slide-interactive="true"
                  />
                ))}
              </div>
            ))}
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
