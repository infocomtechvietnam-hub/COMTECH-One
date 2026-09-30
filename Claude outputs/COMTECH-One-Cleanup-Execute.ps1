# COMTECH One - GitHub Cleanup & Reset Script
# Run this script from D:\comtech-one on Windows
# Requires: git, GitHub CLI (gh) installed

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   COMTECH One - GitHub Cleanup & Fresh Repository Reset  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Configuration
$projectPath = "D:\comtech-one"
$repoUrl = "https://github.com/infocomtechvietnam-hub/COMTECH-One.git"
$oldRepoUrl = "https://github.com/infocomtechvietnam-hub/comtech-web-app.git"

# Step 1: Verify environment
Write-Host "[1/6] Checking environment..." -ForegroundColor Yellow
if (!(Test-Path $projectPath)) {
    Write-Host "❌ Directory not found: $projectPath" -ForegroundColor Red
    exit 1
}

cd $projectPath

if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git not found. Please install Git." -ForegroundColor Red
    exit 1
}

if (!(Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  GitHub CLI (gh) not found. Install from: https://cli.github.com/" -ForegroundColor Yellow
    Write-Host "   You can still use GitHub web interface for repo deletion." -ForegroundColor Gray
    $useGH = $false
} else {
    $useGH = $true
}

Write-Host "✓ Environment OK" -ForegroundColor Green
Write-Host ""

# Step 2: Update local repository
Write-Host "[2/6] Updating local repository with cleaned commits..." -ForegroundColor Yellow
git config user.email "noreply@anthropic.com"
git config user.name "Claude"
git pull origin main 2>&1 | Select-Object -First 10

Write-Host "✓ Repository updated" -ForegroundColor Green
Write-Host ""

# Step 3: Verify new structure
Write-Host "[3/6] Verifying cleaned structure..." -ForegroundColor Yellow
$expectedFolders = @("docs\deployment", "docs\reports", "docs\screenshots", "docs\g0", "apps\web", "apps\api")
$missing = @()

foreach ($folder in $expectedFolders) {
    if (Test-Path $folder) {
        Write-Host "  ✓ $folder" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $folder (MISSING)" -ForegroundColor Red
        $missing += $folder
    }
}

if ($missing.Count -gt 0) {
    Write-Host "⚠️  Some expected folders are missing. Continue anyway? (Y/n)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq "n") { exit 1 }
}
Write-Host ""

# Step 4: Show cleanup summary
Write-Host "[4/6] Cleanup Summary:" -ForegroundColor Yellow
Write-Host "  Latest commits:" -ForegroundColor Gray
git log --oneline -3 | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }

Write-Host ""
Write-Host "  Repository size: " -ForegroundColor Gray -NoNewline
$size = (du -r . --exclude=.git --exclude=node_modules --exclude=.next | Measure-Object -Sum).Sum / 1MB
Write-Host "$([Math]::Round($size, 2)) MB" -ForegroundColor Cyan
Write-Host ""

# Step 5: GitHub repository reset options
Write-Host "[5/6] GitHub Repository Reset Options:" -ForegroundColor Yellow
Write-Host ""
Write-Host "This script can:" -ForegroundColor Gray
Write-Host "  1. Delete old 'comtech-web-app' repository" -ForegroundColor Gray
Write-Host "  2. Delete and recreate 'COMTECH-One' repository" -ForegroundColor Gray
Write-Host "  3. Push cleaned code to the new repository" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  WARNING: Repository deletion is permanent and cannot be undone!" -ForegroundColor Red
Write-Host ""

$confirm = Read-Host "Do you want to proceed with GitHub cleanup? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Cancelled by user." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "IMPORTANT: You must manually handle GitHub repository deletion!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Step 1 - Delete old repository (comtech-web-app):" -ForegroundColor Yellow
Write-Host "  Option A (Web): Settings → Danger Zone → Delete repository" -ForegroundColor Gray
Write-Host "  Option B (CLI): gh repo delete infocomtechvietnam-hub/comtech-web-app --confirm" -ForegroundColor Gray
Write-Host ""
Write-Host "Step 2 - Delete current repository (COMTECH-One):" -ForegroundColor Yellow
Write-Host "  Option A (Web): Settings → Danger Zone → Delete repository" -ForegroundColor Gray
Write-Host "  Option B (CLI): gh repo delete infocomtechvietnam-hub/COMTECH-One --confirm" -ForegroundColor Gray
Write-Host ""
Write-Host "Step 3 - Create fresh repository:" -ForegroundColor Yellow
Write-Host "  Go to: https://github.com/new" -ForegroundColor Gray
Write-Host "  Name: COMTECH-One" -ForegroundColor Gray
Write-Host "  Description: COMTECH One - Telecommunications Platform" -ForegroundColor Gray
Write-Host "  Do NOT initialize with README (we already have it)" -ForegroundColor Gray
Write-Host ""

Write-Host "Press ENTER after completing GitHub cleanup..." -ForegroundColor Cyan
Read-Host

# Step 6: Push cleaned repository
Write-Host "[6/6] Pushing cleaned code to GitHub..." -ForegroundColor Yellow

# Verify remote
$remoteUrl = (git config --get remote.origin.url)
if ($remoteUrl -ne $repoUrl -and $remoteUrl -ne "https://github.com/infocomtechvietnam-hub/COMTECH-One.git") {
    Write-Host "Updating git remote..." -ForegroundColor Gray
    git remote remove origin
    git remote add origin $repoUrl
}

# Push
Write-Host "Pushing to $repoUrl..." -ForegroundColor Gray
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Push successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Push failed. Check your GitHub credentials and try again." -ForegroundColor Red
    Write-Host "Manual command: git push -u origin main" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                   ✅ CLEANUP COMPLETE!                    ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Verify repository: https://github.com/infocomtechvietnam-hub/COMTECH-One" -ForegroundColor Gray
Write-Host "  2. Check CI/CD in Actions tab" -ForegroundColor Gray
Write-Host "  3. Deploy: npm install && npm run build" -ForegroundColor Gray
Write-Host "  4. Deploy to Vercel: vercel --prod" -ForegroundColor Gray
Write-Host ""

Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "  • Deployment: docs/deployment/DEPLOY_NOW.md" -ForegroundColor Gray
Write-Host "  • Reports: docs/reports/" -ForegroundColor Gray
Write-Host "  • Legacy docs: docs/g0/" -ForegroundColor Gray
Write-Host ""
