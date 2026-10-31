@AGENTS.md

## Project notes

- **Pages are prerendered at build time.** Anything random or per-visit must be picked on the client: load the component with `next/dynamic` and `ssr: false` (see `FlagQuizLoader.tsx`), or render a placeholder until mounted (see `OpeningMessage.tsx`). `Math.random()` in a server component is frozen into the build and every visitor gets the same result.
- **Lint uses the React Compiler rules.** They reject `setState` called directly in a `useEffect` body and reading `ref.current` during render. Use a lazy `useState` initializer or `useSyncExternalStore` instead.
- **The service worker is built by a route handler**, not the Serwist build plugin: `src/app/serwist/[...path]/route.ts` bundles `src/sw.ts` with esbuild. The precache manifest is set by hand there, so any page that must work offline needs adding to it. Build chunks, icons and flags are picked up automatically, but only in production builds (dev precaches just `/~offline`), so test offline behaviour with `npm run build && npx next start`.
- **Flag images are `public/nationalFlags/<flagId>.svg`, lowercase.** Run `npm run check:flags` after changing `src/data/countries.json`.
- **Checks:** `npm run lint`, `npx tsc --noEmit`, `npm run format:check`, `npm run build` and `npm run test:e2e`. GitHub Actions runs the same on every PR (`.github/workflows/ci.yml`). The Playwright tests in `e2e/` build and serve production on port 3100, in Chromium (Pixel 7) and WebKit (iPhone 15), and include going offline after one visit. For a one-off look at a UI change, drive the running app with `puppeteer-core` (already installed via `lighthouse`) and the installed Chrome at `/Applications/Google Chrome.app`, and look at screenshots.
- **Node comes from nvm.** If `node` isn't found in a shell that skips `~/.zshrc`, run `source ~/.nvm/nvm.sh` first.
