@AGENTS.md

## Project notes

- **Pages are prerendered at build time.** Anything random or per-visit must be picked on the client: load the component with `next/dynamic` and `ssr: false` (see `FlagQuizLoader.tsx`), or render a placeholder until mounted (see `OpeningMessage.tsx`). `Math.random()` in a server component is frozen into the build and every visitor gets the same result.
- **Lint uses the React Compiler rules.** They reject `setState` called directly in a `useEffect` body and reading `ref.current` during render. Use a lazy `useState` initializer or `useSyncExternalStore` instead.
- **The service worker is built by a route handler**, not the Serwist build plugin: `src/app/serwist/[...path]/route.ts` bundles `src/sw.ts` with esbuild. The precache manifest is set by hand there, so any page that must work offline needs adding to it. Build chunks, icons and flags are picked up automatically, but only in production builds (dev precaches just `/~offline`), so test offline behaviour with `npm run build && npx next start`.
- **Flag images are `public/nationalFlags/<flagId>.svg`, lowercase.** Run `npm run check:flags` after changing `src/data/countries.json`.
- **No test suite.** Verify with `npm run lint`, `npx tsc --noEmit` and `npm run build`. For UI changes, drive the running app with `puppeteer-core` (already installed via `lighthouse`) and the installed Chrome at `/Applications/Google Chrome.app`, and look at screenshots.
- **Node comes from nvm.** If `node` isn't found in a shell that skips `~/.zshrc`, run `source ~/.nvm/nvm.sh` first.
