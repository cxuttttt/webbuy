# Roofing Calculator — FINAL VERCEL QA

Review date: 2026-09-01
Target: Vercel free `*.vercel.app` deployment
Public support email: `sewang262@gmail.com`

## Final status

**PASS — no known user-facing launch blockers remain in the source package.**

The actual Vercel URL does not exist until deployment. The build script injects Vercel's production URL automatically into canonical tags, Open Graph URLs, robots.txt, and sitemap.xml.

If Vercel system environment variables are unavailable, the production build intentionally fails instead of publishing incorrect SEO URLs.

---

## 1. User-facing cleanup

Removed from the user interface:

- State input that did not affect price
- Roof pitch input that did not affect price
- Story-count input that did not affect price
- Complexity input that did not affect price
- Unsupported Tile / Wood Easy Mode choices
- Prelaunch / placeholder / configuration-script language
- Development-version wording such as “v1”
- Internal “operator should…” instructions
- Future-development explanations that did not help homeowners

Result:

**Every visible control on the homepage now affects the calculation or the calculation method.**

---

## 2. Contact email

Configured public email:

`sewang262@gmail.com`

Verified:

- Contact page displays the real email
- `mailto:` points to `sewang262@gmail.com`
- Privacy Policy points to the same email
- No `CONTACT_EMAIL_PLACEHOLDER` remains

---

## 3. Production build simulation

Simulated:

`VERCEL_ENV=production`
`VERCEL_PROJECT_PRODUCTION_URL=roofing-calculator-demo.vercel.app`

Build result:

- 11 HTML pages built
- 10 canonical public URLs
- `robots.txt` = Allow
- valid XML `sitemap.xml`
- 404 remains `noindex`
- normal public pages do not contain `noindex`
- no unresolved site-origin token
- no unresolved email placeholder

Static SEO audit:

**0 issues**

Inline JavaScript syntax audit:

**0 issues**

---

## 4. Browser-level calculator tests

Executed in Chromium through Playwright using the final production HTML.

### Main Roofing Cost Calculator
Input:
- 2,000 sq ft
- Architectural asphalt
- 10% waste
- Tear-off: yes

Verified:
- Low: `$10,200`
- Typical: `$14,350`
- High: `$18,500`
- Roof area: `2,000 sq ft`
- Roofing squares incl. waste: `22.00`
- Material area: `2,200 sq ft`
- Material: `$2,200–$5,500`
- Labor: `$6,000–$7,000`
- Tear-off: `$2,000–$6,000`

**PASS**

### Advanced Mode validation

Invalid rate order:
- Low = 12
- Typical = 8
- High = 10

Verified:
- Old result is cleared
- User receives:
  `Use rates in ascending order: Low ≤ Typical ≤ High.`

**PASS**

### Roofing Square Calculator

2,400 sq ft + 10% waste:
- `26.40 squares`
- `2,640 sq ft`

**PASS**

### Roof Shingle Calculator

2,000 sq ft + 10% waste + 3 bundles/square:
- `66 bundles`
- `22.00` roofing squares

**PASS**

### Roof Square Footage Calculator

40 × 30 ft footprint + 6:12 pitch:
- `1,342 sq ft`
- `13.42` roofing squares

**PASS**

### Metal Roof Cost Calculator

2,000 sq ft, rates $6 / $10 / $14:
- Low `$12,000`
- Typical `$20,000`
- High `$28,000`

**PASS**

---

## 5. Mobile layout QA

Viewport:
- 390 × 844

Verified:
- document width = 390 px
- body width = 390 px
- no horizontal overflow
- result card fits viewport
- Low / Typical / High row remains readable
- left result-card inset = 27 px
- right result-card inset = 27 px

The previously reported “High card too close to the right edge” issue is resolved.

**PASS**

---

## 6. Visual QA

Manually inspected final rendered pages:

- Homepage desktop
- Homepage mobile result
- Contact
- Privacy Policy
- Methodology
- Terms & Disclaimer

Checked for:

- clipping
- overlap
- uneven result-card spacing
- visible internal/developer text
- broken typography
- poor mobile wrapping
- email presentation
- obvious unfinished placeholders

**PASS**

Screenshots are included in `/qa`.

---

## 7. SEO / Vercel behavior

`vercel.json` includes:

- `buildCommand`
- `outputDirectory`
- clean URLs
- no trailing slash
- security headers
- Content Security Policy
- X-Content-Type-Options
- Referrer-Policy
- X-Frame-Options
- Permissions-Policy

Production build automatically generates:

- `dist/robots.txt`
- `dist/sitemap.xml`
- final canonical URLs
- final Open Graph URLs

Preview/local builds are deliberately non-indexable.
Production builds are indexable.
404 remains non-indexable.

---

## 8. Privacy-policy consistency

Current site behavior represented in Privacy Policy:

- calculator inputs are browser-side
- no application database for calculator inputs
- hosted by Vercel
- no Google Analytics
- no Google AdSense
- no first-party tracking cookies
- no contractor lead form
- email contact is available
- Vercel privacy link is disclosed

**PASS**

---

# Deployment package rule

The final ZIP intentionally does **not** include the simulated `dist` folder.

Reason:
The test `dist` used a fake QA hostname. Vercel must run the build itself so that the real `*.vercel.app` production URL is injected.

Deploy the repository/package root containing:

- `src/`
- `build.mjs`
- `package.json`
- `vercel.json`
- `DEPLOY.md`

Vercel will create `dist/` automatically.

# Remaining external dependency

There is only one deployment-time dependency that cannot be tested before the real Vercel project exists:

**Vercel must expose its System Environment Variables to the build.**

If they are not available, the build fails with an explicit message instead of silently publishing incorrect canonical/sitemap URLs.

This is intentional fail-safe behavior.
