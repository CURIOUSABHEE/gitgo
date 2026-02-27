# 🔒 Security Incident Response Checklist

## ✅ Immediate Actions (Do NOW - within 15 minutes)

### 1. Rotate MongoDB Credentials
- [ ] Log into [MongoDB Atlas](https://cloud.mongodb.com/)
- [ ] Go to Database Access
- [ ] Delete compromised user OR change password
- [ ] Create new user with strong password
- [ ] Update local `.env` with new connection string
- [ ] Test connection: `mongosh "your-new-connection-string"`

### 2. Rotate GitHub OAuth Credentials
- [ ] Go to [GitHub Developer Settings](https://github.com/settings/developers)
- [ ] Find your OAuth App
- [ ] Generate new client secret
- [ ] Delete old secret
- [ ] Update `GITHUB_CLIENT_SECRET` in local `.env`

### 3. Generate New NextAuth Secret
```bash
openssl rand -base64 32
```
- [ ] Copy generated secret
- [ ] Update `NEXTAUTH_SECRET` in local `.env`

### 4. Rotate Redis Credentials (if exposed)
- [ ] Log into Redis provider
- [ ] Regenerate password or create new instance
- [ ] Update `REDIS_URL` in local `.env`

## ✅ Remove from Git History (within 1 hour)

### Option A: Automated Script (Recommended)
```bash
cd source_code
./remove-env-from-history.sh
```

### Option B: Manual Removal
```bash
cd source_code

# Remove .env from Git tracking
git rm --cached .env

# Remove from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch source_code/.env .env" \
  --prune-empty --tag-name-filter cat -- --all

# Clean up
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Verify Removal
```bash
# Should return nothing
git log --all --full-history -- ".env"
```

### Force Push Changes
```bash
# WARNING: This rewrites history!
git push origin --force --all
git push origin --force --tags
```

## ✅ Prevent Future Incidents

### 1. Install Git Hooks
```bash
cd source_code
./setup-git-hooks.sh
```

### 2. Test Pre-commit Hook
```bash
# This should fail
git add .env
git commit -m "test"
```

### 3. Enable GitHub Secret Scanning
- [ ] Go to repository Settings
- [ ] Navigate to "Security & analysis"
- [ ] Enable "Secret scanning"
- [ ] Enable "Push protection"

### 4. Verify .gitignore
```bash
cat .gitignore | grep .env
# Should show: .env
```

## ✅ Monitor for Suspicious Activity (24-48 hours)

### MongoDB Atlas
- [ ] Check "Activity Feed" for unusual access
- [ ] Review "Access List" for unknown IPs
- [ ] Check "Metrics" for unusual query patterns

### GitHub OAuth App
- [ ] Check app installations
- [ ] Review recent authorizations
- [ ] Monitor for unusual API usage

### Application Logs
- [ ] Check for failed authentication attempts
- [ ] Monitor for unusual database queries
- [ ] Watch for unexpected API calls

## ✅ Update Documentation

- [ ] Update README.md with security best practices
- [ ] Document incident in SECURITY_INCIDENT.md
- [ ] Update team on what happened (if applicable)

## ✅ Final Verification

- [ ] ✅ All credentials rotated
- [ ] ✅ .env removed from Git history
- [ ] ✅ .env in .gitignore
- [ ] ✅ Pre-commit hooks installed
- [ ] ✅ GitHub secret scanning enabled
- [ ] ✅ .env.example has no real credentials
- [ ] ✅ Local .env has new credentials
- [ ] ✅ Application works with new credentials
- [ ] ✅ No suspicious activity detected

## 📞 Emergency Contacts

If you detect suspicious activity:

1. **MongoDB**: Immediately delete the database user
2. **GitHub**: Revoke OAuth app access
3. **Redis**: Delete the instance and create new one
4. **Application**: Take offline if necessary

## 🎓 Lessons Learned

### What Went Wrong
- .env file was committed to Git
- Credentials were exposed in public repository
- GitHub detected and sent alert

### Prevention
- Always use .gitignore for sensitive files
- Use pre-commit hooks to catch mistakes
- Enable GitHub secret scanning
- Regular security audits
- Use environment variable management tools (e.g., Doppler, Vault)

### Best Practices Going Forward
1. Never commit .env files
2. Use .env.example with placeholders
3. Rotate credentials regularly
4. Use different credentials for dev/staging/prod
5. Enable all available security features
6. Review commits before pushing
7. Use secret management tools for production

## 📚 Additional Resources

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [git-secrets Tool](https://github.com/awslabs/git-secrets)

---

**Remember**: Security is not a one-time task. Stay vigilant!
