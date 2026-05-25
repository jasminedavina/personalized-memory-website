import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getFriendBySlug } from "@/data/friends";

export default function HillaryFotoPage() {
  const friend = getFriendBySlug("hillary");

  if (!friend) {
    notFound();
  }

  const themeStyle = {
    "--background": friend.theme.background,
    "--foreground": friend.theme.foreground,
    "--muted": friend.theme.muted,
    "--accent": friend.theme.accent,
    "--card": friend.theme.card,
  } as CSSProperties;

  return (
    <div className="video-stage" style={themeStyle}>
      <div className="video-frame">
        <Link
          href="/hillary/letter"
          className="video-link"
          aria-label="Open the letter video"
        >
          <video
            className="video-media"
            src="/videos/hilifoto.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <span className="video-hint">Tap to continue →</span>
        </Link>
      </div>
    </div>
  );
}
