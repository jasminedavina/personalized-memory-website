"use client";

import { ReactNode } from "react";
import MainAudioProvider from "./MainAudioProvider";

type Props = {
  children: ReactNode;
};

export default function ClientProviders({ children }: Props) {
  // MainAudioProvider will attempt to start background music and persist across navigation
  return <MainAudioProvider>{children}</MainAudioProvider>;
}
