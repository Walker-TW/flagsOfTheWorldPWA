// src/app/serwist/[...path]/route.ts
import { spawnSync } from "node:child_process";
import { NextResponse } from "next/server";
import path from "node:path";

export function generateStaticParams() {
  return [{ path: ["sw.js"] }];
}

export async function GET() {
  const swSrc = path.resolve(process.cwd(), "src/sw.ts");

  const result = spawnSync(
    "node_modules/.bin/esbuild",
    [
      swSrc,
      "--bundle",
      "--format=esm",
      "--platform=browser",
      "--define:self.__SW_MANIFEST=[]",
    ],
    { encoding: "utf-8" }
  );

  if (result.error || result.status !== 0) {
    console.error("SW build failed:", result.stderr);
    return new NextResponse("Service worker build failed", { status: 500 });
  }

  return new NextResponse(result.stdout, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Service-Worker-Allowed": "/",
      "Cache-Control": "no-store",
    },
  });
}