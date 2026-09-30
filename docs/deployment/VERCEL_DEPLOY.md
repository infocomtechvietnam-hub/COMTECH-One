# COMTECH Website - Vercel Deployment Guide

## ⚡ Full Automated Deployment (5 minutes)

### Step 1: Prepare Environment (2 min)

```bash
# 1. Go to project directory
cd /path/to/comtech-website

# 2. Run deployment setup script
bash DEPLOYMENT.sh

# 3. Edit .env.local with your credentials
nano .env.local  # Or use your editor

# ✅ Update these fields:
# SMTP_USER=your-email@your-domain.com
# SMTP_PASS=your-app-password-from-mail90139
```

**Get SMTP Password:**
- Go to: https://mail90139.maychuemail.com/
- Login with your email
- Find "App Password" or "Generate Password"
- Copy to SMTP_PASS in .env.local

### Step 2: Test Locally (2 min)

```bash
# Start development server
npm run dev

# Open browser: http://localhost:3000
# Test:
# ✓ Pages load correctly
# ✓ Contact form works
# ✓ Responsive design (mobile view)
# ✓ Navigation links work

# Stop: Ctrl+C
```

### Step 3: Push to GitHub (1 min)

```bash
# Navigate to project
cd /path/to/comtech-website

# Initialize git (if not already done)
git init
git add .
git commit -m "Deploy: COMTECH website v1.0"
git branch -M main

# Add GitHub remote
git remote add origin https://github.com/infocomtechvietnam-hub/COMTECH-One.git

# Push to GitHub
git push -u origin main
```

### Step 4: Deploy to Vercel

#### Option A: Web Dashboard (Easiest)

1. Go to https://vercel.com
2. Click "Log in" > "Continue with GitHub"
3. Authorize Vercel to access your GitHub
4. Click "Add New" > "Project"
5. Find and select `COMTECH-One` repository
6. Click "Import"
7. **Configure Environment Variables:**
   - Click "Environment Variables"
   - Add these variables:
     ```
     NEXT_PUBLIC_API_URL=https://www.comtechvietnam.vn
     NEXT_PUBLIC_SITE_URL=https://www.comtechvietnam.vn
     SMTP_HOST=mail90139.maychuemail.com
     SMTP_PORT=465
     SMTP_USER=your-email@your-domain.com
     SMTP_PASS=your-app-password
     ADMIN_EMAIL=admin@comtechvietnam.vn
     ```
8. Click "Deploy"
9. ✅ Wait for deployment to complete (2-3 min)

#### Option B: CLI (Terminal)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy to production
vercel --prod

# 4. Follow prompts:
# - Set up and deploy? YES
# - Use current directory? YES
# - Override existing? YES
# - Enter production URL domain: www.comtechvietnam.vn
```

### Step 5: Connect Domain (10 min)

**At your hosting provider (where you have www.comtechvietnam.vn):**

1. Go to DNS settings
2. Update nameservers to Vercel:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com

**Or use CNAME record:**
- Name: www
- Value: cname.vercel-dns.com

3. Wait for DNS propagation (up to 24 hours)

**Verify deployment:**
```bash
# Check DNS is pointing to Vercel
dig www.comtechvietnam.vn
# Should show Vercel IP
```

### Step 6: Setup SSL (Automatic)

Vercel automatically handles SSL certificates. Your site will be:
- `https://www.comtechvietnam.vn` ✅

## 📧 Email Configuration

### Test Email Notifications

After deployment, test the contact form:

```bash
# Local testing (before deploy)
npm run dev

# 1. Go to http://localhost:3000/contact
# 2. Fill form with test data
# 3. Submit
# 4. Check console for logged lead
# 5. (Emails sent if SMTP configured)
```

### Enable Email Sending

Edit `app/api/leads/route.ts` to send emails:

```typescript
// Add nodemailer
npm install nodemailer @types/nodemailer

// Update route.ts to send email via SMTP
// See README.md section "Email Notifications"
```

## 🔍 Monitoring & Troubleshooting

### Check Deployment Status

```bash
# View deployment logs
vercel logs www.comtechvietnam.vn

# View environment variables
vercel env list

# Rebuild
vercel --prod --force
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check `.env.local` has correct values |
| 404 pages | Ensure all files deployed correctly |
| Contact form error | Check SMTP credentials in env vars |
| DNS not resolving | Wait 24 hours or check DNS records |
| SSL not working | Vercel auto-handles, may take hours |

## 📊 Deployment Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` created with credentials
- [ ] Local test passed (`npm run dev`)
- [ ] Code pushed to GitHub main branch
- [ ] Vercel project created and connected
- [ ] Environment variables configured in Vercel
- [ ] Initial deployment completed
- [ ] Domain DNS updated to Vercel
- [ ] SSL certificate issued (automatic)
- [ ] Contact form tested
- [ ] All pages accessible

## 🚀 After Deployment

### Monitor Performance
- Vercel Analytics dashboard
- Check build times
- Monitor API response times

### Setup Alerts
1. Go to Vercel Dashboard
2. Project Settings > Alerts
3. Enable notifications for:
   - Build failures
   - Performance degradation
   - Errors in production

### Auto-Deploy on Push
Vercel automatically deploys when you:
```bash
git push origin main
```

### Rollback if Needed
```bash
# Via Vercel Dashboard:
# Deployments > Click previous version > Click "Promote to Production"
```

## 📈 Performance Optimization

After deployment:

1. **Enable Caching:**
   - Vercel handles by default

2. **Optimize Images:**
   - Use Next.js Image component (already done)

3. **Monitor Core Web Vitals:**
   - Vercel Analytics dashboard

4. **Setup CDN:**
   - Vercel Pro includes global CDN

## 🔒 Security

- SSL/TLS: Automatic ✅
- Environment variables: Encrypted ✅
- Rate limiting: Configure if needed
- CORS: Configured for API

## 📱 Test on Mobile

After deployment:

1. Open `https://www.comtechvietnam.vn` on phone
2. Test:
   - Menu navigation
   - Contact form
   - Page responsiveness
   - Images load correctly

## 🎯 Final Verification

```bash
# After DNS propagates (24 hours):

# 1. Visit website
https://www.comtechvietnam.vn

# 2. Check all pages load
- Home: https://www.comtechvietnam.vn/
- Solutions: https://www.comtechvietnam.vn/solutions
- About: https://www.comtechvietnam.vn/about
- Contact: https://www.comtechvietnam.vn/contact

# 3. Test contact form
- Fill & submit
- Check for success message

# 4. Check SSL
- Browser shows 🔒 lock icon
- Certificate is valid

# 5. Performance
- Page loads in <2 seconds
- No console errors
```

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Contact Support:** info@comtechvietnam.vn

---

## ⚡ Quick Commands

```bash
# Full setup & deployment
bash DEPLOYMENT.sh                    # Setup
npm run dev                           # Test locally
git add . && git commit -m "Deploy"   # Commit
git push -u origin main               # Push to GitHub
vercel --prod                         # Deploy to Vercel

# Monitor
vercel logs www.comtechvietnam.vn     # View logs
vercel env list                       # List env vars
vercel analytics                      # View analytics
```

---

**Status:** ✅ Ready to Deploy  
**Next:** Run `bash DEPLOYMENT.sh` to start!
