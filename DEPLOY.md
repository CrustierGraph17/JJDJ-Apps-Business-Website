# Deploying JJDJ

Next.js 16 (App Router, Turbopack). Every route is prerendered, so any static or
Node host works. These steps cover Vercel; the caveat in **Hobby is free but not
for this** is worth reading before you pick a plan.

---

## 1. Put the project in a Git repo

The folder inside OneDrive is not a Git repository yet, so Vercel has nothing to
build from. Do this from a copy **outside OneDrive** — syncing `node_modules`
and `.next` through OneDrive is slow, locks files mid-build, and is the reason
`next build` currently warns about its project root.

```bash
# e.g. C:\dev\jjdj-website  (not ...\OneDrive - ...\JJDJ Website)
git init -b main
git add .
git commit -m "JJDJ website"
```

Then create an **empty** repository on GitHub (no README, no .gitignore) and
push:

```bash
git remote add origin https://github.com/<your-account>/jjdj-website.git
git push -u origin main
```

`.gitignore` already excludes `node_modules`, `.next`, `*.tsbuildinfo` and
`.env*`, so nothing heavy or secret is committed.

## 2. Import it into Vercel

1. Sign up at <https://vercel.com/signup> with your GitHub account (free).
2. **Add New → Project → Import** the `jjdj-website` repository.
3. Leave everything at its default: framework **Next.js**, install `npm install`,
   build `npm run build`, output `.next`, root directory `./`.
4. Under **Environment Variables** add (optional, see note):

   | Name | Value | Notes |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://jjdj.app` | Used by metadata, sitemap, `robots.txt` and JSON-LD. Falls back to `https://jjdj.app` when unset, so you only need it for a preview/staging URL. |

   Variables are build-time for `NEXT_PUBLIC_*`, so add it before the first
   build (or redeploy afterwards).
5. **Deploy.** First build takes a couple of minutes; every push to `main`
   redeploys, and every pull request gets its own preview URL.

Prefer the command line? `npm i -g vercel`, then `vercel login`, `vercel`
(preview) and `vercel --prod` (production) from the project folder.

## 3. Attach the domain (free)

Project → **Settings → Domains → Add** `jjdj.app` (and `www` if you want it
redirected). Either point the domain's nameservers at Vercel, or add the A /
CNAME records Vercel shows you. TLS certificates are issued and renewed
automatically.

## 4. Check the deployment

- `/` renders the hero, the intro plays once per session, light/dark both work.
- The product page and a help article render, e.g. `/products/notle`,
  `/help/getting-started-with-notle`.
- `/sitemap.xml` and `/robots.txt` show the production host, not
  `localhost` — if they don't, `NEXT_PUBLIC_SITE_URL` is wrong or missing.
- Social previews: `/opengraph-image` returns a PNG.

## 5. Hobby is free but not for this

Vercel's Hobby plan is restricted to personal, non-commercial use, and the
guidelines name *"advertising the sale of a product or service"* as commercial:

> "Hobby teams are restricted to non-commercial personal use only. All
> commercial usage of the platform requires either a Pro or Enterprise plan."

A JJDJ marketing site that promotes the apps is a commercial deployment on
Vercel's own reading, so the honest options are:

| Option | Cost | Notes |
| --- | --- | --- |
| Vercel Hobby | Free | Technically works, but outside the terms for a company site. Accounts get asked to upgrade. |
| Vercel Pro | US$20/month (includes $20 usage credit) | The compliant Vercel route and the simplest if you want Vercel's DX. |
| Netlify Free | Free | Terms explicitly allow commercial projects. Runs Next 16 through the OpenNext adapter (caching, ISR, image optimization). |
| Cloudflare Workers Free | Free | No blanket non-commercial clause; 100k requests/day, 10ms CPU per request. Needs the `@opennextjs/cloudflare` adapter (or `vinext`, still beta). |
| Cloudflare Pages | Free | Static export only — you'd lose `next/image` optimisation and the API route. |

Hobby limits worth knowing either way: **100 GB** fast data transfer,
**1,000,000** function invocations and **5,000** image transformations per
month; a Hobby project is *paused* when its included usage runs out until the
next cycle, and a single build is capped at 45 minutes.

Sources: [Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines),
[Hobby plan](https://vercel.com/docs/plans/hobby),
[Vercel pricing](https://vercel.com/pricing),
[Netlify Free](https://www.netlify.com/blog/introducing-netlify-free-plan/),
[Netlify + OpenNext](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/),
[Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/),
[OpenNext on Cloudflare](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/).

---

## Pre-launch list

- The launch date is written once, in `data/site.ts`. Nothing else needs
  updating when it changes.
- Add the production host to `NEXT_PUBLIC_SITE_URL` so canonicals and OG URLs
  are absolute.
- Decide whether to keep the intro overlay's session storage key
  (`jjdj:intro`) — it is what stops the intro replaying on every navigation.
