# 🚀 GitHub Setup Guide - ImageWord Ministries

## Overview: Two-Branch Strategy

```
main branch (PRIVATE)     →  Full project with all files (your backup)
demo branch (PUBLIC-SAFE) →  Sanitized version for portfolio
```

---

## STEP 1: Initialize Git Repository

Open your terminal in the project root folder and run:

```bash
git init
git add .
git commit -m "Initial commit - ImageWord Ministries church website"
```

---

## STEP 2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `imageword-ministries`
3. Description: `Modern church website with Next.js 14, Supabase, and admin dashboard`
4. **Set to PRIVATE** (important for main branch security)
5. Do NOT initialize with README (we already have one)
6. Click "Create repository"

---

## STEP 3: Connect Local to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/imageword-ministries.git
git branch -M main
git push -u origin main
```

---

## STEP 4: Create Demo Branch for Portfolio

```bash
# Create and switch to demo branch
git checkout -b demo
```

---

## STEP 5: Remove Sensitive Files from Demo Branch

Run these commands to remove sensitive files from the demo branch ONLY:

```bash
# Remove SQL scripts (contain database structure)
git rm -r --cached docs/*.sql

# Remove Kiro/IDE configuration
git rm -r --cached .kiro/

# Remove any accidentally committed env files (if any)
git rm --cached .env.local 2>nul
git rm --cached admin/.env.local 2>nul

# Remove internal documentation (optional)
git rm --cached STORAGE-COMPLETE.md 2>nul
git rm --cached PROJECT-SUMMARY.md 2>nul
git rm -r --cached admin/docs/ 2>nul
```

---

## STEP 6: Create Demo-Specific .gitignore

Create a file called `.gitignore-demo` with additional exclusions, then merge it:

The demo branch should have these ADDITIONAL items in .gitignore:

```bash
# Add to .gitignore for demo branch
echo. >> .gitignore
echo # Demo Branch - Additional Exclusions >> .gitignore
echo docs/*.sql >> .gitignore
echo .kiro/ >> .gitignore
echo admin/docs/ >> .gitignore
echo STORAGE-COMPLETE.md >> .gitignore
echo PROJECT-SUMMARY.md >> .gitignore
```

---

## STEP 7: Replace README for Portfolio

```bash
# Backup original README
copy README.md README-ORIGINAL.md

# Use portfolio README
copy README-PORTFOLIO.md README.md

# Remove the portfolio template
del README-PORTFOLIO.md
```

---

## STEP 8: Commit Demo Branch

```bash
git add .
git commit -m "Create portfolio demo version - sanitized for public viewing"
```

---

## STEP 9: Push Demo Branch

```bash
git push -u origin demo
```

---

## STEP 10: Make Demo Branch Public (Optional)

If you want the demo branch publicly visible while keeping main private:

### Option A: Keep Single Repo (Recommended)
1. Go to your repo on GitHub
2. Settings → Branches → Add branch protection rule
3. Protect `main` branch from public access
4. Share only the `demo` branch URL with portfolio viewers

### Option B: Create Separate Public Repo
```bash
# Create a new public repo on GitHub called "imageword-ministries-demo"
# Then push demo branch to it:
git remote add public https://github.com/YOUR_USERNAME/imageword-ministries-demo.git
git push public demo:main
```

---

## 📋 Quick Reference Commands

### Switch Between Branches
```bash
# Go to main (full project)
git checkout main

# Go to demo (portfolio version)
git checkout demo
```

### Update Main Branch (Regular Development)
```bash
git checkout main
git add .
git commit -m "Your commit message"
git push origin main
```

### Update Demo Branch (After Main Updates)
```bash
git checkout demo
git merge main --no-commit
# Remove sensitive files again if needed
git rm -r --cached docs/*.sql
git rm -r --cached .kiro/
git commit -m "Merge updates from main"
git push origin demo
```

---

## 🔒 Security Checklist

Before pushing to demo branch, verify these files are NOT included:

- [ ] `.env.local` - Contains Supabase keys
- [ ] `admin/.env.local` - Contains service role key
- [ ] `docs/*.sql` - Contains database schema
- [ ] `.kiro/` - Contains IDE configuration
- [ ] Any file with API keys, passwords, or secrets

---

## 📁 Files Safe for Demo Branch

These are fine to include in your portfolio:

- ✅ All `/src` files (React components, pages)
- ✅ All `/admin/src` files (admin components)
- ✅ `/public` folder (images, assets)
- ✅ `package.json` files
- ✅ `tailwind.config.js`
- ✅ `next.config.js`
- ✅ `.env.example` files (templates without values)
- ✅ `README.md` (portfolio version)

---

## 🎯 Portfolio Tips

1. **Add Screenshots**: Create a `/screenshots` folder with images of your site
2. **Live Demo**: Deploy to Vercel and add the link to README
3. **Customize README**: Update author info, links, and description
4. **Star Your Repo**: It looks more professional with activity

---

## Need Help?

If you encounter issues:

```bash
# Check current branch
git branch

# Check what files are tracked
git ls-files

# Check git status
git status

# View commit history
git log --oneline
```
