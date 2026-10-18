Secrets manager in use: none

# Secrets with Infisical

This is a Next.js 16 marketing site (`npm`, App Router). It reads no required
secrets, so `npm run dev` runs the plain Next dev server and works on a fresh
clone. Infisical is **optional**: if you later add a feature that needs a key,
run the site through `npm run dev:secrets` so it is injected from Infisical
instead of a file. Nothing secret is committed.

## Commands

- `npm run dev` — local development (`next dev`), no secrets manager required
- `npm run dev:secrets` — same, wrapped in `infisical run --env=dev` (requires the CLI and a linked project)
- `npm run build` — production build (not wrapped)
- `npm run start` — production server for a build (not wrapped)
- `npm run typecheck` / `npm run lint` — checks (not wrapped)

## Environment variables the app reads

- `NEXT_PUBLIC_SITE_URL` — absolute site URL used for metadata and JSON-LD, read in `lib/utils.ts`. It falls back to `https://jjdj.app` when unset.

No other environment variables are read. The site has no forms and no server
endpoints; if one is added later, its key belongs in Infisical too, never in the
repo.

## How dev secrets are loaded

`npm run dev:secrets` starts the app as:

```
infisical run --env=dev -- next dev
```

Infisical injects the Development environment's secrets as environment variables,
so `process.env.NEXT_PUBLIC_SITE_URL` works unchanged. Next.js also still reads
`.env` files if they are present, but a variable that is already in the environment
wins — which is what `infisical run` sets.

Production entry points are intentionally not wrapped: `npm run start`, the Vercel
build and any CI run as they are. They need a machine identity instead (see below).

## Finish setup

Run these in this folder (`INFISICAL.md`'s parent). Each line is one command —
Windows PowerShell 5.1 has no `&&`, so run them one at a time.

1. Create a project for this site in Infisical at https://app.infisical.com (call it something like `jjdj-website`).
2. Install the CLI — Windows (scoop):
   `scoop bucket add org https://github.com/Infisical/scoop-infisical.git`
   `scoop install infisical`
   Or on macOS: `brew install infisical/get-cli/infisical`
   Or with npm anywhere: `npm install -g @infisical/cli`
3. `infisical login`
4. `infisical init` — pick the project you just created. This writes `.infisical.json` (project id only, no secrets; safe to commit).
5. Import your existing variables: in the project's **Secrets Overview** page, choose the **Development** environment and drag your `.env` file onto the page. Every key is imported at once. If you have no `.env` yet, add the keys from `.env.example` by hand, with real values.
6. `npm run dev:secrets` — the app should boot exactly as before, now with values from Infisical.
7. Move the file OUT of the repository folder — do not rename it to a backup inside the repo, because a `.env.*` backup is not ignored:
   `Move-Item .env $HOME\.env.jjdj-website.backup`
8. Restart `npm run dev:secrets` to prove the values come from Infisical and not from the file.

### CI and production

Production and CI are not the dev CLI: create a machine identity in Infisical with
Universal Auth and give the platform the `INFISICAL_UNIVERSAL_AUTH_CLIENT_ID` and
`INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET` values through its own secret store (for
Vercel, the project's Environment Variables), then fetch secrets at build time with
`infisical run` or the Infisical SDK.

### If a secret was ever committed

A value that reached git stays in history until it is rotated. Rotate it in
Infisical first, then scan the working copy and history for leaks with
`infisical scan`.
