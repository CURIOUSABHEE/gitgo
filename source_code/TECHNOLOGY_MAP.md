# Technology Map Feature

## Overview

The Technology Map is a comprehensive tracking system that maintains consistency across the application by mapping which technologies (languages, frameworks, tools) are used in which projects. This provides better insights into a user's technical expertise and project history.

## Data Structure

### User Model Extension

```typescript
technologyMap: {
  technology: string              // Name of the technology (e.g., "TypeScript", "React", "Docker")
  projects: Array<{
    repoName: string             // Name of the repository
    repoId: number               // GitHub repository ID
    isPrimary: boolean           // true if it's the main language of the repo
    lastUsed: Date               // Last update date of the repo
  }>
  totalProjects: number          // Total number of projects using this technology
  firstUsed: Date                // Date when first used (oldest repo)
  lastUsed: Date                 // Date when last used (most recent repo)
}[]
```

## How It Works

### 1. Data Collection

When a user syncs their GitHub data:

1. **Primary Languages**: Extracted from `repo.language` field
   - Marked as `isPrimary: true`
   - Represents the main programming language of the repository

2. **Secondary Technologies**: Extracted from `repo.topics` field
   - Marked as `isPrimary: false`
   - Includes frameworks, tools, and other technologies tagged in the repo

3. **Project Mapping**: Each technology tracks:
   - Which repositories use it
   - Whether it's the primary language
   - When it was last used (repo update date)

### 2. Data Processing

The technology map is built during the `syncUserFromGitHub` process:

```typescript
// For each repository
repos.forEach((repo) => {
  // Add primary language
  if (repo.language) {
    technologyMap.add({
      technology: repo.language,
      project: { repoName, repoId, isPrimary: true }
    })
  }
  
  // Add technologies from topics
  repo.topics.forEach((topic) => {
    technologyMap.add({
      technology: topic,
      project: { repoName, repoId, isPrimary: false }
    })
  })
})
```

### 3. Statistics Generation

The `getTechnologyStats` method provides organized views:

- **Most Used**: Technologies sorted by number of projects
- **Recently Used**: Technologies sorted by last usage date
- **Primary**: Technologies used as main languages
- **All**: Complete technology map

## API Endpoints

### GET /api/github/technology-map

Returns comprehensive technology statistics for the authenticated user.

**Response:**
```json
{
  "all": [...],                    // All technologies
  "mostUsed": [...],               // Top 10 most used
  "recentlyUsed": [...],           // Top 10 recently used
  "primary": [...],                // Primary languages only
  "totalTechnologies": 25,         // Total unique technologies
  "totalProjects": 15              // Total unique projects
}
```

## UI Components

### Settings Technology Map

Located in: `components/settings/settings-technology-map.tsx`

Features:
- **Overview Cards**: Display total technologies, projects, and primary languages
- **Tabbed Interface**: 
  - Most Used: Technologies sorted by usage frequency
  - Recently Used: Technologies sorted by recency
  - Primary: Technologies used as main languages
- **Project Badges**: Show which projects use each technology
- **Timeline**: Display first and last usage dates

## Benefits

### 1. Consistency

- Single source of truth for user's technology stack
- Consistent data across all features (filters, recommendations, profiles)
- Automatic updates when repositories are synced

### 2. Better Insights

- See which technologies you use most
- Track technology adoption over time
- Identify primary vs. secondary skills
- Understand project distribution across technologies

### 3. Improved Filtering

- More accurate "My Tech Stack" filter
- Better project recommendations
- Skill-based matching for open source projects

### 4. Career Tracking

- Visualize technology journey
- Identify skill gaps
- Track learning progress
- Portfolio enhancement

## Usage Examples

### 1. Filter Projects by Technology

```typescript
// Get user's technology map
const techMap = await UserService.getTechnologyMap(githubId)

// Find all projects using React
const reactProjects = techMap
  .find(t => t.technology === "React")
  ?.projects || []
```

### 2. Get Most Used Technologies

```typescript
const stats = await UserService.getTechnologyStats(githubId)
const topTechnologies = stats.mostUsed.slice(0, 5)
```

### 3. Check Technology Expertise

```typescript
const stats = await UserService.getTechnologyStats(githubId)

// Find TypeScript expertise
const typescript = stats.all.find(t => t.technology === "TypeScript")
if (typescript) {
  console.log(`Used in ${typescript.totalProjects} projects`)
  console.log(`Primary language in ${typescript.projects.filter(p => p.isPrimary).length} projects`)
}
```

## Caching Strategy

- **Cache Key**: `user:techmap:{githubId}`
- **TTL**: 1 hour (same as user basic info)
- **Invalidation**: Automatic on user sync

## Data Flow

```
GitHub Sync
    ↓
Extract Languages & Topics
    ↓
Build Technology Map
    ↓
Store in MongoDB (User.technologyMap)
    ↓
Cache in Redis (1 hour)
    ↓
API Endpoint (/api/github/technology-map)
    ↓
UI Components (Settings, Dashboard, Filters)
```

## Future Enhancements

### Potential Features

1. **Technology Trends**
   - Track technology adoption over time
   - Show growth/decline in usage
   - Compare with industry trends

2. **Skill Recommendations**
   - Suggest complementary technologies
   - Identify learning opportunities
   - Recommend projects to expand skills

3. **Technology Proficiency Levels**
   - Calculate proficiency based on:
     - Number of projects
     - Lines of code
     - Commit frequency
     - Project complexity

4. **Technology Relationships**
   - Map commonly used technology combinations
   - Identify tech stacks (e.g., MERN, LAMP)
   - Suggest compatible technologies

5. **Export & Sharing**
   - Generate technology resume
   - Share technology profile
   - Export as JSON/PDF

## Example Output

```json
{
  "all": [
    {
      "technology": "TypeScript",
      "projects": [
        {
          "repoName": "portfolio-site",
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
    },
    {
      "technology": "React",
      "projects": [
        {
          "repoName": "portfolio-site",
          "repoId": 123456,
          "isPrimary": false,
          "lastUsed": "2024-02-15T10:30:00Z"
        }
      ],
      "totalProjects": 1,
      "firstUsed": "2023-06-01T08:00:00Z",
      "lastUsed": "2024-02-15T10:30:00Z"
    }
  ],
  "mostUsed": [...],
  "recentlyUsed": [...],
  "primary": [...],
  "totalTechnologies": 15,
  "totalProjects": 8
}
```

## Testing

### Manual Testing

1. Navigate to Settings → Technology Map
2. Verify statistics are displayed correctly
3. Check each tab (Most Used, Recently Used, Primary)
4. Verify project badges show correct repositories
5. Confirm dates are formatted properly

### API Testing

```bash
# Get technology map
curl -X GET http://localhost:3000/api/github/technology-map \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

## Notes

- Technology map is built from GitHub repository data
- Updates automatically when repositories are synced
- Provides consistent data across the entire application
- Cached for performance (1 hour TTL)
- Supports both primary languages and secondary technologies
