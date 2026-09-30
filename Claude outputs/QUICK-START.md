# COMTECH One - Quick Start Cleanup Guide

**TL;DR - Execute in 5 minutes:**

```powershell
# 1. Update local repo
cd D:\comtech-one
git pull origin main

# 2. Verify changes
git log --oneline -3
ls docs\deployment\
ls docs\reports\
ls docs\screenshots\

# 3. ⚠️ DELETE GITHUB REPOS (can't be undone!)
# Go to: https://github.com/infocomtechvietnam-hub/comtech-web-app
#   → Settings → Danger Zone → Delete
# Go to: https://github.com/infocomtechvietnam-hub/COMTECH-One
#   → Settings → Danger Zone → Delete

# 4. CREATE NEW REPO
# Go to: https://github.com/new
# Name: COMTECH-One
# Public
# Do NOT initialize

# 5. PUSH CLEANED CODE
git remote remove origin
git remote add origin https://github.com/infocomtechvietnam-hub/COMTECH-One.git
git push -u origin main
```

---

## What Changed?

✅ **Removed:** 11 duplicate/old files (~2 MB)
✅ **Organized:** deployment guides, reports, screenshots into docs/
✅ **Kept:** All source code (apps/, packages/), all config
✅ **Archived:** Legacy G0 in docs/g0/

---

## Files to Download

1. **COMTECH-One-Analysis-Report.md** - Full analysis with MD5 verification
2. **COMTECH-One-Cleanup-Instructions.md** - Detailed step-by-step guide
3. **COMTECH-One-Cleanup-Execute.ps1** - Automated PowerShell script

---

## Verify New Structure

After `git pull`, you should see:

```
docs/
├── deployment/        ← DEPLOYMENT.sh, DEPLOY_NOW.md, VERCEL_DEPLOY.md
├── reports/          ← 01-, 02-, 03-*.md technical reports
├── screenshots/      ← All .png mockups
├── g0/              ← Legacy G0 bundle + docs
└── ...              ← Other existing docs
```

Root should only have:
- apps/, packages/, .github/ (folders)
- package.json, turbo.json, docker-compose.yml, .env.example (files)
- NO duplicate images, NO DEPLOY_NOW_2.md, NO duplicate bundles

---

## Common Issues

**Q: Can I undo GitHub deletion?**  
A: No. Make sure you have local backup (you do - in D:\comtech-one).

**Q: Git push fails?**  
A: Check GitHub repo exists and you have write access. Verify remote:  
```powershell
git remote -v
```

**Q: Where are old files?**  
A: Duplicates are deleted. Legacy items in docs/g0/. Original source stays in apps/.

---

**Ready?** Run the PowerShell script or follow detailed instructions.
