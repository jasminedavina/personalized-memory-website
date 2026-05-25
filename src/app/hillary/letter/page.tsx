import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getFriendBySlug } from "@/data/friends";

export default function HillaryLetterPage() {
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
        <div className="video-link">
          <video
            className="video-media"
            src="/videos/hililetter.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
        <div className="video-actions">
          <Link href="/" className="ribbon-button">
            Return to scrapbook home
          </Link>
        </div>
      </div>
    </div>
  );
}
