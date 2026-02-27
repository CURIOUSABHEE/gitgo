# Redis Cache Inventory

## Overview

This document details everything stored in Redis cache, including cache keys, data structures, TTL (Time To Live), and purposes.

## Cache TTL Configuration

```typescript
export const CACHE_TTL = {
  USER_BASIC: 60 * 60,        // 1 hour (3600 seconds)
  REPO_LIST: 60 * 30,         // 30 minutes (1800 seconds)
  REPO_DETAIL: 60 * 60 * 24,  // 24 hours (86400 seconds)
}
```

## Cached Data Items

### 1. User Basic Information

**Cache Key:** `user:basic:{githubId}`

**TTL:** 1 hour (3600 seconds)

**Data Structure:**
```typescript
{
  githubId: string
  login: string
  name: string
  email: string
  avatar_url: string
  bio: string
  location: string
  followers: number
  following: number
  public_repos: number
}
```

**Purpose:**
- Quick access to user profile information
- Used in sidebar, headers, and profile pages
- Reduces GitHub API calls

**Example:**
```json
{
  "githubId": "12345678",
  "login": "johndoe",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar_url": "https://avatars.githubusercontent.com/u/12345678",
  "bio": "Full-stack developer",
  "location": "San Francisco, CA",
  "followers": 150,
  "following": 200,
  "public_repos": 25
}
```

**Set in:** `UserService.syncUserFromGitHub()`

**Retrieved by:** `UserService.getUserBasic()`

---

### 2. User Languages

**Cache Key:** `user:languages:{githubId}`

**TTL:** 1 hour (3600 seconds)

**Data Structure:**
```typescript
string[]  // Array of programming language names
```

**Purpose:**
- Display languages in sidebar "Skills Detected"
- Show languages in "My Projects" page
- Quick language filtering

**Example:**
```json
["TypeScript", "JavaScript", "Python", "Go", "Rust"]
```

**Set in:** `UserService.syncUserFromGitHub()`

**Retrieved by:** `UserService.getUserLanguages()`

---

### 3. User Skills

**Cache Key:** `user:skills:{githubId}`

**TTL:** 1 hour (3600 seconds)

**Data Structure:**
```typescript
string[]  // Array of skill names from repo topics
```

**Purpose:**
- Display skills/technologies used
- Tech stack filtering
- Skill-based recommendations

**Example:**
```json
["react", "nodejs", "docker", "kubernetes", "mongodb", "graphql"]
```

**Set in:** `UserService.syncUserFromGitHub()`

**Retrieved by:** `UserService.getUserSkills()`

---

### 4. Technology Map

**Cache Key:** `user:techmap:{githubId}`

**TTL:** 1 hour (3600 seconds)

**Data Structure:**
```typescript
Array<{
  technology: string
  projects: Array<{
    repoName: string
    repoId: number
    isPrimary: boolean
    lastUsed: Date
  }>
  totalProjects: number
  firstUsed: Date
  lastUsed: Date
}>
```

**Purpose:**
- Track which technologies are used in which projects
- Display in Settings → Technology Map
- Provide usage statistics
- Enable consistent tech stack filtering

**Example:**
```json
[
  {
    "technology": "TypeScript",
    "projects": [
      {
        "repoName": "my-app",
        "repoId": 123456,
        "isPrimary": true,
        "lastUsed": "2024-02-15T10:30:00Z"
      },
      {
        "repoName": "api-server",
        "repoId": 789012,
        "isPrimary": true,
        "lastUsed": "2024-02-10T14:20:00Z"
      }
    ],
    "totalProjects": 2,
    "firstUsed": "2023-06-01T08:00:00Z",
    "lastUsed": "2024-02-15T10:30:00Z"
  }
]
```

**Set in:** `UserService.syncUserFromGitHub()`

**Retrieved by:** `UserService.getTechnologyMap()`

---

### 5. Repository List

