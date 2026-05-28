"use client";

import { ReactNode } from "react";
import { GlobalAudioProvider } from "./GlobalAudio";

type Props = {
  children: ReactNode;
  src?: string;
};

export default function MainAudioProvider({ children, src = "/music/letter.mp3" }: Props) {
  return (
    <GlobalAudioProvider src={src} autoStart={true}>
      {children}
    </GlobalAudioProvider>
  );
}
