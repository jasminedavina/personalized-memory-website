import { HomeDeck } from "@/components/HomeDeck";
import { getFriends } from "@/data/friends";

export default function Home() {
  const friends = getFriends();

  return <HomeDeck friends={friends} />;
}
