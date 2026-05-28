import Link from "next/link";
import { notFound } from "next/navigation";

import { getFriendBySlug, getFriendSlugs } from "@/data/friends";
import FriendLetterClient from "@/components/FriendLetterClient";

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

  const endHref = `/${friend.slug}/end`;

  return (
    <div className="video-stage">
      <div className="video-frame">
        <Link href={endHref} className="video-link" aria-label="Open the end video">
          <video className="video-media" src={`/videos/${videoPrefix}letter.mp4`} autoPlay muted playsInline />
          <span className="video-hint">Tap to continue →</span>
        </Link>
      </div>
    </div>
  );
}
