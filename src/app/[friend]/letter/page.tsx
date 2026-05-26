import Link from "next/link";
import { notFound } from "next/navigation";

import { getFriendBySlug, getFriendSlugs } from "@/data/friends";

type FriendLetterPageProps = {
  params: Promise<{
    friend: string;
  }>;
};

export function generateStaticParams() {
  return getFriendSlugs().map((friend) => ({ friend }));
}

export default async function FriendLetterPage({ params }: FriendLetterPageProps) {
  const { friend: friendSlug } = await params;
  const friend = getFriendBySlug(friendSlug);

  if (!friend) {
    notFound();
  }

  const videoPrefix = friend.videoPrefix ?? friend.slug;
  const videoSrc = `/videos/${videoPrefix}letter.mp4`;

  return (
    <div className="video-stage">
      <div className="video-frame">
        <div className="video-link">
          <video
            className="video-media"
            src={videoSrc}
            autoPlay
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
