#!/bin/bash

# Script to remove .env from Git history
# WARNING: This rewrites Git history!

echo "🚨 WARNING: This will rewrite Git history!"
echo "Make sure you have:"
echo "  1. Rotated ALL credentials in .env"
echo "  2. Backed up your repository"
echo "  3. Informed collaborators (if any)"
echo ""
read -p "Have you completed the above steps? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted. Please complete the steps first."
    exit 1
fi

echo ""
echo "📋 Removing .env from Git history..."
echo ""

# Remove .env from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch source_code/.env .env" \
  --prune-empty --tag-name-filter cat -- --all

echo ""
echo "🧹 Cleaning up..."
echo ""

# Clean up
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "✅ .env removed from Git history!"
echo ""
echo "Next steps:"
echo "  1. Verify .env is not in history: git log --all --full-history -- '.env'"
echo "  2. Force push to remote: git push origin --force --all"
echo "  3. Force push tags: git push origin --force --tags"
echo ""
echo "⚠️  IMPORTANT: All collaborators must re-clone the repository!"
echo ""
