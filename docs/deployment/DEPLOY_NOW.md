# 🚀 DEPLOY NOW - Complete Setup (5 Steps)

## Step 1: Prepare (2 min)

```bash
# Copy this entire block and run in terminal:

cd /path/to/comtech-website

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit with your SMTP credentials
# (Open .env.local and update these 2 lines)
# SMTP_USER=your-email@your-domain.com
# SMTP_PASS=your-app-password-from-mail90139.maychuemail.com
```

**Where to get SMTP password:**
1. Go to: https://mail90139.maychuemail.com/
2. Login with your email
3. Find "Passwords" or "App Passwords"
4. Generate new password
5. Copy to SMTP_PASS in .env.local

---

## Step 2: Test Locally (2 min)

```bash
# Start development server
npm run dev

# Opens: http://localhost:3000
# 
# Test:
# ✓ Homepage loads
# ✓ Solutions page works
# ✓ About page loads
# ✓ Contact form displays
# ✓ Mobile view works (press F12, then Ctrl+Shift+M)
# ✓ All links work
```

**Stop server:** Press `Ctrl+C`

---

## Step 3: Push to GitHub (2 min)

```bash
# Initialize git and push code
cd /path/to/comtech-website

git init
git add .
git commit -m "Deploy: COMTECH website v1.0"
git branch -M main

# Add your GitHub repo
git remote add origin https://github.com/infocomtechvietnam-hub/COMTECH-One.git

# Push
git push -u origin main
```

---

## Step 4: Deploy to Vercel (3 min)

### Option A: Using CLI (Fastest)

```bash
# Install Vercel CLI
npm i -g vercel

# Login with GitHub
vercel login

# Deploy to production
vercel --prod

# Follow prompts:
# ✓ Set up and deploy? → YES
# ✓ Use current directory? → YES
# ✓ Override existing? → YES
# ✓ Enter production domain → www.comtechvietnam.vn
```

### Option B: Using Web Dashboard

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New" > "Project"
4. Select `COMTECH-One` repository
5. Click "Import"
6. In "Environment Variables", add:
   ```
   NEXT_PUBLIC_API_URL=https://www.comtechvietnam.vn
   NEXT_PUBLIC_SITE_URL=https://www.comtechvietnam.vn
   SMTP_HOST=mail90139.maychuemail.com
   SMTP_PORT=465
   SMTP_USER=your-email@your-domain.com
   SMTP_PASS=your-app-password
   ADMIN_EMAIL=admin@comtechvietnam.vn
   ```
7. Click "Deploy"
8. Wait 2-3 minutes for deployment

---

## Step 5: Setup Domain (10 min)

**At your domain hosting provider:**

1. Find DNS Settings for `www.comtechvietnam.vn`
2. Update nameservers OR create CNAME record:

### Option A: Nameservers (Recommended)
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Option B: CNAME Record
```
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

3. Save changes
4. Wait 24 hours for DNS to propagate

**Verify deployment:**
```bash
# Check if domain points to Vercel
ping www.comtechvietnam.vn

# Should resolve to Vercel IP address
```

---

## ✅ Verify Deployment

After DNS propagates:

```bash
# Test website
https://www.comtechvietnam.vn

# Check:
1. Page loads (no 404)
2. SSL lock icon appears 🔒
3. Contact form works
4. Mobile view responsive
5. All pages accessible:
   - /
   - /solutions
   - /solutions/infrastructure
   - /solutions/services
   - /solutions/consulting
   - /about
   - /contact
```

---

## 📊 What You Get

✅ Website live at `https://www.comtechvietnam.vn`
✅ Automatic HTTPS/SSL
✅ Auto-deploy on every `git push`
✅ Global CDN (fast everywhere)
✅ 99.99% uptime SLA
✅ Free tier available

---

## 🔄 After Deployment

### Update Website (Automatic)

```bash
# Make changes
# Edit files in app/*/page.tsx

# Commit and push
git add .
git commit -m "Update: Add new feature"
git push origin main

# ✅ Vercel auto-deploys in 1-2 minutes
```

### Monitor Deployment

```bash
# View logs
vercel logs www.comtechvietnam.vn

# View environment variables
vercel env list

# View analytics
vercel analytics

# Rollback if needed
# Via Vercel Dashboard > Deployments
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check .env.local has all required vars |
| 404 errors | Check DNS is updated to Vercel |
| Contact form doesn't work | Verify SMTP_HOST, SMTP_USER, SMTP_PASS |
| Domain not resolving | Wait 24 hours or use Vercel's test domain |
| SSL certificate pending | Vercel auto-handles, wait 1-2 hours |
| Page loads slow | Clear cache, restart Vercel build |

---

## 📞 Support

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Contact: info@comtechvietnam.vn

---

## 🎯 Complete Checklist

- [ ] Step 1: Setup environment (.env.local created)
- [ ] Step 2: Test locally (npm run dev works)
- [ ] Step 3: Push to GitHub (git push successful)
- [ ] Step 4: Deploy to Vercel (deployment complete)
- [ ] Step 5: Setup domain (DNS updated)
- [ ] Verify: Website loads at www.comtechvietnam.vn
- [ ] Test: All pages work, contact form functional
- [ ] Check: SSL certificate shows 🔒

---

**Ready?** Start with Step 1! ⬆️

**Estimated time:** 20 minutes total (mostly waiting for DNS)
**Cost:** Free (Vercel free tier)
**Downtime:** None (already live)

