# MongoDB and Redis Setup Guide

## Overview

The application now uses:
- **MongoDB** - Persistent storage for user data and repositories
- **Redis** - Fast caching layer for frequently accessed data

## Architecture

### Data Flow

```
GitHub API → MongoDB (persistent) → Redis (cache) → Application
```

### Caching Strategy

**Redis Cache:**
- User basic info (login, name, email, avatar, bio, stats) - 1 hour TTL
- Repository list (id, name, language, stars, forks) - 30 minutes TTL
- Repository details (full info) - 24 hours TTL

**MongoDB Storage:**
- Complete user profiles
- All repository data
- Sync timestamps

## Installation

### 1. Install Dependencies

```bash
cd source_code
npm install
```

This installs:
- `mongoose` - MongoDB ODM
- `ioredis` - Redis client

### 2. Install MongoDB

#### Option A: Local MongoDB (Development)

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**Windows:**
Download from https://www.mongodb.com/try/download/community

#### Option B: MongoDB Atlas (Production)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gitgo
```

### 3. Install Redis

#### Option A: Local Redis (Development)

**macOS (Homebrew):**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

**Windows:**
Download from https://github.com/microsoftarchive/redis/releases

#### Option B: Redis Cloud (Production)

1. Go to https://redis.com/try-free/
2. Create free database
3. Get connection URL
4. Add to `.env.local`:
```env
REDIS_URL=redis://username:password@host:port
```

### 4. Configure Environment Variables

Create `.env.local`:

```env
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key

# MongoDB
MONGODB_URI=mongodb://localhost:27017/gitgo

