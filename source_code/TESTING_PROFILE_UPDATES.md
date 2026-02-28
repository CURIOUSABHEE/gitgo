# Testing Profile Updates - Step by Step Guide

## Prerequisites
1. Make sure your app is running: `npm run dev`
2. Make sure MongoDB is connected
3. Make sure Redis is connected
4. You must be logged in with GitHub

## Test 1: Update First Name

### Steps:
1. Navigate to **Dashboard → Settings → Profile**
2. Find the "First Name" field
3. Change your first name (e.g., "John" → "Jane")
4. Click **"Save Changes"** button
5. Wait for success toast: "Profile updated"
6. **Refresh the page** (F5 or Cmd+R)

### Expected Result:
✅ Your new first name should still be displayed
✅ The change persists after refresh

### If it fails:
❌ Check browser console for errors
❌ Check server logs for API errors
❌ Verify MongoDB connection
❌ Verify Redis connection

---

## Test 2: Update Multiple Fields

### Steps:
1. Go to **Settings → Profile**
2. Update multiple fields:
   - First Name: "Jane"
   - Last Name: "Doe"
   - Email: "jane.doe@example.com"
   - Location: "San Francisco, CA"
   - Bio: "Full-stack developer"
3. Click **"Save Changes"**
4. Wait for success toast
5. **Refresh the page**

### Expected Result:
✅ All changes should persist
✅ All fields show updated values

---

## Test 3: Cancel Changes

