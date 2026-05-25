"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type PhotoGridProps = {
  photos: string[];
  friendName: string;
};

const rotations = [-4, 3, -2, 5, -1, 2];
const offsets = [0, 16, -8, 20, -4, 12];
const stickerEmojis = ["✨", "🌸", "📌", "🍒", "🧸", "💌"];

export function PhotoGrid({ photos, friendName }: PhotoGridProps) {
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {photos.map((photo, index) => {
        const rotation = rotations[index % rotations.length];
        const offset = offsets[index % offsets.length];
        const style = {
          "--rotation": `${rotation}deg`,
          "--offset": `${offset}px`,
        } as CSSProperties;

        const sticker = stickerEmojis[index % stickerEmojis.length];

        return (
          <motion.figure
            key={`${photo}-${index}`}
            className="polaroid-card group mb-6 break-inside-avoid"
            style={style}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
          >
            <span className="polaroid-tape" aria-hidden="true" />
            <span className="polaroid-sticker" aria-hidden="true">
              {sticker}
            </span>
            <div className="overflow-hidden rounded-xl">
              <Image
                src={photo}
                alt={`${friendName} memory ${index + 1}`}
                width={640}
                height={480}
                className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <figcaption className="polaroid-caption font-title">
              Memory {index + 1}
            </figcaption>
          </motion.figure>
        );
      })}
    </div>
  );
}
