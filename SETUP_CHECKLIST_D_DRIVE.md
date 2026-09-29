# COMTECH Website - Setup Checklist for D:\comtech-one

**Updated:** 2026-09-29  
**Status:** Ready to Deploy

---

## 📋 FILES YOU NEED TO UPDATE/ADD

Copy these files to your `D:\comtech-one` folder:

### 1. Documentation Files (PRIORITY HIGH)
- [ ] `DEPLOY_NOW.md` - 5-step deployment guide
- [ ] `VERCEL_DEPLOY.md` - Detailed Vercel deployment instructions
- [ ] `README.md` - Complete project documentation
- [ ] `Dockerfile` - Docker configuration
- [ ] `docker-compose.yml` - Docker Compose setup

### 2. Environment Configuration
- [ ] `.env.local` - Copy the content below to `D:\comtech-one\.env.local`

**Copy this exactly:**
```
NEXT_PUBLIC_API_URL=https://www.comtechvietnam.vn
NEXT_PUBLIC_SITE_URL=https://www.comtechvietnam.vn

SMTP_HOST=mail90139.maychuemail.com
SMTP_PORT=465
SMTP_USER=comte202
SMTP_PASS=HeoFone@1982
SMTP_SECURE=true

ADMIN_EMAIL=admin@comtechvietnam.vn
SUPPORT_EMAIL=support@comtechvietnam.vn

DATABASE_URL=postgresql://comtech_user:comtech_password@localhost:5432/comtech_leads

NODE_ENV=development
```

---

## 🚀 NEXT STEPS

### Phase 1: Local Testing (Right Now)
```bash
cd D:\comtech-one

# Option A: Using pnpm (recommended)
pnpm install
pnpm run dev

# Option B: Using npm (if pnpm fails)
npm install
npm run dev
```

Wait for: `- Local: http://localhost:3000`

Then:
- Open browser to http://localhost:3000
- Test all pages (Home, Solutions, About, Contact)
- Fill contact form and verify
- Press Ctrl+C to stop

### Phase 2: Push to GitHub
```bash
cd D:\comtech-one

git init
git add .
git commit -m "feat: COMTECH website v1.0 - ready for deployment"
git branch -M main
git remote add origin https://github.com/infocomtechvietnam-hub/COMTECH-One.git
git push -u origin main
```

### Phase 3: Deploy to Vercel
```bash
npm i -g vercel
vercel login
vercel --prod
```

Configure these environment variables in Vercel:
- NEXT_PUBLIC_API_URL=https://www.comtechvietnam.vn
- NEXT_PUBLIC_SITE_URL=https://www.comtechvietnam.vn
- SMTP_HOST=mail90139.maychuemail.com
- SMTP_PORT=465
- SMTP_USER=comte202
- SMTP_PASS=HeoFone@1982
- ADMIN_EMAIL=admin@comtechvietnam.vn

### Phase 4: Connect Domain
At your hosting provider:
- Update nameservers to Vercel OR
- Add CNAME record: www → cname.vercel-dns.com

---

## 📁 FOLDER STRUCTURE (D:\comtech-one)

```
D:\comtech-one/
├── apps/
│   ├── web/              ← Next.js website
│   │   ├── src/
│   │   ├── package.json
│   │   └── next.config.ts
│   └── api/              ← Backend API
├── packages/             ← Shared packages
├── .env.local            ← ⭐ ADD THIS FILE
├── DEPLOY_NOW.md         ← ⭐ ADD THIS FILE
├── VERCEL_DEPLOY.md      ← ⭐ ADD THIS FILE
├── README.md
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

## ✅ VERIFICATION CHECKLIST

Before deployment:
- [ ] .env.local created with SMTP credentials
- [ ] Latest documentation files copied
- [ ] `pnpm install` completed successfully
- [ ] `pnpm run dev` works (http://localhost:3000)
- [ ] Contact form submissions work
- [ ] All pages load without errors
- [ ] Code pushed to GitHub main branch
- [ ] Vercel project created
- [ ] Environment variables configured in Vercel
- [ ] Initial Vercel deployment successful
- [ ] DNS updated to point to Vercel

---

## 🆘 TROUBLESHOOTING

### Issue: "pnpm: command not found"
**Fix:**
```bash
npm install -g pnpm
```

### Issue: Port 3000 already in use
**Fix:**
```bash
# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: SMTP credentials not working
**Check:**
- Username: comte202
- Password: HeoFone@1982
- Host: mail90139.maychuemail.com
- Port: 465 (SSL/TLS)

### Issue: Vercel deployment fails
**Check:**
- All environment variables are set
- Code is pushed to GitHub main branch
- No build errors in local `npm run build`

---

## 📞 CONTACTS

- **Email Server:** mail90139.maychuemail.com
- **SMTP User:** comte202
- **Domain:** www.comtechvietnam.vn
- **Admin Email:** admin@comtechvietnam.vn

---

## 🎯 KEY REMINDERS

1. **Do NOT run from OneDrive** - Use D:\comtech-one (local)
2. **Use pnpm** - This is a Turborepo monorepo setup
3. **SMTP credentials are configured** - No need to change them
4. **Follow DEPLOY_NOW.md** - Step by step guide
5. **Test locally first** - Before pushing to GitHub

---

**Status:** ✅ All code ready. Following this checklist will deploy your website in 30 minutes!

---

Generated: 2026-09-29