### Steps:
1. Go to **Settings → Profile**
2. Make some changes (don't save)
3. Click **"Cancel"** button

### Expected Result:
✅ Form resets to original values
✅ "Save Changes" button becomes disabled
✅ No API call is made

---

## Test 4: Error Handling

### Steps:
1. Open browser DevTools → Network tab
2. Go to **Settings → Profile**
3. Make changes
4. In Network tab, right-click and select "Block request URL" for `/api/user/profile`
5. Click **"Save Changes"**

### Expected Result:
✅ Error toast appears: "Update failed"
✅ Form doesn't reset
✅ Changes are not lost
✅ User can try again

---

## Test 5: Concurrent Updates

### Steps:
1. Open your app in **two different browser tabs**
2. In Tab 1: Change first name to "Alice"
3. In Tab 1: Click "Save Changes"
4. In Tab 2: Refresh the page

### Expected Result:
✅ Tab 2 should show "Alice" after refresh
✅ Cache is properly invalidated
✅ Both tabs show consistent data

---

## Test 6: Empty Fields

### Steps:
1. Go to **Settings → Profile**
2. Clear the "Location" field (make it empty)
3. Click **"Save Changes"**
4. Refresh the page

### Expected Result:
✅ Location field remains empty
✅ Empty values are saved correctly

---

## Test 7: Special Characters

### Steps:
1. Go to **Settings → Profile**
2. Enter special characters in bio:
   ```
   Full-stack developer 🚀
   Love coding & building things!
   React | Node.js | TypeScript
   ```
3. Click **"Save Changes"**
4. Refresh the page

### Expected Result:
✅ Special characters are preserved
✅ Emojis display correctly
✅ Line breaks are maintained

---

## Debugging Guide

### Check Server Logs

Look for these log messages:

**Success:**
```
[Profile Update] Cache invalidated for user 12345678
```

**Error:**
```
Error updating user profile: [error details]
Error invalidating cache: [error details]
```

### Check Browser Console

**Success:**
```
Profile updated successfully
```

**Error:**
```
Error saving profile: [error message]
Failed to update profile
```

### Check Network Tab

**Request:**
```
PATCH /api/user/profile
Status: 200 OK
Response: {
  "success": true,
  "user": { ... },
  "message": "Profile updated successfully"
}
```

**Then:**
```
GET /api/github/profile
Status: 200 OK
Response: {
  "user": { ... with updated values },
  "repos": [...],
  "languages": [...]
}
```

### Check MongoDB

Connect to MongoDB and verify:
```javascript
db.users.findOne({ githubId: "YOUR_GITHUB_ID" })
```

Should show updated values:
```json
{
  "_id": "...",
  "githubId": "12345678",
  "name": "Jane Doe",  // ✅ Updated
  "email": "jane.doe@example.com",  // ✅ Updated
  "bio": "Full-stack developer",  // ✅ Updated
  "location": "San Francisco, CA",  // ✅ Updated
  "blog": "https://janedoe.com",  // ✅ Updated
  ...
}
```

### Check Redis Cache

Connect to Redis and check:
```bash
redis-cli
> GET user:basic:12345678
```

**Before update:**
```json
{"name":"John Doe",...}
```

**After update (cache invalidated):**
```
(nil)  // ✅ Cache was deleted
```

**After refresh (cache repopulated):**
```json
{"name":"Jane Doe",...}  // ✅ New values cached
```

---

## Common Issues & Solutions

### Issue 1: Changes Don't Persist
**Symptom:** Changes save but revert after refresh

**Solution:**
1. Check if Redis cache is being invalidated
2. Look for log: `[Profile Update] Cache invalidated`
3. Verify `deleteCached` is imported correctly
4. Check Redis connection

### Issue 2: "Unauthorized" Error
**Symptom:** Can't save changes, get 401 error

**Solution:**
1. Make sure you're logged in
2. Check session in browser DevTools → Application → Cookies
3. Verify `githubId` is in session
4. Try logging out and back in

### Issue 3: "User not found" Error
**Symptom:** Get 404 error when saving

**Solution:**
1. User might not be in database yet
2. Try syncing from GitHub first
3. Check MongoDB for user document
4. Verify `githubId` matches

### Issue 4: Changes Save but UI Doesn't Update
**Symptom:** API succeeds but form shows old values

**Solution:**
1. Check if `refreshProfile()` is being called
2. Verify `useEffect` dependency on `profile`
3. Check browser console for errors
4. Try hard refresh (Ctrl+Shift+R)

### Issue 5: Redis Connection Error
**Symptom:** Cache invalidation fails

**Solution:**
1. Check if Redis is running: `redis-cli ping`
2. Verify Redis connection in `.env`
3. Check Redis logs
4. Note: Profile update will still work, just won't invalidate cache

---

## API Endpoints Reference

### PATCH /api/user/profile
**Purpose:** Update user profile in database

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "bio": "Developer",
  "location": "SF",
  "blog": "https://example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": { ...updated user object },
  "message": "Profile updated successfully"
}
```

**Response (Error):**
```json
{
  "error": "Failed to update profile"
}
```

### GET /api/github/profile
**Purpose:** Fetch user profile from database/cache

**Response:**
```json
{
  "user": {
    "githubId": "12345678",
    "login": "janedoe",
    "name": "Jane Doe",
    "email": "jane@example.com",
    ...
  },
  "repos": [...],
  "languages": [...],
  "stats": {...}
}
```

---

## Success Criteria

All tests should pass with these results:

✅ **Test 1:** First name persists after refresh
✅ **Test 2:** Multiple fields persist after refresh
✅ **Test 3:** Cancel button resets form
✅ **Test 4:** Error handling works correctly
✅ **Test 5:** Changes sync across tabs
✅ **Test 6:** Empty fields save correctly
✅ **Test 7:** Special characters preserved

**If all tests pass:** Profile updates are working correctly! 🎉

**If any test fails:** Follow the debugging guide above to identify the issue.

---

## Quick Verification Checklist

Before testing, verify:

- [ ] MongoDB is running and connected
- [ ] Redis is running and connected
- [ ] Environment variables are set correctly
- [ ] You're logged in with GitHub
- [ ] User exists in MongoDB database
- [ ] No TypeScript errors in console
- [ ] API endpoints are accessible

After testing, verify:

- [ ] Changes persist after page refresh
- [ ] MongoDB has updated values
- [ ] Redis cache was invalidated
- [ ] No errors in server logs
- [ ] No errors in browser console
- [ ] Success toast appears on save
- [ ] UI updates immediately after save

---

## Need Help?

If you're still having issues:

1. **Check the logs:** Server console and browser console
2. **Verify connections:** MongoDB and Redis
3. **Test API directly:** Use Postman or curl
4. **Check the code:** Review the files modified in PROFILE_UPDATE_FIX.md
5. **Clear cache:** Try clearing browser cache and Redis cache

The profile update feature should now work perfectly! 🚀
