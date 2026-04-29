"use client";

import ActionButton from "./ActionButton";

export default function FlagButtonBar() {
  return (
    <div className="flex gap-4 justify-center">
      <ActionButton correct={true} onPress={() => console.log("Correct")} />
      <ActionButton correct={false} onPress={() => console.log("Incorrect")} />
    </div>
  );
}
