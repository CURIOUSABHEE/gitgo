# Profile Update Fix - Settings Not Persisting

## Problem
User reported that when changing profile settings (name, email, bio, etc.) and clicking "Save Changes", the changes would not persist after page refresh. The old values would reappear.

## Root Cause Analysis

### Issue 1: Cache Invalidation
When a user updated their profile via `/api/user/profile` (PATCH), the changes were saved to MongoDB successfully. However, the Redis cache was not invalidated, so subsequent requests would return stale cached data instead of the updated values.

**Flow:**
```
1. User updates name: "John" → "Jane"
2. API saves to MongoDB ✅
3. Redis cache still has "John" ❌
4. Page refresh fetches from Redis cache
5. User sees "John" (old value) ❌
```

### Issue 2: Wrong Refresh Endpoint
The `refreshProfile()` function in `use-github.ts` was calling `/api/github/sync` which fetches fresh data from GitHub API, not from the database where the user's custom changes are stored.

**Flow:**
```
1. User updates name in database: "John Doe"
2. refreshProfile() calls /api/github/sync
3. Syncs from GitHub (still has old name)
4. Overwrites database changes ❌
```

## Solution

### Fix 1: Invalidate Redis Cache on Update
Updated `/api/user/profile` (PATCH) to invalidate Redis cache after successful update:

```typescript
// After updating MongoDB
await deleteCached(`user:basic:${session.user.githubId}`)
await deleteCached(`user:repos:${session.user.githubId}`)
```

This ensures that the next request fetches fresh data from MongoDB, not stale cache.

### Fix 2: Separate Refresh and Sync Functions
Updated `use-github.ts` hook to have two distinct functions:

**refreshProfile()** - Fetches from database (for local updates)
```typescript
const refreshProfile = async () => {
  const response = await fetch("/api/github/profile")
  // Fetches from MongoDB (with updated values)
}
```

**syncFromGitHub()** - Syncs from GitHub API (for GitHub updates)
```typescript
const syncFromGitHub = async () => {
  const response = await fetch("/api/github/sync", { method: "POST" })
  // Fetches from GitHub and updates MongoDB
}
```

### Fix 3: Better Error Handling
Added more descriptive error messages in the settings component:

```typescript
catch (error) {
  toast({
    title: "Update failed",
    description: error instanceof Error ? error.message : "Failed to save...",
    variant: "destructive",
  })
}
```

## Data Flow (After Fix)

### Updating Profile
```
User changes name: "John" → "Jane"
  ↓
Click "Save Changes"
  ↓
POST /api/user/profile
  ↓
Update MongoDB ✅
  ↓
Invalidate Redis cache ✅
  ↓
Call refreshProfile()
  ↓
GET /api/github/profile
  ↓
Check Redis cache (empty)
  ↓
Fetch from MongoDB (has "Jane") ✅
  ↓
Cache in Redis ✅
  ↓
Return to UI
  ↓
User sees "Jane" ✅
```

### Page Refresh
```
User refreshes page
  ↓
useEffect in use-github.ts
  ↓
GET /api/github/profile
  ↓
Check Redis cache (has "Jane") ✅
  ↓
Return cached data
  ↓
User sees "Jane" ✅
```

## Files Modified

### 1. `/app/api/user/profile/route.ts`
**Changes:**
- Added `deleteCached` import from `@/lib/redis`
- Added cache invalidation after successful update
- Added logging for cache invalidation

**Impact:** Ensures fresh data is fetched after updates

### 2. `/hooks/use-github.ts`
**Changes:**
- Renamed old `refreshProfile()` to `syncFromGitHub()`
- Created new `refreshProfile()` that fetches from database
- Exported both functions

**Impact:** Separates local refresh from GitHub sync

### 3. `/components/settings/settings-profile.tsx`
**Changes:**
- Improved error handling with specific error messages
- Better error display in toast notifications

**Impact:** Better user feedback on errors

## Testing

### Test Case 1: Update Name
1. Go to Settings → Profile
2. Change first name from "John" to "Jane"
3. Click "Save Changes"
4. ✅ Should see success toast
5. Refresh page
6. ✅ Should still see "Jane"

### Test Case 2: Update Multiple Fields
1. Change name, email, bio, location
2. Click "Save Changes"
3. ✅ All changes should persist
4. Refresh page
5. ✅ All changes should still be there

### Test Case 3: Cancel Changes
1. Make changes
2. Click "Cancel"
3. ✅ Form should reset to original values
4. ✅ hasChanges should be false

### Test Case 4: Error Handling
1. Disconnect from internet
2. Make changes
3. Click "Save Changes"
4. ✅ Should see error toast with message

## Cache Strategy

### Redis Cache Keys
- `user:basic:{githubId}` - Basic user info (name, email, bio, etc.)
- `user:repos:{githubId}` - User's repositories

### Cache TTL
- User basic: 1 hour (CACHE_TTL.USER_BASIC)
- User repos: 30 minutes (CACHE_TTL.USER_REPOS)

### Cache Invalidation Triggers
1. Profile update via `/api/user/profile` (PATCH)
2. GitHub sync via `/api/github/sync` (POST)

## Benefits

### 1. Data Consistency
- Changes persist correctly across page refreshes
- No more stale data from cache

### 2. Better UX
- Users see their changes immediately
- Clear error messages when something fails
- Proper loading states

### 3. Performance
- Still uses Redis cache for fast reads
- Only invalidates cache when necessary
- Efficient data fetching

### 4. Separation of Concerns
- `refreshProfile()` - For local database updates
- `syncFromGitHub()` - For GitHub API syncs
- Clear distinction between the two

## Future Enhancements

### 1. Optimistic Updates
Update UI immediately before API call completes:
```typescript
// Update local state immediately
setFormData(newData)
// Then save to server
await saveToServer(newData)
```

### 2. Real-time Sync
Use WebSockets to sync changes across multiple tabs:
```typescript
// When profile updates in one tab
socket.emit('profile:updated', newData)
// Other tabs receive and update
socket.on('profile:updated', (data) => setProfile(data))
```

### 3. Conflict Resolution
Handle conflicts when GitHub data differs from local changes:
```typescript
if (githubData.name !== localData.name) {
  // Show merge UI
  showConflictResolution(githubData, localData)
}
```

### 4. Audit Trail
Track profile changes for security:
```typescript
ProfileHistory.create({
  userId,
  changes: { name: { old: "John", new: "Jane" } },
  timestamp: new Date()
})
```

## Summary

The profile update issue was caused by:
1. ❌ Redis cache not being invalidated after updates
2. ❌ Wrong refresh function fetching from GitHub instead of database

Fixed by:
1. ✅ Invalidating Redis cache after profile updates
2. ✅ Separating `refreshProfile()` (database) from `syncFromGitHub()` (GitHub API)
3. ✅ Better error handling and user feedback

**Result:** Profile changes now persist correctly across page refreshes! 🎉