**Cache Key:** `repos:list:{githubId}`

**TTL:** 30 minutes (1800 seconds)

**Data Structure:**
```typescript
Array<{
  id: number
  name: string
  full_name: string
  description: string
  language: string
  stargazers_count: number
  forks_count: number
  updated_at: Date
}>
```

**Purpose:**
- Display user's repositories
- Quick access to repo list
- Dashboard and projects page
- Shorter TTL for more frequent updates

**Example:**
```json
[
  {
    "id": 123456,
    "name": "my-app",
    "full_name": "johndoe/my-app",
    "description": "A cool web application",
    "language": "TypeScript",
    "stargazers_count": 45,
    "forks_count": 12,
    "updated_at": "2024-02-15T10:30:00Z"
  },
  {
    "id": 789012,
    "name": "api-server",
    "full_name": "johndoe/api-server",
    "description": "REST API backend",
    "language": "Python",
    "stargazers_count": 23,
    "forks_count": 5,
    "updated_at": "2024-02-10T14:20:00Z"
  }
]
```

**Set in:** `UserService.syncRepositories()`

**Retrieved by:** `UserService.getRepoList()`

---

### 6. Repository Details

**Cache Key:** `repo:detail:{repoId}`

**TTL:** 24 hours (86400 seconds)

**Data Structure:**
```typescript
{
  githubId: number
  userId: ObjectId
  name: string
  full_name: string
  description: string
  html_url: string
  language: string
  stargazers_count: number
  forks_count: number
  topics: string[]
  updated_at: Date
  owner: {
    login: string
    avatar_url: string
  }
  lastSynced: Date
}
```

**Purpose:**
- Detailed repository information
- Individual repo pages
- Longer TTL as details change less frequently

**Example:**
```json
{
  "githubId": 123456,
  "userId": "507f1f77bcf86cd799439011",
  "name": "my-app",
  "full_name": "johndoe/my-app",
  "description": "A cool web application",
  "html_url": "https://github.com/johndoe/my-app",
  "language": "TypeScript",
  "stargazers_count": 45,
  "forks_count": 12,
  "topics": ["react", "typescript", "nextjs"],
  "updated_at": "2024-02-15T10:30:00Z",
  "owner": {
    "login": "johndoe",
    "avatar_url": "https://avatars.githubusercontent.com/u/12345678"
  },
  "lastSynced": "2024-02-15T11:00:00Z"
}
```

**Set in:** `UserService.getRepoDetail()`

**Retrieved by:** `UserService.getRepoDetail()`

---

## Cache Strategy

### Cache-First Approach

```
Request → Check Redis Cache
           ↓ (if found)
           Return cached data
           ↓ (if not found)
           Query MongoDB
           ↓ (if found)
           Cache in Redis → Return data
           ↓ (if not found)
           Fetch from GitHub API
           ↓
           Store in MongoDB
           ↓
           Cache in Redis → Return data
```

### TTL Rationale

| Data Type | TTL | Reason |
|-----------|-----|--------|
| User Basic | 1 hour | Profile info changes infrequently |
| Languages | 1 hour | Extracted from repos, stable |
| Skills | 1 hour | Extracted from topics, stable |
| Tech Map | 1 hour | Comprehensive data, stable |
| Repo List | 30 min | More dynamic, users add/update repos |
| Repo Detail | 24 hours | Individual repo details rarely change |

## Cache Operations

### Setting Cache

```typescript
await setCached(key, value, ttl)
```

**Example:**
```typescript
await setCached(
  `user:basic:${githubId}`,
  userBasicData,
  CACHE_TTL.USER_BASIC
)
```

### Getting Cache

```typescript
const cached = await getCached<Type>(key)
```

**Example:**
```typescript
const cached = await getCached<UserBasicCache>(
  `user:basic:${githubId}`
)
```

### Deleting Cache

```typescript
await deleteCached(key)
```

