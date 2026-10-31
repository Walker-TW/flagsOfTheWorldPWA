# Flags of the World

A Progressive Web App for learning the flags of the world. Pick a quiz length
(10, 20, 50, 100 or every country), then work through a shuffled set of flags,
each shown with its name, capital and a fun fact. Swipe right or tap ✓ if you
knew it, swipe left or tap ✗ if you didn't; your score is shown at the end.

Built with Next.js 16, React 19, Tailwind CSS 4 and [Serwist](https://serwist.pages.dev/)
for the service worker.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command               | What it does                                                        |
| --------------------- | ------------------------------------------------------------------- |
| `npm run dev`         | Start the dev server                                                |
| `npm run build`       | Production build                                                    |
| `npm run start`       | Serve the production build                                          |
| `npm run lint`        | Run ESLint                                                          |
| `npm run check:flags` | Check every country in `countries.json` has a flag SVG, and vice versa |

## Project layout

- `src/app/page.tsx`: landing page where you choose the quiz length.
- `src/app/quiz/page.tsx`: the quiz page; the length comes from `?count=` (a number or `all`).
- `src/app/components/FlagQuiz.tsx`: builds the shuffled deck on the client, keeps score and shows the results.
- `src/app/components/SwipeCard.tsx`: swipe right/left gesture around the flag card.
- `src/app/~offline/page.tsx`: fallback page the service worker serves when offline.
- `src/app/serwist/[...path]/route.ts`: bundles `src/sw.ts` with esbuild and serves it at `/serwist/sw.js`.
- `src/data/countries.json`: country data (name, `flagId`, capital, fact).
- `public/nationalFlags/`: flag SVGs, named `<flagId>.svg` in lowercase.
- `public/icons/`: PNG app icons generated from `public/appIcon.svg`.

## Regenerating icons

```bash
rsvg-convert -w 192 -h 192 public/appIcon.svg -o public/icons/icon-192.png
rsvg-convert -w 512 -h 512 public/appIcon.svg -o public/icons/icon-512.png
rsvg-convert -w 180 -h 180 --background-color=white public/appIcon.svg -o public/icons/apple-touch-icon.png
```
