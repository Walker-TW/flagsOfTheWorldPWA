// app/serwist/[...path]/route.ts
import { createSerwistRoute } from "@serwist/turbopack";

export const { GET } = createSerwistRoute({
  swSrc: "src/sw.ts",
  // caching strategies and config go here
});