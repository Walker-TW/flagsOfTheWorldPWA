import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { NextResponse } from "next/server";
import path from "node:path";

export function generateStaticParams() {
  return [{ path: ["sw.js"] }];
}

// Every file under `dir`, as paths relative to it.
function listFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(dir, path.join(entry.parentPath, entry.name)));
}

function fileHash(file: string): string {
  return createHash("md5").update(readFileSync(file)).digest("hex");
}

// Public files, keyed on their contents so an edited flag is fetched again.
function publicEntries(dir: string) {
  const root = path.resolve(process.cwd(), "public");
  return listFiles(path.join(root, dir)).map((file) => ({
    url: `/${path.posix.join(dir, file.split(path.sep).join("/"))}`,
    revision: fileHash(path.join(root, dir, file)),
  }));
}

// Everything the app needs to run offline from its first launch. The route is
// prerendered during `next build`, so this is worked out once per build.
function buildPrecacheManifest() {
  // The revision busts the cached pages on each build.
  const buildRevision = Date.now().toString();
  const offline = { url: "/~offline", revision: buildRevision };

  // In dev the chunk names differ from the last build's, and precached pages
  // would hide edits, so only the offline page is cached.
  if (process.env.NODE_ENV !== "production") return [offline];

  const staticDir = path.resolve(process.cwd(), ".next/static");
  // Chunk file names carry a content hash, so they need no revision.
  const chunks = listFiles(staticDir).map((file) => ({
    url: `/_next/static/${file.split(path.sep).join("/")}`,
    revision: null,
  }));

  return [
    offline,
    { url: "/", revision: buildRevision },
    { url: "/quiz", revision: buildRevision },
    { url: "/manifest.json", revision: fileHash("public/manifest.json") },
    { url: "/appIcon.svg", revision: fileHash("public/appIcon.svg") },
    ...publicEntries("icons"),
    ...publicEntries("nationalFlags"),
    ...chunks,
  ];
}

export async function GET() {
  const swSrc = path.resolve(process.cwd(), "src/sw.ts");
  const precacheManifest = JSON.stringify(buildPrecacheManifest());

  // The manifest is too long to pass on the command line, so esbuild leaves a
  // placeholder name that is declared above the bundle.
  const result = spawnSync(
    "node_modules/.bin/esbuild",
    [
      swSrc,
      "--bundle",
      "--format=esm",
      "--platform=browser",
      "--define:self.__SW_MANIFEST=__PRECACHE_MANIFEST__",
    ],
    { encoding: "utf-8" }
  );

  if (result.error || result.status !== 0) {
    console.error("SW build failed:", result.stderr);
    return new NextResponse("Service worker build failed", { status: 500 });
  }

  const sw = `const __PRECACHE_MANIFEST__ = ${precacheManifest};\n${result.stdout}`;

  return new NextResponse(sw, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Service-Worker-Allowed": "/",
      "Cache-Control": "no-store",
    },
  });
}
