import { HomeDeck } from "@/components/HomeDeck";
import { getFriends } from "@/data/friends";
import MainAudioProvider from "@/components/MainAudioProvider";

export default function Home() {
  const friends = getFriends();

  return (
    <MainAudioProvider>
      <HomeDeck friends={friends} />
    </MainAudioProvider>
  );
}