# Redis
REDIS_URL=redis://localhost:6379
```

### 5. Verify Installation

**Check MongoDB:**
```bash
mongosh
# Should connect successfully
```

**Check Redis:**
```bash
redis-cli ping
# Should return: PONG
```

## Database Schema

### User Collection

```typescript
{
  githubId: string (unique, indexed)
  login: string (unique)
  name: string
  email: string
  avatar_url: string
  bio: string
  location: string
  blog: string
  company: string
  twitter_username: string
  hireable: boolean
  public_repos: number
  followers: number
  following: number
  created_at: Date
  lastSynced: Date
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### Repository Collection

```typescript
{
  githubId: number (unique, indexed)
  userId: ObjectId (indexed, ref: User)
  name: string
  full_name: string
  description: string
  html_url: string
  language: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  topics: string[]
  created_at: Date
  updated_at: Date
  pushed_at: Date
  size: number
  default_branch: string
  owner: {
    login: string
    avatar_url: string
  }
  private: boolean
  fork: boolean
  archived: boolean
  disabled: boolean
  lastSynced: Date
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## Redis Cache Keys

```
user:basic:{githubId}     - User basic info (1 hour)
repos:list:{githubId}     - Repository list (30 min)
repo:detail:{repoId}      - Repository details (24 hours)
```

## API Endpoints

### GET /api/github/profile
Fetches user profile and repository list.

**Flow:**
1. Check Redis cache for user basic info
2. If not cached, check MongoDB
3. If not in DB, fetch from GitHub API and store
4. Return cached/stored data

**Response:**
```json
{
  "user": {
    "login": "username",
    "name": "Full Name",
    "email": "email@example.com",
    "avatar_url": "https://...",
    "bio": "Bio text",
    "location": "City, Country",
    "followers": 100,
    "following": 50,
    "public_repos": 25
  },
  "repos": [
    {
      "id": 123456,
      "name": "repo-name",
      "full_name": "username/repo-name",
      "language": "TypeScript",
      "stargazers_count": 10,
      "forks_count": 2,
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "languages": ["TypeScript", "Python", "JavaScript"],
  "stats": {
    "totalRepos": 25,
    "totalStars": 150,
    "totalForks": 30
  }
}
```

### GET /api/github/repo/[id]
Fetches detailed information for a specific repository.

**Flow:**
1. Check Redis cache
2. If not cached, check MongoDB
3. Return repository details

**Response:**
```json
{
  "githubId": 123456,
  "name": "repo-name",
  "full_name": "username/repo-name",
  "description": "Repository description",
  "html_url": "https://github.com/username/repo-name",
  "language": "TypeScript",
  "stargazers_count": 10,
  "forks_count": 2,
  "topics": ["react", "typescript"],
  "owner": {
    "login": "username",
    "avatar_url": "https://..."
  },
  "updated_at": "2025-01-01T00:00:00Z"
}
```

### POST /api/github/sync
Forces a fresh sync from GitHub API.

**Flow:**
1. Invalidate Redis cache
2. Fetch fresh data from GitHub API
3. Update MongoDB
4. Update Redis cache
5. Return fresh data

## Performance Benefits

### Before (In-Memory Cache)
- Cache lost on server restart
- Each user's data cached separately per instance
- No persistence between sessions
- Limited to single server

### After (MongoDB + Redis)
- Persistent storage survives restarts
- Shared cache across all instances
- Data persists between sessions
- Scales horizontally

### Cache Hit Rates (Expected)
- User basic info: ~95% (1 hour TTL)
- Repository list: ~90% (30 min TTL)
- Repository details: ~98% (24 hour TTL)

### API Call Reduction
- Without cache: ~100 GitHub API calls/user/day
- With cache: ~5-10 GitHub API calls/user/day
- 90-95% reduction in API calls

## Monitoring

### Check MongoDB Data

```bash
mongosh
use gitgo
db.users.countDocuments()
db.repositories.countDocuments()
db.users.findOne({ login: "username" })
```

### Check Redis Cache

```bash
redis-cli
KEYS user:*
GET user:basic:123456
TTL user:basic:123456
```

### Clear Cache

```bash
redis-cli
FLUSHDB  # Clear all cache
DEL user:basic:123456  # Clear specific key
```

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongooseServerSelectionError"**
- Check MongoDB is running: `brew services list` or `systemctl status mongodb`
- Verify connection string in `.env.local`
- Check firewall settings

### Redis Connection Issues

**Error: "Redis connection refused"**
- Check Redis is running: `brew services list` or `systemctl status redis`
- Verify REDIS_URL in `.env.local`
- Try: `redis-cli ping`

### Cache Not Working

**Data always fetched from GitHub:**
- Check Redis connection
- Verify cache keys: `redis-cli KEYS *`
- Check TTL values: `redis-cli TTL user:basic:123456`

### Stale Data

**Old data showing after GitHub update:**
- Use "Re-sync Data" button in Settings > Integrations
- Or call: `POST /api/github/sync`
- Or clear cache: `redis-cli FLUSHDB`

## Production Deployment

### Environment Variables

```env
# Use production URLs
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gitgo
REDIS_URL=redis://user:pass@host:port
NEXTAUTH_URL=https://yourdomain.com
```

### MongoDB Atlas Setup

1. Create production cluster
2. Whitelist application IPs
3. Create database user
4. Enable connection pooling
5. Set up backups

### Redis Cloud Setup

1. Create production database
2. Enable persistence
3. Set up replication
4. Configure eviction policy: `allkeys-lru`
5. Monitor memory usage

### Scaling Considerations

- MongoDB: Use replica sets for high availability
- Redis: Use Redis Cluster for horizontal scaling
- Consider read replicas for MongoDB
- Use Redis Sentinel for automatic failover

## Development Tips

### Reset Database

```bash
mongosh
use gitgo
db.dropDatabase()
```

### Clear All Cache

```bash
redis-cli FLUSHDB
```

### View Logs

```bash
# MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log

# Redis logs
tail -f /usr/local/var/log/redis.log
```

### Test Cache Performance

```javascript
// In browser console
console.time('First load')
await fetch('/api/github/profile')
console.timeEnd('First load')

console.time('Cached load')
await fetch('/api/github/profile')
console.timeEnd('Cached load')
```

## Security Best Practices

1. Never commit `.env.local` to version control
2. Use strong passwords for MongoDB and Redis
3. Enable authentication in production
4. Use TLS/SSL for connections
5. Restrict network access with firewalls
6. Regularly update dependencies
7. Monitor for suspicious activity
8. Implement rate limiting
9. Use environment-specific credentials
10. Regular security audits