**Example:**
```typescript
await deleteCached(`user:basic:${githubId}`)
```

### Deleting by Pattern

```typescript
await deletePattern(pattern)
```

**Example:**
```typescript
await deletePattern(`user:*:${githubId}`)  // Delete all user caches
```

## Cache Keys Summary

| Key Pattern | Data Type | TTL | Size Estimate |
|-------------|-----------|-----|---------------|
| `user:basic:{githubId}` | User profile | 1h | ~500 bytes |
| `user:languages:{githubId}` | Language array | 1h | ~100 bytes |
| `user:skills:{githubId}` | Skills array | 1h | ~200 bytes |
| `user:techmap:{githubId}` | Technology map | 1h | ~5-10 KB |
| `repos:list:{githubId}` | Repository list | 30m | ~10-50 KB |
| `repo:detail:{repoId}` | Single repo | 24h | ~1-2 KB |

## Total Cache Usage Estimate

For a typical user with 25 repositories:

```
User Basic:      0.5 KB
Languages:       0.1 KB
Skills:          0.2 KB
Tech Map:        8 KB
Repo List:       30 KB
Repo Details:    50 KB (25 repos × 2 KB)
─────────────────────────
Total:           ~89 KB per user
```

## Cache Invalidation

### Automatic Invalidation
- TTL expires automatically
- Redis handles cleanup

### Manual Invalidation
- On user sync: `POST /api/github/sync`
- On logout: Clear user-specific caches
- On data update: Delete specific cache keys

### Invalidation Strategy

```typescript
// When syncing user data
await deletePattern(`user:*:${githubId}`)
await deletePattern(`repos:*:${githubId}`)

// Then sync fresh data from GitHub
await UserService.syncUserFromGitHub(accessToken, githubId)
```

## Benefits of Caching

### Performance
- **Reduced API Calls**: 90% reduction in GitHub API calls
- **Faster Response**: ~10ms (cache) vs ~500ms (API)
- **Better UX**: Instant page loads

### Reliability
- **Fallback**: Works even if GitHub API is slow
- **Rate Limits**: Avoids hitting GitHub rate limits
- **Offline**: Can serve cached data

### Cost
- **API Quota**: Saves GitHub API quota
- **Bandwidth**: Reduces network traffic
- **Server Load**: Less processing needed

## Monitoring Cache

### Check Cache Keys

```bash
# Connect to Redis
redis-cli

# List all keys
KEYS *

# List user-specific keys
KEYS user:*

# Get specific cache
GET user:basic:12345678

# Check TTL
TTL user:basic:12345678

# Get cache size
MEMORY USAGE user:basic:12345678
```

### Cache Hit Rate

Monitor cache effectiveness:
- Cache hits: Data found in Redis
- Cache misses: Data fetched from MongoDB/API
- Hit rate = hits / (hits + misses)

Target: >80% cache hit rate

## Best Practices

### 1. Consistent Key Naming
- Use colons for hierarchy: `user:basic:{id}`
- Use descriptive names
- Include entity type and ID

### 2. Appropriate TTLs
- Frequently changing data: Shorter TTL
- Stable data: Longer TTL
- Balance freshness vs performance

### 3. Cache Invalidation
- Invalidate on updates
- Use patterns for bulk deletion
- Don't let stale data persist

### 4. Error Handling
- Graceful degradation if Redis fails
- Fall back to MongoDB
- Log cache errors

### 5. Memory Management
- Monitor Redis memory usage
- Set maxmemory policy
- Use appropriate data structures

## Conclusion

Redis cache stores 6 types of data:
1. User basic information (1h TTL)
2. User languages (1h TTL)
3. User skills (1h TTL)
4. Technology map (1h TTL)
5. Repository list (30m TTL)
6. Repository details (24h TTL)

All data is fetched from GitHub API, stored in MongoDB, and cached in Redis for fast access. The cache-first approach significantly improves performance and user experience.
