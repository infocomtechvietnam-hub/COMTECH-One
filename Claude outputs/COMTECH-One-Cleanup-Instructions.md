# COMTECH One - Cleanup & GitHub Reset Instructions

## 📋 Summary of Changes

✅ **Removed Duplicates:**
- Exact duplicate markdown files (03-thong-tin-can-comtech_1.md, _2.md)
- Exact duplicate images (desktop-01-trang-chu_1.png, desktop-11-form-thanh-cong_1.png)
- Duplicate deployment guides (DEPLOY_NOW_2.md) and bundle files
- **Total: 11 files removed, ~2 MB freed**

✅ **Reorganized Structure:**
- Deployment guides → `docs/deployment/` (DEPLOYMENT.sh, DEPLOY_NOW.md, VERCEL_DEPLOY.md)
- Technical reports → `docs/reports/` (01-, 02-, 03-*.md)
- Screenshots → `docs/screenshots/` (all .png files)
- Legacy G0 → `docs/g0/` (old bundle + docs)
- **Result: Clean root directory with only core config files**

✅ **Kept Intact:**
- `apps/web/` - Next.js website (642 files)
- `apps/api/` - NestJS backend API (109 files)
- `packages/` - Shared contracts, config, content, database
- `.github/workflows/` - CI/CD pipeline
- Core config files (package.json, turbo.json, docker-compose.yml, etc.)

---

## 🔧 Execute on Your Windows Machine

### Step 1: Update Local Repository

```powershell
# Navigate to your project
cd D:\comtech-one

# Configure git
git config user.email "noreply@anthropic.com"
git config user.name "Claude"

# Pull the cleaned commits
git pull origin main

# Verify the new structure
git log --oneline -5
dir docs\
```

**Expected output:**
- 2 new commits: "refactor: organize..." and "cleanup: remove duplicates..."
- New folders: `docs/deployment/`, `docs/reports/`, `docs/screenshots/`, `docs/g0/`
- Root should only have config files

---

### Step 2: Clear Old Repositories (GitHub Admin Tasks)

You need to clear both old repositories and reset COMTECH-One:

#### Option A: Using GitHub Web Interface (Recommended)

**For comtech-web-app (OLD - to be replaced):**
1. Go to https://github.com/infocomtechvietnam-hub/comtech-web-app
2. Click **Settings** → **General**
3. Scroll to **Danger Zone** → **Delete this repository**
4. Type the repo name to confirm
5. Click **I understand the consequences, delete this repository**

**For COMTECH-One (to reset and re-push cleaned code):**
1. Go to https://github.com/infocomtechvietnam-hub/COMTECH-One
2. Click **Settings** → **General**
3. Scroll to **Danger Zone** → **Delete this repository**
4. Type the repo name to confirm
5. Click **I understand the consequences, delete this repository**

#### Option B: Using GitHub CLI (Faster)

```powershell
# Install GitHub CLI if not already installed
# https://cli.github.com/

gh repo delete infocomtechvietnam-hub/comtech-web-app --confirm
gh repo delete infocomtechvietnam-hub/COMTECH-One --confirm
```

---

### Step 3: Create Fresh COMTECH-One Repository

**Using GitHub Web Interface:**

1. Go to https://github.com/new
2. Fill in:
   - **Repository name:** `COMTECH-One`
   - **Description:** "COMTECH One - Telecommunications Platform (Website + API)"
   - **Public** (or Private, your choice)
   - **Do NOT initialize** with README/gitignore (we already have them)
3. Click **Create repository**

**Using GitHub CLI:**

```powershell
gh repo create COMTECH-One --public --source=. --remote=origin --push
```

---

### Step 4: Push Cleaned Repository to GitHub

```powershell
cd D:\comtech-one

# Verify remote is set
git remote -v
# Output should show: origin https://github.com/infocomtechvietnam-hub/COMTECH-One.git

# If remote needs updating:
git remote remove origin
git remote add origin https://github.com/infocomtechvietnam-hub/COMTECH-One.git

# Push cleaned code
git push -u origin main

# Verify push
git log --oneline -n 3
```

**Expected output:**
```
c2c32e8 refactor: organize root files into proper docs structure
fba0be8 cleanup: remove duplicate deployment files and bundle copies
f6a6c99 Merge remote changes and fix homepage redirect
```

---

### Step 5: Verify Clean Repository

Visit: https://github.com/infocomtechvietnam-hub/COMTECH-One

Check:
- ✅ Latest commits are cleanup commits
- ✅ File structure is clean (no duplicates)
- ✅ `docs/` folder contains organized subdirectories
- ✅ Root has only essential config files
- ✅ `apps/web` and `apps/api` are intact
- ✅ `packages/` contains shared modules

---

## 📁 New Repository Structure

```
COMTECH-One/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── .env.example
├── apps/
│   ├── api/           (NestJS backend - 109 files)
│   └── web/           (Next.js frontend - 642 files)
├── docs/
│   ├── adr/           (Architecture Decision Records)
│   ├── deployment/    (DEPLOYMENT.sh, DEPLOY_NOW.md, VERCEL_DEPLOY.md)
│   ├── reports/       (Technical reports 01-, 02-, 03-*.md)
│   ├── screenshots/   (UI mockups - desktop, mobile, production)
│   ├── g0/            (Legacy G0 bundle + docs - historical reference)
│   ├── open-issues.md
│   └── content-verification.md
├── infra/
├── packages/
│   ├── config/        (Shared configuration)
│   ├── content/       (Content management)
│   ├── contracts/     (API contracts/types)
│   └── db/            (Prisma database schemas)
├── docker-compose.yml
├── Dockerfile
├── README.md
├── SECURITY.md
├── SETUP_CHECKLIST_D_DRIVE.md
├── comtech-one.bundle (Project backup)
├── package.json
├── package-lock.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── turbo.json
```

---

## ✅ Checklist

- [ ] Step 1: `git pull origin main` - local repo updated
- [ ] Step 2A/B: Old repositories deleted (comtech-web-app, COMTECH-One)
- [ ] Step 3: New COMTECH-One repository created
- [ ] Step 4: `git push -u origin main` - cleaned code pushed
- [ ] Step 5: GitHub shows clean repository with new structure
- [ ] Verify: No duplicate files in repository
- [ ] Verify: `docs/` folder properly organized
- [ ] Verify: All commits preserved in history

---

## 🚀 Next Steps After Push

1. **Update CI/CD**: Verify `.github/workflows/ci.yml` runs correctly
2. **Deploy to Vercel**: Run `vercel --prod` or set up auto-deploy in Vercel dashboard
3. **Configure environment**: Copy `DEPLOY_NOW.md` guide to team
4. **Archive old repo**: Keep backup of old comtech-web-app data locally if needed

---

## 📞 Questions?

Refer to these files in the repo:
- `docs/deployment/DEPLOY_NOW.md` - Complete deployment guide
- `docs/reports/` - Technical analysis documents
- `docs/g0/` - Historical documentation from previous versions
- `README.md` - Project overview

