# LinkedIn Integration - Testing Guide

## Prerequisites Checklist

Before testing, verify:
- ✅ LinkedIn Client ID added to `.env`
- ✅ LinkedIn Client Secret added to `.env`
- ✅ Redirect URL added to LinkedIn app: `http://localhost:3000/api/auth/callback/linkedin`
- ✅ Scopes approved in LinkedIn app: `r_liteprofile`, `r_emailaddress`
- ✅ App is running: `npm run dev`
- ✅ You're logged in with GitHub first

## Step-by-Step Testing

### Step 1: Verify Environment Variables

Check your `.env` file has:
```env
LINKEDIN_CLIENT_ID=your_actual_client_id
LINKEDIN_CLIENT_SECRET=your_actual_client_secret
```

**Important:** Restart your app after adding these!
```bash
# Stop the app (Ctrl+C)
npm run dev
```

### Step 2: Check LinkedIn App Settings

Go to your LinkedIn app settings and verify:

1. **Redirect URLs** includes:
   ```
   http://localhost:3000/api/auth/callback/linkedin
   ```

2. **OAuth 2.0 scopes** includes:
   - ✅ r_liteprofile
   - ✅ r_emailaddress

3. **App status** is:
   - ✅ Not in draft mode
   - ✅ Verified (if required)

### Step 3: Test OAuth Connection

1. **Navigate to Settings**
   ```
   http://localhost:3000/dashboard/settings
   ```
   Click on "Integrations" tab

2. **Check LinkedIn Card**
   - Should show "Not connected" status
   - Should have a "Connect" button

3. **Click "Connect" Button**
   - Should redirect to LinkedIn
   - LinkedIn authorization page should appear

4. **Authorize the App**
   - Review permissions requested
   - Click "Allow" or "Authorize"

5. **Verify Redirect**
   - Should redirect back to: `http://localhost:3000/dashboard/settings`
   - LinkedIn card should now show "Connected" ✅

### Step 4: Test Data Sync

1. **Click "Re-sync Data" Button**
   - Button should show "Syncing..." with spinner
   - Wait for completion (2-5 seconds)

2. **Check for Success**
   - Button should return to "Re-sync Data"
   - Last synced time should update

3. **Verify in Browser Console**
   - Open DevTools (F12)
   - Check Console tab
   - Should see: "LinkedIn data synced successfully"

### Step 5: Verify Data in MongoDB

**Option A: Using MongoDB Compass**
1. Connect to: `mongodb://localhost:27017/gitgo`
2. Go to `users` collection
3. Find your user document
4. Check for LinkedIn fields:
   ```json
   {
     "linkedinId": "...",
     "linkedinAccessToken": "...",
     "linkedinProfile": {
       "headline": "...",
       "profilePicture": "..."
     },
     "linkedinLastSynced": "2024-..."
   }
   ```

**Option B: Using MongoDB Shell**
```bash
mongosh
use gitgo
db.users.findOne({ email: "your@email.com" })
```

Look for:
- `linkedinId` - Should have a value
- `linkedinAccessToken` - Should have a token
- `linkedinProfile` - Should have profile data
- `linkedinLastSynced` - Should have recent timestamp

### Step 6: Test API Endpoints Directly

**Check Connection Status:**
```bash
curl http://localhost:3000/api/linkedin/status \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

Expected response:
```json
{
  "connected": true,
  "lastSynced": "2024-02-28T10:30:00.000Z"
}
```

**Trigger Sync:**
```bash
curl -X POST http://localhost:3000/api/linkedin/sync \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

Expected response:
```json
{
  "success": true,
  "message": "LinkedIn data synced successfully",
  "data": {
    "profile": { ... },
    "experience": [],
    "education": [],
    "skills": []
  }
}
```

## Troubleshooting

### Issue 1: "Connect" Button Does Nothing

**Symptoms:**
- Click "Connect" but nothing happens
- No redirect to LinkedIn

**Solutions:**
1. Check browser console for errors
2. Verify `LINKEDIN_CLIENT_ID` is set correctly
3. Restart the app after adding env variables
4. Check NextAuth configuration

**Debug:**
```javascript
// In browser console
console.log(process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID)
```

### Issue 2: "Redirect URI Mismatch" Error

**Symptoms:**
- Redirects to LinkedIn
- Shows error: "redirect_uri_mismatch"

**Solutions:**
1. Verify redirect URL in LinkedIn app **exactly** matches:
   ```
   http://localhost:3000/api/auth/callback/linkedin
   ```
2. Check for:
   - Extra spaces
   - http vs https
   - Trailing slash
   - Port number (3000)

**Fix:**
- Go to LinkedIn app → Auth tab
- Update Redirect URLs
- Save changes
- Try again

### Issue 3: "Invalid Scope" Error

**Symptoms:**
- Authorization page shows error
- "Invalid scope" message

**Solutions:**
1. Go to LinkedIn app → Products tab
2. Request access to:
   - Sign In with LinkedIn
