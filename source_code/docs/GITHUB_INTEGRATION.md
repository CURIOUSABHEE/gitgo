# GitHub Integration Documentation

## Overview

The app uses NextAuth.js with GitHub OAuth to authenticate users and fetch their GitHub data.

## Architecture

### Authentication Flow

1. User clicks "Get Started via GitHub" on landing page
2. NextAuth redirects to GitHub OAuth authorization
3. User authorizes the app
4. GitHub redirects back with authorization code
5. NextAuth exchanges code for access token
6. Access token is stored in session (JWT)
7. User is redirected to onboarding page

### Components

#### `/lib/auth.ts`
NextAuth configuration with GitHub provider and custom callbacks to persist access token.

#### `/lib/github.ts`
GitHub API client class with methods to fetch:
- User profile
- Repositories
- Languages
- Organizations
- Contribution events

#### `/app/api/auth/[...nextauth]/route.ts`
NextAuth API route handler for authentication endpoints.

#### `/app/api/github/profile/route.ts`
Server-side API route to fetch GitHub profile data using the stored access token.

#### `/hooks/use-github.ts`
React hook to easily access GitHub data in client components.

## Usage Examples

### In Client Components

```tsx
import { useSession } from "next-auth/react"
import { useGitHub } from "@/hooks/use-github"

function MyComponent() {
  const { data: session } = useSession()
  const { profile, loading, error } = useGitHub()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Welcome {profile?.user.name}</h1>
      <p>Languages: {profile?.languages.join(", ")}</p>
    </div>
  )
}
```

### Direct API Access

```tsx
import { GitHubAPI } from "@/lib/github"

const github = new GitHubAPI(accessToken)
const user = await github.getUser()
const repos = await github.getRepos()
```

### Server-Side

```tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function MyServerComponent() {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    return <div>Not authenticated</div>
  }

  // Use session.accessToken to make GitHub API calls
}
```

## Security Considerations

1. **Access Token Storage**: Tokens are stored in encrypted JWT sessions, not in database
2. **Token Scope**: Only request necessary scopes (read:user, user:email, repo, read:org)
3. **Environment Variables**: Never commit `.env.local` to version control
4. **HTTPS**: Always use HTTPS in production
5. **Token Refresh**: GitHub tokens don't expire, but implement token refresh if needed

## Rate Limits

GitHub API has rate limits:
- Authenticated requests: 5,000 requests per hour
- Unauthenticated: 60 requests per hour

The app uses authenticated requests, so you have plenty of headroom.

## Testing

To test the integration:

1. Set up GitHub OAuth app (see GITHUB_AUTH_SETUP.md)
2. Configure environment variables
3. Run `npm run dev`
4. Click "Get Started via GitHub"
5. Authorize the app
6. Check browser console for any errors
7. Verify data appears in onboarding flow

## Troubleshooting

### "Unauthorized" Error
- Check that GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are correct
- Verify callback URL matches in GitHub OAuth app settings

### "Failed to fetch GitHub data"
- Check that access token is being stored in session
- Verify GitHub API is accessible (check network tab)
- Check rate limits

### Session Not Persisting
- Ensure NEXTAUTH_SECRET is set
- Check that cookies are enabled in browser
- Verify NEXTAUTH_URL matches your domain
