# LinkedIn Integration - Quick Start ✅

## You're Ready to Test!

Since you've already:
- ✅ Added LinkedIn Client ID to `.env`
- ✅ Added LinkedIn Client Secret to `.env`
- ✅ Added redirect URLs to LinkedIn app

You can now test the integration!

## Quick Test (5 Minutes)

### 1. Restart Your App
```bash
# Stop the app (Ctrl+C or Cmd+C)
npm run dev
```

**Why?** Environment variables are only loaded on startup.

### 2. Open Settings
```
http://localhost:3000/dashboard/settings
```

Click on the **"Integrations"** tab.

### 3. Connect LinkedIn

You should see two integration cards:
- GitHub (already connected ✅)
- LinkedIn (not connected yet)

**Click "Connect"** on the LinkedIn card.

### 4. Authorize on LinkedIn

You'll be redirected to LinkedIn. You should see:
- App name: "GitGo" (or your app name)
- Permissions requested:
  - Access your basic profile
  - Access your email address

**Click "Allow"** or **"Authorize"**

### 5. Verify Connection

You should be redirected back to Settings. The LinkedIn card should now show:
- ✅ Green "Connected" indicator
- "Re-sync Data" button
- Last synced time

### 6. Sync Data

**Click "Re-sync Data"** button.

Wait a few seconds. You should see:
- Button shows "Syncing..." with spinner
- Then returns to "Re-sync Data"
- Last synced time updates

### 7. Verify in MongoDB

**Option A: MongoDB Compass**
1. Connect to `mongodb://localhost:27017/gitgo`
2. Open `users` collection
3. Find your user
4. Look for `linkedinId`, `linkedinProfile`, etc.

**Option B: MongoDB Shell**
```bash
mongosh
use gitgo
db.users.findOne({ email: "your@email.com" })
```

You should see:
```json
{
  "linkedinId": "some_id",
  "linkedinAccessToken": "AQV...",
  "linkedinProfile": {
    "profilePicture": "https://...",
    ...
  },
  "linkedinLastSynced": "2024-02-28T..."
}
```

## ✅ Success!

If you see:
- LinkedIn shows as "Connected" in UI
- Data appears in MongoDB
- No errors in console

**Your LinkedIn integration is working perfectly!** 🎉

## What You Can Do Now

### 1. View LinkedIn Data
```typescript
// In your code
const user = await User.findOne({ githubId })
console.log(user.linkedinProfile)
console.log(user.linkedinExperience)
console.log(user.linkedinEducation)
console.log(user.linkedinSkills)
```

### 2. Use in Profile
- Display LinkedIn profile picture
- Show professional headline
- List work experience
- Display education
- Show skills

### 3. Match with Projects
- Use skills for project matching
- Use experience for recommendations
- Use education for filtering

## Troubleshooting

### "Connect" Button Does Nothing
**Fix:** Restart the app after adding env variables
```bash
npm run dev
```

### "Redirect URI Mismatch"
**Fix:** Verify redirect URL in LinkedIn app:
```
http://localhost:3000/api/auth/callback/linkedin
```

### Still Shows "Not Connected"
**Fix:** Check server logs for errors
```bash
# Look for errors in terminal where app is running
```

### "Failed to Sync"
**Fix:** Make sure you clicked "Connect" first

## Need More Help?

See detailed guides:
- `LINKEDIN_TESTING_GUIDE.md` - Comprehensive testing
- `LINKEDIN_INTEGRATION_SETUP.md` - Setup instructions
- `LINKEDIN_INTEGRATION_COMPLETE.md` - Full documentation

## Summary

**You're all set!** Just:
1. Restart app
2. Go to Settings → Integrations
3. Click "Connect" on LinkedIn
4. Authorize
5. Click "Re-sync Data"
6. Done! ✅

**Go ahead and test it now!** 🚀