3. Go to Auth tab
4. Verify scopes:
   - r_liteprofile ✅
   - r_emailaddress ✅

### Issue 4: Redirects but Shows "Not Connected"

**Symptoms:**
- OAuth flow completes
- Redirects back to settings
- Still shows "Not connected"

**Solutions:**
1. Check server logs for errors
2. Verify MongoDB is running
3. Check if tokens are being stored

**Debug:**
```bash
# Check MongoDB
mongosh
use gitgo
db.users.findOne({ email: "your@email.com" })
```

Look for `linkedinId` field. If missing, check:
- NextAuth callback is executing
- Database connection is working
- No errors in server logs

### Issue 5: "Failed to Sync" Error

**Symptoms:**
- Click "Re-sync Data"
- Shows error message
- Sync fails

**Solutions:**
1. Check if LinkedIn is connected first
2. Verify access token is valid
3. Check LinkedIn API rate limits
4. Review server logs

**Debug:**
```bash
# Check server logs
# Look for:
# - "LinkedIn sync error"
# - "LinkedIn API error"
# - Token expiry messages
```

### Issue 6: Token Expired

**Symptoms:**
- Was working before
- Now shows "Token expired" error

**Solutions:**
1. System should auto-refresh token
2. If refresh fails, reconnect LinkedIn
3. Click "Connect" again

**Manual Fix:**
```bash
# In MongoDB, remove old tokens
db.users.updateOne(
  { email: "your@email.com" },
  { $unset: { 
    linkedinAccessToken: "",
    linkedinRefreshToken: "",
    linkedinTokenExpiry: ""
  }}
)
```
Then reconnect LinkedIn.

## Common Errors and Solutions

### Error: "Unauthorized"
**Cause:** Not logged in
**Solution:** Log in with GitHub first

### Error: "User not found"
**Cause:** User doesn't exist in database
**Solution:** Ensure you're logged in with GitHub first

### Error: "LinkedIn not connected"
**Cause:** Haven't connected LinkedIn yet
**Solution:** Click "Connect" button first

### Error: "Failed to refresh LinkedIn token"
**Cause:** Refresh token invalid or expired
**Solution:** Reconnect LinkedIn account

### Error: "LinkedIn API rate limit exceeded"
**Cause:** Too many API calls
**Solution:** Wait and try again later

## Verification Checklist

After testing, verify:

- [ ] Can click "Connect" button
- [ ] Redirects to LinkedIn authorization
- [ ] Can authorize the app
- [ ] Redirects back to settings
- [ ] Shows "Connected" status
- [ ] Can click "Re-sync Data"
- [ ] Sync completes successfully
- [ ] Last synced time updates
- [ ] Data appears in MongoDB
- [ ] `linkedinId` is stored
- [ ] `linkedinAccessToken` is stored
- [ ] `linkedinProfile` has data
- [ ] No errors in console
- [ ] No errors in server logs

## Success Indicators

When everything works correctly:

**In UI:**
```
✅ LinkedIn card shows "Connected"
✅ Green dot indicator
✅ "Re-sync Data" button available
✅ Last synced time displayed
✅ No error messages
```

**In MongoDB:**
```json
{
  "linkedinId": "abc123",
  "linkedinAccessToken": "AQV...",
  "linkedinRefreshToken": "AQX...",
  "linkedinTokenExpiry": "2024-04-28T...",
  "linkedinProfile": {
    "headline": "Full-Stack Developer",
    "profilePicture": "https://..."
  },
  "linkedinLastSynced": "2024-02-28T..."
}
```

**In Server Logs:**
```
✅ No errors
✅ "LinkedIn data synced successfully"
✅ Token refresh messages (if applicable)
```

## Next Steps

After successful testing:

1. **Test with Multiple Users**
   - Create another test account
   - Verify isolation of data

2. **Test Token Refresh**
   - Manually expire token in DB
   - Verify auto-refresh works

3. **Test Error Handling**
   - Disconnect internet
   - Verify error messages

4. **Production Setup**
   - Add production redirect URL
   - Update environment variables
   - Test in production

## Need Help?

If you're still having issues:

1. **Check Server Logs**
   - Look for error messages
   - Check stack traces

2. **Check Browser Console**
   - Look for JavaScript errors
   - Check network requests

3. **Verify LinkedIn App**
   - App is not in draft mode
   - Scopes are approved
   - Redirect URLs are correct

4. **Test API Directly**
   - Use curl or Postman
   - Bypass frontend issues

5. **Check Documentation**
   - `LINKEDIN_INTEGRATION_SETUP.md`
   - `LINKEDIN_INTEGRATION_COMPLETE.md`

## Summary

✅ **If all tests pass, your LinkedIn integration is working perfectly!**

You should be able to:
- Connect LinkedIn account
- Sync profile data
- Store in MongoDB
- Re-sync on demand
- Handle token refresh

**Ready to test? Go to Settings → Integrations and click "Connect" on LinkedIn!** 🚀
