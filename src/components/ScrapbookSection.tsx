"use client";

import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

type ScrapbookSectionProps = PropsWithChildren<{
  id?: string;
  className?: string;
  delay?: number;
}>;

export function ScrapbookSection({
  id,
  className,
  delay = 0,
  children,
}: ScrapbookSectionProps) {
  return (
    <motion.section
      id={id}
      className={`scrapbook-section ${className ?? ""}`}
      initial={{ opacity: 0, y: 36, rotateZ: -0.6, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, rotateZ: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
      style={{ transformOrigin: "left center" }}
    >
      <div className="scrapbook-stack">
        <div className="scrapbook-sheet sheet-1" aria-hidden="true" />
        <div className="scrapbook-sheet sheet-2" aria-hidden="true" />
        <div className="scrapbook-page">
          {children}
        </div>
      </div>
    </motion.section>
  );
}
