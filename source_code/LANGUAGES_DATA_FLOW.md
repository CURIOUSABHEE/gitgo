# Languages Data Flow - NOT Hardcoded

## Summary

The languages displayed in both the sidebar and "My Projects" page are **100% dynamic** and come from your actual GitHub repositories. Nothing is hardcoded.

## Complete Data Flow

```
1. GitHub API (Real Data)
   ↓
2. UserService.syncUserFromGitHub()
   - Fetches your actual repositories from GitHub
   - Stores in MongoDB
   ↓
3. UserService.syncRepositories()
   - Syncs all repository details
   - Extracts language from each repo
   - Stores in MongoDB with cache in Redis
   ↓
4. /api/github/profile
   - Retrieves repos from cache/MongoDB
   - Extracts unique languages from repos
   - Returns: languages: Array.from(languages)
   ↓
5. useGitHub() Hook
   - Fetches from /api/github/profile
   - Stores in profile.languages
   ↓
6. UI Components
   ├─→ Sidebar: profile.languages
   └─→ My Projects: profile.languages
```

## Code Evidence

### 1. API Route (`/api/github/profile/route.ts`)

```typescript
// Extract unique languages from repo list
const languages = new Set<string>()
repoList?.forEach((repo) => {
  if (repo.language) languages.add(repo.language)
})

return NextResponse.json({
  // ... other data
  languages: Array.from(languages),  // ← Dynamic, from actual repos
})
```

### 2. UserService (`lib/services/user-service.ts`)

```typescript
static async syncRepositories(
  accessToken: string,
  userId: string,
  githubId: string
): Promise<void> {
  const github = new GitHubAPI(accessToken)
  const repos = await github.getRepos()  // ← Fetches from GitHub API
  
  // Stores each repo with its language
  const bulkOps = repos.map((repo: GitHubRepo) => ({
    updateOne: {
      filter: { githubId: repo.id },
      update: {
        $set: {
          language: repo.language || "",  // ← Real language from GitHub
          // ... other fields
        }
      }
    }
  }))
}
```

### 3. GitHub API Client (`lib/github.ts`)

```typescript
async getRepos() {
  const response = await fetch(
    "https://api.github.com/user/repos?per_page=100",
    {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    }
  )
  return response.json()  // ← Real data from GitHub
}
```

### 4. Sidebar Component

```typescript
const { profile } = useGitHub()
const languages = profile?.languages || []  // ← From API, not hardcoded

{languages.map((lang) => (
  <span key={lang}>{lang}</span>  // ← Displays real languages
))}
```

### 5. My Projects Page

```typescript
const { profile } = useGitHub()

{profile.languages.map((lang) => (
  <Badge key={lang}>{lang}</Badge>  // ← Same real languages
))}
```

## Data Sources

### Primary Source: GitHub API
- **Endpoint**: `https://api.github.com/user/repos`
- **Authentication**: Your GitHub OAuth token
- **Data**: All your actual repositories with their languages

### Storage Layers

1. **MongoDB** (Persistent Storage)
   - Stores all repository data
   - Includes language field for each repo
   - Updated on sync

2. **Redis** (Cache Layer)
   - Caches repository list (30 min TTL)
   - Caches user data (1 hour TTL)
   - Improves performance

3. **React State** (UI Layer)
   - `useGitHub()` hook stores in state
   - Shared across components
   - Updates on data refresh

## How Languages Are Extracted

### Step-by-Step Process

1. **Fetch Repositories**
   ```typescript
   const repos = await github.getRepos()
   // Returns: [
   //   { name: "project1", language: "TypeScript", ... },
   //   { name: "project2", language: "JavaScript", ... },
   //   { name: "project3", language: "Python", ... }
   // ]
   ```

2. **Extract Unique Languages**
   ```typescript
   const languages = new Set<string>()
   repoList?.forEach((repo) => {
     if (repo.language) languages.add(repo.language)
   })
   // Result: Set { "TypeScript", "JavaScript", "Python" }
   ```

3. **Convert to Array**
   ```typescript
   languages: Array.from(languages)
   // Result: ["TypeScript", "JavaScript", "Python"]
   ```

4. **Display in UI**
   ```typescript
   {languages.map((lang) => <Badge>{lang}</Badge>)}
   // Renders: [TypeScript] [JavaScript] [Python]
   ```

## Verification

### How to Verify It's Real Data

1. **Check Your GitHub Repos**
   - Go to your GitHub profile
   - Look at your repositories
   - Note the languages used

2. **Check the App**
   - Navigate to "My Projects"
   - See the "Languages" section
   - Should match your actual GitHub repos

3. **Check the Sidebar**
   - Look at "Skills Detected"
   - Should show same languages as My Projects
   - Should match your GitHub repos

### Example

If your GitHub has:
- 5 TypeScript repos
- 3 JavaScript repos
- 2 Python repos
- 1 Go repo

The app will show:
```
Skills Detected: [TypeScript] [JavaScript] [Python] [Go]
My Projects Languages: [TypeScript] [JavaScript] [Python] [Go]
```

## When Data Updates

### Automatic Updates
- On first login (onboarding)
- When you manually sync (if implemented)
- When cache expires

### Manual Sync
You can trigger a sync by:
1. Calling `/api/github/sync` endpoint
2. Using the refresh function in `useGitHub()` hook
3. Re-authenticating

## No Hardcoded Data

### What IS Hardcoded
- UI labels ("Skills Detected", "Languages")
- Styling and colors
- Component structure

### What is NOT Hardcoded
- ❌ Language names
- ❌ Repository data
- ❌ User information
- ❌ Statistics
- ❌ Any actual content

## Proof

### Test It Yourself

1. **Create a new repo on GitHub** with a different language
2. **Sync your data** (re-login or call sync endpoint)
3. **Check the app** - new language should appear

### Check the Database

```bash
# Connect to MongoDB
mongosh

# Use your database
use gitgo

# Check user's languages
db.users.findOne({ githubId: "YOUR_GITHUB_ID" }, { languages: 1 })

# Check repositories
db.repositories.find({ userId: "YOUR_USER_ID" }, { name: 1, language: 1 })
```

### Check the API Response

```bash
# Call the profile endpoint
curl -X GET http://localhost:3000/api/github/profile \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"

# Response will show:
{
  "languages": ["TypeScript", "JavaScript", "Python"],  // ← Real data
  "repos": [...],  // ← Real repos
  "user": {...}    // ← Real user data
}
```

## Conclusion

**Everything is dynamic and comes from your actual GitHub account:**

✅ Languages are extracted from your real repositories  
✅ Data is fetched from GitHub API  
✅ Stored in MongoDB for persistence  
✅ Cached in Redis for performance  
✅ Displayed consistently across the app  
✅ Updates when you sync your data  

**Nothing is hardcoded. It's all real data from your GitHub profile.**
