"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { shuffle } from "@/data/shuffle";

const TILE_COUNT = 24;
// Flags whose shape crops badly into a 3:2 tile.
const NOT_TILEABLE = new Set(["np", "ch", "va"]);

const subscribe = () => () => {};

// Decorative banner for the home page: a fresh random set of flags on every
// visit. Six across on phones, eight on wider screens, and hidden on a phone
// held sideways where there is no room.
export default function FlagMosaic({ flagIds }: { flagIds: string[] }) {
  // The page is prerendered, so the flags are picked on the client. Until
  // then (and during hydration) blank tiles hold the space.
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [picked] = useState(() =>
    shuffle(flagIds.filter((id) => !NOT_TILEABLE.has(id))).slice(0, TILE_COUNT),
  );

  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 w-full max-w-xs sm:max-w-md short:hidden"
    >
      {picked.map((flagId) =>
        isClient ? (
          <Image
            key={flagId}
            src={`/nationalFlags/${flagId.toLowerCase()}.svg`}
            alt=""
            width={60}
            height={40}
            className="w-full aspect-[3/2] object-cover rounded-sm shadow-sm"
          />
        ) : (
          <div
            key={flagId}
            className="w-full aspect-[3/2] rounded-sm bg-gray-200"
          />
        ),
      )}
    </div>
  );
}
