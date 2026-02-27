# Redis Cache - Quick Summary

## What We Store in Cache

### 6 Types of Cached Data

```
┌─────────────────────────────────────────────────────────────┐
│                    REDIS CACHE STORAGE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. user:basic:{githubId}           TTL: 1 hour            │
│     └─ Profile info (name, email, avatar, bio, etc.)       │
│                                                             │
│  2. user:languages:{githubId}       TTL: 1 hour            │
│     └─ ["TypeScript", "JavaScript", "Python"]              │
│                                                             │
│  3. user:skills:{githubId}          TTL: 1 hour            │
│     └─ ["react", "docker", "kubernetes"]                   │
│                                                             │
│  4. user:techmap:{githubId}         TTL: 1 hour            │
│     └─ Technology usage map with project details           │
│                                                             │
│  5. repos:list:{githubId}           TTL: 30 minutes        │
│     └─ Array of user's repositories                        │
│                                                             │
│  6. repo:detail:{repoId}            TTL: 24 hours          │
│     └─ Detailed info for single repository                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Cache Keys & TTL

| Cache Key | What It Stores | TTL | Used By |
|-----------|----------------|-----|---------|
| `user:basic:{githubId}` | User profile data | 1 hour | Sidebar, Headers, Profile |
| `user:languages:{githubId}` | Programming languages | 1 hour | Sidebar, My Projects |
| `user:skills:{githubId}` | Skills from repo topics | 1 hour | Skills API |
| `user:techmap:{githubId}` | Technology-project mapping | 1 hour | Settings, Tech Map |
| `repos:list:{githubId}` | List of repositories | 30 min | Dashboard, Projects |
| `repo:detail:{repoId}` | Single repo details | 24 hours | Repo detail pages |

## Why We Cache

### Performance Boost
```
Without Cache:  GitHub API → 500ms response
With Cache:     Redis → 10ms response
Improvement:    50x faster! 🚀
```

### Reduced API Calls
```
Without Cache:  Every page load = GitHub API call
With Cache:     1 API call → Serves 100+ requests
Savings:        99% reduction in API calls
```

## Data Flow

```
User Request
     ↓
Check Redis Cache
     ↓
  Found? ──Yes──→ Return cached data (10ms) ✅
     ↓
    No
     ↓
Check MongoDB
     ↓
  Found? ──Yes──→ Cache in Redis → Return (50ms) ✅
     ↓
    No
     ↓
Fetch from GitHub API
     ↓
Store in MongoDB
     ↓
Cache in Redis
     ↓
Return data (500ms) ✅
```

## Cache Size Per User

```
User Basic:        0.5 KB
Languages:         0.1 KB
Skills:            0.2 KB
Tech Map:          8 KB
Repo List:         30 KB
Repo Details:      50 KB (25 repos)
────────────────────────
Total:             ~89 KB per user
```

## Quick Reference

### What Gets Cached?
✅ User profile information  
✅ Programming languages  
✅ Skills and technologies  
✅ Technology-project mapping  
✅ Repository lists  
✅ Repository details  

### What Doesn't Get Cached?
❌ Authentication tokens  
❌ Session data  
❌ Real-time GitHub events  
❌ Community posts  
❌ User settings/preferences  

### Cache Expiration
- User data: 1 hour
- Repo list: 30 minutes (more dynamic)
- Repo details: 24 hours (rarely changes)

### Cache Invalidation
- Automatic: TTL expires
- Manual: User syncs data
- Pattern: Delete all user caches on logout

## Benefits

🚀 **50x faster** response times  
💰 **99% reduction** in API calls  
📊 **Better UX** with instant loads  
🛡️ **Reliability** even if GitHub is slow  
💾 **Saves quota** on GitHub API limits  

## Monitoring

```bash
# Check what's in cache
redis-cli KEYS user:*

# Check specific cache
redis-cli GET user:basic:12345678

# Check TTL
redis-cli TTL user:basic:12345678

# Clear all caches
redis-cli FLUSHALL
```
