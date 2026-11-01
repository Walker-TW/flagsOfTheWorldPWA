import type { MetadataRoute } from "next";
import { HOME_SCREEN_NAME } from "@/edition";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flags of the World",
    short_name: HOME_SCREEN_NAME,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/appIcon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
