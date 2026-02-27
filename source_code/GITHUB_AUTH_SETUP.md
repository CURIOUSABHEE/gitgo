# GitHub OAuth Setup Guide

## Step 1: Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: gitgo (or your app name)
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID**
6. Click "Generate a new client secret" and copy the **Client Secret**

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your credentials:
   ```env
   GITHUB_CLIENT_ID=your_client_id_here
   GITHUB_CLIENT_SECRET=your_client_secret_here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
   ```

3. Generate `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Run the Application

```bash
npm run dev
```

## OAuth Scopes Requested

The app requests the following GitHub scopes:
- `read:user` - Read user profile data
- `user:email` - Access user email addresses
- `repo` - Access repositories (public and private)
- `read:org` - Read organization membership

## What Data is Fetched

After authentication, the app fetches:
- User profile (name, email, bio, avatar)
- All repositories (public and private)
- Programming languages used
- Repository statistics
- Organization memberships
- Public contribution events

## Production Deployment

For production, update:
1. GitHub OAuth App callback URL to your production domain
2. `NEXTAUTH_URL` in environment variables to your production URL
3. Keep `NEXTAUTH_SECRET` secure and never commit it to version control
