import { notFound } from "next/navigation";

import type { CSSProperties } from "react";

import { FriendExperience } from "@/components/FriendExperience";
import { getFriendBySlug, getFriendSlugs } from "@/data/friends";

type FriendPageProps = {
  params: Promise<{
    friend: string;
  }>;
};

export function generateStaticParams() {
  return getFriendSlugs().map((friend) => ({ friend }));
}

export default async function FriendPage({ params }: FriendPageProps) {
  const { friend: friendSlug } = await params;
  const friend = getFriendBySlug(friendSlug);

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
    <div
      className="ambient-bg min-h-screen bg-background text-foreground"
      style={themeStyle}
    >
      <FriendExperience friend={friend} />
    </div>
  );
}
