"use client";

import dynamic from "next/dynamic";

// Rendered only on the client so each visit gets its own random country,
// rather than one frozen into the statically generated HTML.
const FlagQuiz = dynamic(() => import("./FlagQuiz"), {
  ssr: false,
  loading: () => <div className="grow" />,
});

export default FlagQuiz;
