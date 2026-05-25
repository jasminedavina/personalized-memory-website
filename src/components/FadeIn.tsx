"use client";

import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

type FadeInProps = PropsWithChildren<{
  delay?: number;
}>;

export function FadeIn({ children, delay = 0 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}
