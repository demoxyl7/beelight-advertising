# BeeLightAdvertising — Vercel Ready + Resend Email

Dark glossy futuristic OOH site. Now with REAL email sending via Resend.

## Quick Start
```bash
npm install
npm run dev
# http://localhost:3000
```

## Contact Form Now Sends Real Email
Frontend POSTs to /api/contact.js

**Pre-domain (no Resend key):** Works in offline mode — saves to localStorage `beelight_submissions` and shows toast. No error.

**To enable real emails:**
1. Sign up at resend.com (free)
2. Get API key
3. In Vercel > Your Project > Settings > Environment Variables, add:
   - RESEND_API_KEY = re_xxx
   - ADMIN_EMAIL = admin@yourdomain.com (destination)
   - VITE_ADMIN_EMAIL = same (fallback for UI)
4. Redeploy

In api/contact.js, change `from:` from `onboarding@resend.dev` to `no-reply@yourdomain.com` AFTER you verify domain in Resend.

Test:
```bash
curl -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","message":"hello"}'
# But local dev: vite dev server doesn't run /api — deploy to Vercel to test, or use `vercel dev`
```

For local API testing: `npx vercel dev` (needs Vercel CLI) instead of `npm run dev`.

## Admin
/admin password: beelight2025
Settings tab controls accent color, logo URL, adminEmail, WhatsApp number.

Data lives in localStorage `beelight_data` — Export/Import JSON to backup.

## Push to GitHub
```bash
git init
git add .
git commit -m "BeeLight with Resend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/beelight-advertising.git
git push -u origin main
```

Then Vercel > New Project > Import > Deploy. Instant vercel.app URL.

## Changing WhatsApp
Admin > Settings > WhatsApp, or env VITE_WHATSAPP_NUMBER. All links are https://wa.me/<number>

## Changing Admin Email Later
Admin > Settings > Admin Email, or env ADMIN_EMAIL — no rebuild needed, just change env and redeploy or update via admin panel.

## Stack
React + Vite + TypeScript + Tailwind + Vercel Serverless + Resend
