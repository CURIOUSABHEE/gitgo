# Data Flow Architecture

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Dashboard   │  │   Projects   │  │   Settings   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┴──────────────────┘                  │
│                            │                                      │
│                     useGitHub() Hook                             │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
                    HTTP Request
                             │
┌────────────────────────────┼──────────────────────────────────────┐
│                    NEXT.JS API ROUTES                             │
│                            │                                      │
│  ┌─────────────────────────▼────────────────────────┐            │
│  │  GET /api/github/profile                         │            │
│  │  GET /api/github/repo/[id]                       │            │
│  │  POST /api/github/sync                           │            │
│  └─────────────────────────┬────────────────────────┘            │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
                    UserService Layer
                             │
┌────────────────────────────┼──────────────────────────────────────┐
│                      SERVICE LAYER                                │
│                            │                                      │
│  ┌─────────────────────────▼────────────────────────┐            │
│  │           UserService.getUserBasic()             │            │
│  │           UserService.getRepoList()              │            │
│  │           UserService.syncUserFromGitHub()       │            │
│  └─────────────────────────┬────────────────────────┘            │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│      REDIS CACHE         │  │      MONGODB             │
│                          │  │                          │
│  user:basic:{id}         │  │  users collection        │
│  repos:list:{id}         │  │  repositories collection │
│  repo:detail:{id}        │  │                          │
│                          │  │  Indexes:                │
│  TTL: 1 hour (user)      │  │  - githubId              │
│  TTL: 30 min (repos)     │  │  - login                 │
│  TTL: 24 hours (detail)  │  │  - userId + updated_at   │
└──────────────────────────┘  └──────────────────────────┘
                    │                 │
                    └────────┬────────┘
                             │
                    If cache miss or sync
                             │
                             ▼
                  ┌──────────────────────┐
                  │    GITHUB API        │
                  │                      │
                  │  /user               │
                  │  /user/emails        │
                  │  /user/repos         │
                  └──────────────────────┘
```

## Data Flow Scenarios

### Scenario 1: First Time User Login

```
1. User clicks "Get Started via GitHub"
   ↓
2. GitHub OAuth redirects back with code
   ↓
3. NextAuth exchanges code for access token
   ↓
4. Session created with githubId
   ↓
5. User navigates to Dashboard
   ↓
6. useGitHub() hook calls /api/github/profile
   ↓
7. API checks Redis cache → MISS
   ↓
8. API checks MongoDB → MISS
   ↓
9. API calls GitHub API
   ↓
10. Store user in MongoDB
    ↓
11. Store repos in MongoDB
    ↓
12. Cache user in Redis (1 hour TTL)
    ↓
13. Cache repos in Redis (30 min TTL)
    ↓
14. Return data to client
    ↓
15. Client displays user data
```

**Time:** ~1-2 seconds (GitHub API call)

### Scenario 2: Returning User (Cache Hit)

```
1. User navigates to Dashboard
   ↓
2. useGitHub() hook calls /api/github/profile
   ↓
3. API checks Redis cache → HIT
   ↓
4. Return cached data to client
   ↓
5. Client displays user data
```

**Time:** ~5-20ms (Redis cache)

### Scenario 3: Cache Expired (MongoDB Hit)

```
1. User navigates to Dashboard (after 1 hour)
   ↓
2. useGitHub() hook calls /api/github/profile
   ↓
3. API checks Redis cache → MISS (expired)
   ↓
4. API checks MongoDB → HIT
   ↓
5. Re-cache in Redis
   ↓
6. Return data to client
   ↓
7. Client displays user data
```

**Time:** ~50-100ms (MongoDB query)

### Scenario 4: Manual Sync

```
1. User clicks "Re-sync Data" in Settings
   ↓
2. Client calls POST /api/github/sync
   ↓
3. API invalidates Redis cache
   ↓
4. API calls GitHub API for fresh data
   ↓
5. Update MongoDB with new data
   ↓
6. Update Redis cache
   ↓
7. Return fresh data to client
   ↓
8. Client displays updated data
```

**Time:** ~1-2 seconds (GitHub API call)

### Scenario 5: Repository Detail Click

```
1. User clicks on a repository card
   ↓
2. Client calls GET /api/github/repo/[id]
   ↓
3. API checks Redis cache → HIT/MISS
   ↓
4. If MISS, fetch from MongoDB
   ↓
5. Cache in Redis (24 hour TTL)
   ↓
6. Return repo details
   ↓
