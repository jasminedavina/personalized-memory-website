import angieJson from "./friends/angie.json";
import armanJson from "./friends/arman.json";
import charleneJson from "./friends/charlene.json";
import cleoJson from "./friends/cleo.json";
import gabyJson from "./friends/gaby.json";
import hillaryJson from "./friends/hillary.json";
import jesslyneJson from "./friends/jesslyne.json";
import nadyaJson from "./friends/nadya.json";
import uneJson from "./friends/une.json";
import valerieJson from "./friends/valerie.json";

export type FriendTimelineItem = {
  year: string;
  text: string;
};

export type FriendWrappedStat = {
  title: string;
  value: string;
  emoji?: string;
};

export type FriendTheme = {
  background: string;
  foreground: string;
  muted: string;
  accent: string;
  card: string;
};

export type FriendData = {
  slug: string;
  name: string;
  passcode: string;
  passcodeBackground?: string;
  redirectUrl?: string;
  videoPrefix?: string;
  letter: string[];
  photos: string[];
  timeline: FriendTimelineItem[];
  wrapped?: FriendWrappedStat[];
  farewell: string;
  music?: string;
  theme: FriendTheme;
};

const friends: FriendData[] = [
  hillaryJson,
  charleneJson,
  armanJson,
  uneJson,
  nadyaJson,
  cleoJson,
  angieJson,
  valerieJson,
  jesslyneJson,
  gabyJson,
];

export function getFriends(): FriendData[] {
  return friends;
}

export function getFriendBySlug(slug: string): FriendData | undefined {
  return friends.find((friend) => friend.slug === slug);
}

export function getFriendSlugs(): string[] {
  return friends.map((friend) => friend.slug);
}
