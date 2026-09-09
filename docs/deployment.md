# Deployment

Vercel project: `albovsky-com` (`prj_IuOWe7DW3bX0tg7zmDUEbM4vvZ8x`).
Team: `glibs-projects-09812790`.

Production URL: https://albovsky.com

Alternate domain: https://www.albovsky.com
Vercel fallback: https://albovsky-com-glibs-projects-09812790.vercel.app

The fallback Vercel URL currently requires Vercel sign-in. Authenticated checks confirmed the portfolio homepage returns HTTP 200 and an invalid signup returns HTTP 400 without persistence.

The production deployment published on 2026-09-08 is `dpl_5kNcpyBNVeWLh9eUjbwoRNZkPg4X`.
Production database variables are configured as secrets; see `testflight-signups.md`.
Environment files are excluded from source uploads by `.vercelignore`.

## Custom domains

`albovsky.com` and `www.albovsky.com` are attached to the Vercel project.
Spaceship MCP is installed and authenticated in Codex.

After explicit user approval, Spaceship confirmed the switch from Hover to `ns1.vercel-dns.com` and `ns2.vercel-dns.com`.
Public DNS reflects the new nameservers, and Vercel reports both domains configured correctly.
Vercel's DNS zone already contains default root and wildcard ALIAS records and certificate-authority records.

Both custom domains serve the portfolio with HTTP 200 and valid HTTPS certificates. Vercel lists automatic renewal enabled for both certificates.
The `/photo`, `/video`, `/motion`, and `/toolbox` routes return HTTP 200 on the custom domain. Invalid signup input returns HTTP 400 without writing a database record.

## Updates

Run from this directory:

```sh
npm exec --yes --package=vercel -- vercel deploy --prod --scope glibs-projects-09812790
```

Repository: https://github.com/albovsky/Portfolio. Automatic Git deployment is not configured; production updates currently use the Vercel CLI.

## Performance and visual assets

The portrait is generated from the original character/tone data into a standalone SVG. This keeps the glyphs out of React hydration. The hidden game, sticker renderer, and drag plugin load only when opened. Gallery pages are pre-rendered and use responsive Next.js image optimization with recorded intrinsic dimensions.

After adding gallery photos or editing the portrait character data, regenerate the checked-in assets before building:

```sh
npm run assets:generate
```

The country-card ambient animation pauses outside the viewport and when the document is hidden. Static cat-room artwork is memoized independently from the changing residents.
