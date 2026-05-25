"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { TargetAndTransition, Variants } from "framer-motion";
import type {
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  TouchEvent,
} from "react";
import { useCallback, useRef, useState } from "react";

export type SlideTransition =
  | "page-flip"
  | "paper-swipe"
  | "polaroid"
  | "bouquet-bloom"
  | "sticker-pop";

export type SlideRenderProps = {
  index: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  goNext: () => void;
  goPrev: () => void;
};

export type SlideDefinition = {
  id: string;
  transition?: SlideTransition;
  render: (controls: SlideRenderProps) => ReactNode;
};

type SlideDeckProps = {
  slides: SlideDefinition[];
  initialIndex?: number;
  className?: string;
  onSlideChange?: (index: number) => void;
  renderNavigation?: (controls: SlideRenderProps) => ReactNode;
};

const transitionCycle: SlideTransition[] = [
  "paper-swipe",
  "polaroid",
  "sticker-pop",
  "page-flip",
  "bouquet-bloom",
];

type TransitionVariant = {
  enter: TargetAndTransition;
  exit: TargetAndTransition;
};

const variantMap: Record<SlideTransition, (direction: number) => TransitionVariant> = {
  "paper-swipe": (direction) => ({
    enter: {
      x: direction > 0 ? 160 : -160,
      y: 18,
      opacity: 0,
      rotate: direction > 0 ? -3 : 3,
      filter: "blur(8px)",
    },
    exit: {
      x: direction > 0 ? -160 : 160,
      y: -18,
      opacity: 0,
      rotate: direction > 0 ? 2 : -2,
      filter: "blur(8px)",
    },
  }),
  polaroid: (direction) => ({
    enter: {
      y: direction > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.94,
      rotate: direction > 0 ? 6 : -6,
      filter: "blur(8px)",
    },
    exit: {
      y: direction > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.92,
      rotate: direction > 0 ? -4 : 4,
      filter: "blur(8px)",
    },
  }),
  "sticker-pop": (direction) => ({
    enter: {
      scale: 0.9,
      opacity: 0,
      rotate: direction > 0 ? -10 : 10,
      filter: "blur(6px)",
    },
    exit: {
      scale: 1.05,
      opacity: 0,
      rotate: direction > 0 ? 8 : -8,
      filter: "blur(6px)",
    },
  }),
  "page-flip": (direction) => ({
    enter: {
      opacity: 0,
      rotateY: direction > 0 ? -45 : 45,
      x: direction > 0 ? 120 : -120,
      scale: 0.96,
      filter: "blur(6px)",
    },
    exit: {
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45,
      x: direction > 0 ? -120 : 120,
      scale: 0.92,
      filter: "blur(6px)",
    },
  }),
  "bouquet-bloom": () => ({
    enter: {
      scale: 0.88,
      opacity: 0,
      filter: "blur(10px)",
    },
    exit: {
      scale: 1.08,
      opacity: 0,
      filter: "blur(10px)",
    },
  }),
};

const slideVariants: Variants = {
  enter: ({
    direction,
    transitionStyle,
  }: {
    direction: number;
    transitionStyle: SlideTransition;
  }) => {
    return variantMap[transitionStyle](direction).enter;
  },
  center: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    rotateY: 0,
    filter: "blur(0px)",
  },
  exit: ({
    direction,
    transitionStyle,
  }: {
    direction: number;
    transitionStyle: SlideTransition;
  }) => {
    return variantMap[transitionStyle](direction).exit;
  },
};

function SlideEffects({
  transitionStyle,
  slideKey,
}: {
  transitionStyle: SlideTransition;
  slideKey: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`effects-${slideKey}`}
        className={`slide-effects effect-${transitionStyle}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        aria-hidden="true"
      >
        <span className="effect-petal petal-1" />
        <span className="effect-petal petal-2" />
        <span className="effect-petal petal-3" />
        <span className="effect-confetti confetti-1" />
        <span className="effect-confetti confetti-2" />
        <span className="effect-sparkle sparkle-1" />
        <span className="effect-sparkle sparkle-2" />
      </motion.div>
    </AnimatePresence>
  );
}

export function SlideDeck({
  slides,
  initialIndex = 0,
  className,
  onSlideChange,
  renderNavigation,
}: SlideDeckProps) {
  const [currentSlide, setCurrentSlide] = useState(initialIndex);
  const [direction, setDirection] = useState(1);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const total = slides.length;
  const slide = slides[currentSlide];
  const transitionStyle =
    slide.transition ?? transitionCycle[currentSlide % transitionCycle.length];
  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= total) {
        return;
      }
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
      onSlideChange?.(index);
    },
    [currentSlide, onSlideChange, total]
  );

  const goNext = useCallback(() => {
    if (currentSlide >= total - 1) {
      return;
    }
    goTo(currentSlide + 1);
  }, [currentSlide, goTo, total]);

  const goPrev = useCallback(() => {
    if (currentSlide <= 0) {
      return;
    }
    goTo(currentSlide - 1);
  }, [currentSlide, goTo]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (
        target.closest("[data-slide-interactive='true']") ||
        target.closest("button, a, input, textarea, select, [role='button']")
      ) {
        return;
      }
      goNext();
    },
    [goNext]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        goNext();
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goPrev();
      }
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        goNext();
      }
    },
    [goNext, goPrev]
  );

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const touchStart = touchStartRef.current;
    if (!touchStart) {
      return;
    }
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }
    if (deltaX < 0) {
      goNext();
    } else {
      goPrev();
    }
  };

  const renderProps: SlideRenderProps = {
    goNext,
    goPrev,
    isFirst: currentSlide === 0,
    isLast: currentSlide === total - 1,
    index: currentSlide,
    total,
  };

  const slideStyle =
    transitionStyle === "page-flip"
      ? { transformStyle: "preserve-3d" as const, perspective: "1400px" }
      : undefined;

  return (
    <div
      className={`scrapbook-deck ${className ?? ""}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="group"
      aria-label="Scrapbook slide deck"
    >
      <SlideEffects
        transitionStyle={transitionStyle}
        slideKey={slide.id}
      />
      <AnimatePresence mode="wait" custom={{ direction, transitionStyle }}>
        <motion.div
          key={slide.id}
          className="scrapbook-slide"
          data-slide-id={slide.id}
          custom={{ direction, transitionStyle }}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={slideStyle}
        >
          <div className="scrapbook-slide-inner">
            {slide.render(renderProps)}
          </div>
        </motion.div>
      </AnimatePresence>
      {renderNavigation ? renderNavigation(renderProps) : null}
    </div>
  );
}
