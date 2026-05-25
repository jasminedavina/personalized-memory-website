"use client";

import { useEffect, useRef } from "react";
import Typed from "typed.js";

type TypewriterLetterProps = {
  lines: string[];
};

export function TypewriterLetter({ lines }: TypewriterLetterProps) {
  const letterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!letterRef.current) {
      return;
    }

    const typed = new Typed(letterRef.current, {
      strings: [lines.join("<br />")],
      typeSpeed: 22,
      startDelay: 400,
      backSpeed: 0,
      showCursor: true,
      cursorChar: "|",
      contentType: "html",
    });

    return () => {
      typed.destroy();
    };
  }, [lines]);

  return <span ref={letterRef} />;
}
