"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import type { FriendTimelineItem, FriendWrappedStat } from "@/data/friends";

type TimelineProps = {
  items: FriendTimelineItem[];
  wrapped?: FriendWrappedStat[];
  friendName: string;
  photos: string[];
};

const rotations = [-3, 2, -2, 4, -1, 3, -4, 1];
const offsets = [0, 14, -6, 18, -4, 12, -8, 10];
const emojiFallback = ["🌸", "✨", "🎀", "☕", "📸", "🫶", "🌟", "🍪"];

function getDefaultWrapped(
  items: FriendTimelineItem[],
  friendName: string
): FriendWrappedStat[] {
  const first = items[0];
  const last = items[items.length - 1];
  const second = items[1];
  const third = items[2];

  const yearRange =
    first && last ? `${first.year} → ${last.year}` : "Our campus era";

  return [
    {
      title: "Friendship Era",
      value: yearRange,
      emoji: "📚",
    },
    {
      title: "Best Memory",
      value: second?.text ?? first?.text ?? "Late-night talks and laughter",
      emoji: "🌙",
    },
    {
      title: "Top Activity",
      value: third?.text ?? "Cafe hopping ☕",
      emoji: "☕",
    },
    {
      title: "Most Used Phrase",
      value: "let’s do it tomorrow",
      emoji: "💬",
    },
    {
      title: "Chaos Level",
      value: `${82 + (friendName.length % 12)}%`,
      emoji: "🔥",
    },
    {
      title: "Inside Joke",
      value: `The “${friendName}” whisper`,
      emoji: "🤍",
    },
  ];
}

export function Timeline({ items, wrapped, friendName, photos }: TimelineProps) {
  const stats = useMemo(() => {
    if (wrapped && wrapped.length > 0) {
      return wrapped;
    }
    return getDefaultWrapped(items, friendName);
  }, [items, wrapped, friendName]);

  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  const handleShuffle = () => {
    if (stats.length === 0) {
      return;
    }
    const nextIndex = Math.floor(Math.random() * stats.length);
    setHighlightIndex(nextIndex);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          A scrapbook-style recap of the moments that made us.
        </p>
        <button
          type="button"
          onClick={handleShuffle}
          className="rounded-full border border-foreground/10 bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition hover:opacity-90"
        >
          Random memory shuffle
        </button>
      </div>

      <motion.div
        className="wrapped-track"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.12 },
          },
        }}
      >
        {stats.map((stat, index) => {
          const rotation = rotations[index % rotations.length];
          const offset = offsets[index % offsets.length];
          const sticker = stat.emoji ?? emojiFallback[index % emojiFallback.length];
          const photo = photos.length > 0 ? photos[index % photos.length] : null;
          const style = {
            marginTop: `${offset}px`,
          } as CSSProperties;

          return (
            <motion.article
              key={`${stat.title}-${index}`}
              className={`wrapped-card ${
                highlightIndex === index ? "is-highlighted" : ""
              }`}
              style={style}
              variants={{
                hidden: { opacity: 0, y: 26 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <motion.div
                className={`wrapped-card-inner ${photo ? "has-photo" : ""}`}
                style={{ rotate: rotation }}
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 6 + index * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{ scale: 1.04, rotate: rotation + 1 }}
                whileTap={{ scale: 1.02 }}
              >
                <span className="wrapped-tape" aria-hidden="true" />
                <span className="wrapped-sticker" aria-hidden="true">
                  {sticker}
                </span>
                {photo ? (
                  <div className="wrapped-photo" aria-hidden="true">
                    <span className="wrapped-photo-tape" />
                    <Image
                      src={photo}
                      alt=""
                      width={180}
                      height={180}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <p className="wrapped-title">{stat.title}</p>
                <p className="wrapped-value">{stat.value}</p>
              </motion.div>
            </motion.article>
          );
        })}
      </motion.div>
    </div>
  );
}
