# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running
- Redis installed and running
- GitHub OAuth App created

## Installation Steps

### 1. Install Dependencies

```bash
cd source_code
npm install
```

### 2. Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Ubuntu/Linux
sudo systemctl start mongodb

# Windows
net start MongoDB
```

Verify:
```bash
mongosh
# Should connect successfully
```

### 3. Start Redis

```bash
# macOS
brew services start redis

# Ubuntu/Linux
sudo systemctl start redis

# Windows
redis-server
```

Verify:
```bash
redis-cli ping
# Should return: PONG
```

### 4. Configure Environment

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# GitHub OAuth (from https://github.com/settings/developers)
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# MongoDB
MONGODB_URI=mongodb://localhost:27017/gitgo

# Redis
REDIS_URL=redis://localhost:6379
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 5. Run the Application

```bash
npm run dev
```

Open http://localhost:3000

## First Time Setup

1. Click "Get Started via GitHub"
2. Authorize the application
3. Wait for data sync (first time takes ~5-10 seconds)
4. Navigate through the app

## Verify Everything Works

### Check MongoDB Data
```bash
mongosh
use gitgo
db.users.countDocuments()
db.repositories.countDocuments()
```

### Check Redis Cache
```bash
redis-cli
KEYS *
```

### Test Performance
Open browser console:
```javascript
// First load (fetches from GitHub)
console.time('First load')
await fetch('/api/github/profile')
console.timeEnd('First load')

// Second load (from cache)
console.time('Cached load')
await fetch('/api/github/profile')
console.timeEnd('Cached load')
```

Expected results:
- First load: 500-1000ms
- Cached load: 5-20ms

## Common Issues

### MongoDB Connection Error
```bash
# Check if running
brew services list | grep mongodb

# Start if not running
brew services start mongodb-community
```

### Redis Connection Error
```bash
# Check if running
brew services list | grep redis

# Start if not running
brew services start redis
```

### GitHub OAuth Error
- Verify callback URL: `http://localhost:3000/api/auth/callback/github`
- Check CLIENT_ID and CLIENT_SECRET in `.env.local`

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

## What's Cached

- **User basic info**: Name, email, avatar, bio (1 hour)
- **Repository list**: Names, languages, stars (30 minutes)
- **Repository details**: Full info (24 hours)

## Force Refresh

To get fresh data from GitHub:
1. Go to Settings > Integrations
2. Click "Re-sync Data"

Or use API:
```bash
curl -X POST http://localhost:3000/api/github/sync \
  -H "Cookie: your-session-cookie"
```

## Development Tips

### Clear All Cache
```bash
redis-cli FLUSHDB
```

### Reset Database
```bash
mongosh
use gitgo
db.dropDatabase()
```

### View Logs
```bash
# Application logs
npm run dev

# MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log

# Redis logs
tail -f /usr/local/var/log/redis.log
```

## Production Deployment

See `MONGODB_REDIS_SETUP.md` for detailed production setup instructions.

Quick checklist:
- [ ] Use MongoDB Atlas or managed MongoDB
- [ ] Use Redis Cloud or managed Redis
- [ ] Set production environment variables
- [ ] Enable authentication for MongoDB and Redis
- [ ] Use HTTPS for NEXTAUTH_URL
- [ ] Set up monitoring and backups

## Need Help?

- MongoDB docs: https://docs.mongodb.com
- Redis docs: https://redis.io/docs
- Next.js docs: https://nextjs.org/docs
- NextAuth docs: https://next-auth.js.org

## Architecture Overview

```
User Request
    ↓
Next.js API Route
    ↓
UserService
    ↓
Redis Cache? → Yes → Return (5-10ms)
    ↓ No
MongoDB? → Yes → Cache & Return (20-50ms)
    ↓ No
GitHub API → Store in MongoDB → Cache in Redis → Return (500-1000ms)
```

## Success!

If you see:
- ✅ MongoDB connected
- ✅ Redis connected
- ✅ GitHub OAuth working
- ✅ Data syncing
- ✅ Cache working

You're all set! 🎉
