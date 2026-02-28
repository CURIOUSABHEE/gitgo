# LinkedIn Scope Error - Fix Guide

## Problem
You're getting this error:
```
error=invalid_scope_error
error_description=The requested permission scope is not valid
```

This means the OAuth scopes we're requesting aren't enabled in your LinkedIn app.

## Solution

LinkedIn has updated their API to use OpenID Connect. We need to:
1. Update the scopes in your LinkedIn app
2. Use the new OpenID scopes

## Step-by-Step Fix

### Step 1: Update LinkedIn App Settings

1. Go to your LinkedIn app: https://www.linkedin.com/developers/apps
2. Click on your app
3. Go to the **"Products"** tab
4. Make sure you have **"Sign In with LinkedIn using OpenID Connect"** added
   - If not, click "Request access" or "Add product"
   - It should be approved instantly

### Step 2: Verify Scopes in Auth Tab

1. Go to the **"Auth"** tab
2. Under **"OAuth 2.0 scopes"**, you should see:
   - ✅ `openid`
   - ✅ `profile`
   - ✅ `email`

3. If you see old scopes like `r_liteprofile` or `r_emailaddress`, that's okay - the new ones should work.

### Step 3: Verify Redirect URLs

Make sure your redirect URL is still there:
```
http://localhost:3000/api/auth/callback/linkedin
```

### Step 4: Save and Test

1. Save any changes in LinkedIn app
2. Restart your Next.js app:
   ```bash
   # Stop the app (Ctrl+C)
   npm run dev
   ```

3. Try connecting again:
   - Go to Settings → Integrations
   - Click "Connect" on LinkedIn
   - Should work now! ✅

## What Changed

### Old Scopes (Deprecated)
```
r_liteprofile
r_emailaddress
```

### New Scopes (OpenID Connect)
```
openid
profile
email
```

The new scopes provide the same data but use the modern OpenID Connect standard.

## Verification

After the fix, when you click "Connect":

1. **LinkedIn Authorization Page** should show:
   - "Sign in with LinkedIn"
   - Permissions:
     - Access your basic profile
     - Access your email address

2. **No Error** - Should redirect back successfully

3. **Connected Status** - LinkedIn should show as connected

## If Still Not Working

### Check 1: Product Access
Go to Products tab and verify:
- ✅ "Sign In with LinkedIn using OpenID Connect" is added
- Status should be "Added" or "Approved"

### Check 2: App Status
- App should not be in "Draft" mode
- App should be "Active"

### Check 3: Restart App
Make sure you restarted the app after code changes:
```bash
npm run dev
```

### Check 4: Clear Browser Cache
Sometimes OAuth state gets cached:
1. Open DevTools (F12)
2. Go to Application tab
3. Clear cookies for localhost
4. Try again

## Alternative: Use LinkedIn API v2 Scopes

If OpenID Connect doesn't work, you can try the v2 API scopes:

1. In LinkedIn app, go to Products tab
2. Add "Sign In with LinkedIn" (not OpenID Connect)
3. Use these scopes in code:
   ```typescript
   scope: "r_liteprofile r_emailaddress"
   ```

But OpenID Connect is recommended as it's the modern standard.

## Testing After Fix

1. **Restart app**
   ```bash
   npm run dev
   ```

2. **Clear browser cookies**
   - DevTools → Application → Cookies → Clear

3. **Try connecting**
   - Settings → Integrations
   - Click "Connect" on LinkedIn

4. **Should work!** ✅

## What Data You'll Get

With the new scopes, you'll receive:
- ✅ LinkedIn ID
- ✅ Full name
- ✅ Email address
- ✅ Profile picture
- ⚠️ Limited access to experience/education (requires additional approval)

## Summary

The fix is simple:
1. ✅ Code updated to use `openid profile email` scopes
2. ✅ Add "Sign In with LinkedIn using OpenID Connect" product
3. ✅ Restart app
4. ✅ Test connection

**Try it now and it should work!** 🚀
