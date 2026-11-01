// The same code is deployed twice: a public version, and a gift version with
// a welcome screen and personal messages. Set NEXT_PUBLIC_EDITION=gift on the
// gift deployment. The gift's words are kept out of the code and set as
// environment variables on that deployment too; see .env.example.
//
// These are read at build time, so changing one needs a rebuild. Each must be
// written out in full as process.env.NEXT_PUBLIC_..., or Next.js won't inline
// it for the browser.
export const IS_GIFT = process.env.NEXT_PUBLIC_EDITION === "gift";

function giftText(value: string | undefined, fallback: string): string {
  return (IS_GIFT && value?.trim()) || fallback;
}

// Shown under the icon on a home screen; iOS cuts off long names.
export const HOME_SCREEN_NAME = giftText(
  process.env.NEXT_PUBLIC_GIFT_HOME_SCREEN_NAME,
  "Flags",
);

// The welcome screen shown once, on first open. Gift version only.
export const WELCOME_TITLE = giftText(
  process.env.NEXT_PUBLIC_GIFT_WELCOME_TITLE,
  "Welcome!",
);
export const WELCOME_MESSAGE = giftText(
  process.env.NEXT_PUBLIC_GIFT_WELCOME_MESSAGE,
  "",
);
export const WELCOME_BUTTON = giftText(
  process.env.NEXT_PUBLIC_GIFT_WELCOME_BUTTON,
  "Let's go!",
);

// Extra messages for the home page to pick from, separated by "|".
export const GIFT_OPENING_MESSAGES = giftText(
  process.env.NEXT_PUBLIC_GIFT_OPENING_MESSAGES,
  "",
)
  .split("|")
  .map((message) => message.trim())
  .filter(Boolean);
