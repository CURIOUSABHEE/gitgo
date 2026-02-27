# 🚀 Deployment Guide

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub account with your repository
- Vercel account (sign up at [vercel.com](https://vercel.com))
- MongoDB Atlas database
- Redis Cloud instance
- GitHub OAuth App configured

### Step 1: Prepare Environment Variables

Before deploying, ensure you have these values ready:

```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gitgo
REDIS_URL=redis://username:password@host:port
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Easiest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `source_code`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   - Click "Environment Variables"
   - Add all variables from above
   - Make sure to add them for Production, Preview, and Development

5. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Navigate to project
cd source_code

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set root directory to current directory
# - Override settings: No
# - Add environment variables when prompted

# Deploy to production
vercel --prod
```

### Step 3: Configure GitHub OAuth Callback

After deployment, update your GitHub OAuth App:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Edit your OAuth App
3. Update **Authorization callback URL**:
   ```
   https://your-domain.vercel.app/api/auth/callback/github
   ```
4. Save changes

### Step 4: Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to Network Access
3. Add Vercel's IP addresses or use `0.0.0.0/0` (allow all)
   - Note: For better security, use Vercel's IP ranges
4. Test connection from Vercel deployment

### Step 5: Verify Deployment

1. Visit your deployed URL
2. Test GitHub sign-in
3. Check that data syncs correctly
4. Verify portfolio generation works
5. Test all major features

## Environment Variables Explained

### NEXTAUTH_URL
- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.vercel.app`
- Must match your actual domain

### NEXTAUTH_SECRET
Generate a secure secret:
```bash
openssl rand -base64 32
```
- Use different secrets for dev/prod
- Keep it secret and secure

### GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET
- Get from GitHub OAuth App settings
- Can use same app for dev/prod or create separate apps
- Recommended: Separate apps for better security

### MONGODB_URI
- **Development**: Local MongoDB or Atlas
- **Production**: MongoDB Atlas (recommended)
- Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
- Ensure IP whitelist includes Vercel

### REDIS_URL
- **Development**: Local Redis or Redis Cloud
- **Production**: Redis Cloud (recommended)
- Format: `redis://username:password@host:port`
- Use TLS in production: `rediss://...`

## Troubleshooting

### Build Fails

**Error: Cannot find module**
```bash
# Locally, clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

**Error: Environment variable not found**
- Check all required env vars are set in Vercel
- Verify no typos in variable names
- Ensure values are correct (no extra spaces)

### Runtime Errors

**MongoDB Connection Failed**
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Test connection string locally first

**Redis Connection Failed**
- Verify Redis URL is correct
- Check if Redis instance is running
- Ensure SSL/TLS settings match

**GitHub OAuth Not Working**
- Verify callback URL matches deployment URL
- Check client ID and secret are correct
- Ensure OAuth app is not suspended

### Performance Issues

**Slow API Responses**
- Check Redis cache is working
- Verify MongoDB indexes are created
- Monitor Vercel function logs

**High Memory Usage**
- Check for memory leaks in API routes
- Optimize database queries
- Use pagination for large datasets

## Monitoring

### Vercel Dashboard
- View deployment logs
- Monitor function execution
- Check error rates
- Review analytics

### MongoDB Atlas
- Monitor database performance
- Check query patterns
- Review slow queries
- Set up alerts

### Redis Cloud
- Monitor cache hit rates
- Check memory usage
- Review connection stats

## Scaling

### Vercel
- Automatically scales with traffic
- No configuration needed
- Monitor usage in dashboard

### MongoDB Atlas
- Upgrade cluster tier as needed
- Enable auto-scaling
- Add read replicas for high traffic

### Redis Cloud
- Upgrade plan for more memory
- Enable clustering for high availability
- Use Redis Insight for monitoring

## Security Best Practices

1. **Environment Variables**
   - Never commit .env files
   - Use different secrets for dev/prod
   - Rotate credentials regularly

2. **Database**
   - Use strong passwords
   - Enable IP whitelisting
   - Use SSL/TLS connections
   - Regular backups

3. **API Routes**
   - Validate all inputs
   - Use rate limiting
   - Implement CORS properly
   - Log suspicious activity

4. **GitHub OAuth**
   - Use separate apps for dev/prod
   - Limit OAuth scopes
   - Monitor app usage
   - Revoke unused tokens

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

1. **Production**: Push to `main` branch
2. **Preview**: Push to any other branch or open PR
3. **Rollback**: Use Vercel dashboard to rollback to previous deployment

### Branch Strategy

```
main (production)
  ├── develop (staging)
  └── feature/* (preview deployments)
```

## Cost Optimization

### Vercel
- Free tier: 100GB bandwidth, 100 hours function execution
- Pro tier: $20/month for more resources
- Monitor usage to avoid overages

### MongoDB Atlas
- Free tier: 512MB storage, shared cluster
- Paid tiers: Start at $9/month
- Use indexes to reduce query costs

### Redis Cloud
- Free tier: 30MB memory
- Paid tiers: Start at $5/month
- Optimize cache TTL to reduce memory usage

## Support

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **MongoDB**: [mongodb.com/support](https://www.mongodb.com/support)
- **Redis**: [redis.com/support](https://redis.com/support)
- **GitHub**: [support.github.com](https://support.github.com)

---

**Ready to deploy?** Follow the steps above and your app will be live in minutes! 🚀
