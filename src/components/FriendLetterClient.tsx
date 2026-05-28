"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Props = {
  videoPrefix: string;
  friendSlug: string;
};

export default function FriendLetterClient({ videoPrefix, friendSlug }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      // navigate to the dedicated end page for this friend
      router.push(`/${friendSlug}/end`);
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [videoPrefix, friendSlug, router]);

  return (
    <div className="video-link">
      <video
        ref={videoRef}
        className="video-media"
        src={`/videos/${videoPrefix}letter.mp4`}
        autoPlay
        muted
        playsInline
      />
    </div>
  );
}
