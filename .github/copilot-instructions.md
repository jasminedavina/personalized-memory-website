# Copilot instructions

## Build, run, lint
- `npm run dev` — start the Next.js dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint

## High-level architecture
- App Router lives under `src/app/`. The home page (`src/app/page.tsx`) lists friends from `src/data/friends.ts` and links to `/{friend}`.
- Friend pages are rendered by `src/app/[friend]/page.tsx`, prebuilt via `generateStaticParams()` from friend slugs. Missing slugs call `notFound()`.
- Friend content is data-driven: JSON in `src/data/friends/*.json` (letter, photos, timeline, theme, optional music) is imported and registered in `src/data/friends.ts`.
- The friend page composes `PasscodeGate` → `EnvelopeIntro` → section components (`TypewriterLetter`, `PhotoGrid`, `Timeline`, optional `MusicPlayer`) wrapped in `FadeIn`.
- Theme colors come from each friend’s JSON `theme` and are applied as CSS custom properties on the page root; `globals.css` maps these to Tailwind tokens.

## Deployment (Vercel)
- Deployment is intended for Vercel; follow the Next.js deployment guide: https://nextjs.org/docs/app/building-your-application/deploying

## Key conventions
- Use the `@/*` alias for imports from `src/`.
- Components using hooks are client components and include `"use client"` at the top.
- Passcodes are case-insensitive (normalized in `PasscodeGate`); update passcodes in the friend JSON files.
- `TypewriterLetter` expects `letter` as an array of strings and renders it via `typed.js` with HTML line breaks.
- This repo uses a newer Next.js with breaking changes; check `node_modules/next/dist/docs/` and heed deprecations before making framework-level changes.
