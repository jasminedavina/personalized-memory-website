"use client";

import { PasscodeGate } from "@/components/PasscodeGate";
import { GlobalAudioProvider } from "@/components/GlobalAudio";
import type { FriendData } from "@/data/friends";

type FriendExperienceProps = {
  friend: FriendData;
};

export function FriendExperience({ friend }: FriendExperienceProps) {
  const redirectUrl = friend.redirectUrl ?? `/${friend.slug}/foto`;
  const redirectMessage = "Opening your scrapbook...";

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
