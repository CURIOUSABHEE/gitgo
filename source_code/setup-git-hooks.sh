#!/bin/bash

# Setup Git hooks to prevent committing sensitive files

echo "🔒 Setting up Git security hooks..."

# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Check if .env is being committed
if git diff --cached --name-only | grep -E "^(source_code/)?\.env$"; then
    echo ""
    echo "❌ ERROR: Attempting to commit .env file!"
    echo ""
    echo "The .env file contains sensitive credentials and should NEVER be committed."
    echo ""
    echo "To fix this:"
    echo "  git reset HEAD .env"
    echo "  git reset HEAD source_code/.env"
    echo ""
    exit 1
fi

# Check for common secrets in staged files
if git diff --cached | grep -E "(mongodb\+srv://|redis://.*@|MONGODB_URI=mongodb|REDIS_URL=redis://.*@|sk-[a-zA-Z0-9]{32,}|ghp_[a-zA-Z0-9]{36})"; then
    echo ""
    echo "⚠️  WARNING: Possible secret detected in staged files!"
    echo ""
    echo "Please review your changes and ensure no credentials are being committed."
    echo ""
    read -p "Continue anyway? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "❌ Commit aborted."
        exit 1
    fi
fi

echo "✅ Pre-commit checks passed"
EOF

# Make hook executable
chmod +x .git/hooks/pre-commit

echo "✅ Pre-commit hook installed!"
echo ""
echo "This hook will:"
echo "  - Prevent committing .env files"
echo "  - Warn about potential secrets in code"
echo ""
echo "To test it, try: git add .env && git commit -m 'test'"
echo ""
