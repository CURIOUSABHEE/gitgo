# 🚨 SECURITY INCIDENT - IMMEDIATE ACTION REQUIRED

## What Happened
Your `.env` file containing sensitive credentials was accidentally committed to Git and pushed to GitHub.

## IMMEDIATE ACTIONS REQUIRED (Do these NOW!)

### 1. Rotate MongoDB Credentials
**CRITICAL - Do this first!**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your cluster
3. Go to "Database Access"
4. Delete the compromised user OR change the password
5. Create a new database user with a strong password
6. Update connection string in your local `.env` file
7. **DO NOT commit the new .env file**

### 2. Rotate GitHub OAuth Credentials

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Find your OAuth App
3. Click "Generate a new client secret"
4. Delete the old secret
5. Update `GITHUB_CLIENT_SECRET` in your local `.env` file

### 3. Generate New NextAuth Secret

```bash
# Generate a new secret
openssl rand -base64 32
```

Update `NEXTAUTH_SECRET` in your local `.env` file

### 4. Rotate Redis Credentials (if exposed)

1. Go to your Redis provider dashboard
2. Regenerate password or create new instance
3. Update `REDIS_URL` in your local `.env` file

## Remove .env from Git History

### Option 1: Using BFG Repo-Cleaner (Recommended)

```bash
# Install BFG
brew install bfg  # macOS
# or download from https://rtyley.github.io/bfg-repo-cleaner/

# Clone a fresh copy
git clone --mirror https://github.com/yourusername/gitgo.git

# Remove .env from history
bfg --delete-files .env gitgo.git

# Clean up
cd gitgo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (WARNING: This rewrites history!)
git push --force
```

### Option 2: Using git filter-branch

```bash
# Navigate to your repo
cd source_code

# Remove .env from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This rewrites history!)
git push origin --force --all
git push origin --force --tags
```

### Option 3: If you can't rewrite history

If others have already cloned the repo, consider:
1. Delete the repository on GitHub
2. Create a new repository
3. Push clean code without .env

## Verify .env is Ignored

```bash
# Check .gitignore
cat .gitignore | grep .env

# Verify .env is not tracked
git status

# If .env shows up, remove it:
git rm --cached .env
git commit -m "Remove .env from tracking"
git push
```

## Update .env.example

Make sure `.env.example` only contains placeholder values:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Database
MONGODB_URI=mongodb://localhost:27017/gitgo

# Redis
REDIS_URL=redis://localhost:6379
```

## Prevention for Future

### 1. Add pre-commit hook

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash

# Check if .env is being committed
if git diff --cached --name-only | grep -q "^\.env$"; then
    echo "ERROR: Attempting to commit .env file!"
    echo "Please remove it from staging: git reset HEAD .env"
    exit 1
fi
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

### 2. Use git-secrets

```bash
# Install git-secrets
brew install git-secrets  # macOS

# Set up in your repo
cd source_code
git secrets --install
git secrets --register-aws
```

### 3. Enable GitHub Secret Scanning

1. Go to your repository settings
2. Navigate to "Security & analysis"
3. Enable "Secret scanning"
4. Enable "Push protection"

## Verify Security

After rotating all credentials:

1. ✅ MongoDB credentials changed
2. ✅ GitHub OAuth secret regenerated
3. ✅ NextAuth secret regenerated
4. ✅ Redis credentials changed (if applicable)
5. ✅ .env removed from Git history
6. ✅ .env in .gitignore
7. ✅ New credentials in local .env only
8. ✅ .env.example has no real credentials
9. ✅ Pre-commit hook installed
10. ✅ GitHub secret scanning enabled

## Monitor for Suspicious Activity

- Check MongoDB Atlas access logs
- Monitor GitHub OAuth app usage
- Watch for unusual database queries
- Check Redis connection logs

## Timeline

- **Immediately**: Rotate all credentials
- **Within 1 hour**: Remove .env from Git history
- **Within 24 hours**: Monitor for suspicious activity
- **Ongoing**: Use pre-commit hooks and secret scanning

## Need Help?

If you see suspicious activity:
1. Immediately revoke all access
2. Create new database/services
3. Review all recent commits
4. Check application logs

---

**Remember**: Never commit `.env` files. Always use `.env.example` with placeholder values.