7. Client displays detailed view
```

**Time:** ~5-20ms (cache) or ~20-50ms (MongoDB)

## MongoDB Schema Structure

### Users Collection

```javascript
{
  _id: ObjectId("..."),
  githubId: "12345678",
  login: "username",
  name: "Full Name",
  email: "user@example.com",
  avatar_url: "https://avatars.githubusercontent.com/...",
  bio: "Developer bio",
  location: "City, Country",
  blog: "https://website.com",
  company: "Company Name",
  twitter_username: "twitter_handle",
  hireable: true,
  public_repos: 25,
  followers: 100,
  following: 50,
  created_at: ISODate("2020-01-01T00:00:00Z"),
  lastSynced: ISODate("2025-02-27T12:00:00Z"),
  createdAt: ISODate("2025-02-27T10:00:00Z"),
  updatedAt: ISODate("2025-02-27T12:00:00Z")
}
```

### Repositories Collection

```javascript
{
  _id: ObjectId("..."),
  githubId: 123456789,
  userId: ObjectId("..."), // Reference to User
  name: "repo-name",
  full_name: "username/repo-name",
  description: "Repository description",
  html_url: "https://github.com/username/repo-name",
  language: "TypeScript",
  stargazers_count: 150,
  forks_count: 30,
  watchers_count: 150,
  open_issues_count: 5,
  topics: ["react", "typescript", "nextjs"],
  created_at: ISODate("2023-01-01T00:00:00Z"),
  updated_at: ISODate("2025-02-20T00:00:00Z"),
  pushed_at: ISODate("2025-02-25T00:00:00Z"),
  size: 1024,
  default_branch: "main",
  owner: {
    login: "username",
    avatar_url: "https://avatars.githubusercontent.com/..."
  },
  private: false,
  fork: false,
  archived: false,
  disabled: false,
  lastSynced: ISODate("2025-02-27T12:00:00Z"),
  createdAt: ISODate("2025-02-27T10:00:00Z"),
  updatedAt: ISODate("2025-02-27T12:00:00Z")
}
```

## Redis Cache Structure

### User Basic Cache

```json
{
  "githubId": "12345678",
  "login": "username",
  "name": "Full Name",
  "email": "user@example.com",
  "avatar_url": "https://avatars.githubusercontent.com/...",
  "bio": "Developer bio",
  "location": "City, Country",
  "followers": 100,
  "following": 50,
  "public_repos": 25
}
```

**Key:** `user:basic:12345678`  
**TTL:** 3600 seconds (1 hour)

### Repository List Cache

```json
[
  {
    "id": 123456789,
    "name": "repo-name",
    "full_name": "username/repo-name",
    "language": "TypeScript",
    "stargazers_count": 150,
    "forks_count": 30,
    "updated_at": "2025-02-20T00:00:00Z"
  }
]
```

**Key:** `repos:list:12345678`  
**TTL:** 1800 seconds (30 minutes)

### Repository Detail Cache

```json
{
  "githubId": 123456789,
  "name": "repo-name",
  "full_name": "username/repo-name",
  "description": "Repository description",
  "html_url": "https://github.com/username/repo-name",
  "language": "TypeScript",
  "stargazers_count": 150,
  "forks_count": 30,
  "topics": ["react", "typescript"],
  "owner": {
    "login": "username",
    "avatar_url": "https://..."
  },
  "updated_at": "2025-02-20T00:00:00Z"
}
```

**Key:** `repo:detail:123456789`  
**TTL:** 86400 seconds (24 hours)

## Performance Metrics

### Response Times

| Source | Average Time | Use Case |
|--------|-------------|----------|
| Redis Cache | 5-20ms | Frequent access, recent data |
| MongoDB | 50-100ms | Cache miss, older data |
| GitHub API | 500-1000ms | First sync, manual refresh |

### Cache Hit Rates (Expected)

| Cache Type | Hit Rate | Reason |
|-----------|----------|--------|
| User Basic | 95% | Long TTL (1 hour) |
| Repo List | 90% | Medium TTL (30 min) |
| Repo Detail | 98% | Very long TTL (24 hours) |

### API Call Reduction

| Scenario | Without Cache | With Cache | Reduction |
|----------|--------------|------------|-----------|
| Page Load | 1 GitHub API call | 0 calls (cache hit) | 100% |
| Daily Usage | ~100 calls/user | ~5-10 calls/user | 90-95% |
| Peak Hours | 1000 calls/min | 50-100 calls/min | 90-95% |

## Error Handling Flow

```
API Request
    ↓
Try Redis Cache
    ↓ Error
Log error, continue
    ↓
Try MongoDB
    ↓ Error
Log error, continue
    ↓
Try GitHub API
    ↓ Error
Return error to client
```

## Data Consistency

### Sync Strategy

1. **Optimistic Caching**: Serve cached data immediately
2. **Background Refresh**: Update cache asynchronously
3. **Manual Sync**: User can force refresh
4. **TTL-based Expiry**: Automatic cache invalidation

### Consistency Guarantees

- **Eventually Consistent**: Cache may be slightly stale
- **User-Controlled**: Manual sync for fresh data
- **Automatic Refresh**: TTL ensures data freshness
- **Fallback Chain**: Redis → MongoDB → GitHub

## Monitoring Points

### Key Metrics to Track

1. **Cache Hit Rate**: Redis cache effectiveness
2. **Response Times**: API endpoint performance
3. **GitHub API Calls**: Rate limit management
4. **MongoDB Queries**: Database performance
5. **Error Rates**: System reliability
6. **Sync Frequency**: User behavior patterns

### Health Checks

```bash
# Redis health
redis-cli ping

# MongoDB health
mongosh --eval "db.adminCommand('ping')"

# Application health
curl http://localhost:3000/api/health
```

## Scaling Considerations

### Horizontal Scaling

- **Redis**: Use Redis Cluster for distributed cache
- **MongoDB**: Use replica sets for read scaling
- **API**: Stateless design allows multiple instances

### Vertical Scaling

- **Redis**: Increase memory for larger cache
- **MongoDB**: Increase storage and RAM
- **API**: Increase CPU for faster processing

### Cost Optimization

- **Cache First**: Reduce expensive GitHub API calls
- **Batch Operations**: Bulk insert repositories
- **Efficient Queries**: Use MongoDB indexes
- **TTL Management**: Balance freshness vs. cost
