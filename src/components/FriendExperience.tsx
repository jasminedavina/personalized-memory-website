"use client";

import { PasscodeGate } from "@/components/PasscodeGate";
import type { FriendData } from "@/data/friends";

type FriendExperienceProps = {
  friend: FriendData;
};

export function FriendExperience({ friend }: FriendExperienceProps) {
  const canvaLink = "https://canva.link/reztw4tvj1by95x";
  const redirectUrl = friend.redirectUrl ?? canvaLink;
  const redirectMessage = friend.redirectUrl
    ? "Opening your video scrapbook..."
    : "Opening your Canva scrapbook...";

  return (
    <div className="relative min-h-screen">
      <PasscodeGate
        passcode={friend.passcode}
        friendName={friend.name}
        passcodeBackground={friend.passcodeBackground}
        redirectUrl={redirectUrl}
        redirectMessage={redirectMessage}
      />
    </div>
  );
}
