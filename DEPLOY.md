# Deploy to Vercel

Public support email already configured: **sewang262@gmail.com**

1. Put this folder into a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep Root Directory as `./`.
4. Deploy. `vercel.json` runs the build and publishes `dist`.
5. Your production `*.vercel.app` URL is automatically inserted into canonical tags, sitemap.xml, robots.txt, and social metadata.

If Vercel says the production URL is unavailable, enable:
**Project Settings → Environment Variables → Automatically expose System Environment Variables**
and redeploy.

After deployment, check:
- `/`
- `/contact`
- `/privacy-policy`
- `/sitemap.xml`
- `/robots.txt`

The Contact page should show `sewang262@gmail.com` and the link should open an email addressed to it.
