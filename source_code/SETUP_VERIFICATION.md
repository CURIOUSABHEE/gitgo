# Setup and Verification Guide

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd source_code
npm install
```

This installs:
- `mongoose` - MongoDB ODM
- `ioredis` - Redis client
- `tsx` - TypeScript execution (for testing)

### 2. Install and Start MongoDB

#### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

#### Ubuntu/Linux
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Verify MongoDB is Running
```bash
mongosh
# Should connect and show MongoDB shell
# Type 'exit' to quit
```

### 3. Install and Start Redis

#### macOS
```bash
brew install redis
brew services start redis
```

#### Ubuntu/Linux
```bash
sudo apt-get install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

#### Verify Redis is Running
```bash
redis-cli ping
# Should return: PONG
```

### 4. Configure Environment Variables

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret

# MongoDB
MONGODB_URI=mongodb://localhost:27017/gitgo

# Redis
REDIS_URL=redis://localhost:6379
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 5. Test Database Connection

```bash
npm run test:db
```

Expected output:
```
🔌 Connecting to MongoDB...
✅ MongoDB connected successfully!

📊 Testing User model...
   Found 0 users in database

📦 Testing Repository model...
   Found 0 repositories in database

🔍 Checking indexes...
   User indexes: [ '_id_', 'githubId_1', 'login_1' ]
   Repository indexes: [ '_id_', 'githubId_1', 'userId_1', 'userId_1_updated_at_-1' ]

✨ All tests passed!
```

### 6. Start the Application

```bash
npm run dev
```

Open http://localhost:3000

## Verification Steps

### Step 1: Verify MongoDB Schema

```bash
mongosh
```

```javascript
use gitgo

// Check collections
show collections

// Check User schema
db.users.findOne()

// Check Repository schema
db.repositories.findOne()

// Check indexes
db.users.getIndexes()
db.repositories.getIndexes()
```

### Step 2: Verify Redis Connection

```bash
redis-cli
```

```redis
# Test connection
PING

# Check all keys
KEYS *

# Check specific user cache
GET user:basic:123456

# Check TTL
TTL user:basic:123456
```

### Step 3: Test GitHub OAuth Flow

1. Go to http://localhost:3000
2. Click "Get Started via GitHub"
3. Authorize the application
4. Wait for sync to complete

### Step 4: Verify Data in MongoDB

```bash
mongosh
```

```javascript
use gitgo

// Check if user was created
db.users.countDocuments()
db.users.findOne()

// Check if repositories were synced
db.repositories.countDocuments()
db.repositories.find().limit(5)

// Check user's repositories
const user = db.users.findOne()
db.repositories.find({ userId: user._id }).count()
```

### Step 5: Verify Redis Cache

```bash
redis-cli
```

```redis
# Check cached keys
KEYS *

# Should see:
# user:basic:{githubId}
# repos:list:{githubId}

# Check user cache
GET user:basic:YOUR_GITHUB_ID

# Check TTL (should be around 3600 seconds = 1 hour)
TTL user:basic:YOUR_GITHUB_ID
```

### Step 6: Test Client-Side Data Fetching

Open browser console on http://localhost:3000/dashboard

```javascript
// Test API endpoint
const response = await fetch('/api/github/profile')
const data = await response.json()
console.log('User:', data.user)
console.log('Repos:', data.repos.length)
console.log('Languages:', data.languages)
console.log('Stats:', data.stats)
```

### Step 7: Test Cache Performance

```javascript
// First load (from MongoDB or GitHub)
console.time('First load')
await fetch('/api/github/profile')
console.timeEnd('First load')

// Second load (from Redis cache)
console.time('Cached load')
await fetch('/api/github/profile')
console.timeEnd('Cached load')
```

Expected results:
- First load: 100-500ms (from MongoDB) or 500-1000ms (from GitHub)
- Cached load: 5-20ms (from Redis)

### Step 8: Test Manual Sync

1. Go to Settings > Integrations
2. Click "Re-sync Data"
3. Check MongoDB for updated data:

```bash
mongosh
use gitgo
db.users.findOne({}, { lastSynced: 1 })
```

## Troubleshooting

### MongoDB Connection Failed

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
```bash
# Check if MongoDB is running
brew services list | grep mongodb
# or
sudo systemctl status mongod

# Start MongoDB
brew services start mongodb-community
# or
sudo systemctl start mongod

# Check MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log
# or
sudo tail -f /var/log/mongodb/mongod.log
```

### Redis Connection Failed

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:6379`

**Solutions:**
```bash
# Check if Redis is running
brew services list | grep redis
# or
sudo systemctl status redis-server

# Start Redis
brew services start redis
# or
sudo systemctl start redis-server

# Test connection
redis-cli ping
```

### No Data in MongoDB After Login

**Check:**
1. Verify GitHub OAuth is working
2. Check browser console for errors
3. Check server logs: `npm run dev`
4. Verify MongoDB connection in logs
5. Check if user was created:

```bash
mongosh
use gitgo
db.users.find()
```

### Cache Not Working

**Check:**
1. Verify Redis is running: `redis-cli ping`
2. Check if keys exist: `redis-cli KEYS *`
3. Check TTL: `redis-cli TTL user:basic:123456`
4. Clear cache and retry: `redis-cli FLUSHDB`

### Data Not Showing on Client

**Check:**
1. Open browser console for errors
2. Check Network tab for API calls
3. Verify API response: `fetch('/api/github/profile')`
4. Check if session is valid
5. Try logging out and back in

## Data Flow Verification

### Complete Flow Test

1. **Login** → Creates session with GitHub ID
2. **First API Call** → Fetches from GitHub, stores in MongoDB, caches in Redis
3. **Second API Call** → Fetches from Redis cache (fast)
4. **After Cache Expires** → Fetches from MongoDB (medium)
5. **Manual Sync** → Fetches from GitHub, updates MongoDB and Redis

### Verify Each Step

```bash
# 1. Check session (browser console)
console.log(document.cookie)

# 2. Check MongoDB
mongosh
use gitgo
db.users.findOne()
db.repositories.countDocuments()

# 3. Check Redis
redis-cli
KEYS *
GET user:basic:YOUR_GITHUB_ID

# 4. Check API response
curl http://localhost:3000/api/github/profile \
  -H "Cookie: your-session-cookie"
```

## Success Checklist

- [ ] MongoDB installed and running
- [ ] Redis installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] Database test passes (`npm run test:db`)
- [ ] Application starts (`npm run dev`)
- [ ] GitHub OAuth works
- [ ] User data saved to MongoDB
- [ ] Repositories synced to MongoDB
- [ ] Redis cache working
- [ ] Client-side fetches data correctly
- [ ] Cache performance verified
- [ ] Manual sync works

## Next Steps

Once everything is verified:

1. Test all pages (Dashboard, Projects, Settings)
2. Verify data persistence across restarts
3. Test cache expiration and refresh
4. Monitor MongoDB and Redis performance
5. Set up production databases (MongoDB Atlas, Redis Cloud)

## Production Checklist

- [ ] Use MongoDB Atlas or managed MongoDB
- [ ] Use Redis Cloud or managed Redis
- [ ] Enable authentication for both databases
- [ ] Use environment-specific credentials
- [ ] Set up monitoring and alerts
- [ ] Configure backups
- [ ] Enable SSL/TLS
- [ ] Set up replica sets (MongoDB)
- [ ] Configure Redis persistence
- [ ] Implement rate limiting
- [ ] Set up logging and error tracking
