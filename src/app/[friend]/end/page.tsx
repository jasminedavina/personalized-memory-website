import Link from "next/link";
import { notFound } from "next/navigation";

import { getFriendBySlug, getFriendSlugs } from "@/data/friends";

type FriendEndPageProps = {
  params: Promise<{
    friend: string;
  }>;
};

export function generateStaticParams() {
  return getFriendSlugs().map((friend) => ({ friend }));
}

export default async function FriendEndPage({ params }: FriendEndPageProps) {
  const { friend: friendSlug } = await params;
  const friend = getFriendBySlug(friendSlug);

  if (!friend) {
    notFound();
  }

  const videoPrefix = friend.videoPrefix ?? friend.slug;
  const videoSrc = `/videos/end.mp4`;

  return (
    <div className="video-stage">
      <div className="video-frame">
        <Link href="/" className="video-link" aria-label="Return to scrapbook home">
          <video className="video-media" src={videoSrc} autoPlay muted  />
          <span className="video-hint">Tap to return →</span>
        </Link>
      </div>
    </div>
  );
}
