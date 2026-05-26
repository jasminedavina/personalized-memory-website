import Link from "next/link";
import { notFound } from "next/navigation";

import { getFriendBySlug, getFriendSlugs } from "@/data/friends";

type FriendFotoPageProps = {
  params: Promise<{
    friend: string;
  }>;
};

export function generateStaticParams() {
  return getFriendSlugs().map((friend) => ({ friend }));
}

export default async function FriendFotoPage({ params }: FriendFotoPageProps) {
  const { friend: friendSlug } = await params;
  const friend = getFriendBySlug(friendSlug);

  if (!friend) {
    notFound();
  }

  const videoPrefix = friend.videoPrefix ?? friend.slug;
  const videoSrc = `/videos/${videoPrefix}foto.mp4`;

  return (
    <div className="video-stage">
      <div className="video-frame">
        <Link
          href={`/${friend.slug}/letter`}
          className="video-link"
          aria-label="Open the letter video"
        >
          <video
            className="video-media"
            src={videoSrc}
            autoPlay
            muted
            playsInline
          />
          <span className="video-hint">Tap to continue →</span>
        </Link>
      </div>
    </div>
  );
}
